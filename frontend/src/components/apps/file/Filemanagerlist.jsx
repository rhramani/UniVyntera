import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Pagination, Row } from 'react-bootstrap';
import Pageheader from '../../../layouts/Pageheader';
import ALLImages from '../../../common/Imagedata';

const FileManagerlist = () => (
	<Fragment>

<Pageheader mainheading='File-Manager-List' parentfolder='File-Manager' activepage='File-Manager-List' />

		{/* <!-- Row --> */}
		<Row>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className=" custom-card border shadow-none">
					<Card.Body className="text-center">
						<div className="file-manger-icon">
							<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`} ><img src={ALLImages("filepng4")} alt="img" className="br-7" /></Link>
						</div>
						<h6 className="mb-1 fw-semibold mt-0">videos</h6>
						<span className="text-muted">4.23gb</span>
					</Card.Body>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card border p-0 shadow-none">
					<Card.Body className="text-center">
						<div className="file-manger-icon">
							<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`} ><img src={ALLImages("filepng4")} alt="img" className="br-7" /></Link>
						</div>
						<h6 className="mb-1 fw-semibold mt-0">images</h6>
						<span className="text-muted">4.23gb</span>
					</Card.Body>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card border p-0 shadow-none">
					<Card.Body className="text-center">
						<div className="file-manger-icon">
							<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`} ><img src={ALLImages('filepng6')} alt="img" className="br-7" /></Link>
						</div>
						<h6 className="mb-1 fw-semibold mt-0">Documents</h6>
						<span className="text-muted">4.23gb</span>
					</Card.Body>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card border p-0 shadow-none">
					<Card.Body className="text-center">
						<div className="file-manger-icon">
							<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`} ><img src={ALLImages('filepng6')} alt="img" className="br-7" /></Link>
						</div>
						<h6 className="mb-1 fw-semibold mt-0">Documents</h6>
						<span className="text-muted">4.23gb</span>
					</Card.Body>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card border p-0 shadow-none">
					<Card.Body className="text-center">
						<div className="file-manger-icon">
							<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages('filepng6')} alt="img" className="br-7" /></Link>
						</div>
						<h6 className="mb-1 fw-semibold mt-0">Documents</h6>
						<span className="text-muted">4.23gb</span>
					</Card.Body>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card border p-0 shadow-none">
					<Card.Body className="text-center">
						<div className="file-manger-icon">
							<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filepng1")} alt="img" className="br-7" /></Link>
						</div>
						<h6 className="mb-1 fw-semibold mt-0">Documents</h6>
						<span className="text-muted">4.23gb</span>
					</Card.Body>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card border p-0 shadow-none">
					<Card.Body className="text-center">
						<div className="file-manger-icon">
							<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filepng1")} alt="img" className="br-7" /></Link>
						</div>
						<h6 className="mb-1 fw-semibold mt-0">Documents</h6>
						<span className="text-muted">4.23gb</span>
					</Card.Body>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card border p-0 shadow-none">
					<Card.Body className="text-center">
						<div className="file-manger-icon">
							<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filepng1")} alt="img" className="br-7" /></Link>
						</div>
						<h6 className="mb-1 fw-semibold mt-0">Documents</h6>
						<span className="text-muted">4.23gb</span>
					</Card.Body>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card border p-0 shadow-none">
					<Card.Body className="text-center">
						<div className="file-manger-icon">
							<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filepng2")} alt="img" className="br-7" /></Link>

						</div>
						<h6 className="mb-1 fw-semibold mt-0">Documents</h6>
						<span className="text-muted">4.23gb</span>
					</Card.Body>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card border p-0 shadow-none">
					<Card.Body className="text-center">
						<div className="file-manger-icon">
							<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filepng2")} alt="img" className="br-7" /></Link>
						</div>
						<h6 className="mb-1 fw-semibold mt-0">Documents</h6>
						<span className="text-muted">4.23gb</span>
					</Card.Body>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card border p-0 shadow-none">
					<Card.Body className="text-center">
						<div className="file-manger-icon">
							<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filepng3")} alt="img" className="br-7" /></Link>
						</div>
						<h6 className="mb-1 fw-semibold mt-0">Documents</h6>
						<span className="text-muted">4.23gb</span>
					</Card.Body>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card border p-0 shadow-none">
					<Card.Body className="text-center">
						<div className="file-manger-icon">
							<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filepng3")} alt="img" className="br-7" /></Link>
						</div>
						<h6 className="mb-1 fw-semibold mt-0">Documents</h6>
						<span className="text-muted">4.23gb</span>
					</Card.Body>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card overflow-hidden">
					<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filejpg1")} alt="img" /></Link>
					<div className="card-footer bd-t-0 py-3">
						<div className="d-flex">
							<div>
								<h6 className="mb-0">221.jpg</h6>
							</div>
							<div className="ms-auto">
								<h6 className="text-muted mb-0">120 KB</h6>
							</div>
						</div>
					</div>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card overflow-hidden">
					<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filejpg2")} alt="img" /></Link>
					<div className="card-footer bd-t-0 py-3">
						<div className="d-flex">
							<div>
								<h6 className="mb-0">567.jpg</h6>
							</div>
							<div className="ms-auto">
								<h6 className="text-muted mb-0">120 KB</h6>
							</div>
						</div>
					</div>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card overflow-hidden">
					<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filejpg3")} alt="img" /></Link>
					<div className="card-footer bd-t-0 py-3">
						<div className="d-flex">
							<div>
								<h6 className="mb-0">367.jpg</h6>
							</div>
							<div className="ms-auto">
								<h6 className="text-muted mb-0">120 KB</h6>
							</div>
						</div>
					</div>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card overflow-hidden">
					<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filejpg4")} alt="img" /></Link>
					<div className="card-footer bd-t-0 py-3">
						<div className="d-flex">
							<div>
								<h6 className="mb-0">211.jpg</h6>
							</div>
							<div className="ms-auto">
								<h6 className="text-muted mb-0">120 KB</h6>
							</div>
						</div>
					</div>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card overflow-hidden">
					<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filejpg5")} alt="img" /></Link>
					<div className="card-footer bd-t-0 py-3">
						<div className="d-flex">
							<div>
								<h6 className="mb-0">541.jpg</h6>
							</div>
							<div className="ms-auto">
								<h6 className="text-muted mb-0">120 KB</h6>
							</div>
						</div>
					</div>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card overflow-hidden">
					<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filejpg6")} alt="img" /></Link>
					<div className="card-footer bd-t-0 py-3">
						<div className="d-flex">
							<div>
								<h6 className="mb-0">345.jpg</h6>
							</div>
							<div className="ms-auto">
								<h6 className="text-muted mb-0">120 KB</h6>
							</div>
						</div>
					</div>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} 
			>
				<Card className="custom-card overflow-hidden">
					<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filejpg7")} alt="img" /></Link>
					<div className="card-footer bd-t-0 py-3">
						<div className="d-flex">
							<div>
								<h6 className="mb-0">213.jpg</h6>
							</div>
							<div className="ms-auto">
								<h6 className="text-muted mb-0">120 KB</h6>
							</div>
						</div>
					</div>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} >
				<Card className="custom-card overflow-hidden">
					<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filejpg8")} alt="img" /></Link>
					<div className="card-footer bd-t-0 py-3">
						<div className="d-flex">
							<div>
								<h6 className="mb-0">1324.jpg</h6>
							</div>
							<div className="ms-auto">
								<h6 className="text-muted mb-0">120 KB</h6>
							</div>
						</div>
					</div>
				</Card>
			</Col>
			<Col xl={3} md={3} lg={6} xxl={2} >
				<Card className="custom-card overflow-hidden">
					<Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages("filejpg9")} alt="img" /></Link>
					<div className="card-footer bd-t-0 py-3">
						<div className="d-flex">
							<div>
								<h6 className="mb-0">123.jpg</h6>
							</div>
							<div className="ms-auto">
								<h6 className="text-muted mb-0">120 KB</h6>
							</div>
						</div>
					</div>
				</Card>
			</Col>
			<nav>

				<Pagination className="pagination justify-content-end">

					<Pagination.Item >Prev</Pagination.Item>
					<Pagination.Item active >{1}</Pagination.Item>
					<Pagination.Item >{2}</Pagination.Item>
					<Pagination.Item >{3}</Pagination.Item>
					<Pagination.Item >{4}</Pagination.Item>
					<Pagination.Item  >{5}</Pagination.Item>
					<Pagination.Item >Next</Pagination.Item>

				</Pagination>
			</nav>
		</Row>
		{/* <!-- End Row --> */}
	</Fragment>
);

export default FileManagerlist;
