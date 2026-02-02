import  { useState } from 'react';
import { Card, Col, Row, Navbar, Nav, NavDropdown, Form, Button, InputGroup, Container, Offcanvas, Collapse, Dropdown } from "react-bootstrap"
import Pageheader from "../../layouts/Pageheader";
import ALLImages from '../../common/Imagedata';


const Navbars = () => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <Pageheader mainheading='Navbar' parentfolder='Advanced Ui' activepage='Navbar' />

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Navbar with sub-component
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className="bg-body-tertiary">
                                <div className="container-fluid">
                                    <Navbar.Brand><img src={ALLImages('logo5')} alt="" className="d-inline-block" /></Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto mb-2 mb-lg-0">
                                            <Nav.Link active>Home</Nav.Link>
                                            <Nav.Link >Link</Nav.Link>
                                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                                <NavDropdown.Item >Action</NavDropdown.Item>
                                                <NavDropdown.Item > Another action </NavDropdown.Item>
                                                <NavDropdown.Item >Something</NavDropdown.Item>
                                                <NavDropdown.Divider />
                                                <NavDropdown.Item disabled> Disabled </NavDropdown.Item>
                                            </NavDropdown>
                                            <Nav.Link disabled>Disabled</Nav.Link>
                                        </Nav>
                                        <Form className="d-flex" role="search">
                                            <Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search" />
                                            <Button type="submit">Search</Button>
                                        </Form>
                                    </Navbar.Collapse>
                                </div>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Brand With And Without Links
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className="bg-body-tertiary mb-3">
                                <div className="container-fluid">
                                    <Navbar.Brand><img src={ALLImages('logo5')} alt="" /></Navbar.Brand>
                                </div>
                            </Navbar>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className="bg-body-tertiary">
                                <div className="container-fluid">
                                    <Navbar.Brand><img src={ALLImages('logo5')} alt="" /></Navbar.Brand>
                                </div>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Image and text
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className="bg-body-tertiary">
                                <div className="container-fluid">
                                    <Navbar.Brand className="text-default d-inline-flex align-items-center"><img src={ALLImages('logo5')} alt="" className="d-inline-block align-text-top" />React BootStrap</Navbar.Brand>
                                </div>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Nav with lists, links and dropdowns
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className="bg-body-tertiary mb-3">
                                <div className="container-fluid">
                                    <Navbar.Brand><img src={ALLImages('logo5')} alt="" /></Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto">
                                            <Nav.Link href="#home" active>Home</Nav.Link>
                                            <Nav.Link href="#link1">Features</Nav.Link>
                                            <Nav.Link href="#link2">Pricing</Nav.Link>
                                            <Nav.Link href="#link3" disabled>Disabled</Nav.Link>
                                        </Nav>
                                    </Navbar.Collapse>
                                </div>
                            </Navbar>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className="bg-body-tertiary mb-3">
                                <div className="container-fluid">
                                    <Navbar.Brand><img src={ALLImages('logo5')} alt="" /></Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto">
                                            <Nav.Link href="#home" active>Home</Nav.Link>
                                            <Nav.Link href="#link1">Features</Nav.Link>
                                            <Nav.Link href="#link2">Pricing</Nav.Link>
                                            <Nav.Link href="#link3" disabled>Disabled</Nav.Link>
                                        </Nav>
                                    </Navbar.Collapse>
                                </div>
                            </Navbar>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className="bg-body-tertiary mb-3">
                                <div className="container-fluid">
                                    <Navbar.Brand><img src={ALLImages('logo5')} alt="" /></Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto">
                                            <Nav.Link href="#home" active>Home</Nav.Link>
                                            <Nav.Link href="#link1">Features</Nav.Link>
                                            <Nav.Link href="#link2">Pricing</Nav.Link>
                                            <NavDropdown title="Dropdown link" id="basic-nav-dropdown">
                                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                                <NavDropdown.Item href="#action/3.2"> Another action </NavDropdown.Item>
                                                <NavDropdown.Item href="#action/3.3">Something else here</NavDropdown.Item>
                                            </NavDropdown>
                                        </Nav>
                                    </Navbar.Collapse>
                                </div>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Forms In Navbar
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className="bg-body-tertiary mb-3">
                                <div className="container-fluid">
                                    <Form className="d-flex" role="search">
                                        <Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search" />
                                        <Button type="submit">Search</Button>
                                    </Form>
                                </div>
                            </Navbar>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className="bg-body-tertiary mb-3">
                                <div className="container-fluid">
                                    <Navbar.Brand><img src={ALLImages('logo5')} alt="" /></Navbar.Brand>
                                    <Form className="d-flex" role="search">
                                        <Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search" />
                                        <Button type="submit">Search</Button>
                                    </Form>
                                </div>
                            </Navbar>
                            <h6 className="mb-3 fw-semibold">Input groups in navbar forms</h6>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className=" mb-3">
                                <div className="container-fluid">
                                    <InputGroup>
                                        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                                        <Form.Control placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                                    </InputGroup>
                                </div>
                            </Navbar>
                            <h6 className="mb-3 fw-semibold"> Variation buttons are supported as part of the navbar forms</h6>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className=" mb-3">
                                <Form className="container-fluid justify-content-start">
                                    <Button className="m-1" type="button">Main button</Button>
                                    <Button size="sm" variant="outline-secondary" className="m-1" type="button">Smaller button</Button>
                                </Form>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Navbar With Text
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className=" mb-3">
                                <div className="container-fluid">
                                    <span className="navbar-text">
                                        Navbar text with an inline element
                                    </span>
                                </div>
                            </Navbar>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className="bg-body-tertiary">
                                <div className="container-fluid">
                                    <Navbar.Brand>Navbar with text</Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto mb-2 mb-lg-0">
                                            <Nav.Link href="#home" active>Home</Nav.Link>
                                            <Nav.Link href="#link1">Features</Nav.Link>
                                            <Nav.Link href="#link2">Pricing</Nav.Link>
                                        </Nav>
                                        <span className="navbar-text">
                                            Navbar text with an inline element
                                        </span>
                                    </Navbar.Collapse>
                                </div>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Transparent Color Schemes
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Navbar expand="lg" bg="primary-transparent" data-bs-theme="primary-transparent" className="bg-body-tertiary mb-3 navbar-primary-transparent">
                                <div className="container-fluid">
                                    <Navbar.Brand> <img src={ALLImages('logo5')} alt="" /></Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto mb-2 mb-lg-0">
                                            <Nav.Link href="#home" active>Home</Nav.Link>
                                            <Nav.Link href="#link1">Features</Nav.Link>
                                            <Nav.Link href="#link2">Pricing</Nav.Link>
                                            <Nav.Link href="#link3">About</Nav.Link>
                                        </Nav>
                                        <Form className="d-flex" role="search">
                                            <Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search" />
                                            <Button type="submit">Search</Button>
                                        </Form>
                                    </Navbar.Collapse>
                                </div>
                            </Navbar>
                            <Navbar expand="lg" bg="secondary-transparent" data-bs-theme="secondary-transparent" className="bg-body-tertiary mb-3 navbar-secondary-transparent">
                                <div className="container-fluid">
                                    <Navbar.Brand> <img src={ALLImages('logo5')} alt="" /></Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto mb-2 mb-lg-0">
                                            <Nav.Link href="#home" active>Home</Nav.Link>
                                            <Nav.Link href="#link1">Features</Nav.Link>
                                            <Nav.Link href="#link2">Pricing</Nav.Link>
                                            <Nav.Link href="#link3">About</Nav.Link>
                                        </Nav>
                                        <Form className="d-flex" role="search">
                                            <Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search" />
                                            <Button variant="secondary" type="submit">Search</Button>
                                        </Form>
                                    </Navbar.Collapse>
                                </div>
                            </Navbar>
                            <Navbar expand="lg" bg="dark-transparent" data-bs-theme="dark-transparent" className="bg-body-tertiary mb-3 navbar-dark-transparent">
                                <div className="container-fluid">
                                    <Navbar.Brand> <img src={ALLImages('logo5')} alt="" /></Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto mb-2 mb-lg-0">
                                            <Nav.Link href="#home" active>Home</Nav.Link>
                                            <Nav.Link href="#link1">Features</Nav.Link>
                                            <Nav.Link href="#link2">Pricing</Nav.Link>
                                            <Nav.Link href="#link3">About</Nav.Link>
                                        </Nav>
                                        <Form className="d-flex" role="search">
                                            <Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search" />
                                            <Button variant="dark" type="submit">Search</Button>
                                        </Form>
                                    </Navbar.Collapse>
                                </div>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Solid Color Schemes
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Navbar expand="lg" data-bs-theme="primary" className="navbar-primary mb-3">
                                <div className="container-fluid">
                                    <Navbar.Brand> <img src={ALLImages('logo6')} alt="" /></Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto mb-2 mb-lg-0">
                                            <Nav.Link href="#home" active>Home</Nav.Link>
                                            <Nav.Link href="#link1">Features</Nav.Link>
                                            <Nav.Link href="#link2">Pricing</Nav.Link>
                                            <Nav.Link href="#link3">About</Nav.Link>
                                        </Nav>
                                        <Form className="d-flex" role="search">
                                            <Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search" />
                                            <Button variant='light' type="submit">Search</Button>
                                        </Form>
                                    </Navbar.Collapse>
                                </div>
                            </Navbar>
                            <Navbar expand="lg" data-bs-theme="secondary" className="navbar-secondary mb-3">
                                <div className="container-fluid">
                                    <Navbar.Brand> <img src={ALLImages('logo5')} alt="" /></Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto mb-2 mb-lg-0">
                                            <Nav.Link href="#home" active>Home</Nav.Link>
                                            <Nav.Link href="#link1">Features</Nav.Link>
                                            <Nav.Link href="#link2">Pricing</Nav.Link>
                                            <Nav.Link href="#link3">About</Nav.Link>
                                        </Nav>
                                        <Form className="d-flex" role="search">
                                            <Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search" />
                                            <Button variant="light" type="submit">Search</Button>
                                        </Form>
                                    </Navbar.Collapse>
                                </div>
                            </Navbar>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className="mb-3">
                                <div className="container-fluid">
                                    <Navbar.Brand> <img src={ALLImages('logo5')} alt="" /></Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto mb-2 mb-lg-0">
                                            <Nav.Link href="#home" active>Home</Nav.Link>
                                            <Nav.Link href="#link1">Features</Nav.Link>
                                            <Nav.Link href="#link2">Pricing</Nav.Link>
                                            <Nav.Link href="#link3">About</Nav.Link>
                                        </Nav>
                                        <Form className="d-flex" role="search">
                                            <Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search" />
                                            <Button variant="light" type="submit">Search</Button>
                                        </Form>
                                    </Navbar.Collapse>
                                </div>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Containers
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <h6>Too center</h6>
                            <Container>
                                <Navbar expand="lg" bg="light" data-bs-theme="light" className="mb-3">
                                    <div className="container-fluid">
                                        <Navbar.Brand>Navbar</Navbar.Brand>
                                    </div>
                                </Navbar>
                            </Container>
                            <h6>Change the responsive container to how to wide the content</h6>

                            <Navbar expand="lg" bg="light" data-bs-theme="light" className="mb-3">
                                <div className="container-md">
                                    <Navbar.Brand>Navbar</Navbar.Brand>
                                </div>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Placement
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Navbar expand="lg" bg="light" data-bs-theme="light">
                                <div className="container-fluid">
                                    <Navbar.Brand>Default</Navbar.Brand>
                                </div>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Placement
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" fixed="top">
                                <div className="container-fluid">
                                    <Navbar.Brand>Fixed top</Navbar.Brand>
                                </div>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Placement
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" fixed="bottom">
                                <div className="container-fluid">
                                    <Navbar.Brand>Fixed bottom</Navbar.Brand>
                                </div>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Placement
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" sticky="top">
                                <div className="container-fluid">
                                    <Navbar.Brand>Sticky top</Navbar.Brand>
                                </div>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Scrolling
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Navbar expand="lg" bg="light" data-bs-theme="light" className="bg-body-tertiary">
                                <div className="container-fluid">
                                    <Navbar.Brand>Navbar scroll</Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto mb-2 mb-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                                            <Nav.Link active>Home</Nav.Link>
                                            <Nav.Link >Link</Nav.Link>
                                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                                <NavDropdown.Item >Action</NavDropdown.Item>
                                                <NavDropdown.Item > Another action </NavDropdown.Item>
                                                <NavDropdown.Item >Something</NavDropdown.Item>
                                                <NavDropdown.Divider />
                                                <NavDropdown.Item  disabled> Disabled </NavDropdown.Item>
                                            </NavDropdown>
                                            <Nav.Link >Link 1</Nav.Link>
                                            <Nav.Link >Link 2</Nav.Link>

                                        </Nav>
                                        <Form className="d-flex mt-lg-0 mt-3" role="search">
                                            <Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search" />
                                            <Button type="submit">Search</Button>
                                        </Form>
                                    </Navbar.Collapse>
                                </div>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Responsive behaviors Toggler
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary bg-light">
                                <Container fluid>
                                    <Navbar.Brand href="#home">Hidden brand</Navbar.Brand>
                                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                                    <Navbar.Collapse id="responsive-navbar-nav">
                                        <Nav className="me-auto">
                                            <Nav.Link active>Home</Nav.Link>
                                            <Nav.Link >Link</Nav.Link>
                                            <Nav.Link  disabled>Disabled</Nav.Link> 
                                        </Nav>
                                        <Nav>
                                        <Form className="d-flex mt-3 mt-lg-0" role="search">
                                            <Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search" />
                                            <Button type="submit">Search</Button>
                                        </Form>
                                        </Nav>
                                    </Navbar.Collapse>
                                </Container>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card external_content">
                        <Card.Header>
                            <div className="card-title">
                                External content
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Collapse in={open}>
                                <div className="bg-dark p-4">
                                    <h5 className="text-white h4">Collapsed content</h5>
                                    <span className="text-white op-7">Toggleable via the navbar brand.</span>
                                </div>
                            </Collapse>
                            <Navbar className="navbar navbar-dark bg-dark rounded-0">
                                <Container fluid>
                                    <Button variant=''
                                        onClick={() => setOpen(!open)} className="nav-toggle"
                                        aria-controls="example-collapse-text"
                                        aria-expanded={open}>
                                        <span className="navbar-toggler-icon"></span>
                                    </Button>
                                </Container>
                            </Navbar>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Offcanvas
                            </div>
                        </Card.Header>
                        <Card.Body>
                            
                            <Navbar expand="xxxl" className="bg-body-tertiary mb-3">
                                <Container fluid>
                                    <Navbar.Brand>Navbar Offcanvas</Navbar.Brand>
                                    <Navbar.Toggle aria-controls="offcanvasNavbar" />
                                    <Navbar.Offcanvas 
                                        id="offcanvasNavbar"
                                        aria-labelledby="offcanvasNavbarLabel"
                                        placement="end"
                                        className='custom_offcanvas_nav'
                                        backdrop='false'
                                    >
                                        <Offcanvas.Header closeButton>
                                            <Offcanvas.Title id="offcanvasNavbarLabel">Offcanvas</Offcanvas.Title>
                                        </Offcanvas.Header>
                                    <Offcanvas.Body>
                                        <Nav className="justify-content-end flex-grow-1 pe-3">
                                        <Nav.Item><Nav.Link active>Home</Nav.Link></Nav.Item>
                                        <Nav.Item><Nav.Link>Link</Nav.Link></Nav.Item>
                                        <NavDropdown
                                            title="Dropdown"
                                            id="offcanvasNavbarDropdown-expand-false"
                                        >
                                            <NavDropdown.Item >Action</NavDropdown.Item>
                                            <NavDropdown.Item>
                                            Another action
                                            </NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item>
                                            Something else here
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                        </Nav>
                                        <Form className="d-flex mt-2">
                                        <Form.Control
                                            type="search"
                                            placeholder="Search"
                                            className="me-2"
                                            aria-label="Search"
                                        />
                                        <Button variant="primary">Search</Button>
                                        </Form>
                                    </Offcanvas.Body>
                                    </Navbar.Offcanvas>
                                </Container>
                            </Navbar>
   
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </div>
    )
}

export default Navbars;
