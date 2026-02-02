import { Fragment, useEffect, useRef, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import Pickr from "@simonwep/pickr";
import Pageheader from "../../../layouts/Pageheader";

const ColorPicker = () => {
  //Classic method

  const colorPicker = useRef();

  useEffect(() => {
    if (colorPicker.current) {
      Pickr.create({
        el: ".color-picker",
        theme: "classic", // or 'monolith', or 'nano'
        default: "rgba(166, 142, 94, 1)",
        swatches: [
          "rgba(244, 67, 54, 1)",
          "rgba(233, 30, 99, 0.95)",
          "rgba(156, 39, 176, 0.9)",
          "rgba(103, 58, 183, 0.85)",
          "rgba(63, 81, 181, 0.8)",
          "rgba(33, 150, 243, 0.75)",
          "rgba(3, 169, 244, 0.7)",
          "rgba(0, 188, 212, 0.7)",
          "rgba(0, 150, 136, 0.75)",
          "rgba(76, 175, 80, 0.8)",
          "rgba(139, 195, 74, 0.85)",
          "rgba(205, 220, 57, 0.9)",
          "rgba(255, 235, 59, 0.95)",
          "rgba(255, 193, 7, 1)",
        ],

        components: {
          // Main components
          preview: true,
          opacity: true,
          hue: false,

          // Input / output Options
          interaction: {
            hex: true,
            rgba: true,
            hsla: true,
            hsva: true,
            cmyk: true,
            input: true,
            clear: true,
            save: true,
          },
        },
      });
    }
  }, []);

  //Monolith method

  const colorPicker1 = useRef();

  useEffect(() => {
    if (colorPicker1.current) {
      Pickr.create({
        el: ".color-picker",
        theme: "classic", // or 'monolith', or 'nano'
        default: "rgba(213, 221, 231, 1);",
        swatches: [
          "rgba(244, 67, 54, 1)",
          "rgba(233, 30, 99, 0.95)",
          "rgba(156, 39, 176, 0.9)",
          "rgba(103, 58, 183, 0.85)",
          "rgba(63, 81, 181, 0.8)",
          "rgba(33, 150, 243, 0.75)",
          "rgba(3, 169, 244, 0.7)",
          "rgba(0, 188, 212, 0.7)",
          "rgba(0, 150, 136, 0.75)",
          "rgba(76, 175, 80, 0.8)",
          "rgba(139, 195, 74, 0.85)",
          "rgba(205, 220, 57, 0.9)",
          "rgba(255, 235, 59, 0.95)",
          "rgba(255, 193, 7, 1)",
        ],

        components: {
          // Main components
          preview: true,
          opacity: true,
          hue: false,

          // Input / output Options
          interaction: {
            // hex: true,
            // rgba: true,
            // hsla: true,
            // hsva: true,
            // cmyk: true,
            input: true,
            clear: true,
            save: true,
          },
        },
      });
    }
  }, []);

  //Nano Method

  const colorPicker2 = useRef();

  useEffect(() => {
    if (colorPicker2.current) {
      Pickr.create({
        el: ".color-picker",
        theme: "nano", // or 'monolith', or 'nano'
        default: "rgba(185, 93, 75, 1);",
        swatches: [
          "rgba(244, 67, 54, 1)",
          "rgba(233, 30, 99, 0.95)",
          "rgba(156, 39, 176, 0.9)",
          "rgba(103, 58, 183, 0.85)",
          "rgba(63, 81, 181, 0.8)",
          "rgba(33, 150, 243, 0.75)",
          "rgba(3, 169, 244, 0.7)",
          "rgba(0, 188, 212, 0.7)",
          "rgba(0, 150, 136, 0.75)",
          "rgba(76, 175, 80, 0.8)",
          "rgba(139, 195, 74, 0.85)",
          "rgba(205, 220, 57, 0.9)",
          "rgba(255, 235, 59, 0.95)",
          "rgba(255, 193, 7, 1)",
        ],

        components: {
          // Main components
          preview: true,
          opacity: true,
          hue: false,

          // Input / output Options
          interaction: {
            hex: true,
            // rgba: true,
            // hsla: true,
            // hsva: true,
            // cmyk: true,
            input: true,
            clear: true,
            save: true,
          },
        },
      });
    }
  }, []);

  //showcode

  const [isHidden, setisHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setisHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader
        mainheading="Color Pickers"
        parentfolder="Form Elements"
        activepage="Color Pickers"
      />

      {/* <!-- Start::row-1 --> */}
      <Row className="row-sm">
        <Col xl={3}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title"> Bootstrap Color Picker </div>
              <div className="prism-toggle">
                <button
                  className="btn btn-sm btn-primary-light"
                  onClick={() => toggleHidden(0)}
                >
                  Show Code
                  <i
                    className={`${
                      isHidden[0] ? "ri-eye-off-line" : "ri-eye-line"
                    } ms-2 d-inline-block align-middle fs-14 `}
                  ></i>
                </button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? "d-none" : ""}`}>
              <Form.Control
                type="color"
                className="form-control-color border-0"
                id="exampleColorInput"
                defaultValue="#136ad0"
                title="Choose your color"
              />
            </Card.Body>
            <div
              className={`${
                isHidden[0] ? "" : "d-none"
              } card-footer border-top-0 `}
            >
              <pre>
                <code className="language-javascript">
                  {`
        <Card.Body>
        <Form.Control type="color" className="form-control-color border-0" id="exampleColorInput" defaultValue="#136ad0" title="Choose your color" />
        </Card.Body>
                `}
                </code>
              </pre>
            </div>
          </Card>
        </Col>
        <Col xl={9}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title"> Classic </div>
            </Card.Header>
            <Card.Body className="d-flex justify-content-between">
              <div>
                <div className="color-picker" ref={colorPicker}></div>
              </div>
              <div>
                <div className="color-picker" ref={colorPicker1}></div>
              </div>
              <div>
                <div className="color-picker" ref={colorPicker2}></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!--End::row-1 --> */}
    </Fragment>
  );
};

export default ColorPicker;
