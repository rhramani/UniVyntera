import { Fragment } from "react";
import { Button, Row, Card, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import Pageheader from "../../layouts/Pageheader";
import ALLImages from "../../common/Imagedata";

const Sweetalert = () => {
  function Basicsweetalert() {
    Swal.fire({
      title: " Welcome to Your Admin Page",
      allowOutsideClick: false,
    });
  }

  function Dangersweetalert() {
    Swal.fire({
      // text: " Welcome to Your Admin Page",
      allowOutsideClick: false,
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: '<a href="">Why do I have this issue?</a>',
    });
  }

  function Imagesweetalert() {
    Swal.fire({
      allowOutsideClick: false,
      title: "Sweet!",
      text: "Modal with a custom image.",
      imageUrl: ALLImages("media6"),
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Custom image",
    });
  }

  function Image3dsweetalert() {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

  function Aminationsweetalert() {
    Swal.fire({
      title: "Custom animation with Animate.css",
      showClass: {
        popup: `
				animate__animated
				animate__bounce
				animate__faster
			  `,
      },
      hideClass: {
        popup: `
				animate__animated
				animate__fadeOutDown
				animate__faster
			  `,
      },
    });
  }

  function Topend() {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: true,
      timer: 1500,
    });
  }

  function TopStart() {
    Swal.fire({
      position: "top-start",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: true,
      timer: 1500,
    });
  }

  function BottomStart() {
    Swal.fire({
      position: "bottom-start",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: true,
      timer: 1500,
    });
  }
  function Bottomend() {
    Swal.fire({
      position: "bottom-end",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: true,
      timer: 1500,
    });
  }
  function Customziable() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#5e76a6",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }
  function Autoalert() {
    let timerInterval;
    Swal.fire({
      title: "Auto close alert!",
      html: "I will close in <b></b> milliseconds.",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer()?.querySelector("b");
        if (b) {
          timerInterval = setInterval(() => {
            const remainingTime = Swal.getTimerLeft();
            if (remainingTime) {
              b.textContent = remainingTime.toString();
            }
          }, 100);
        }
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        // Do something when the timer expires
      }
    });
  }
  function Ajaxcalling() {
    Swal.fire({
      title: "Submit your username",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Look up",
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        return fetch(`//api.github.com/users/${login}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .catch((error) => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `${result.value.login}'s avatar`,
          imageUrl: result.value.avatar_url,
        });
      }
    });
  }

  function Style1() {
    Swal.fire("The Internet ?", "That thing is still around ?", "question");
  }

  function Style2() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5e76a6",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }

  function Style3() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary me-2",
        cancelButton: "btn btn-primary me-2",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            "Deleted!",
            "Your file has been deleted.",
            "success"
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your imaginary file is safe :)",
            "error"
          );
        }
      });
  }
  return (
    <Fragment>
      <Pageheader
        mainheading="Sweet Alerts"
        parentfolder="Apps"
        activepage="Sweet Alerts"
      />

      <div className="sidemenu-height">
        <Row>
          <Col sm={6} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">Basic Sweetalert</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  className="ripple"
                  aria-label="Try me! Example: A basic message"
                  onClick={Basicsweetalert}
                  id="basic"
                >
                  Basic Alert
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">Danger Sweetalert</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  onClick={Dangersweetalert}
                  aria-label="Try me! Example: A modal with a title, an error icon, a text, and a footer"
                  id="error-sweetalert"
                >
                  Danger Alert
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">Image Sweetalert</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  onClick={Imagesweetalert}
                  aria-label="Try me! Example: A modal window with a long content inside"
                  id="image-sweetalert"
                >
                  Image Alert
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">Sweetalert With 3Buttons</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  aria-label="Try me! Example: A dialog with three buttons"
                  onClick={Image3dsweetalert}
                  id="sweetalert2"
                >
                  Alert with Button
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col sm={6} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">Sweetalert With Animation</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  aria-label="Try me!"
                  id="sweetalert3"
                  onClick={Aminationsweetalert}
                >
                  Alert With Animation
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">Sweetalert style 1</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  aria-label="Try me! Example: A title with a text under"
                  id="sweetalert1"
                  onClick={Style1}
                >
                  Alert style 1
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">Sweetalert style-2</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  className="ripple"
                  aria-label="Try me! Example: A custom positioned dialog"
                  id="confirm-btn"
                  onClick={Style2}
                >
                  Alert style 2
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">Sweetalert style-3</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  className="ripple"
                  aria-label="Try me! Example: A custom positioned dialog"
                  id="sweetalert4"
                  onClick={Style3}
                >
                  Alert style 3
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col sm={6} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">Top-End Sweetalert</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  className="ripple"
                  aria-label="Try me! Example: A custom positioned dialog"
                  id="top-end"
                  onClick={Topend}
                >
                  Top-End
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">Top-Start Sweetalert</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  className="ripple"
                  aria-label="Try me! Example: A custom positioned dialog"
                  id="top-start"
                  onClick={TopStart}
                >
                  Top-Start
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">Bottom-Start Sweetalert</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  className="ripple"
                  aria-label="Try me! Example: A custom positioned dialog"
                  id="bottom-start"
                  onClick={BottomStart}
                >
                  Bottom-Start
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">Bottom-End Sweetalert</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  className="ripple"
                  aria-label="Try me! Example: A custom positioned dialog"
                  id="bottom-end"
                  onClick={Bottomend}
                >
                  Bottom-End
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">A message with customization</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  className="ripple"
                  aria-label="Try me! Example: A custom positioned dialog"
                  id="customized-btn"
                  onClick={Customziable}
                >
                  Customised Alert
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={12} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">Timer Sweetalert</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  className="ripple"
                  aria-label="Try me! Example: A message with auto close timer"
                  id="timer-btn"
                  onClick={Autoalert}
                >
                  Timer Alert
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={12} md={6} lg={3}>
            <Card className="custom-card text-center">
              <Card.Header>
                <div className="card-title">Ajax loader Sweetalert</div>
              </Card.Header>
              <Card.Body className="text-center">
                <Button
                  className="ripple"
                  aria-label="Try me! Example: AJAX request"
                  id="ajax-btn"
                  onClick={Ajaxcalling}
                >
                  Ajax loader
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default Sweetalert;
