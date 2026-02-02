import React from "react";
import { FcPrevious } from "react-icons/fc";
import { MdVerified } from "react-icons/md";
import { IoCallOutline, IoVideocamOutline } from "react-icons/io5";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import TemplatePicture from "../../../../assets/images/template image/Picture.png";
import TemplateVideo from "../../../../assets/images/template image/video.png";
import TemplateDocs from "../../../../assets/images/template image/document.png";
import whatsappBg from "../../../../assets/images/template image/wp background.png";

const PreviewSection = ({
  headerType,
  media,
  headerText,
  messageText,
  footerText,
  buttonType,
  quickReplies = [],
  ctaButtons = [],
  variableExamples = {},
}) => {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const getMediaPreview = () => {
    if (media instanceof File) {
      return URL.createObjectURL(media);
    }

    if (typeof media === "string") {
      if (
        media.endsWith(".jpg") ||
        media.endsWith(".png") ||
        media.endsWith(".jpeg")
      )
        return media;
      if (media.endsWith(".mp4")) return TemplateVideo;
      if (
        media.endsWith(".pdf") ||
        media.endsWith(".doc") ||
        media.endsWith(".docx")
      )
        return TemplateDocs;
    }

    switch (media) {
      case "image":
        return TemplatePicture;
      case "video":
        return TemplateVideo;
      case "document":
        return TemplateDocs;
      default:
        return null;
    }
  };

  const replaceVariables = (text, variableValues) => {
    return text.replace(/{{\d+}}/g, (match) => {
      return variableValues?.[match] || match;
    });
  };

  return (
    <div
      className="border-start pt-4 pe-4 ps-4 min-vh-100"
      style={{ width: "40%", borderColor: "#CBD5E0" }}
    >
      <div className="d-flex align-items-center mb-4 p-2 px-3 bg-primary bg-opacity-10 rounded-3 shadow-sm">
        <i className="bi bi-eye-fill text-primary me-2 fs-5"></i>
        <h5 className="mb-0 fw-bold text-primary">Preview</h5>
      </div>

      <hr className="w-100 bg-secondary" />

      <div className="d-flex flex-column align-items-center w-100 mt-4 p-5 bg-light rounded">
        <div
          className="d-flex align-items-center justify-content-between w-100 bg-white rounded-top-3 p-2 border border-bottom-0 border-light"
          style={{ maxWidth: "358px", height: "62px" }}
        >
          <div className="d-flex align-items-center gap-2">
            <FcPrevious size={24} />
            <span className="fw-bold text-primary">12</span>
          </div>
          <div className="d-flex align-items-center gap-3 flex-grow-1 ms-3">
            <div
              className="rounded-circle bg-secondary"
              style={{ width: "32px", height: "32px" }}
            ></div>
            <div>
              <div className="d-flex align-items-center gap-1">
                <span className="fw-bold">Your Company</span>
                <MdVerified color="#28a745" size={16} />
              </div>
              <small className="text-muted">Online</small>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <IoVideocamOutline size={20} color="#007AFF" />
            <IoCallOutline size={20} color="#007AFF" />
          </div>
        </div>

        <div
          className="p-3 rounded-bottom-3 border border-top-0 border-light"
          style={{
            maxWidth: "358px",
            minHeight: "500px",
            backgroundImage: `url(${whatsappBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="d-flex justify-content-center my-3">
            <span
              className="bg-light p-2 rounded text-muted"
              style={{ fontSize: "0.875rem" }}
            >
              {today}
            </span>
          </div>

          <div
            className="bg-white rounded p-3 shadow-sm"
            style={{ maxWidth: "80%" }}
          >
            {headerType === "text" && headerText && (
              <p className="fw-bold mb-3">{headerText}</p>
            )}

            {headerType === "media" && media && (
              <img
                src={getMediaPreview()}
                className="img-fluid mx-auto d-block mb-3"
                style={{ maxWidth: "250px" }}
                alt="Media Preview"
              />
            )}

            {messageText && (
              <p className="mb-3" style={{ whiteSpace: "pre-line" }}>
                {replaceVariables(messageText, variableExamples)}
              </p>
            )}

            {footerText && (
              <p className="text-muted small mt-3">{footerText}</p>
            )}

            {buttonType === "quickreply" &&
              quickReplies?.filter(Boolean).length > 0 && (
                <div className="mt-3 border-top pt-2">
                  <div className="d-flex justify-content-around py-2 border-bottom">
                    {quickReplies.slice(0, 2).map((btn, idx) => (
                      <span
                        key={idx}
                        className="text-primary fw-medium"
                        style={{ cursor: "pointer" }}
                      >
                        {btn}
                      </span>
                    ))}
                  </div>
                  {quickReplies[2] && (
                    <div className="d-flex justify-content-center py-2">
                      <span
                        className="text-primary fw-medium"
                        style={{ cursor: "pointer" }}
                      >
                        {quickReplies[2]}
                      </span>
                    </div>
                  )}
                </div>
              )}

            {buttonType === "calltoaction" && ctaButtons?.length > 0 && (
              <div className="mt-3 border-top pt-2">
                {ctaButtons.map((btn, idx) => (
                  <div
                    key={idx}
                    className={`d-flex justify-content-center align-items-center py-2 ${
                      idx < ctaButtons.length - 1 ? "border-bottom" : ""
                    }`}
                    style={{ minHeight: "21px" }}
                  >
                    <span
                      className="d-flex justify-content-center align-items-center gap-2 text-primary fw-medium w-100"
                      style={{ cursor: "pointer" }}
                    >
                      {btn?.type === "callNumber" ? (
                        <IoCallOutline color="#007AFF" />
                      ) : (
                        <LiaExternalLinkAltSolid color="#007AFF" />
                      )}
                      {btn?.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewSection;
