import { Fragment } from "react";
import { OverlayTrigger, Row, Tooltip, Col, Card } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
const Icons = () => {
  return (

    <Fragment>
      <Pageheader mainheading='Icons' parentfolder='Apps' activepage='Icons' />

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Bootstrap Icons</div>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">Simply beautiful open source icons. For more info <a href="https://icons.getbootstrap.com/" target="_blank" className="text-primary">click here</a>.</p>
              <p className="mb-4"><code>&lt;i className="bi bi-ICON_NAME"&gt;&lt;/i&gt;</code></p>
              <ul className="icons-list list-unstyled">
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bi bi-arrow-left-circle</Tooltip>}><i className="bi bi-arrow-left-circle"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bi bi-arrows-move</Tooltip>}><i className="bi bi-arrows-move"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bi bi-bag</Tooltip>}><i className="bi bi-bag"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bi bi-bar-chart-line</Tooltip>}><i className="bi bi-bar-chart-line"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bi bi-basket</Tooltip>}><i className="bi bi-basket"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>"bi bi-bell</Tooltip>}><i className="bi bi-bell"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bi bi-book</Tooltip>}><i className="bi bi-book"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bi bi-box</Tooltip>}><i className="bi bi-box"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bi bi-briefcase</Tooltip>}><i className="bi bi-briefcase"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bi bi-brightness-high</Tooltip>}><i className="bi bi-brightness-high"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bi bi-calendar</Tooltip>}><i className="bi bi-calendar"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bi bi-paint-bucket</Tooltip>}><i className="bi bi-paint-bucket"></i></OverlayTrigger></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Remix Icons</div>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">Simply beautiful open source icons. For more info <a href="https://remixicon.com/" target="_blank" className="text-primary">click here</a>.</p>
              <p className="mb-4"><code>&lt;i className="ri-ICON_NAME"&gt;&lt;/i&gt;</code></p>
              <ul className="icons-list list-unstyled">
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ri-home-line</Tooltip>}><i className="ri-home-line"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ri-mail-line</Tooltip>}><i className="ri-mail-line"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ri-briefcase-line</Tooltip>}><i className="ri-briefcase-line"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ri-window-line</Tooltip>}><i className="ri-window-line"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ri-chat-2-line</Tooltip>}><i className="ri-chat-2-line"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ri-chat-settings-line</Tooltip>}><i className="ri-chat-settings-line"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ri-edit-line</Tooltip>}><i className="ri-edit-line"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ri-layout-line</Tooltip>}><i className="ri-layout-line"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ri-code-s-slash-line</Tooltip>}><i className="ri-code-s-slash-line"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ri-airplay-line</Tooltip>}><i className="ri-airplay-line"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ri-file-line</Tooltip>}><i className="ri-file-line"></i></OverlayTrigger></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Feather Icons</div>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">Simply beautiful open source icons. For more info <a href="https://feathericons.com/" target="_blank" className="text-primary">click here</a>.</p>
              <p className="mb-4"><code>&lt;i className="fe fe-ICON_NAME"&gt;&lt;/i&gt;</code></p>
              <ul className="icons-list list-unstyled">
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fe fe-activity</Tooltip>}><i className="fe fe-activity"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fe fe-airplay</Tooltip>}><i className="fe fe-airplay"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fe fe-alert-circle</Tooltip>}><i className="fe fe-alert-circle"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fe fe-alert-triangle</Tooltip>}><i className="fe fe-alert-triangle"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fe fe-bar-chart-2</Tooltip>}><i className="fe fe-bar-chart-2"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fe fe-bell</Tooltip>}><i className="fe fe-bell"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fe fe-camera</Tooltip>}><i className="fe fe-camera"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fe fe-copy</Tooltip>}><i className="fe fe-copy"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fe fe-eye</Tooltip>}><i className="fe fe-eye"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fe fe-file</Tooltip>}><i className="fe fe-file"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fe fe-layout</Tooltip>}><i className="fe fe-layout"></i></OverlayTrigger></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Tabler Icons</div>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">Simply beautiful open source icons. For more info <a href="https://tabler-icons.io/" target="_blank" className="text-primary">click here</a>.</p>
              <p className="mb-4"><code>&lt;i className="ti ti-ICON_NAME"&gt;&lt;/i&gt;</code></p>
              <ul className="icons-list list-unstyled">
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti ti-brand-tabler</Tooltip>}><i className="ti ti-brand-tabler"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti ti-activity-heartbeat</Tooltip>}><i className="ti ti-activity-heartbeat"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti ti-alert-octagon</Tooltip>}><i className="ti ti-alert-octagon"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti ti-album</Tooltip>}><i className="ti ti-album"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti ti-alert-circle</Tooltip>}><i className="ti ti-alert-circle"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti ti-antenna-bars-5</Tooltip>}><i className="ti ti-antenna-bars-5"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti ti-armchair</Tooltip>}><i className="ti ti-armchair"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti ti-arrow-big-right</Tooltip>}><i className="ti ti-arrow-big-right"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti ti-arrows-shuffle-2</Tooltip>}><i className="ti ti-arrows-shuffle-2"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti ti-backspace</Tooltip>}><i className="ti ti-backspace"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti ti-apps</Tooltip>}><i className="ti ti-apps"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti ti-color-picker</Tooltip>}><i className="ti ti-color-picker"></i></OverlayTrigger></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Line Awesome Icons</div>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">Simply beautiful open source icons. For more info <a href="https://icons8.com/line-awesome" target="_blank" className="text-primary">click here</a>.</p>
              <p className="mb-4"><code>&lt;i className="las la-ICON_NAME"&gt;&lt;/i&gt;</code></p>
              <ul className="icons-list list-unstyled">
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>las la-bell</Tooltip>}><i className="las la-bell"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>las la-exclamation-circle</Tooltip>}><i className="las la-exclamation-circle"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>las la-exclamation-triangle</Tooltip>}><i className="las la-exclamation-triangle"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>las la-arrow-alt-circle-down</Tooltip>}><i className="las la-arrow-alt-circle-down"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>las la-arrow-alt-circle-up</Tooltip>}><i className="las la-arrow-alt-circle-up"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>las la-arrow-alt-circle-left</Tooltip>}><i className="las la-arrow-alt-circle-left"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>las la-arrow-alt-circle-right</Tooltip>}><i className="las la-arrow-alt-circle-right"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>las la-history</Tooltip>}><i className="las la-history"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>las la-headphones</Tooltip>}><i className="las la-headphones"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>las la-tv</Tooltip>}><i className="las la-tv"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>las la-car-side</Tooltip>}><i className="las la-car-side"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>las la-envelope</Tooltip>}><i className="las la-envelope"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>las la-edit</Tooltip>}><i className="las la-edit"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>las la-map</Tooltip>}><i className="las la-map"></i></OverlayTrigger></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Boxicons</div>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">Simply beautiful open source icons. For more info <a href="https://boxicons.com/" target="_blank" className="text-primary">click here</a>.</p>
              <p className="mb-4"><code>&lt;i className="bx bx-ICON_NAME"&gt;&lt;/i&gt;</code></p>
              <ul className="icons-list list-unstyled">
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-home</Tooltip>}><i className="bx bx-home"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-home-alt</Tooltip>}><i className="bx bx-home-alt"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-box</Tooltip>}><i className="bx bx-box"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-medal</Tooltip>}><i className="bx bx-medal"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-file</Tooltip>}><i className="bx bx-file"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-palette</Tooltip>}><i className="bx bx-palette"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-receipt</Tooltip>}><i className="bx bx-receipt"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-table</Tooltip>}><i className="bx bx-table"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-bar-chart-alt</Tooltip>}><i className="bx bx-bar-chart-alt"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-layer</Tooltip>}><i className="bx bx-layer"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-map-alt</Tooltip>}><i className="bx bx-map-alt"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-gift</Tooltip>}><i className="bx bx-gift"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-file-blank</Tooltip>}><i className="bx bx-file-blank"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-lock-alt</Tooltip>}><i className="bx bx-lock-alt"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-error</Tooltip>}><i className="bx bx-error"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>bx bx-error-circle</Tooltip>}><i className="bx bx-error-circle"></i></OverlayTrigger></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Fontawesome Icons</div>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">Simply beautiful open source icons. For more info <a href="http://fontawesome.io" target="_blank" className="text-primary">click here</a>.</p>
              <p className="mb-4"><code>&lt;i className="fa fa-ICON_NAME"&gt;&lt;/i&gt;</code></p>
              <ul className="icons-list list-unstyled">
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fab fa-500px</Tooltip>}><i className="fab fa-500px"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fa fa-address-book</Tooltip>}><i className="fa fa-address-book"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>far fa-address-book</Tooltip>}><i className="far fa-address-book"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>far fa-address-card</Tooltip>}><i className="far fa-address-card"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fa fa-adjust</Tooltip>}><i className="fa fa-adjust"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fab fa-adn</Tooltip>}><i className="fab fa-adn"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fa fa-align-center</Tooltip>}><i className="fa fa-align-center"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fa fa-align-justify</Tooltip>}><i className="fa fa-align-justify"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fa fa-align-left</Tooltip>}><i className="fa fa-align-left"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fa fa-align-right</Tooltip>}><i className="fa fa-align-right"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fa fa-american-sign-language-interpreting</Tooltip>}><i className="fa fa-american-sign-language-interpreting"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fa fa-ambulance</Tooltip>}><i className="fa fa-ambulance"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fa fa-anchor</Tooltip>}><i className="fa fa-anchor"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>fab fa-android</Tooltip>}><i className="fab fa-android"></i></OverlayTrigger></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Materialdesign Icons</div>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">Simply beautiful open source icons. For more info <a href="https://materialdesignicons.com" target="_blank" className="text-primary">click here</a>.</p>
              <p className="mb-4"><code>&lt;i className="mdi mdi-ICON_NAME"&gt;&lt;/i&gt;</code></p>
              <ul className="icons-list list-unstyled">
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-access-point</Tooltip>}><i className="mdi mdi-access-point"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-access-point-network</Tooltip>}><i className="mdi mdi-access-point-network"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-account</Tooltip>}><i className="mdi mdi-account"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-account-alert</Tooltip>}><i className="mdi mdi-account-alert"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-account-box</Tooltip>}><i className="mdi mdi-account-box"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-account-box-outline</Tooltip>}><i className="mdi mdi-account-box-outline"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-account-card-details</Tooltip>}><i className="mdi mdi-account-card-details"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-account-check</Tooltip>}><i className="mdi mdi-account-check"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-account-circle</Tooltip>}><i className="mdi mdi-account-circle"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-account-convert</Tooltip>}><i className="mdi mdi-account-convert"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-account-edit</Tooltip>}><i className="mdi mdi-account-edit"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-account-key</Tooltip>}><i className="mdi mdi-account-key"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-account-location</Tooltip>}><i className="mdi mdi-account-location"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-account-minus</Tooltip>}><i className="mdi mdi-account-minus"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-account-multiple</Tooltip>}><i className="mdi mdi-account-multiple"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>mdi mdi-account-multiple-minus</Tooltip>}><i className="mdi mdi-account-multiple-minus"></i></OverlayTrigger></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Simpleline Icons</div>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">Simply beautiful open source icons. For more info <a href="https://simplelineicons.github.io/" target="_blank" className="text-primary">click here</a>.</p>
              <p className="mb-4"><code>&lt;i className="si si-ICON_NAME"&gt;&lt;/i&gt;</code></p>
              <ul className="icons-list list-unstyled">
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-user</Tooltip>}><i className="si si-user"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-people</Tooltip>}><i className="si si-people"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-user-female</Tooltip>}><i className="si si-user-female"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-user-follow</Tooltip>}><i className="si si-user-follow"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-user-following</Tooltip>}><i className="si si-user-following"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-user-unfollow</Tooltip>}><i className="si si-user-unfollow"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-login</Tooltip>}><i className="si si-login"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-logout</Tooltip>}><i className="si si-logout"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-emotsmile</Tooltip>}><i className="si si-emotsmile"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-phone</Tooltip>}><i className="si si-phone"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-call-end</Tooltip>}><i className="si si-call-end"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-call-in</Tooltip>}><i className="si si-call-in"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-call-out</Tooltip>}><i className="si si-call-out"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-map</Tooltip>}><i className="si si-map"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-location-pin</Tooltip>}><i className="si si-location-pin"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>si si-direction</Tooltip>}><i className="si si-direction"></i></OverlayTrigger></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Ionic Icons</div>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">Simply beautiful open source icons. For more info <a href="https://ionicons.com" target="_blank" className="text-primary">click here</a>.</p>
              <p className="mb-4"><code>&lt;i className="ion ICON_NAME"&gt;&lt;/i&gt;</code></p>
              <ul className="icons-list list-unstyled">
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-md-alarm</Tooltip>}><i className="icon ion-md-alarm"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-md-chatboxes</Tooltip>}><i className="icon ion-md-chatboxes"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-md-copy</Tooltip>}><i className="icon ion-md-copy"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-md-cube</Tooltip>}><i className="icon ion-md-cube"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-md-filing</Tooltip>}><i className="icon ion-md-filing"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-md-eye</Tooltip>}><i className="icon ion-md-eye"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-md-globe</Tooltip>}><i className="icon ion-md-globe"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-md-images</Tooltip>}><i className="icon ion-md-images"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-md-laptop</Tooltip>}><i className="icon ion-md-laptop"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-md-paper</Tooltip>}><i className="icon ion-md-paper"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-md-paper-plane</Tooltip>}><i className="icon ion-md-paper-plane"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-md-pricetags</Tooltip>}><i className="icon ion-md-pricetags"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-ios-settings</Tooltip>}><i className="icon ion-ios-settings"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-ios-stats</Tooltip>}><i className="icon ion-ios-stats"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-ios-share-alt</Tooltip>}><i className="icon ion-ios-share-alt"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>icon ion-ios-rocket</Tooltip>}><i className="icon ion-ios-rocket"></i></OverlayTrigger></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Pe7 Icons</div>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">Simply beautiful open source icons. For more info <a href="https://themes-pixeden.com/font-demos/7-stroke/" target="_blank" className="text-primary">click here</a>.</p>
              <p className="mb-4"><code>&lt;i className="pe-ICON_NAME"&gt;&lt;/i&gt;</code></p>
              <ul className="icons-list list-unstyled">
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-arc</Tooltip>}><i className="pe-7s-arc"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-back-2</Tooltip>}><i className="pe-7s-back-2"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-bandaid</Tooltip>}><i className="pe-7s-bandaid"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-car</Tooltip>}><i className="pe-7s-car"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-diamond</Tooltip>}><i className="pe-7s-diamond"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-door-lock</Tooltip>}><i className="pe-7s-door-lock"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-eyedropper</Tooltip>}><i className="pe-7s-eyedropper"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-female</Tooltip>}><i className="pe-7s-female"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-gym</Tooltip>}><i className="pe-7s-gym"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-hammer</Tooltip>}><i className="pe-7s-hammer"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-headphones</Tooltip>}><i className="pe-7s-headphones"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-helm</Tooltip>}><i className="pe-7s-helm"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-hourglass</Tooltip>}><i className="pe-7s-hourglass"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-leaf</Tooltip>}><i className="pe-7s-leaf"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-magic-wand</Tooltip>}><i className="pe-7s-magic-wand"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>pe-7s-male</Tooltip>}><i className="pe-7s-male"></i></OverlayTrigger></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Themify Icons</div>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">Simply beautiful open source icons. For more info <a href="https://themify.me/themify-icons" target="_blank" className="text-primary">click here</a>.</p>
              <p className="mb-4"><code>&lt;i className="ti-ICON_NAME"&gt;&lt;/i&gt;</code></p>
              <ul className="icons-list list-unstyled">
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-arrow-up</Tooltip>}><i className="ti-arrow-up"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-arrow-right</Tooltip>}><i className="ti-arrow-right"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-arrow-left</Tooltip>}><i className="ti-arrow-left"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-arrow-down</Tooltip>}><i className="ti-arrow-down"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-arrows-vertical</Tooltip>}><i className="ti-arrows-vertical"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-arrows-horizontal</Tooltip>}><i className="ti-arrows-horizontal"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-angle-up</Tooltip>}><i className="ti-angle-up"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-angle-right</Tooltip>}><i className="ti-angle-right"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-angle-left</Tooltip>}><i className="ti-angle-left"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-angle-down</Tooltip>}><i className="ti-angle-down"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-angle-double-up</Tooltip>}><i className="ti-angle-double-up"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-angle-double-right</Tooltip>}><i className="ti-angle-double-right"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-angle-double-left</Tooltip>}><i className="ti-angle-double-left"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-angle-double-down</Tooltip>}><i className="ti-angle-double-down"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-move</Tooltip>}><i className="ti-move"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>ti-fullscreen</Tooltip>}><i className="ti-fullscreen"></i></OverlayTrigger></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Typicons Icons</div>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">Simply beautiful open source icons. For more info <a href="https://www.s-ings.com/typicons/" target="_blank" className="text-primary">click here</a>.</p>
              <p className="mb-4"><code>&lt;i className="typcn typcn-ICON_NAME"&gt;&lt;/i&gt;</code></p>
              <ul className="icons-list list-unstyled">
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-chart-pie-outline</Tooltip>}><i className="typcn typcn-chart-pie-outline"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-chart-pie</Tooltip>}><i className="typcn typcn-chart-pie"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-chevron-left-outline</Tooltip>}><i className="typcn typcn-chevron-left-outline"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-chevron-left</Tooltip>}><i className="typcn typcn-chevron-left"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-chevron-right-outline</Tooltip>}><i className="typcn typcn-chevron-right-outline"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-chevron-right</Tooltip>}><i className="typcn typcn-chevron-right"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-clipboard</Tooltip>}><i className="typcn typcn-clipboard"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-cloud-storage</Tooltip>}><i className="typcn typcn-cloud-storage"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-cloud-storage-outline</Tooltip>}><i className="typcn typcn-cloud-storage-outline"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-code-outline</Tooltip>}><i className="typcn typcn-code-outline"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-code</Tooltip>}><i className="typcn typcn-code"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-coffee</Tooltip>}><i className="typcn typcn-coffee"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-cog-outline</Tooltip>}><i className="typcn typcn-cog-outline"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-cog</Tooltip>}><i className="typcn typcn-cog"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-compass</Tooltip>}><i className="typcn typcn-compass"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>typcn typcn-contacts</Tooltip>}><i className="typcn typcn-contacts"></i></OverlayTrigger></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Weather Icons</div>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">Simply beautiful open source icons. For more info <a href="https://erikflowers.github.io/weather-icons/" target="_blank" className="text-primary">click here</a>.</p>
              <p className="mb-4"><code>&lt;i className="wi wi-ICON_NAME"&gt;&lt;/i&gt;</code></p>
              <ul className="icons-list list-unstyled">
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-day-cloudy-high</Tooltip>}><i className="wi wi-day-cloudy-high"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-moonrise</Tooltip>}><i className="wi wi-moonrise"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-na</Tooltip>}><i className="wi wi-na"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-volcano</Tooltip>}><i className="wi wi-volcano"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-day-light-wind</Tooltip>}><i className="wi wi-day-light-wind"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-moonset</Tooltip>}><i className="wi wi-moonset"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-flood</Tooltip>}><i className="wi wi-flood"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-train</Tooltip>}><i className="wi wi-train"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-day-sleet</Tooltip>}><i className="wi wi-day-sleet"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-night-sleet</Tooltip>}><i className="wi wi-night-sleet"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-sandstorm</Tooltip>}><i className="wi wi-sandstorm"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-small-craft-advisory</Tooltip>}><i className="wi wi-small-craft-advisory"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-day-haze</Tooltip>}><i className="wi wi-day-haze"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-night-alt-sleet</Tooltip>}><i className="wi wi-night-alt-sleet"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-tsunami</Tooltip>}><i className="wi wi-tsunami"></i></OverlayTrigger></li>
                <li className="icons-list-item"><OverlayTrigger overlay={<Tooltip>wi wi-gale-warning</Tooltip>}><i className="wi wi-gale-warning"></i></OverlayTrigger></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
};

export default Icons;
