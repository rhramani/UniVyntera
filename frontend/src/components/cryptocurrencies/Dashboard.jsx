import { Fragment, useState } from 'react';
import { Col, Table, Row, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { BitCoin, BtcDashboard, Cryptodashboard, YourProfile } from '../../common/Chartdata';
import { TRADINGACTIVITIES } from '../../common/Comondata';
import Pageheader from '../../layouts/Pageheader';
import ALLImages from '../../common/Imagedata';

const CryptoDashboard = () => {

	const [isRTL, _setIsRTL] = useState(false);

	return (
		<Fragment>
			<Pageheader mainheading='Welcome To Dashboard' parentfolder='Crypto-Currencies' activepage='Dashboard' />

			<Row className="row-sm">
				<div id='crypto-slick'>
					<Swiper  autoplay={{ delay: 1000, disableOnInteraction: false }} dir={isRTL ? 'rtl' : 'ltr'} modules={[Autoplay]} breakpoints={{
						320: { slidesPerView: 1, spaceBetween: 20 },
						480: { slidesPerView: 1, spaceBetween: 20 },
						640: { slidesPerView: 2, spaceBetween: 20 },
						768: { slidesPerView: 3, spaceBetween: 20 },
						1024: { slidesPerView: 3, spaceBetween: 20 },
						1400: { slidesPerView: 5, spaceBetween: 20 },
					}} className="mySwiper">
						<SwiperSlide className="itemslick">
							<Card className="custom-card me-4">
								<Card.Body>
									<div className="d-flex no-block align-items-center currency-item">
										<div>
											<span className="text-muted fs-13 mb-3">Bitcoin BTC</span>
											<h3 className="m-0 mt-2">1.343434</h3>
										</div>
										<div className="ms-auto mt-auto">
											<img src={ALLImages('svg3')} className="wd-30 hd-30 me-2" alt="btc" />
										</div>
									</div>
								</Card.Body>
							</Card>
						</SwiperSlide>
						<SwiperSlide className="item">
							<Card className="custom-card me-4">
								<Card.Body>
									<div className="d-flex no-block align-items-center currency-item">
										<div>
											<span className="text-muted fs-13 mb-3">Ethereum ETH</span>
											<h3 className="m-0 mt-2">3.763674</h3>
										</div>
										<div className="ms-auto mt-auto">
											<img src={ALLImages('svg1')} className="wd-30 hd-30 me-2" alt="eth" />
										</div>
									</div>
								</Card.Body>
							</Card>
						</SwiperSlide>
						<SwiperSlide className="item">
							<Card className="custom-card me-4">
								<Card.Body>
									<div className="d-flex no-block align-items-center currency-item">
										<div>
											<span className="text-muted fs-13 mb-3">Ripple XRP</span>
											<h3 className="m-0 mt-2">12.53647</h3>
										</div>
										<div className="ms-auto mt-auto">
											<img src={ALLImages('svg2')} className="wd-30 hd-30 me-2" alt="" />
										</div>
									</div>
								</Card.Body>
							</Card>
						</SwiperSlide>
						<SwiperSlide className="item">
							<Card className="custom-card me-4 ">
								<Card.Body>
									<div className="d-flex no-block align-items-center currency-item">
										<div>
											<span className="text-muted fs-13 mb-3">litecoin LTC</span>
											<h3 className="m-0 mt-2">3,635387</h3>
										</div>
										<div className="ms-auto mt-auto">
											<img src={ALLImages('svg4')} className="wd-30 hd-30 me-2" alt="ltc" />
										</div>
									</div>
								</Card.Body>
							</Card>
						</SwiperSlide>
						<SwiperSlide className="item">
							<Card className="custom-card me-4">
								<Card.Body>
									<div className="d-flex no-block align-items-center currency-item">
										<div>
											<span className="text-muted fs-13 mb-3">Dash DASH</span>
											<h3 className="m-0 mt-2">3,635387</h3>
										</div>
										<div className="ms-auto mt-auto">
											<img src={ALLImages('svg5')} className="wd-30 hd-30 me-2" alt="dash" />
										</div>
									</div>
								</Card.Body>
							</Card>
						</SwiperSlide>
						<SwiperSlide className="item">
							<Card className=" custom-card me-4">
								<Card.Body>
									<div className="d-flex no-block align-items-center currency-item">
										<div>
											<span className="text-muted fs-13 mb-3">Monero XMR</span>
											<h3 className="m-0 mt-2">5,34578</h3>
										</div>
										<div className="ms-auto mt-auto">
											<img src={ALLImages('svg7')} className="wd-30 hd-30 me-2" alt="xmr" />
										</div>
									</div>
								</Card.Body>
							</Card>
						</SwiperSlide>
						<SwiperSlide className="item">
							<Card className=" custom-card me-4">
								<Card.Body>
									<div className="d-flex no-block align-items-center currency-item">
										<div>
											<span className="text-muted fs-13 mb-3">Neo NEO</span>
											<h3 className="m-0 mt-2">4,435456</h3>
										</div>
										<div className="ms-auto mt-auto">
											<img src={ALLImages('svg8')} className="wd-30 hd-30 me-2" alt="neo" />
										</div>
									</div>
								</Card.Body>
							</Card>
						</SwiperSlide>
						<SwiperSlide className="item">
							<Card className=" custom-card me-4">
								<Card.Body>
									<div className="d-flex no-block align-items-center currency-item">
										<div>
											<span className="text-muted fs-13 mb-3">Steem STEEM</span>
											<h3 className="m-0 mt-2">2,345467</h3>
										</div>
										<div className="ms-auto mt-auto">
											<img src={ALLImages('svg9')} className="wd-30 hd-30 me-2" alt="steem" />
										</div>
									</div>
								</Card.Body>
							</Card>
						</SwiperSlide>
					</Swiper>
				</div>
			</Row>
			{/* <!-- row opened --> */}
			<Row className="row-sm">
				<Col md={12} sm={12} lg={12} xl={12} xxl={4} >
					<Card className="custom-card wallet-1">
						<Card.Header className="border-bottom-0">
							<label className="main-content-label my-auto pt-2 mb-1">Assets Allocation</label>
							<span className="d-block fs-12 mb-0 mt-1 text-muted">Asset allocation involves dividing an investment portfolio among different asset categories</span>
						</Card.Header>
						<Card.Body className="crypto-wallet">
							<div className="">
								<Cryptodashboard />
								<div className="chart-circle-value circle-style"><div className="fs-20 fw-semibold">55%</div> </div>
							</div>
						</Card.Body>
						<div className="table-responsive border-0 br-10 pb-3">
								<table className="table border-0 mg-b-0 text-nowrap text-md-nowrap">
									<tbody>
										<tr>
											<td className="d-flex">
												<div className="cryp-icon bg-primary my-auto me-2"> <i className="cf cf-btc"></i> </div>
												<div className="media-body ms-3">
													<p className="mb-1 text-muted fw-normal fs-15">Bitcoin BTC</p>
													<span className="fs-15 fw-medium my-auto">$10,245.00</span>
												</div>
											</td>
											<td className="">0.0215637249</td>
											<td>+12.85% <i className="fa fa-arrow-up text-success ms-1"> </i></td>
										</tr>
										<tr>
											<td className="d-flex">
												<div className="cryp-icon bg-primary my-auto me-2"> <i className="cf cf-btc"></i> </div>
												<div className="media-body ms-3">
													<p className="mb-1 text-muted fw-normal fs-15">Ethereum ETH</p>
													<span className="fs-15 fw-medium my-auto">$10,245.00</span>
												</div>
											</td>
											<td className="">0.0253737689</td>
											<td>-02.25% <i className="fa fa-arrow-down text-danger ms-1"> </i></td>
										</tr>
										<tr>
											<td className="d-flex">
												<div className="cryp-icon bg-primary my-auto me-2"> <i className="cf cf-btc"></i> </div>
												<div className="media-body ms-3">
													<p className="mb-1 text-muted fw-normal fs-15">Dash DASH</p>
													<span className="fs-15 fw-medium my-auto">$10,245.00</span>
												</div>
											</td>
											<td>0.0253546426</td>
											<td>-11.85% <i className="fa fa-arrow-down text-danger ms-1"> </i></td>
										</tr>
									</tbody>
								</table>
							</div>
					</Card>
				</Col>
				<Col xl={12} xxl={8} lg={12} md={12}>
					<Card className="card-bitcoin custom-card">
						<Card.Header className="border-bottom-0 d-block">
							<label className="main-content-label my-auto pt-2 fs-15-f">BTC/USD</label>
							<span className="d-block fs-12 mb-0 mt-1 text-muted">
								Bitcoin is a digital cryptocurrency made up of processed data blocks used for online and
								brick-and-mortar purchases.
							</span>
						</Card.Header>
						<Card.Body className='pt-0'>
							<BtcDashboard />
						</Card.Body>
						<div className="media px-4 pb-4 pt-1 bitcoin-market">
							<div className="media-icon bg-primary crypto-icon me-2">
								<i className="cf cf-btc fs-20" />
							</div>
							<div className="media-body ms-2">
								<Row className="row-sm">
									<div className="col">
										<label>Symbol</label>
										<p>BTC</p>
									</div>
									<div className="col-3">
										<label>Price Benchmark</label>
										<p>135.00%</p>
									</div>
									<div className="col">
										<label>Price (USD)</label>
										<p>$2,457.69</p>
									</div>
									<div className="col">
										<label>Change (24H)</label>
										<p>-0.32%</p>
									</div>
									<div className="col">
										<label>Market Cap</label>
										<p>$134.17B</p>
									</div>
								</Row>
								{/* <!-- row --> */}
							</div>
						</div>
					</Card>
				</Col>
			</Row>
			{/* <!-- row closed --> */}

			{/* <!-- row opened --> */}
			<Row className="row-sm">
				<div className="col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-8">
					<Row className="row-sm">
						<div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
							<Card className="custom-card">
								<Card.Body className="row">
									<div className="col-sm-5 d-flex no-block align-items-center">
										<div>
											<span className="fs-18 mb-3">Bitcoin</span>
											<h2 className="mb-2 mt-2">3.634528</h2>
											<span className="m-0 fs-15 mt-4 text-muted">$2500 USD</span>
										</div>
									</div>
									<div className="col-sm-7 my-auto">
										<BitCoin />
									</div>
								</Card.Body>
							</Card>
						</div>
						<div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
							<Card className="custom-card">
								<Card.Body className="pt-0">
									<br />
									<span className="fs-18 mb-3">Your Profile</span>
									<Row className="mt-3">
										<div className="col-sm-6 my-auto border-end text-centerd-flex no-block align-items-center">
											<div className="d-flex">
												<YourProfile />
												<div className="my-auto d-block ms-3">
													<h6 className="mb-2 fs-16">2.343434</h6>
													<span className="m-0 fs-13 text-muted">$2500 USD</span>
												</div>
											</div>
										</div>
										<div className="col-sm-6 my-auto text-sm-center">
											<h2 className="mb-2  mt-3 mt-sm-0">2.343434</h2>
											<span className="m-0 fs-14 mt-3 text-muted">Pending Balance</span>
										</div>
									</Row>
								</Card.Body>
							</Card>
						</div>
					</Row>
					<Card className="custom-card">
						<Card.Header className="border-bottom-0">
							<label className="main-content-label my-auto pt-2">TRADING ACTIVITIES</label>
							<span className="d-block fs-12 mb-3 mt-1 text-muted">
								Cryptocurrency trading is the act of speculating on cryptocurrency price movements via a
								CFD trading account, or buying and selling the underlying coins via an exchange
							</span>
						</Card.Header>
						<Card.Body className="">
							<div className="table-responsive tasks">
								<Table className="table border text-nowrap">
									<thead>
										<tr>
											<th className="wd-lg-10p text-center">#</th>
											<th className="wd-lg-10p ">Name</th>
											<th className="wd-lg-20p ">Price</th>
											<th className="wd-lg-20p ">Change</th>
											<th className="wd-lg-20p ">Chart</th>
											<th className="wd-lg-20p ">Status</th>
										</tr>
									</thead>
									<tbody>
										{TRADINGACTIVITIES.map((list, index) => (
											<tr key={index} data-index={index}>
												<td className="text-center">{list.id}</td>
												<td className="coin_icon w-11r">
													<div className='d-flex'>
														<div className="cryp-icon bg-primary me-2">
															<i className={`cf cf-${list.icon} `} />
														</div>
														<span className=" my-auto ">
															{list.name} <b>{list.title}</b>
														</span>
													</div>
												</td>
												<td className="">{list.price}</td>
												<td className="">
													<span className={`text-${list.changeStatus} `}>{list.change}</span>
												</td>
												<td className="">{list.date}</td>
												<td className="">
													<Link to="#" className={`text-${list.status}`}>
														{list.statusText}
													</Link>
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							</div>
						</Card.Body>
					</Card>
				</div>
				<Col md={12} sm={12} lg={12} xl={12} xxl={4}>
					<Card className=" custom-card overflow-hidden">
						<Card.Header className="border-bottom-0">
							<div>
							<div className='card-title'>Activity</div>
							<span className="d-block fs-12 mb-0 mt-1 text-muted">
								Activity is one of the many blockchain consensus algorithms
							</span>
							</div>
						</Card.Header>
						<ul className="crypto-transcation list-unstyled mg-b-0 px-0 my-2">
							<li className="list-item mb-0 px-3 mt-0 pb-3">
								<div className="media align-items-center">
									<div className="crypto-icon bg-primary-transparent text-primary">
										<i className="cf cf-btc wd-20 ht-20 text-center fs-18" />
									</div>
									<div className="media-body ms-3">
										<p className="fw-medium mg-b-3 fs-15">Sent Litecoin</p>
										<p className="fs-11 mg-b-0 text-gray-3">To bitcoin Address</p>
									</div>
								</div>
								<div className="text-end ms-auto my-auto">
									<h5 className="fw-semibold fs-16 mb-0">
										+ 0.0147
										<i className="text-success fs-16 fe fe-arrow-up ms-1" />
									</h5>
								</div>
							</li>
							<li className="list-item mb-0 px-3 pb-3">
								<div className="media align-items-center">
									<div className="crypto-icon bg-primary-transparent text-primary">
										<i className="cf cf-ltc wd-20 ht-20 text-center fs-18" />
									</div>
									<div className="media-body ms-3">
										<p className="fw-medium mg-b-3 fs-15">Sent Ethereum</p>
										<p className="fs-11 mg-b-0 text-gray-3">Pending</p>
									</div>
								</div>
								<div className="text-end ms-auto my-auto">
									<h5 className="fw-semibold fs-16 mb-0">
										- 0.0345
										<i className="text-danger fs-16 fe fe-arrow-down ms-1" />
									</h5>
								</div>
							</li>
							<li className="list-item mb-0 px-3 pb-3">
								<div className="media align-items-center">
									<div className="crypto-icon bg-primary-transparent text-primary">
										<i className="cf cf-dash wd-20 ht-20 text-center fs-18" />
									</div>
									<div className="media-body ms-3">
										<p className="fw-medium mg-b-3 fs-15">Received Dash</p>
										<p className="fs-11 mg-b-0 text-gray-3">To Received Address</p>
									</div>
								</div>
								<div className="text-end ms-auto my-auto">
									<h5 className="fw-semibold fs-16 mb-0">
										- 0.0346
										<i className="text-danger fs-16 fe fe-arrow-down" />
									</h5>
								</div>
							</li>
							<li className="list-item px-3 pb-3">
								<div className="media align-items-center">
									<div className="crypto-icon bg-primary-transparent text-primary">
										<i className="cf cf-xrp wd-20 ht-20 text-center fs-18" />
									</div>
									<div className="media-body ms-3">
										<p className="fw-medium mg-b-3 fs-15">Received Ripple</p>
										<p className="fs-11 mg-b-0 text-gray-3">To Received Address</p>
									</div>
								</div>
								<div className="text-end ms-auto my-auto">
									<h5 className="fw-semibold fs-16 mb-0">
										+ 0.0237
										<i className="text-success fs-16 fe fe-arrow-up ms-1" />
									</h5>
								</div>
							</li>
							<li className="list-item px-3 pb-3">
								<div className="media align-items-center">
									<div className="crypto-icon bg-primary-transparent text-primary">
										<i className="cf cf-bsd wd-20 ht-20 text-center fs-18" />
									</div>
									<div className="media-body ms-3">
										<p className="fw-medium mg-b-3 fs-15">Received Ripple</p>
										<p className="fs-11 mg-b-0 text-gray-3">To Received Address</p>
									</div>
								</div>
								<div className="text-end ms-auto my-auto">
									<h5 className="fw-semibold fs-16 mb-0">
										- 0.0348
										<i className="text-danger fs-16 fe fe-arrow-down ms-1" />
									</h5>
								</div>
							</li>
						</ul>
					</Card>
				</Col>
			</Row>
		</Fragment>
	);
};

export default CryptoDashboard;
