import { Fragment } from "react";
import { Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Error505 = () => {
  return (
    <Fragment >
      <div className="page main-signin-wrapper bg-primary construction">

        {/* <!-- Start::container --> */}
        <Container>
          <div className="construction1 text-center details text-fixed-white">
            <div className="">
              <Col lg={12}>
                <h1 className="fs-140 mb-0">500</h1>
              </Col>
              <Col lg={12}>
                <h1>Oops.The Page you are looking  for doesn't  exit..</h1>
                <h6 className="fs-15 mt-3 mb-4 text-white-50">You may have mistyped the address or the page may have moved. Try searching below.</h6>
                <Link className="btn ripple btn-secondary text-center mb-2" to={`${import.meta.env.BASE_URL}dashboard/`}>Back to Home</Link>
              </Col>
            </div>
          </div>
        </Container>
        {/* <!-- End::container --> */}

      </div>
    </Fragment>
  )
};

export default Error505;
