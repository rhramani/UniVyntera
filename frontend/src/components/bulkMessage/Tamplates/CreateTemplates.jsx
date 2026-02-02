import { useState } from "react";
import HeaderSection from "./utils/HeaderSection";
import ButtonSection from "./utils/ButtonSection";
import PreviewSection from "./utils/PreviewSection";
import { useDispatch } from "react-redux";
import AddSampleModal from "./utils/AddSampleModal";
import { BASEURL } from "../../../baseUrl";
import { createTemplate } from "../../../redux/actions/BulkMessage/Template.action";
import { Button, Col, Form } from "react-bootstrap";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import Pageheader from "../../../layouts/Pageheader";

const CreateTemplates = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bodyVariableExamples, setBodyVariableExamples] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false);

  const initialTemplate = {
    name: "",
    language: "en_US",
    category: "utility",
    header: {
      type: "none",
      format: "",
      text: "",
      media: null,
    },
    body: {
      text: "Hi {{1}}, \n\nyour order number {{2}} has been shipped. You can expect delivery within {{3}} days. Track your shipment using the link below.",
    },
    footer: {
      text: "Thank you for shopping with us.",
    },
    buttons: {
      type: "none",
      quickReplies: [""],
      ctaButtons: [
        {
          type: "callNumber",
          text: "",
          country: "91",
          phone: "",
          urlType: "static",
          websiteUrl: "",
        },
      ],
    },
  };

  const [template, setTemplate] = useState(initialTemplate);
  const dispatch = useDispatch();

  const updateField = (section, field, value) => {
    setIsFormTouched(true);
    setTemplate((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const setHeaderType = (val) => {
    setIsFormTouched(true);
    setTemplate((prev) => {
      const isMedia = val === "media";
      return {
        ...prev,
        header: {
          ...prev.header,
          type: val,
          format: isMedia ? prev.header.format || "IMAGE" : "TEXT",
          text: isMedia ? "" : prev.header.text,
          media: isMedia ? null : undefined,
        },
      };
    });
  };

  const updateButtonType = (value) => {
    setIsFormTouched(true);
    setTemplate((prev) => ({
      ...prev,
      buttons: {
        type: value,
        quickReplies: value === "quickreply" ? [""] : [],
        ctaButtons:
          value === "calltoaction"
            ? [
                {
                  type: "callNumber",
                  text: "",
                  country: "91",
                  phone: "",
                  urlType: "static",
                  websiteUrl: "",
                },
              ]
            : [],
      },
    }));
  };

  const handleQuickReplyChange = (value, idx) => {
    setIsFormTouched(true);
    const updated = [...template.buttons.quickReplies];
    updated[idx] = value;
    updateField("buttons", "quickReplies", updated);
  };

  const handleAddQuickReply = () => {
    setIsFormTouched(true);
    if (template.buttons.quickReplies.length < 3) {
      updateField("buttons", "quickReplies", [
        ...template.buttons.quickReplies,
        "",
      ]);
    }
  };

  const handleCTATypeChange = (idx, value) => {
    setIsFormTouched(true);
    const updated = [...template.buttons.ctaButtons];
    updated[idx].type = value;
    if (updated.length === 2) {
      const otherIdx = idx === 0 ? 1 : 0;
      updated[otherIdx].type =
        value === "callNumber" ? "visitwebsite" : "callNumber";
    }
    updateField("buttons", "ctaButtons", updated);
  };

  const handleCTAInputChange = (idx, field, value) => {
    setIsFormTouched(true);
    const updated = [...template.buttons.ctaButtons];
    updated[idx][field] = value;
    updateField("buttons", "ctaButtons", updated);
  };

  const handleAddCTAButton = () => {
    setIsFormTouched(true);
    if (template.buttons.ctaButtons.length < 2) {
      const newType =
        template.buttons.ctaButtons[0].type === "callNumber"
          ? "visitwebsite"
          : "callNumber";
      updateField("buttons", "ctaButtons", [
        ...template.buttons.ctaButtons,
        {
          type: newType,
          text: "",
          country: "91",
          phone: "",
          urlType: "static",
          websiteUrl: "",
        },
      ]);
    }
  };

  const handleCancel = () => {
    setTemplate(initialTemplate);
    setBodyVariableExamples({});
    setIsFormTouched(false);
  };

  const handleCreateTemplate = async () => {
    setIsLoading(true);

    const { name, language, category, header, body, footer, buttons } =
      template;
    const components = [];

    const uploadSampleMedia = async (file, format) => {
      try {
        const formData = new FormData();
        formData.append("mediaType", format.toLowerCase());
        formData.append("file", file);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${BASEURL}/chatbox/media/upload-sample-media`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await res.json();
        return result?.media_id || "";
      } catch (error) {
        console.error("Media upload failed:", error);
        return "";
      }
    };

    if (header.type !== "none") {
      if (header.type === "text") {
        components.push({
          type: "HEADER",
          format: "TEXT",
          text: header.text,
        });
      } else if (header.type === "media") {
        const format = header.format?.toUpperCase();
        let mediaId = "";

        if (header.mediaFile) {
          mediaId = await uploadSampleMedia(header.mediaFile, format);
        }

        components.push({
          type: "HEADER",
          format: format,
          example: {
            header_handle: [mediaId],
          },
        });
      }
    }

    if (body.text) {
      const bodyComponent = {
        type: "BODY",
        text: body.text,
      };

      const vars = body.text.match(/{{\d+}}/g);
      if (vars?.length) {
        const uniqueVars = [...new Set(vars)];
        bodyComponent.example = {
          body_text: [
            uniqueVars.map(
              (v) =>
                bodyVariableExamples[v] || `Example ${v.replace(/[{}]/g, "")}`
            ),
          ],
        };
      }

      components.push(bodyComponent);
    }

    if (footer.text) {
      components.push({
        type: "FOOTER",
        text: footer.text,
      });
    }

    if (buttons.type !== "none") {
      const buttonComponent = { type: "BUTTONS", buttons: [] };

      if (buttons.type === "quickreply") {
        buttonComponent.buttons = buttons.quickReplies
          .filter((text) => text.trim())
          .map((text) => ({ type: "QUICK_REPLY", text }));
      } else if (buttons.type === "calltoaction") {
        buttons.ctaButtons.forEach((btn) => {
          if (btn.type === "callNumber" && btn.text.trim()) {
            buttonComponent.buttons.push({
              type: "PHONE_NUMBER",
              text: btn.text,
              phone_number: `${btn.country}${btn.phone}`,
            });
          } else if (btn.type === "visitwebsite" && btn.text.trim()) {
            buttonComponent.buttons.push({
              type: "URL",
              text: btn.text,
              url: btn.websiteUrl,
            });
          }
        });
      }

      if (buttonComponent.buttons.length > 0) {
        components.push(buttonComponent);
      }
    }

    const isMediaHeader =
      header.type === "media" &&
      ["IMAGE", "VIDEO", "DOCUMENT"].includes(header.format?.toUpperCase());

    const payload = {
      name,
      language,
      category: isMediaHeader ? "MARKETING" : category.toUpperCase(),
      components,
    };

    try {
      await dispatch(createTemplate(payload));
      setTemplate(initialTemplate);
      setBodyVariableExamples({});
      setIsFormTouched(false);
    } catch (error) {
      console.error("Error creating template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleDone = (mediaType, file) => {
    if (file instanceof File) {
      const fileUrl = URL.createObjectURL(file);
      setIsFormTouched(true);
      setTemplate((prev) => ({
        ...prev,
        header: {
          ...prev.header,
          media: fileUrl,
          mediaFile: file,
          format: mediaType?.toUpperCase(),
        },
      }));
    } else {
      setTemplate((prev) => ({
        ...prev,
        header: {
          ...prev.header,
          media: null,
          mediaFile: null,
        },
      }));
    }
  };

  const isSaveDisabled = () => {
    if (!template.name.trim() || template.name.includes(" ")) return true;
    if (!template.body.text.trim()) return true;

    if (template.header.type === "text" && !template.header.text.trim())
      return true;
    if (
      template.header.type === "media" &&
      (!template.header.format || !template.header.media)
    )
      return true;

    if (template.buttons.type === "quickreply") {
      const hasValidQuickReply = template.buttons.quickReplies.some((reply) =>
        reply.trim()
      );
      if (!hasValidQuickReply) return true;
    }

    if (template.buttons.type === "calltoaction") {
      const validButtons = template.buttons.ctaButtons.filter((btn) =>
        btn.text.trim()
      );
      if (validButtons.length === 0) return true;

      for (const btn of validButtons) {
        if (
          btn.type === "callNumber" &&
          (!btn.country.trim() || !btn.phone.trim())
        )
          return true;
        if (btn.type === "visitwebsite" && !btn.websiteUrl.trim()) return true;
      }
    }
  };

  const languageOptions = [
    { language: "English (US)", value: "en_US" },
    { language: "Português (BR)", value: "pt_BR" },
    { language: "Bahasa Indonesia", value: "id" },
    { language: "English", value: "us" },
  ];

  const categoryOption = [
    { label: "Authentication", value: "authentication" },
    { label: "Marketing", value: "marketing" },
    { label: "Utility", value: "utility" },
  ];

  const buttonOptions = [
    { label: "None", value: "none" },
    { label: "Quick Reply", value: "quickreply" },
    { label: "Call to Action", value: "calltoaction" },
  ];

  return (
    <>
      <Pageheader
        mainheading="Create Template"
        parentfolder="Templates"
        activepage="Create Template"
      />

      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <LoadMoreButton isLoading={isLoading} />
        </div>
      )}

      <div className="bg-white d-flex my-5 rounded">
        <div className="p-4 bg-white min-vh-100 rounded" style={{ width: "60%" }}>
          <div className="p-3 mb-3 bg-white border-start border-4 border-primary rounded-3 d-flex align-items-start gap-2">
            <i className="bi bi-info-circle-fill text-primary fs-4"></i>
            <div>
              <p className="mb-1 fw-semibold">Note:</p>
              <p className="mb-0 text-muted">
                Special characters and spaces are not allowed in the template
                name. <br />
                You can use the underscore "_" for the template name.
              </p>
            </div>
          </div>
          <Col md={12} className="mb-3">
            <Form.Label>Template Name</Form.Label>
            <Form.Control
              type="text"
              className="custom-select-height"
              name="name"
              placeholder="Enter Template Name"
              value={template.name}
              onChange={(e) => {
                setIsFormTouched(true);
                setTemplate({ ...template, name: e.target.value });
              }}
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
            />
          </Col>

          <HeaderSection
            templateLanguage={template.language}
            setTemplateLanguage={(lang) => {
              setIsFormTouched(true);
              setTemplate({ ...template, language: lang });
            }}
            languageOptions={languageOptions}
            categoryOption={categoryOption}
            headerType={template.header.type}
            setHeaderType={setHeaderType}
            headerText={template.header.text}
            setHeaderText={(val) => updateField("header", "text", val)}
            media={template.header.media}
            setMedia={(fileUrl, format) => {
              setIsFormTouched(true);
              setTemplate((prev) => ({
                ...prev,
                header: {
                  ...prev.header,
                  media: fileUrl,
                  format: format?.toUpperCase() || "IMAGE",
                },
              }));
            }}
            headerFormat={template.header.format}
            setHeaderFormat={(val) => updateField("header", "format", val)}
          />
          <Col md={12}>
            <Form.Group controlId="template.body.text" className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bodyText"
                value={template.body.text}
                onChange={(e) => {
                  setIsFormTouched(true);
                  updateField("body", "text", e.target.value);

                  const matches = e.target.value.match(/{{\d+}}/g);
                  const uniqueVars = [...new Set(matches || [])];

                  const updatedExamples = {};
                  uniqueVars.forEach((v) => {
                    if (bodyVariableExamples[v]) {
                      updatedExamples[v] = bodyVariableExamples[v];
                    } else {
                      updatedExamples[v] = "";
                    }
                  });
                  setBodyVariableExamples(updatedExamples);
                }}
                className="rounded-4"
              />
            </Form.Group>
          </Col>

          <Col md={12} className="mb-3">
            <Form.Label>Footer (Optional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter footer"
              className="custom-select-height"
              name="footerText"
              value={template.footer.text}
              onChange={(e) => updateField("footer", "text", e.target.value)}
            />
          </Col>

          <ButtonSection
            buttonType={template.buttons.type}
            setButtonType={updateButtonType}
            buttonOptions={buttonOptions}
            quickReplies={template.buttons.quickReplies}
            ctaButtons={template.buttons.ctaButtons}
            handleQuickReplyChange={handleQuickReplyChange}
            handleAddQuickReply={handleAddQuickReply}
            handleCTATypeChange={handleCTATypeChange}
            handleCTAInputChange={handleCTAInputChange}
            handleAddCTAButton={handleAddCTAButton}
          />

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              variant="outline-primary"
              className="custom-select-height btn border-primary text-primary text-decoration-none"
              disabled={!isFormTouched}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="custom-select-height"
              onClick={() => setIsModalOpen(true)}
            >
              Add Sample
            </Button>
            <Button
              variant="outline-primary"
              className="custom-select-height btn border-primary text-primary text-decoration-none"
              onClick={handleCreateTemplate}
              disabled={isSaveDisabled()}
            >
              Save
            </Button>
          </div>
        </div>

        <PreviewSection
          headerType={template.header.type}
          headerText={template.header.text}
          media={template.header.mediaFile || template.header.media}
          messageText={template.body.text}
          footerText={template.footer.text}
          buttonType={template.buttons.type}
          quickReplies={template.buttons.quickReplies}
          ctaButtons={template.buttons.ctaButtons}
          variableExamples={bodyVariableExamples}
        />
      </div>

      <AddSampleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mediaType={template.header.format?.toLowerCase()}
        messageText={template.body.text}
        headerType={template.header.type}
        media={template.header.media}
        headerText={template.header.text}
        footerText={template.footer.text}
        buttonType={template.buttons.type}
        quickReplies={template.buttons.quickReplies}
        ctaButtons={template.buttons.ctaButtons}
        onDone={handleSampleDone}
        bodyVariableExamples={bodyVariableExamples}
        setBodyVariableExamples={setBodyVariableExamples}
      />
    </>
  );
};

export default CreateTemplates;
