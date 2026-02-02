import { Fragment } from "react";
import { Card, Col, Dropdown, Pagination, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Pageheader from "../../layouts/Pageheader";
import { UserlistData } from "../../common/Comondata";

const UserList = () => {

  return (
    <Fragment>

      <Pageheader mainheading='Userlist' parentfolder='Advanced Ui' activepage='Userlist' />

      <Row className="row-sm">
        <Col sm={12} md={12} lg={12} xl={12} className="grid-margin">
          <Card className="custom-card">
            <Card.Header className="border-bottom-0 pb-0 d-block">
              <div className="d-flex justify-content-between align-items-center">
                <label className="main-content-label mb-0 pt-1">User Table</label>
                <div className="ms-auto float-end">
                  <Dropdown>
                    <Dropdown.Toggle className="no-caret" variant="" id="dropdown-basic"><i className="fe fe-more-horizontal"></i></Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-end">
                      <Dropdown.Item>Today</Dropdown.Item>
                      <Dropdown.Item>Last Week</Dropdown.Item>
                      <Dropdown.Item>Last Month</Dropdown.Item>
                      <Dropdown.Item>Last Year</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <p className="fs-12 text-gray-5 mt-0 mb-2">Example of Spruha Simple Table. <Link to="#" className="text-primary">Learn more</Link></p>
            </Card.Header>
            <div className="card-body">
              <div className="table-responsive userlist-table">
                <table className="table card-table table-striped table-vcenter border text-nowrap mb-0">
                  <thead>
                    <tr>
                      <th className="wd-lg-8p"><span>User</span></th>
                      <th className="wd-lg-20p"><span></span></th>
                      <th className="wd-lg-20p"><span>Created</span></th>
                      <th className="wd-lg-20p"><span>Status</span></th>
                      <th className="wd-lg-20p"><span>Email</span></th>
                      <th className="wd-lg-20p">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UserlistData.map((idx)=>(
                    <tr key={idx.id}>
                      <td>
                        <div className="avatar-md">
                          <img alt="avatar" className="rounded-circle me-2" src={idx.Product1} />
                        </div>
                      </td>
                      <td>{idx.ProductId}</td>
                      <td>
                        {idx.created}
                      </td>
                      <td className="text-center">
                        <span className={`label text-${idx.information} d-flex`}><span className="dot-label bg-gray-300 me-1"></span>{idx.status}</span>
                      </td>
                      <td>
                        <Link to="#">{idx.email}</Link>
                      </td>
                      <td>
                        <Link to="#" className="btn btn-sm btn-primary me-2"> <i className="fe fe-search"></i> </Link>
                        <Link to="#" className="btn btn-sm btn-info me-2"> <i className="fe fe-edit-2"></i> </Link>
                        <Link to="#" className="btn btn-sm btn-danger"> <i className="fe fe-trash"></i> </Link>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination className="mt-4 mb-0 float-end">
                <Pagination.Item disabled>Prev</Pagination.Item>
                <Pagination.Item active>{1}</Pagination.Item>
                <Pagination.Item>{2}</Pagination.Item>
                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Item>Next</Pagination.Item>
              </Pagination>
            </div>
          </Card>
        </Col>
      </Row>

    </Fragment>
  )
};

export default UserList;
