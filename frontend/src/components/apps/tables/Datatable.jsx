import { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { BasicTable, ExportCSV, ResponsiveDatatable, Savetable } from "../../../common/Tablefunction";
import Pageheader from "../../../layouts/Pageheader";



const DataTables = () => {
    return (
        <Fragment>
            <Pageheader mainheading='Data Tables' parentfolder='Tables' activepage='Data Tables' />

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title"> Basic Datatable </div>
                        </Card.Header>
                        <Card.Body>
                            <BasicTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">File Export Datatable </div>
                        </Card.Header>
                        <Card.Body>
                            <ExportCSV />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">Delete Row Datatable </div>
                        </Card.Header>
                        <Card.Body>
                            <ResponsiveDatatable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title"> Responisve Modal Datatable </div>
                        </Card.Header>
                        <Card.Body>
                            <Savetable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default DataTables;
