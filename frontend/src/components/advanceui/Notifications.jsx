import { Fragment } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import toast, { Toaster } from 'react-hot-toast';
import Pageheader from "../../layouts/Pageheader";


const Notifications = () => {

  //Basic Notification

  const BasicNotify = () => toast.success('Welcome to Spruha Admin Dashboard!', {
    position: 'top-left'
  });
  const BasicNotify2 = () => toast.success('Welcome to Spruha Admin Dashboard!', {
    position: 'top-center'
  });
  const BasicNotify3 = () => toast.success('Welcome to Spruha Admin Dashboard!', {
    position: 'top-right'
  });
  const BasicNotify4 = () => toast.success('Welcome to Spruha Admin Dashboard!', {
    position: 'bottom-left'
  });
  const BasicNotify5 = () => toast.success('Welcome to Spruha Admin Dashboard!', {
    position: 'bottom-center'
  });
  const BasicNotify6 = () => toast.success('Welcome to Spruha Admin Dashboard!', {
    position: 'bottom-right'
  });


  //Success Message

  const SuccessNotify = () => {
    const options = {
      reverseOrder: false,
      position: 'top-left'
    };

    toast.success('Successfully toasted!', options);
  };

  const ErrorNotify = () => {
    const options = {
      reverseOrder: false,

    };

    toast.error('Not Working toasted!', options);
  };

  const MultilineNotify = () => {
    const options = {
      reverseOrder: true,
    };

    toast.success("This toast is super big. I don't think anyone could eat it in one bite.\n\nIt's larger than you expected. You eat it but it does not seem to get smaller.",  options);
  };


  return (
    <Fragment>
      <Pageheader mainheading='Notification' parentfolder='Advanced Ui' activepage='Notification' />

      <Row className="row-sm">
        <Col xl={4} lg={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Basic Notification</div>
            </Card.Header>
            <Card.Body className="text-center">
              <Button onClick={() => BasicNotify()}><Toaster
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                  // Define default options
                  className: '',
                  duration: 5000,
                  // style: {
                  //   background: '#363636',
                  //   color: '#fff',
                  // },
                  // Default options for specific types
                  success: {
                    duration: 3000,
                  },
                }}
              />Basic Notification</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Basic Center Notification </div>
            </Card.Header>
            <Card.Body className="text-center">
              <Button onClick={() => BasicNotify2()}><Toaster
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                  // Define default options
                  className: '',
                  duration: 5000,
                  style: {
                    background: '#b91c1c',
                    color: '#fff',
                  },
                }} />Async Notification</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Basic Right Notification</div>
            </Card.Header>
            <Card.Body className="text-center">
              <Button id="async-success" onClick={() => BasicNotify3()}><Toaster
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                  // Define default options
                  className: '',
                  duration: 5000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },

                  // Default options for specific types
                  success: {
                    duration: 3000,
                  },
                }} />Async Notification</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={4} lg={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Bottom-left Notification</div>
            </Card.Header>
            <Card.Body className="text-center">
              <Button onClick={() => BasicNotify4()}><Toaster
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                  // Define default options
                  className: '',
                  duration: 5000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },

                  // Default options for specific types
                  success: {
                    duration: 3000,
                  },
                }}
              />Notification</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Bottom-Center Notification</div>
            </Card.Header>
            <Card.Body className="text-center">
              <Button variant="primary" onClick={() => BasicNotify5()}><Toaster
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                  // Define default options
                  className: '',
                  duration: 5000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },

                  // Default options for specific types
                  success: {
                    duration: 3000,
                  },
                }}
              />Info Notification</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Bottom-Right Notification</div>
            </Card.Header>
            <Card.Body className="text-center">
              <Button variant="primary" onClick={() => BasicNotify6()}><Toaster
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                  // Define default options
                  className: '',
                  duration: 5000,
                  style: {
                    background: 'rgb(var(--light-rgb))',
                    color: 'var(--default-text-color)',
                    border:'1px solid var(--default-border)'
                  },

                  // Default options for specific types
                  success: {
                    duration: 3000,
                  },
                }}
              />Success Notification</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={4} lg={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Success Notification</div>
            </Card.Header>
            <Card.Body className="text-center">
              <Button variant="success" onClick={() => SuccessNotify()}>Success Notification</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Error Notification</div>
            </Card.Header>
            <Card.Body className="text-center">
              <Button variant="danger" onClick={() => ErrorNotify()}>Error Notification</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Multi-line Notification</div>
            </Card.Header>
            <Card.Body className="text-center">
              <Button variant="success" onClick={() => MultilineNotify()}>Notification</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Fragment>
  );
}

export default Notifications;
