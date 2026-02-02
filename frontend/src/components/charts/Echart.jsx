import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { BarBackgroundChart, BarsingleChart, BasicAreaChart, 
		BasicbarChart, BubbleEChart, DoughnutEChart, HorizontalBarChart, LineEChart, 
		NegativeValue, PieEChart, SmoothlineChart, 
		StackedAreaChart, StackedHorizontalBarChart, StackedlineChart, 
		StepLineChart, WaterfallChart } from '../../common/Chartdata';
import Pageheader from '../../layouts/Pageheader';

const Echart = () => (
	<Fragment>

		<Pageheader mainheading='Echart Charts' parentfolder='Charts' activepage='Echart Charts' />

		<Row className=" row-sm">
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
							<h6 className="main-content-label mb-1">Line Chart</h6>
							<p className="text-muted  card-sub-title">Below is the basic Bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<LineEChart />
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Combination line & Bar Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic combination line & bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<SmoothlineChart />
						</div>
					</Card.Body>
				</Card>
			</Col>
		</Row>
		<Row className="row-sm">
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Horizonatal Line Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic horizontal line chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<BasicAreaChart />
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Horizonatal Combination line & Bar Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic horizontal combination line & bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<StackedlineChart />
						</div>
					</Card.Body>
				</Card>
			</Col>
		</Row>
		<Row className="row-sm">
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Stacked Bar Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic Stacked Bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<StackedAreaChart />
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Horizonatal Stacked Bar Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic horizontal stacked bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<StepLineChart />
						</div>
					</Card.Body>
				</Card>
			</Col>

		</Row>
		<Row className="row-sm">
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Stacked Bar Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic Stacked Bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<BasicbarChart />
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Horizonatal Stacked Bar Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic horizontal stacked bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<BarBackgroundChart />
						</div>
					</Card.Body>
				</Card>
			</Col>

		</Row>
		<Row className="row-sm">
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Stacked Bar Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic Stacked Bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<BarsingleChart />
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Horizonatal Stacked Bar Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic horizontal stacked bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<WaterfallChart />
						</div>
					</Card.Body>
				</Card>
			</Col>

		</Row>
		<Row className="row-sm">
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Stacked Bar Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic Stacked Bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<NegativeValue />
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Horizonatal Stacked Bar Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic horizontal stacked bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<HorizontalBarChart />
						</div>
					</Card.Body>
				</Card>
			</Col>

		</Row>
		<Row className="row-sm">
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Stacked Bar Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic Stacked Bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<StackedHorizontalBarChart />
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Horizonatal Stacked Bar Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic horizontal stacked bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<PieEChart />
						</div>
					</Card.Body>
				</Card>
			</Col>

		</Row>
		<Row className="row-sm">
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Stacked Bar Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic Stacked Bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<DoughnutEChart />
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={12} lg={6} >
				<Card className=" custom-card overflow-hidden">
					<Card.Header className='d-block'>
						<h6 className="main-content-label mb-1">Horizonatal Stacked Bar Chart</h6>
						<p className="text-muted  card-sub-title">Below is the basic horizontal stacked bar chart example.</p>
					</Card.Header>
					<Card.Body>
						<div>
							<BubbleEChart />
						</div>
					</Card.Body>
				</Card>
			</Col>

		</Row>
	</Fragment>
);

export default Echart;
