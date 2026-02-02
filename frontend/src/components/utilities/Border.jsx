import { Fragment, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Pageheader from '../../layouts/Pageheader';
import ALLImages from '../../common/Imagedata';

const Border = () => {

	//showcode

	const [isHidden, setIsHidden] = useState([false]);
	const toggleHidden = (index) => {
		const updatedHidden = [...isHidden];
		updatedHidden[index] = !updatedHidden[index];
		setIsHidden(updatedHidden);
	};

	return (

		<Fragment>

			<Pageheader mainheading='Borders' parentfolder='Utilities' activepage='Borders' />

			{/* <!-- Start:: row-1 --> */}
			<Row className="row-sm">
				<Col xl={6}>
					<Card className="custom-card">
						<Card.Header className="justify-content-between">
							<div className='card-title'> Borders </div>
							<div className="prism-toggle">
								<button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
							</div>
						</Card.Header>
						<Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
							<span className="border border-container d-inline-flex">
								<span className="fs-11 text-gray-5 m-auto">Border</span>
							</span>
							<span className="border-top border-container d-inline-flex">
								<span className="fs-11 text-gray-5 m-auto">Border-top</span>
							</span>
							<span className="border-end border-container d-inline-flex">
								<span className="fs-11 text-gray-5 m-auto">Border-right</span>
							</span>
							<span className="border-bottom border-container d-inline-flex">
								<span className="fs-11 text-gray-5 m-auto">Border-bottom</span>
							</span>
							<span className="border-start border-container d-inline-flex">
								<span className="fs-11 text-gray-5 m-auto">Border-left</span>
							</span>
						</Card.Body>
						<div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
							<pre><code className='language-javascript'>
								{`
        <Card.Body>
		<span className="border border-container d-inline-flex">
		<span className="fs-11 text-gray-5 m-auto">Border</span>
	</span>
	<span className="border-top border-container d-inline-flex">
		<span className="fs-11 text-gray-5 m-auto">Border-top</span>
	</span>
	<span className="border-end border-container d-inline-flex">
		<span className="fs-11 text-gray-5 m-auto">Border-right</span>
	</span>
	<span className="border-bottom border-container d-inline-flex">
		<span className="fs-11 text-gray-5 m-auto">Border-bottom</span>
	</span>
	<span className="border-start border-container d-inline-flex">
		<span className="fs-11 text-gray-5 m-auto">Border-left</span>
	</span>
        </Card.Body>
                `}
							</code></pre>
						</div>
					</Card>
				</Col>
				<Col xl={6}>
					<Card className="custom-card">
						<Card.Header className="justify-content-between">
							<div className='card-title'> Remove borders </div>
							<div className="prism-toggle">
								<button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
							</div>
						</Card.Header>
						<Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
							<span className="border-0 border-container d-inline-flex">
								<span className="fs-11 text-gray-5 m-auto">No-Border</span>
							</span>
							<span className="border border-top-0 border-container d-inline-flex">
								<span className="fs-11 text-gray-5 m-auto">Top</span>
							</span>
							<span className="border border-end-0 border-container d-inline-flex">
								<span className="fs-11 text-gray-5 m-auto">Right</span>
							</span>
							<span className="border border-bottom-0 border-container d-inline-flex">
								<span className="fs-11 text-gray-5 m-auto">Bottom</span>
							</span>
							<span className="border border-start-0 border-container d-inline-flex">
								<span className="fs-11 text-gray-5 m-auto">Left</span>
							</span>
						</Card.Body>
						<div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
							<pre><code className='language-javascript'>
								{`
        <Card.Body>
		<span className="border-0 border-container d-inline-flex">
		<span className="fs-11 text-gray-5 m-auto">No-Border</span>
	</span>
	<span className="border border-top-0 border-container d-inline-flex">
		<span className="fs-11 text-gray-5 m-auto">Top</span>
	</span>
	<span className="border border-end-0 border-container d-inline-flex">
		<span className="fs-11 text-gray-5 m-auto">Right</span>
	</span>
	<span className="border border-bottom-0 border-container d-inline-flex">
		<span className="fs-11 text-gray-5 m-auto">Bottom</span>
	</span>
	<span className="border border-start-0 border-container d-inline-flex">
		<span className="fs-11 text-gray-5 m-auto">Left</span>
	</span>
        </Card.Body>
                `}
							</code></pre>
						</div>
					</Card>
				</Col>
			</Row>
			{/* <!-- End:: row-1 --> */}

			{/* <!-- Start:: row-2 --> */}
			<Row className="row-sm">
				<Col xl={5}>
					<Card className="custom-card">
						<Card.Header className="justify-content-between">
							<div className='card-title'> Border Widths </div>
							<div className="prism-toggle">
								<button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
							</div>
						</Card.Header>
						<Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
							<span className="border border-container d-inline-flex border-1">
								<span className="fs-11 text-gray-5 m-auto">1px</span>
							</span>
							<span className="border border-container d-inline-flex border-2">
								<span className="fs-11 text-gray-5 m-auto">2px</span>
							</span>
							<span className="border border-container d-inline-flex border-3">
								<span className="fs-11 text-gray-5 m-auto">3px</span>
							</span>
							<span className="border border-container d-inline-flex border-4">
								<span className="fs-11 text-gray-5 m-auto">4px</span>
							</span>
							<span className="border border-container d-inline-flex border-5">
								<span className="fs-11 text-gray-5 m-auto">5px</span>
							</span>
						</Card.Body>
						<div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
							<pre><code className='language-javascript'>
								{`
        <Card.Body>
		<span className="border border-container d-inline-flex border-1">
		<span className="fs-11 text-gray-5 m-auto">1px</span>
	</span>
	<span className="border border-container d-inline-flex border-2">
		<span className="fs-11 text-gray-5 m-auto">2px</span>
	</span>
	<span className="border border-container d-inline-flex border-3">
		<span className="fs-11 text-gray-5 m-auto">3px</span>
	</span>
	<span className="border border-container d-inline-flex border-4">
		<span className="fs-11 text-gray-5 m-auto">4px</span>
	</span>
	<span className="border border-container d-inline-flex border-5">
		<span className="fs-11 text-gray-5 m-auto">5px</span>
	</span>
        </Card.Body>
                `}
							</code></pre>
						</div>
					</Card>
				</Col>
				<Col xl={7}>
					<Card className="custom-card">
						<Card.Header className="justify-content-between">
							<div className='card-title'> Border colors </div>
							<div className="prism-toggle">
								<button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
							</div>
						</Card.Header>
						<Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
							<span className="border border-container border-primary d-inline-flex">
								<span className="fs-11 text-primary m-auto">bd-primary</span>
							</span>
							<span className="border border-container border-secondary d-inline-flex">
								<span className="fs-11 text-secondary m-auto">bd-secondary</span>
							</span>
							<span className="border border-container border-success d-inline-flex">
								<span className="fs-11 text-success m-auto">bd-success</span>
							</span>
							<span className="border border-container border-danger d-inline-flex">
								<span className="fs-11 text-danger m-auto">bd-danger</span>
							</span>
							<span className="border border-container border-warning d-inline-flex">
								<span className="fs-11 text-warning m-auto">bd-warning</span>
							</span>
							<span className="border border-container border-info d-inline-flex">
								<span className="fs-11 text-info m-auto">bd-info</span>
							</span>
							<span className="border border-container border-light d-inline-flex">
								<span className="fs-11 text-gray-2 m-auto">bd-light</span>
							</span>
							<span className="border border-container border-dark d-inline-flex">
								<span className="fs-11 text-dark m-auto">bd-dark</span>
							</span>
							<span className="border border-container border-white d-inline-flex">
								<span className="fs-11 text-dark m-auto">bd-white</span>
							</span>
						</Card.Body>
						<div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
							<pre><code className='language-javascript'>
								{`
        <Card.Body>
		<span className="border border-container border-primary d-inline-flex">
		<span className="fs-11 text-primary m-auto">bd-primary</span>
	</span>
	<span className="border border-container border-secondary d-inline-flex">
		<span className="fs-11 text-secondary m-auto">bd-secondary</span>
	</span>
	<span className="border border-container border-success d-inline-flex">
		<span className="fs-11 text-success m-auto">bd-success</span>
	</span>
	<span className="border border-container border-danger d-inline-flex">
		<span className="fs-11 text-danger m-auto">bd-danger</span>
	</span>
	<span className="border border-container border-warning d-inline-flex">
		<span className="fs-11 text-warning m-auto">bd-warning</span>
	</span>
	<span className="border border-container border-info d-inline-flex">
		<span className="fs-11 text-info m-auto">bd-info</span>
	</span>
	<span className="border border-container border-light d-inline-flex">
		<span className="fs-11 text-gray-2 m-auto">bd-light</span>
	</span>
	<span className="border border-container border-dark d-inline-flex">
		<span className="fs-11 text-dark m-auto">bd-dark</span>
	</span>
	<span className="border border-container border-white d-inline-flex">
		<span className="fs-11 text-dark m-auto">bd-white</span>
	</span>
        </Card.Body>
                `}
							</code></pre>
						</div>
					</Card>
				</Col>
			</Row>
			{/* <!-- End:: row-2 --> */}

			{/* <!-- Start:: row-3 --> */}
			<Row className="row-sm">
				<Col xl={6}>
					<Card className="custom-card">
						<Card.Header className="justify-content-between">
							<div className='card-title'> Border color Styling </div>
							<div className="prism-toggle">
								<button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
							</div>
						</Card.Header>
						<Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
							<div className="mb-4">
								<label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
								<input type="email" className="form-control border-success" id="exampleFormControlInput1" placeholder="name@example.com" />
							</div>
							<div className="h4 pb-3 mb-4 text-danger border-bottom border-danger"> Below Shows Danger Border </div>
							<div className="p-3 bg-info text-dark bg-opacity-10 border border-info border-start-0 rounded-end mb-1"> Customizing borders with backgrounud colors </div>
						</Card.Body>
						<div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
							<pre><code className='language-javascript'>
								{`
        <Card.Body>
        <div className="mb-4">
								<label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
								<input type="email" className="form-control border-success" id="exampleFormControlInput1" placeholder="name@example.com" />
							</div>
							<div className="h4 pb-3 mb-4 text-danger border-bottom border-danger"> Below Shows Danger Border </div>
							<div className="p-3 bg-info text-dark bg-opacity-10 border border-info border-start-0 rounded-end mb-1"> Customizing borders with backgrounud colors </div>
        </Card.Body>
                `}
							</code></pre>
						</div>
					</Card>
				</Col>
				<Col xl={6}>
					<Card className="custom-card">
						<Card.Header className="justify-content-between">
							<div className='card-title'> Border with opacity </div>
							<div className="prism-toggle">
								<button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
							</div>
						</Card.Header>
						<Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
							<div className="border border-success p-2 mb-2">This is default success border</div>
							<div className="border border-success p-2 mb-2 border-opacity-75">This is 75% opacity success border </div>
							<div className="border border-success p-2 mb-2 border-opacity-50">This is 50% opacity success border </div>
							<div className="border border-success p-2 mb-2 border-opacity-25">This is 25% opacity success border </div>
							<div className="border border-success p-2 border-opacity-10">This is 10% opacity success border </div>
						</Card.Body>
						<div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
							<pre><code className='language-javascript'>
								{`
        <Card.Body>
        <div className="border border-success p-2 mb-2">This is default success border</div>
							<div className="border border-success p-2 mb-2 border-opacity-75">This is 75% opacity success border </div>
							<div className="border border-success p-2 mb-2 border-opacity-50">This is 50% opacity success border </div>
							<div className="border border-success p-2 mb-2 border-opacity-25">This is 25% opacity success border </div>
							<div className="border border-success p-2 border-opacity-10">This is 10% opacity success border </div>
        </Card.Body>
                `}
							</code></pre>
						</div>
					</Card>
				</Col>
			</Row>
			{/* <!-- End:: row-3 --> */}

			{/* <!-- Start:: row-4 --> */}
			<Row className="row-sm">
				<Col xl={6}>
					<Card className="custom-card">
						<Card.Header className="justify-content-between">
							<div className='card-title'> Border Radius </div>
							<div className="prism-toggle">
								<button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
							</div>
						</Card.Header>
						<Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
							<img src={ALLImages('media58')} className="bd-placeholder-img rounded" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img rounded-top" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img rounded-end" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img rounded-bottom" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img rounded-start" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img rounded-circle" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img  rounded-pill" alt="..." />
						</Card.Body>
						<div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
							<pre><code className='language-javascript'>
								{`
        <Card.Body>
        <img src={ALLImages('media58')} className="bd-placeholder-img rounded" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img rounded-top" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img rounded-end" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img rounded-bottom" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img rounded-start" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img rounded-circle" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img  rounded-pill" alt="..." />
        </Card.Body>
                `}
							</code></pre>
						</div>
					</Card>
				</Col>
				<Col xl={6}>
					<Card className="custom-card">
						<Card.Header className="justify-content-between">
							<div className='card-title'> Sizes </div>
							<div className="prism-toggle">
								<button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
							</div>
						</Card.Header>
						<Card.Body className={`${isHidden[7] ? 'd-none' : ''}`}>
							<img src={ALLImages('media58')} className="bd-placeholder-img bd-placeholder-img rounded-0" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img bd-placeholder-img rounded-1" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img bd-placeholder-img rounded-2" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img bd-placeholder-img rounded-3" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img bd-placeholder-img rounded-4" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img bd-placeholder-img rounded-5" alt="..." />
						</Card.Body>
						<div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 `}>
							<pre><code className='language-javascript'>
								{`
        <Card.Body>
        <img src={ALLImages('media58')} className="bd-placeholder-img bd-placeholder-img rounded-0" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img bd-placeholder-img rounded-1" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img bd-placeholder-img rounded-2" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img bd-placeholder-img rounded-3" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img bd-placeholder-img rounded-4" alt="..." />
							<img src={ALLImages('media58')} className="bd-placeholder-img bd-placeholder-img rounded-5" alt="..." />
        </Card.Body>
                `}
							</code></pre>
						</div>
					</Card>
				</Col>
			</Row>
			{/* <!-- End:: row-4 --> */}
		</Fragment>
	)
};

export default Border;
