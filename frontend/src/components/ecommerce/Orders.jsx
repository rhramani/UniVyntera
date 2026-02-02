import { Fragment, useState } from "react";
import Select from 'react-select'
import { Link } from "react-router-dom";
import { Location, PageHeadr, Status } from "../../common/Select2data";
import { Card, Col, Form, Pagination, Row, Table } from "react-bootstrap";
import { TableData } from "../../common/Comondata";
import Pageheader from "../../layouts/Pageheader";
const Orders = () => {

    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = TableData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Fragment>

            <Pageheader mainheading='Orders' parentfolder='ECommerce' activepage='Orders' />


            <Row className="row-sm">
                <Col md={12} lg={12}>
                    <Card className="custom-card">
                        <Card.Header className="border-bottom-0 pb-0">
                            <div>
                                <div className="d-flex">
                                    <label className="main-content-label my-auto pt-2">All Orders</label>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="pt-2">
                            <Row className="table-filter mb-3">
                                <Col xl={3} lg={12}>
                                    <div className="d-flex align-items-center">
                                        <span>Show</span>
                                        <div className="d-flex ms-2 mx-2">
                                            <Form.Group className="">
                                                <Select options={PageHeadr} className="wd-80" classNamePrefix="Select2" placeholder="01" />
                                            </Form.Group>
                                        </div>
                                        <span>entries</span>
                                    </div>
                                </Col>
                                <div className="col-xl-9 col-lg-12 d-lg-flex justify-content-end align-items-center mb-3 mt-2 mt-xl-0">
                                    <div className="d-flex mt-4 mt-lg-0">
                                        <div className="filter-group d-inline-flex w-100">
                                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="form-control rounded-end-0" placeholder="search" />
                                            <button type="button" className="btn btn-primary"><i className="fa fa-search"></i></button>
                                        </div>
                                    </div>
                                    <div className="d-sm-flex mt-4 mt-lg-0 ms-3">
                                        <div className="filter-group d-flex align-items-center mb-2 mb-sm-0">
                                            <label className="me-2">Location</label>

                                            <Select options={Location} className="wd-150" classNamePrefix="Select2" placeholder="All" />
                                        </div>
                                        <div className="filter-group ms-3 d-flex align-items-center">
                                            <label className="me-2">Status</label>

                                            <Select options={Status} className="wd-150" classNamePrefix="Select2" placeholder="Any" />
                                        </div>
                                    </div>
                                </div>
                            </Row>
                            <div className="table-responsive border border-bottom-0">
                                <Table className="mb-0 text-nowrap text-md-nowrap">
                                    <thead>
                                        <tr className="border-bottom">
                                            <th>ID</th>
                                            <th>Invoice</th>
                                            <th>Name</th>
                                            <th>Date</th>
                                            <th>Total</th>
                                            <th>Warehouse</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((idx) => (
                                            <tr className="border-bottom" key={idx.id}>
                                                <th scope="row">{idx.orderid}1</th>
                                                <td>{idx.invoice}</td>
                                                <td>{idx.name}</td>
                                                <td>{idx.date}</td>
                                                <td>{idx.total}</td>
                                                <td>{idx.warehouse}</td>
                                                <td><span className={`status bg-${idx.color}`}></span>{idx.status}</td>
                                                <td>
                                                    <div className="btn-list">
                                                        <Link to="#" className="btn"><i className="bi bi-file-earmark-text"></i></Link>
                                                        <Link to="#" className="btn"><i className="bi bi-pencil-square"></i></Link>
                                                        <Link to="#" className="btn"><i className="bi bi-trash"></i></Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <Pagination className="mt-3 justify-content-end">
                                <Pagination.Item>Prev</Pagination.Item>
                                <Pagination.Item active>{1}</Pagination.Item>
                                <Pagination.Item>{2}</Pagination.Item>
                                <Pagination.Item>{3}</Pagination.Item>
                                <Pagination.Item>{4}</Pagination.Item>
                                <Pagination.Item>Next</Pagination.Item>
                            </Pagination>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Orders;
