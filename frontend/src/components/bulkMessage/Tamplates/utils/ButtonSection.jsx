import Select from "react-select";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

const ButtonSection = ({
  buttonType,
  setButtonType,
  buttonOptions = [],
  ctaButtons = [],
  handleCTATypeChange,
  handleCTAInputChange,
  quickReplies = [],
  handleQuickReplyChange,
  handleAddQuickReply,
  handleAddCTAButton,
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
    <div className="mt-3">
      <h5 className="mb-2">Button (Optional)</h5>
      <Row>
        <Col md={6} lg={4}>
          <Select
            value={buttonOptions.find((opt) => opt.value === buttonType)}
            onChange={(selectedOption) => setButtonType(selectedOption.value)}
            options={buttonOptions}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            classNamePrefix="custom-select"
            placeholder="Select Button Type"
            styles={customStyles}
          />
        </Col>
      </Row>

      {buttonType === "calltoaction" && (
        <div className=" d-flex flex-column">
          {(ctaButtons || []).map((btn, index) => (
            <Row key={index} className="d-flex align-items-end mb-3">
              <Col md={6} lg={3} className="mt-3">
                <h5 className="mb-2">Type Of Action</h5>
                <Select
                  value={[
                    { value: "callNumber", label: "Call Phone Number" },
                    { value: "visitwebsite", label: "Visit Website" },
                  ].find((opt) => opt.value === btn.type)}
                  onChange={(selectedOption) =>
                    handleCTATypeChange(index, selectedOption.value)
                  }
                  options={[
                    { value: "callNumber", label: "Call Phone Number" },
                    { value: "visitwebsite", label: "Visit Website" },
                  ]}
                  classNamePrefix="custom-select"
                  placeholder="Select Action"
                />
              </Col>

              <Col md={6} lg={3} className="mt-3">
                {" "}
                <h5 className="mb-2">Button Text</h5>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  value={btn.text}
                  onChange={(e) =>
                    handleCTAInputChange(index, "text", e.target.value)
                  }
                />
              </Col>
              {btn.type === "callNumber" ? (
                <>
                  <Col md={6} lg={3} className="mt-3">
                    <h5 className="mb-2">Country</h5>
                    <PhoneInput
                      country="in"
                      value={btn.country}
                      onChange={(value, data) => {
                        handleCTAInputChange(index, "country", data.dialCode);
                        handleCTAInputChange(
                          index,
                          "phone",
                          value.slice(data.dialCode.length)
                        );
                      }}
                      inputStyle={{ width: "100%", borderRadius: "30px" }}
                      buttonStyle={{
                        borderRadius: "30px 0 0 30px",
                      }}
                      enableSearch
                    />
                  </Col>
                  <Col md={6} lg={3} className="mt-3">
                    <h5 className="mb-2">Phone Number</h5>
                    <Form.Control
                      type="tel"
                      className="custom-select-height"
                      placeholder="Enter Phone Number"
                      value={btn.phone}
                      onChange={(e) =>
                        handleCTAInputChange(index, "phone", e.target.value)
                      }
                    />
                  </Col>
                </>
              ) : (
                <>
                  <Col md={6} lg={3} className="mt-3">
                    <h5 className="mb-2">URL Type</h5>
                    <Select
                      value={[
                        { value: "static", label: "Static" },
                        { value: "dynamic", label: "Dynamic" },
                      ].find((opt) => opt.value === btn.urlType)}
                      onChange={(selectedOption) =>
                        handleCTAInputChange(
                          index,
                          "urlType",
                          selectedOption.value
                        )
                      }
                      options={[
                        { value: "static", label: "Static" },
                        { value: "dynamic", label: "Dynamic" },
                      ]}
                      classNamePrefix="custom-select"
                      styles={customStyles}
                      placeholder="Select URL Type"
                    />
                  </Col>
                  <Col md={6} lg={3} className="mt-3">
                    <h5 className="mb-2">Website URL</h5>
                    <Form.Control
                      type="url"
                      className="custom-select-height"
                      placeholder="Ex. http://"
                      value={btn.websiteUrl}
                      onChange={(e) =>
                        handleCTAInputChange(
                          index,
                          "websiteUrl",
                          e.target.value
                        )
                      }
                    />
                  </Col>
                </>
              )}
            </Row>
          ))}
          {ctaButtons.length === 1 && (
            <Row>
              <Col>
                <Button
                  className="custom-select-height"
                  onClick={handleAddCTAButton}
                >
                  Add Another Button
                </Button>
              </Col>
            </Row>
          )}
        </div>
      )}

      {buttonType === "quickreply" && (
        <div className="mt-3">
          {(quickReplies || []).map((reply, idx) => (
            <div key={idx} className="d-flex align-items-center gap-2 mb-2">
              <Form.Control
                className="custom-select-height"
                style={{ width: "250px" }}
                value={reply}
                onChange={(e) => handleQuickReplyChange(e.target.value, idx)}
                placeholder={`Quick Reply ${idx + 1}`}
              />
              <Button
                className="custom-select-height d-flex justify-content-center align-items-baseline gap-1 rounded-5"
                style={{ minWidth: "40px", height: "40px" }}
                onClick={handleAddQuickReply}
              >
                <FaPlus size={11} /> Add
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ButtonSection;
