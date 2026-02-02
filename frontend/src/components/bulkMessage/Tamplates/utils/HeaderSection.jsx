import TemplatePicture from "../../../../assets/images/template image/Picture.png";
import TemplateVideo from "../../../../assets/images/template image/video.png";
import TemplateDocs from "../../../../assets/images/template image/document.png";
import { Col, Form } from "react-bootstrap";
import Select from "react-select";

const HeaderSection = ({
  templateLanguage,
  setTemplateLanguage,
  languageOptions = [],
  categoryOption = [],
  headerType,
  setHeaderType,
  headerFormat,
  setHeaderFormat,
  setMedia,
  headerText,
  setHeaderText,
}) => {
  const customStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "30px",
      color: "black",
    }),
    placeholder: (base) => ({
      ...base,
      color: "black",
      fontSize: "13px",
    }),
  };

  return (
    <>
      <Col md={12} className="mb-3">
        <Form.Label>Template Language</Form.Label>
        <Select
          value={languageOptions.find((opt) => opt.value === templateLanguage)}
          onChange={(selectedOption) =>
            setTemplateLanguage(selectedOption.value)
          }
          options={languageOptions}
          getOptionLabel={(option) => option.language}
          getOptionValue={(option) => option.value}
          classNamePrefix="custom-select"
          placeholder="Select Template Language"
          styles={customStyles}
        />
      </Col>

      <Col md={12} className="mb-3">
        <Form.Label>Template Category</Form.Label>
        <Select
          options={categoryOption}
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          classNamePrefix="custom-select"
          placeholder="Select Template Category"
          styles={customStyles}
        />
      </Col>

      <Col md={12} className="mb-3">
        <Form.Label>Header (Optional)</Form.Label>
        <Select
          options={[
            { value: "none", label: "None" },
            { value: "text", label: "Text" },
            { value: "media", label: "Media" },
          ]}
          value={{
            value: headerType,
            label: headerType.charAt(0).toUpperCase() + headerType.slice(1),
          }}
          onChange={(selectedOption) => {
            const selectedType = selectedOption.value;
            setHeaderType(selectedType);
            if (selectedType === "text") setMedia(null);
            else if (selectedType === "media") setHeaderText("");
            else if (selectedType === "none") {
              setHeaderText("");
              setMedia(null);
            }
          }}
          classNamePrefix="custom-select"
          placeholder="Select Header Type"
          styles={customStyles}
        />
      </Col>

      {headerType === "media" && (
        <div className="mt-3 d-flex justify-content-center">
          <div className="d-flex gap-3 flex-wrap">
            {["image", "video", "document"].map((type) => (
              <div
                key={type}
                className="border rounded px-3 pt-3 bg-white text-center"
                style={{ width: "230px", cursor: "pointer" }}
                onClick={() => setHeaderFormat(type.toUpperCase())}
              >
                <div className="form-check mt-1 ms-1">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="headerFormat"
                    value={type}
                    checked={headerFormat?.toLowerCase() === type}
                    onChange={() => setHeaderFormat(type.toUpperCase())}
                  />
                </div>
                <img
                  src={
                    type === "image"
                      ? TemplatePicture
                      : type === "video"
                      ? TemplateVideo
                      : TemplateDocs
                  }
                  className="img-fluid mt-3 mb-1 mx-auto"
                  style={{ width: "200px" }}
                  alt={`${type} icon`}
                />
                <p
                  className="mt-2 fw-bold text-muted text-capitalize"
                  style={{ color: "#2f30329e" }}
                >
                  {type}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {headerType === "text" && (
        <Col md={12} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter Header Text"
            value={headerText}
            onChange={(e) => setHeaderText(e.target.value)}
            className="custom-select-height rounded-3"
          />
        </Col>
      )}
    </>
  );
};

export default HeaderSection;
