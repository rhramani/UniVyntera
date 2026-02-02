import { Fragment } from 'react';
import { Row, Col, Card, Nav, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ALLImages from '../../../common/Imagedata';
import Pageheader from '../../../layouts/Pageheader';

const Blogdetails = () => {

	return (

		<Fragment>
			<Pageheader mainheading='Blog-Details' parentfolder='Blog' activepage='Blog-Details' />

			{/* <!-- Row --> */}
			<Row className="row-sm">
				<Col xxl={9} lg={8} md={12}>
					<Card className="custom-card overflow-hidden">
						<div className="px-4 pt-4">
							<Link to={`${import.meta.env.BASE_URL}apps/blog/blogdetails/`}><img src={ALLImages("blog15")} alt="img" className="rounded-2 w-100" /></Link>
						</div>
						<Card.Body>
							<div className="item-card-desc d-md-flex mb-3">
								<Link to="#" className="">
									<span className="text-primary fs-18 me-2"><i className="fe fe-calendar"></i></span>
								</Link>
								<span className="my-auto text-dark">20-Mar-2021</span>
								<Link to="#" className="d-flex me-4"></Link>
								<Link to="#" className="">
									<span className="text-primary fs-18 me-2"><i className="fe fe-user"></i></span>
								</Link>
								<span className="my-auto text-dark">Dennis Mark</span>
								<Link to="#" className="d-flex ms-auto"></Link>
								<Link to="#" className="ms-auto">
									<span className="text-primary fs-18 me-2"><i className="mdi mdi-message-outline"></i></span>
								</Link>
								<span className="my-auto text-dark">6 Comments</span>
							</div>
							<Link to="#" className="mt-4"><h5 className="fw-semibold">Excepteur  occaecat cupidatat</h5></Link>
							<p className="">I must explain to you how all this mistaken idea  the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure.</p>
							<p className="">Sunt in culpa qui officia cupidatat non proident, sunt in culpa qui officia deserunt No one rejects, dislikes, or avoids pleasure itself, because it is pleasure of denouncing pleasure and praising pain was born.of denouncing pleasure and praising pain was born.</p>
							<p className="">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure.</p>
							<p className="tag tag-default px-2 py-1  mb-0 me-1">Travel</p>
							<p className="tag tag-default px-2 py-1 mb-0 me-1">Nature</p>
							<p className="tag tag-default px-2 py-1 mb-0 me-1">Life</p>
							<p className="tag tag-default px-2 py-1 mb-0">Discover</p>
						</Card.Body>
						<Card.Footer>
							{/* <div className="media profile-footer">
								<div className="media-user">
									<div className="demo-avatar-group">
										<div className="main-img-user"><img alt="" className="rounded-circle"  /></div>
										<div className="main-img-user"><img alt="" className="rounded-circle"  /></div>
										<div className="main-img-user"><img alt="" className="rounded-circle"  /></div>
										<div className="main-img-user"><img alt="" className="rounded-circle"  /></div>
									</div>
								</div>
							</div> */}
							<div className="media profile-footer">
								<div className="avatar-list-stacked">
									<span className="avatar avatar-rounded">
										<img src={ALLImages("face12")} alt="img" />
									</span>
									<span className="avatar avatar-rounded">
										<img src={ALLImages("face7")} alt="img" />
									</span>
									<span className="avatar avatar-rounded">
										<img src={ALLImages("face5")} alt="img" />
									</span>
									<span className="avatar avatar-rounded">
										<img src={ALLImages("face6")} alt="img" />
									</span>
								</div>
							</div>
						</Card.Footer>
					</Card>
				</Col>
				<Col xxl={3} lg={4}>
					<Card className="custom-card mail-container task-container overflow-hidden">
						<div className="">
							<div className="p-4 border-bottom d-grid">
								<Link to="#" className="btn btn-primary btn-compose" id="btnCompose">Blog Categories</Link>
							</div>
							<Card.Body className="tab-list-items">
								<div className="main-content-left main-content-left-mail">
									<div className="main-mail-menu">
										<Nav className=" main-nav-column">
											<Nav.Link className='active'><i className="fe fe-music"></i> music <span>20 post</span> </Nav.Link>
											<Nav.Link> <i className="fe fe-truck"></i> Travel <span>3 post</span></Nav.Link>
											<Nav.Link> <i className="fe fe-sunset"></i> Nature & Life <span>10 post</span> </Nav.Link>
											<Nav.Link> <i className="fe fe-monitor"></i>Technologie <span>8 post</span> </Nav.Link>
											<Nav.Link> <i className="fe fe-heart"></i> Fashion <span>15 post</span></Nav.Link>
										</Nav>
									</div>
									{/* <!-- main-mail-menu --> */}
								</div>
							</Card.Body>
						</div>
					</Card>
					<Card className="custom-card">
						<Card.Header className="card-header">
							<h6 className="main-content-label">Trending Posts</h6>
						</Card.Header>
						<Card.Body>
							<ul className="list-unstyled">
								<li className="media d-block d-sm-flex">
									<img alt="img" className="wd-100p wd-sm-100 me-3 mg-b-20 mg-sm-b-0" src={ALLImages("blog2")} />
									<div className="media-body my-auto">
										<p className="mb-0 font-weight-bold fs-15">Sed ut perspiciatis unde omnis iste natus error.</p>
										<p className="mb-0 fs-11 text-muted">2 days ago</p>
									</div>
								</li>
								<li className="media d-block d-sm-flex mg-t-25">
									<img alt="img" className="wd-100p wd-sm-100 me-3 mg-b-20 mg-sm-b-0" src={ALLImages("blog3")} />
									<div className="media-body my-auto">
										<p className="mb-0 font-weight-bold fs-15">Excepteur occaecat cupidatat doloremque laudantium.</p>
										<p className="mb-0 fs-11 text-muted">2 days ago</p>
									</div>
								</li>
								<li className="media d-block d-sm-flex mg-t-25">
									<img alt="img" className="wd-100p wd-sm-100 me-3 mg-b-20 mg-sm-b-0" src={ALLImages("blog4")} />
									<div className="media-body my-auto">
										<p className="mb-0 font-weight-bold fs-15">Sed ut perspiciatis unde omnis iste natus error.</p>
										<p className="mb-0 fs-11 text-muted">2 days ago</p>
									</div>
								</li>
								<li className="media d-block d-sm-flex mg-t-25">
									<img alt="img" className="wd-100p wd-sm-100 me-3 mg-b-20 mg-sm-b-0" src={ALLImages("blog1")} />
									<div className="media-body my-auto">
										<p className="mb-0 font-weight-bold fs-15">Sed ut perspiciatis unde omnis iste natus error.</p>
										<p className="mb-0 fs-11 text-muted">4 days ago</p>
									</div>
								</li>
							</ul>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={12} lg={12}>
					<Card className=" custom-card">
						<Card.Body>
							<div>
								<h6 className="main-content-label mb-3">Comments</h6>
							</div>
							<div className="text-wrap">
								<div className="example">
									<div className="d-sm-flex comment-section">
										<div className="d-flex me-3">
											<Link to="#"><img className="main-avatar" alt="img" src={ALLImages("face1")} /></Link>
										</div>
										<div className="media-body">
											<h5 className="mt-0 mb-1 fw-semibold"> Rohina Klen
												<span className="mx-1"><i className="fe fe-check-circle text-success fs-16"></i></span>
												<span className="fs-12 text-muted ms-1 mt-auto"> 10mins ago</span>
											</h5>
											<p className="font-13  mb-2 mt-2">
												Lorem ipsum dolor sit amet, quis Neque porro quisquam est, nostrud exercitation ullamco laboris   commodo consequat.
											</p>
											<Link to="#" className="me-2 mt-1"><span className="badge bg-success-transparent">Reply</span></Link>
											<Link to="#" className="me-2 mt-1"><span className="badge bg-danger-transparent">Delete</span></Link>
											<div className="btn-group mb-1 ms-auto float-sm-end mt-2 mt-sm-0">
												<button className="btn btn-light btn-sm" ><span className="fe fe-thumbs-up fs-16"></span></button>
												<button className="btn btn-light btn-sm" ><span className="fe fe-thumbs-down fs-16"></span></button>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="text-wrap mt-2">
								<div className="example">
									<div className="d-sm-flex comment-section">
										<div className="d-flex me-3">
											<Link to="#"><img className="main-avatar" alt="img" src={ALLImages("face2")} /></Link>
										</div>
										<div className="media-body">
											<h5 className="mt-0 mb-1 fw-semibold">Dennis Mark
												<span className="mx-1"><i className="fe fe-check-circle text-success fs-16"></i></span>
												<span className="fs-12 text-muted ms-1 mt-auto"> 10mins ago</span>
											</h5>
											<p className="font-13  mb-2 mt-2">ipsum dolor sit amet, quis Neque porro quisquam est, nostrud exercitation ullamco laboris   commodo consequat.</p>
											<Link to="#" className="me-2 mt-1"><span className="badge bg-success-transparent">Reply</span></Link>
											<Link to="#" className="me-2 mt-1"><span className="badge bg-danger-transparent">Delete</span></Link>
											<div className="btn-group mb-1 ms-auto float-sm-end mt-2 mt-sm-0">
												<button className="btn btn-light btn-sm" ><span className="fe fe-thumbs-up fs-16"></span></button>
												<button className="btn btn-light btn-sm" ><span className="fe fe-thumbs-down fs-16"></span></button>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="text-wrap mt-2">
								<div className="example">
									<div className="d-sm-flex comment-section">
										<div className="d-flex me-3">
											<Link to="#">
												<img className="main-avatar" alt="img" src={ALLImages("face3")} /> </Link> </div>
										<div className="media-body">
											<h5 className="mt-0 mb-1 fw-semibold">Joanne Scott
												<span className="mx-1"><i className="fe fe-check-circle text-success fs-16"></i></span>
												<span className="fs-12 text-muted ms-1 mt-auto"> 10mins ago</span>
											</h5>
											<p className="font-13  mb-2 mt-2">
												Lorem ipsum dolor sit amet, quis Neque porro quisquam est, nostrud exercitation ullamco laboris   commodo consequat.
											</p>
											<Link to="#" className="me-2 mt-1"><span className="badge bg-success-transparent">Reply</span></Link>
											<Link to="#" className="me-2 mt-1"><span className="badge bg-danger-transparent">Delete</span></Link>
											<div className="btn-group mb-1 ms-auto float-sm-end mt-2 mt-sm-0">
												<button className="btn btn-light btn-sm" ><span className="fe fe-thumbs-up fs-16"></span></button>
												<button className="btn btn-light btn-sm" ><span className="fe fe-thumbs-down fs-16"></span></button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={12} lg={12}>
					<Card className="custom-card">
						<Card.Body>
							<div>
								<h6 className="main-content-label mb-3">Add A Comment</h6></div>
							<div className="text-wrap">
								<div className="example">
									<div>
										<Form.Group className="form-group">
											<Form.Control type="text" id="name1" placeholder="Your Name" />
										</Form.Group>
										<Form.Group className="form-group">
											<Form.Control type="email" id="email" placeholder="Email Address" />
										</Form.Group>
										<Form.Group className="form-group">
											<Form.Control name="example-textarea-input" as="textarea" rows={6} placeholder="Write Comment" />
										</Form.Group>
										<Link to="#" className="btn btn-primary">Send Reply</Link>
									</div>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			{/* <!-- End Row --> */}
		</Fragment >
	)
};

export default Blogdetails;
