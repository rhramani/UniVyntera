import React from "react";
import { FcPrevious } from "react-icons/fc";
import { IoCallOutline, IoVideocamOutline } from "react-icons/io5";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { MdVerified } from "react-icons/md";
import whatsappBg from "../../../../assets/images/template image/wp background.png";
import TemplatePicture from "../../../../assets/images/template image/Picture.png";
import TemplateVideo from "../../../../assets/images/template image/video.png";
import TemplateDocs from "../../../../assets/images/template image/document.png";

const today = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const WhatsAppMessagePreview = ({
  headerType,
  media,
  headerText,
  messageText,
  footerText,
  buttonType,
  quickReplies,
  ctaButtons,
}) => {
  const getMediaPreview = () => {
    if (!media) return "";

    if (media instanceof File || media instanceof Blob) {
      try {
        return URL.createObjectURL(media);
      } catch (e) {
        return "";
      }
    }

    if (typeof media === "string") {
      const lower = media.toLowerCase();
      if (
        lower.endsWith(".jpg") ||
        lower.endsWith(".jpeg") ||
        lower.endsWith(".png")
      )
        return media;
      if (lower.endsWith(".mp4")) return TemplateVideo;
      if (
        lower.endsWith(".pdf") ||
        lower.endsWith(".doc") ||
        lower.endsWith(".docx")
      )
        return TemplateDocs;

      return media;
    }

    switch (media) {
      case "image":
        return TemplatePicture;
      case "video":
        return TemplateVideo;
      case "document":
        return TemplateDocs;
      default:
        return "";
    }
  };

  return (
    <div className="d-flex flex-column align-items-center w-100">
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
              {messageText}
            </p>
          )}

          {footerText && <p className="text-muted small mt-3">{footerText}</p>}

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
  );
};

export default WhatsAppMessagePreview;
