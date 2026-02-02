import { Bar, Doughnut, Line, PolarArea, Radar } from "react-chartjs-2"; // react-chartjs
import { Chart, registerables } from "chart.js"; // chartjs
import ReactApexChart from "react-apexcharts"; // Apex chart
import ApexCharts from 'apexcharts';
import { Component } from "react";
import ReactEcharts from "echarts-for-react"; //E chart
import { Card, Col, Nav, Row } from "react-bootstrap";
Chart.register(...registerables);

export class MobileAppDesign extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [1854, 250],
      options: {
        labels: ["Bitcoin", "Ethereum"],
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 73,
          width: 50,
          type: "donut",
        },
        dataLabels: {
          enabled: false,
        },

        legend: {
          show: false,
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "round",
          width: 0,
          dashArray: 0,
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "75%",
              background: "transparent",
              labels: {
                show: false,
                name: {
                  show: true,
                  fontSize: "20px",
                  color: "#495057",
                  offsetY: -4,
                },
                value: {
                  show: true,
                  fontSize: "18px",
                  color: undefined,
                  offsetY: 8,
                  formatter: function (val) {
                    return val + "%";
                  },
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: "Total",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#495057",
                },
              },
            },
          },
        },
        colors: ["var(--primary-rgb)", "rgba(98, 89, 202, 0.2)"],
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={73}
          width={50}
          options={this.state.options}
          series={this.state.series}
          type="donut"
        />
      </div>
    );
  }
}

export class WebsiteAppDesign extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [1754, 544],
      options: {
        labels: ["Bitcoin", "Ethereum"],
        chart: {
          height: 73,
          width: 50,
          type: "donut",
        },
        dataLabels: {
          enabled: false,
        },

        legend: {
          show: false,
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "round",
          width: 0,
          dashArray: 0,
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "75%",
              background: "transparent",
              labels: {
                show: false,
                name: {
                  show: true,
                  fontSize: "20px",
                  color: "#495057",
                  offsetY: -4,
                },
                value: {
                  show: true,
                  fontSize: "18px",
                  color: undefined,
                  offsetY: 8,
                  formatter: function (val) {
                    return val + "%";
                  },
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: "Total",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#495057",
                },
              },
            },
          },
        },
        colors: ["var(--primary-color)", "rgba(98, 89, 202, 0.2)"],
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={73}
          width={50}
          options={this.state.options}
          series={this.state.series}
          type="donut"
        />
      </div>
    );
  }
}

export class ProjectBudget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Total Budget",
          data: [20, 38, 38, 72, 55, 63, 43, 76, 55, 80, 40, 80],
        },
        {
          name: "Amount Used",
          data: [85, 65, 75, 38, 85, 35, 62, 40, 40, 64, 50, 89],
        },
      ],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 320,
          type: "line",
          zoom: {
            enabled: false,
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 3,
            color: "#000",
            opacity: 0.1,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          position: "top",
          horizontalAlign: "center",
          offsetX: -15,
          fontWeight: "bold",
        },
        stroke: {
          curve: "smooth",
          width: 3,
          dashArray: [0, 5],
        },
        grid: {
          borderColor: "#f2f6f7",
        },
        colors: ["var(--primary-color)", "rgba(98, 89, 202, 0.3)"],
        yaxis: {
          title: {
            text: "",
            style: {
              color: "#adb5be",
              fontSize: "14px",
              fontFamily: "poppins, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          axisBorder: {
            show: false,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: true,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
          },
          labels: {
            rotate: -90,
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="line"
        />
      </div>
    );
  }
}

export class BudgetTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      className: "forth circle",
      series: [50],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: ["#87D4F9"],
          stops: [0, 100],
        },
      },
      options: {
        colors: ["var(--primary-color)"],
        chart: {
          type: "radialBar",
        },

        plotOptions: {
          radialBar: {
            hollow: {
              size: "60%",
            },

            dataLabels: {
              showOn: "always",
              name: {
                offsetY: -10,
                show: false,
                color: "#888",
                fontSize: "13px",
              },
              value: {
                offsetY: 5,
                color: "#111",
                fontSize: "18px",
                fontWeight: "bold",
                show: true,
              },
            },
          },
        },

        stroke: {
          lineCap: "round",
        },
      },
    };
  }

  render() {
    return (
      <div id="chart" className="radial_chart">
        <ReactApexChart
          height={172}
          options={this.state.options}
          series={this.state.series}
          type="radialBar"
        />
      </div>
    );
  }
}
export class WebsiteDesign extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Total Projects",
          data: [44, 42, 57, 86, 58, 55, 70],
        },
        {
          name: "On Going",
          data: [-34, -22, -37, -56, -21, -35, -60],
        },
      ],

      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          stacked: true,
          type: "bar",
          height: 175,
        },
        grid: {
          show: false,
          borderColor: "#f2f6f7",
        },
        colors: ["var(--primary-color)", "var(--primary05)"],
        plotOptions: {
          bar: {
            columnWidth: "15%",
            borderRadius: 5,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "all",
            colors: {
              ranges: [
                {
                  from: -100,
                  to: -46,
                  color: "rgb(98, 89, 202)",
                },
                {
                  from: -45,
                  to: 0,
                  color: "rgb(98, 89, 202)",
                },
              ],
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
          position: "top",
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          axisBorder: {
            show: false,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={175}
          options={this.state.options}
          series={this.state.series}
          type="bar"
        />
      </div>
    );
  }
}

export class Cryptodashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [1754, 544, 682],

      options: {
        labels: ["Bitcoin", "Ethereum", "Dash"],
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 220,
          type: "donut",
        },
        dataLabels: {
          enabled: false,
        },

        legend: {
          show: false,
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "round",
          width: 0,
          dashArray: 0,
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "75%",
              background: "transparent",
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "20px",
                  color: "#495057",
                  offsetY: 8,
                },
                value: {
                  show: false,
                  fontSize: "18px",
                  color: undefined,
                  offsetY: 5,
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: "50%",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#495057",
                },
              },
            },
          },
        },
        colors: [
          "var(--primary-color)",
          "rgba(var(--primary-rgb), 0.7)",
          "rgba(var(--primary-rgb), 0.4)",
        ],
      },
    };
  }

  render() {
    return (
      <div className="" id="chart">
        <ReactApexChart
          height={220}
          options={this.state.options}
          series={this.state.series}
          type="donut"
        />
      </div>
    );
  }
}

export class BtcDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: [
            {
              x: new Date(1538778600000),
              y: [6629.81, 6650.5, 6623.04, 6633.33],
            },
            {
              x: new Date(1538780400000),
              y: [6632.01, 6643.59, 6620, 6630.11],
            },
            {
              x: new Date(1538782200000),
              y: [6630.71, 6648.95, 6623.34, 6635.65],
            },
            {
              x: new Date(1538784000000),
              y: [6635.65, 6651, 6629.67, 6638.24],
            },
            {
              x: new Date(1538785800000),
              y: [6638.24, 6640, 6620, 6624.47],
            },
            {
              x: new Date(1538787600000),
              y: [6624.53, 6636.03, 6621.68, 6624.31],
            },
            {
              x: new Date(1538789400000),
              y: [6624.61, 6632.2, 6617, 6626.02],
            },
            {
              x: new Date(1538791200000),
              y: [6627, 6627.62, 6584.22, 6603.02],
            },
            {
              x: new Date(1538793000000),
              y: [6605, 6608.03, 6598.95, 6604.01],
            },
            {
              x: new Date(1538794800000),
              y: [6604.5, 6614.4, 6602.26, 6608.02],
            },
            {
              x: new Date(1538796600000),
              y: [6608.02, 6610.68, 6601.99, 6608.91],
            },
            {
              x: new Date(1538798400000),
              y: [6608.91, 6618.99, 6608.01, 6612],
            },
            {
              x: new Date(1538800200000),
              y: [6612, 6615.13, 6605.09, 6612],
            },
            {
              x: new Date(1538802000000),
              y: [6612, 6624.12, 6608.43, 6622.95],
            },
            {
              x: new Date(1538803800000),
              y: [6623.91, 6623.91, 6615, 6615.67],
            },
            {
              x: new Date(1538805600000),
              y: [6618.69, 6618.74, 6610, 6610.4],
            },
            {
              x: new Date(1538807400000),
              y: [6611, 6622.78, 6610.4, 6614.9],
            },
            {
              x: new Date(1538809200000),
              y: [6614.9, 6626.2, 6613.33, 6623.45],
            },
            {
              x: new Date(1538811000000),
              y: [6623.48, 6627, 6618.38, 6620.35],
            },
            {
              x: new Date(1538812800000),
              y: [6619.43, 6620.35, 6610.05, 6615.53],
            },
            {
              x: new Date(1538814600000),
              y: [6615.53, 6617.93, 6610, 6615.19],
            },
            {
              x: new Date(1538816400000),
              y: [6615.19, 6621.6, 6608.2, 6620],
            },
            {
              x: new Date(1538818200000),
              y: [6619.54, 6625.17, 6614.15, 6620],
            },
            {
              x: new Date(1538820000000),
              y: [6620.33, 6634.15, 6617.24, 6624.61],
            },
            {
              x: new Date(1538821800000),
              y: [6625.95, 6626, 6611.66, 6617.58],
            },
            {
              x: new Date(1538823600000),
              y: [6619, 6625.97, 6595.27, 6598.86],
            },
            {
              x: new Date(1538825400000),
              y: [6598.86, 6598.88, 6570, 6587.16],
            },
            {
              x: new Date(1538827200000),
              y: [6588.86, 6600, 6580, 6593.4],
            },
            {
              x: new Date(1538829000000),
              y: [6593.99, 6598.89, 6585, 6587.81],
            },
            {
              x: new Date(1538830800000),
              y: [6587.81, 6592.73, 6567.14, 6578],
            },
            {
              x: new Date(1538832600000),
              y: [6578.35, 6581.72, 6567.39, 6579],
            },
            {
              x: new Date(1538834400000),
              y: [6579.38, 6580.92, 6566.77, 6575.96],
            },
            {
              x: new Date(1538836200000),
              y: [6575.96, 6589, 6571.77, 6588.92],
            },
            {
              x: new Date(1538838000000),
              y: [6588.92, 6594, 6577.55, 6589.22],
            },
            {
              x: new Date(1538839800000),
              y: [6589.3, 6598.89, 6589.1, 6596.08],
            },
            {
              x: new Date(1538841600000),
              y: [6597.5, 6600, 6588.39, 6596.25],
            },
            {
              x: new Date(1538843400000),
              y: [6598.03, 6600, 6588.73, 6595.97],
            },
            {
              x: new Date(1538845200000),
              y: [6595.97, 6602.01, 6588.17, 6602],
            },
            {
              x: new Date(1538847000000),
              y: [6602, 6607, 6596.51, 6599.95],
            },
            {
              x: new Date(1538848800000),
              y: [6600.63, 6601.21, 6590.39, 6591.02],
            },
            {
              x: new Date(1538850600000),
              y: [6591.02, 6603.08, 6591, 6591],
            },
            {
              x: new Date(1538852400000),
              y: [6591, 6601.32, 6585, 6592],
            },
            {
              x: new Date(1538854200000),
              y: [6593.13, 6596.01, 6590, 6593.34],
            },
            {
              x: new Date(1538856000000),
              y: [6593.34, 6604.76, 6582.63, 6593.86],
            },
            {
              x: new Date(1538857800000),
              y: [6593.86, 6604.28, 6586.57, 6600.01],
            },
            {
              x: new Date(1538859600000),
              y: [6601.81, 6603.21, 6592.78, 6596.25],
            },
            {
              x: new Date(1538861400000),
              y: [6596.25, 6604.2, 6590, 6602.99],
            },
            {
              x: new Date(1538863200000),
              y: [6602.99, 6606, 6584.99, 6587.81],
            },
            {
              x: new Date(1538865000000),
              y: [6587.81, 6595, 6583.27, 6591.96],
            },
            {
              x: new Date(1538866800000),
              y: [6591.97, 6596.07, 6585, 6588.39],
            },
            {
              x: new Date(1538868600000),
              y: [6587.6, 6598.21, 6587.6, 6594.27],
            },
            {
              x: new Date(1538870400000),
              y: [6596.44, 6601, 6590, 6596.55],
            },
            {
              x: new Date(1538872200000),
              y: [6598.91, 6605, 6596.61, 6600.02],
            },
            {
              x: new Date(1538874000000),
              y: [6600.55, 6605, 6589.14, 6593.01],
            },
            {
              x: new Date(1538875800000),
              y: [6593.15, 6605, 6592, 6603.06],
            },
            {
              x: new Date(1538877600000),
              y: [6603.07, 6604.5, 6599.09, 6603.89],
            },
            {
              x: new Date(1538879400000),
              y: [6604.44, 6604.44, 6600, 6603.5],
            },
            {
              x: new Date(1538881200000),
              y: [6603.5, 6603.99, 6597.5, 6603.86],
            },
            {
              x: new Date(1538883000000),
              y: [6603.85, 6605, 6600, 6604.07],
            },
            {
              x: new Date(1538884800000),
              y: [6604.98, 6606, 6604.07, 6606],
            },
          ],
        },
      ],

      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "candlestick",
          height: 350,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: "var(--primary-color)",
              downward: "rgba(var(--primary-rgb), 0.2)",
            },
          },
        },
        title: {
          align: "left",
        },
        grid: {
          borderColor: "#f2f6f7",
        },
        xaxis: {
          type: "datetime",
          axisBorder: {
            show: false,
            color: "rgba(var(--primary-rgb), 0.5)",
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: false,
            borderType: "solid",
            color: "rgba(var(--primary-rgb), 0.5)",
            offsetX: 0,
            offsetY: 0,
          },
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={350}
          options={this.state.options}
          series={this.state.series}
          type="candlestick"
        />
      </div>
    );
  }
}

export class BitCoin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [
        {
          name: "Value",
          data: [83, 56, 85, 62, 75, 45, 86, 56],
        },
      ],

      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "line",
          height: 105,
          sparkline: {
            enabled: true,
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          colors: undefined,
          width: 3,
          dashArray: 0,
        },
        tooltip: {
          enabled: true,
        },
        colors: ["var(--primary-color)"],
      },
    };
  }

  render() {
    return (
      <div id="chart" className="bitcoin-chart">
        <ReactApexChart
          height={105}
          options={this.state.options}
          series={this.state.series}
          type="line"
        />
      </div>
    );
  }
}

export class YourProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [1754, 544, 682],

      options: {
        labels: ["Bitcoin", "Ethereum", "Dash"],
        chart: {
          height: 80,
          width: 50,
          type: "donut",
        },
        dataLabels: {
          enabled: false,
        },

        legend: {
          show: false,
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "round",
          width: 0,
          dashArray: 0,
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "80%",
              background: "transparent",
              labels: {
                show: false,
                name: {
                  show: true,
                  fontSize: "20px",
                  color: "#495057",
                  offsetY: -4,
                },
                value: {
                  show: true,
                  fontSize: "18px",
                  color: undefined,
                  offsetY: 8,
                  formatter: function (val) {
                    return val + "%";
                  },
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: "Total",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#495057",
                },
              },
            },
          },
        },
        colors: [
          "var(--primary-color)",
          "rgba(var(--primary-rgb), 0.3)",
          "rgba(var(--primary-rgb), 0.1)",
        ],
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={80}
          width={55}
          options={this.state.options}
          series={this.state.series}
          type="donut"
        />
      </div>
    );
  }
}
export class TrendingActivity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [
            0, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93,
            53, 61, 27, 54, 43, 19, 46,
          ],
        },
      ],

      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "area",
          height: 40,
          width: 120,
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 0,
            left: 0,
            blur: 3,
            color: "#000",
            opacity: 0.1,
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 1.5,
          dashArray: 0,
        },
        series: [
          {
            name: "Value",
            data: [
              0, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93,
              53, 61, 27, 54, 43, 19, 46,
            ],
          },
        ],
        yaxis: {
          min: 0,
          show: false,
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
        },

        colors: ["#6259ca"],
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={30}
          options={this.state.options}
          series={this.state.series}
          type="area"
        />
      </div>
    );
  }
}

export class BtcMarket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [20, 14, 19, 10, 23, 20, 22, 9, 12],
        },
      ],

      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "area",
          height: 40,
          width: 50,
          sparkline: {
            enabled: true,
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: "var(--primary-color)",
          width: 2,
          dashArray: 0,
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.8,
            opacityTo: 0.05,
            stops: [0, 98],
          },
        },
        yaxis: {
          min: 0,
          show: false,
          axisBorder: {
            show: false,
          },
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
        },
        tooltip: {
          enabled: true,
        },
        colors: ["var(--primary-color)"],
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={30}
          width={50}
          options={this.state.options}
          series={this.state.series}
          type="area"
        />
      </div>
    );
  }
}
export class EthMarket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [20, 20, 22, 9, 14, 19, 10, 25, 12],
        },
      ],

      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "area",
          height: 40,
          width: 50,
          sparkline: {
            enabled: true,
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.8,
            opacityTo: 0.1,
            stops: [0, 98],
          },
        },

        yaxis: {
          min: 0,
          show: false,
          axisBorder: {
            show: false,
          },
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
        },
        tooltip: {
          enabled: true,
        },
        colors: ["var(--primary-color)"],
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={30}
          width={50}
          options={this.state.options}
          series={this.state.series}
          type="area"
        />
      </div>
    );
  }
}

export class XrpMarket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [20, 14, 20, 22, 9, 12, 19, 10, 25],
        },
      ],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "area",
          height: 40,
          width: 50,
          sparkline: {
            enabled: true,
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.8,
            opacityTo: 0.1,
            stops: [0, 98],
          },
        },
        yaxis: {
          min: 0,
          show: false,
          axisBorder: {
            show: false,
          },
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
        },
        tooltip: {
          enabled: true,
        },
        colors: ["var(--primary-color)"],
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={30}
          width={50}
          options={this.state.options}
          series={this.state.series}
          type="area"
        />
      </div>
    );
  }
}

export class ItcMarket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [20, 20, 22, 9, 12, 14, 19, 10, 25],
        },
      ],

      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "area",
          height: 40,
          width: 50,
          sparkline: {
            enabled: true,
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.8,
            opacityTo: 0.1,
            stops: [0, 98],
          },
        },

        yaxis: {
          min: 0,
          show: false,
          axisBorder: {
            show: false,
          },
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
        },
        tooltip: {
          enabled: true,
        },
        colors: ["var(--primary-color)"],
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={30}
          width={50}
          options={this.state.options}
          series={this.state.series}
          type="area"
        />
      </div>
    );
  }
}

export class BTC extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [54, 38, 56, 35, 65, 43, 53, 45, 62, 80, 35, 48],
        },
      ],

      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "area",
          height: 130,
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 0,
            left: 0,
            blur: 1,
            color: "#fff",
            opacity: 0.05,
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        grid: {
          padding: {
            bottom: 10,
          },
        },
        yaxis: {
          min: 0,
          show: false,
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
        },
        colors: ["rgba(98, 89, 202,0.7)"],
        tooltip: {
          enabled: true,
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={130}
          options={this.state.options}
          series={this.state.series}
          type="area"
        />
      </div>
    );
  }
}

export class ETH extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [48, 35, 80, 62, 45, 53, 43, 65, 35, 56, 38, 54],
        },
      ],

      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "area",
          height: 130,
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 0,
            left: 0,
            blur: 1,
            color: "#fff",
            opacity: 0.05,
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        yaxis: {
          min: 0,
          show: false,
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
        },
        grid: {
          padding: {
            bottom: 10,
          },
        },
        colors: ["rgba(98, 89, 202,0.7)"],
        tooltip: {
          enabled: true,
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={130}
          options={this.state.options}
          series={this.state.series}
          type="area"
        />
      </div>
    );
  }
}

export class Ripple extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [20, 50, 15, 35, 65, 43, 53, 45, 62, 22, 22, 55],
        },
      ],

      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "area",
          height: 130,
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 0,
            left: 0,
            blur: 1,
            color: "#fff",
            opacity: 0.05,
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        grid: {
          padding: {
            bottom: 10,
          },
        },

        yaxis: {
          min: 0,
          show: false,
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
        },
        colors: ["rgba(98, 89, 202,0.7)"],
        tooltip: {
          enabled: true,
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={130}
          options={this.state.options}
          series={this.state.series}
          type="area"
        />
      </div>
    );
  }
}

export class Dash extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [80, 38, 56, 22, 45, 43, 62, 45, 62, 35, 35, 25],
        },
      ],

      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "area",
          height: 130,
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 0,
            left: 0,
            blur: 1,
            color: "#fff",
            opacity: 0.05,
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 2,
        },
        grid: {
          padding: {
            bottom: 10,
          },
        },

        yaxis: {
          min: 0,
          show: false,
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
        },
        colors: ["rgba(98, 89, 202,0.7)"],
        tooltip: {
          enabled: true,
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={130}
          options={this.state.options}
          series={this.state.series}
          type="area"
        />
      </div>
    );
  }
}

export class NEO extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [54, 38, 56, 35, 65, 43, 53, 45, 62, 80, 35, 48],
        },
      ],

      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "area",
          height: 130,
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 0,
            left: 0,
            blur: 1,
            color: "#fff",
            opacity: 0.05,
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 2,
        },
        yaxis: {
          min: 0,
          show: false,
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
        },
        grid: {
          padding: {
            bottom: 10,
          },
        },
        colors: ["rgba(98, 89, 202,0.7)"],
        tooltip: {
          enabled: true,
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={130}
          options={this.state.options}
          series={this.state.series}
          type="area"
        />
      </div>
    );
  }
}
export class Litecoin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [10, 56, 35, 35, 65, 32, 53, 45, 48, 35, 56, 20],
        },
      ],

      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "area",
          height: 130,
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 0,
            left: 0,
            blur: 1,
            color: "#fff",
            opacity: 0.05,
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 2,
        },

        yaxis: {
          min: 0,
          show: false,
        },
        grid: {
          padding: {
            bottom: 10,
          },
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
        },
        colors: ["rgba(98, 89, 202,0.7)"],
        tooltip: {
          enabled: true,
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={130}
          options={this.state.options}
          series={this.state.series}
          type="area"
        />
      </div>
    );
  }
}

export class BitCoinsell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: [
            [1327359600000, 30.95],
            [1327446000000, 31.34],
            [1327532400000, 31.18],
            [1327618800000, 31.05],
            [1327878000000, 31.0],
            [1327964400000, 30.95],
            [1328050800000, 31.24],
            [1328137200000, 31.29],
            [1328223600000, 31.85],
            [1328482800000, 31.86],
            [1328569200000, 32.28],
            [1328655600000, 32.1],
            [1328742000000, 32.65],
            [1328828400000, 32.21],
            [1329087600000, 32.35],
            [1329174000000, 32.44],
            [1329260400000, 32.46],
            [1329346800000, 32.86],
            [1329433200000, 32.75],
            [1329778800000, 32.54],
            [1329865200000, 32.33],
            [1329951600000, 32.97],
            [1330038000000, 33.41],
            [1330297200000, 33.27],
            [1330383600000, 33.27],
            [1330470000000, 32.89],
            [1330556400000, 33.1],
            [1330642800000, 33.73],
            [1330902000000, 33.22],
            [1330988400000, 31.99],
            [1331074800000, 32.41],
            [1331161200000, 33.05],
            [1331247600000, 33.64],
            [1331506800000, 33.56],
            [1331593200000, 34.22],
            [1331679600000, 33.77],
            [1331766000000, 34.17],
            [1331852400000, 33.82],
            [1332111600000, 34.51],
            [1332198000000, 33.16],
            [1332284400000, 33.56],
            [1332370800000, 33.71],
            [1332457200000, 33.81],
            [1332712800000, 34.4],
            [1332799200000, 34.63],
            [1332885600000, 34.46],
            [1332972000000, 34.48],
            [1333058400000, 34.31],
            [1333317600000, 34.7],
            [1333404000000, 34.31],
            [1333490400000, 33.46],
            [1333576800000, 33.59],
            [1333922400000, 33.22],
            [1334008800000, 32.61],
            [1334095200000, 33.01],
            [1334181600000, 33.55],
            [1334268000000, 33.18],
            [1334527200000, 32.84],
            [1334613600000, 33.84],
            [1334700000000, 33.39],
            [1334786400000, 32.91],
            [1334872800000, 33.06],
            [1335132000000, 32.62],
            [1335218400000, 32.4],
            [1335304800000, 33.13],
            [1335391200000, 33.26],
            [1335477600000, 33.58],
            [1335736800000, 33.55],
            [1335823200000, 33.77],
            [1335909600000, 33.76],
            [1335996000000, 33.32],
            [1336082400000, 32.61],
            [1336341600000, 32.52],
            [1336428000000, 32.67],
            [1336514400000, 32.52],
            [1336600800000, 31.92],
            [1336687200000, 32.2],
            [1336946400000, 32.23],
            [1337032800000, 32.33],
            [1337119200000, 32.36],
            [1337205600000, 32.01],
            [1337292000000, 31.31],
            [1337551200000, 32.01],
            [1337637600000, 32.01],
            [1337724000000, 32.18],
            [1337810400000, 31.54],
            [1337896800000, 31.6],
            [1338242400000, 32.05],
            [1338328800000, 31.29],
            [1338415200000, 31.05],
            [1338501600000, 29.82],
            [1338760800000, 30.31],
            [1338847200000, 30.7],
            [1338933600000, 31.69],
            [1339020000000, 31.32],
            [1339106400000, 31.65],
            [1339365600000, 31.13],
            [1339452000000, 31.77],
            [1339538400000, 31.79],
            [1339624800000, 31.67],
            [1339711200000, 32.39],
            [1339970400000, 32.63],
            [1340056800000, 32.89],
            [1340143200000, 31.99],
            [1340229600000, 31.23],
            [1340316000000, 31.57],
            [1340575200000, 30.84],
            [1340661600000, 31.07],
            [1340748000000, 31.41],
            [1340834400000, 31.17],
            [1340920800000, 32.37],
            [1341180000000, 32.19],
            [1341266400000, 32.51],
            [1341439200000, 32.53],
            [1341525600000, 31.37],
            [1341784800000, 30.43],
            [1341871200000, 30.44],
            [1341957600000, 30.2],
            [1342044000000, 30.14],
            [1342130400000, 30.65],
            [1342389600000, 30.4],
            [1342476000000, 30.65],
            [1342562400000, 31.43],
            [1342648800000, 31.89],
            [1342735200000, 31.38],
            [1342994400000, 30.64],
            [1343080800000, 30.02],
            [1343167200000, 30.33],
            [1343253600000, 30.95],
            [1343340000000, 31.89],
            [1343599200000, 31.01],
            [1343685600000, 30.88],
            [1343772000000, 30.69],
            [1343858400000, 30.58],
            [1343944800000, 32.02],
            [1344204000000, 32.14],
            [1344290400000, 32.37],
            [1344376800000, 32.51],
            [1344463200000, 32.65],
            [1344549600000, 32.64],
            [1344808800000, 32.27],
            [1344895200000, 32.1],
            [1344981600000, 32.91],
            [1345068000000, 33.65],
            [1345154400000, 33.8],
            [1345413600000, 33.92],
            [1345500000000, 33.75],
            [1345586400000, 33.84],
            [1345672800000, 33.5],
            [1345759200000, 32.26],
            [1346018400000, 32.32],
            [1346104800000, 32.06],
            [1346191200000, 31.96],
            [1346277600000, 31.46],
            [1346364000000, 31.27],
            [1346709600000, 31.43],
            [1346796000000, 32.26],
            [1346882400000, 32.79],
            [1346968800000, 32.46],
            [1347228000000, 32.13],
            [1347314400000, 32.43],
            [1347400800000, 32.42],
            [1347487200000, 32.81],
            [1347573600000, 33.34],
            [1347832800000, 33.41],
            [1347919200000, 32.57],
            [1348005600000, 33.12],
            [1348092000000, 34.53],
            [1348178400000, 33.83],
            [1348437600000, 33.41],
            [1348524000000, 32.9],
            [1348610400000, 32.53],
            [1348696800000, 32.8],
            [1348783200000, 32.44],
            [1349042400000, 32.62],
            [1349128800000, 32.57],
            [1349215200000, 32.6],
            [1349301600000, 32.68],
            [1349388000000, 32.47],
            [1349647200000, 32.23],
            [1349733600000, 31.68],
            [1349820000000, 31.51],
            [1349906400000, 31.78],
            [1349992800000, 31.94],
            [1350252000000, 32.33],
            [1350338400000, 33.24],
            [1350424800000, 33.44],
            [1350511200000, 33.48],
            [1350597600000, 33.24],
            [1350856800000, 33.49],
            [1350943200000, 33.31],
            [1351029600000, 33.36],
            [1351116000000, 33.4],
            [1351202400000, 34.01],
            [1351638000000, 34.02],
            [1351724400000, 34.36],
            [1351810800000, 34.39],
            [1352070000000, 34.24],
            [1352156400000, 34.39],
            [1352242800000, 33.47],
            [1352329200000, 32.98],
            [1352415600000, 32.9],
            [1352674800000, 32.7],
            [1352761200000, 32.54],
            [1352847600000, 32.23],
            [1352934000000, 32.64],
            [1353020400000, 32.65],
            [1353279600000, 32.92],
            [1353366000000, 32.64],
            [1353452400000, 32.84],
            [1353625200000, 33.4],
            [1353884400000, 33.3],
            [1353970800000, 33.18],
            [1354057200000, 33.88],
            [1354143600000, 34.09],
            [1354230000000, 34.61],
            [1354489200000, 34.7],
            [1354575600000, 35.3],
            [1354662000000, 35.4],
            [1354748400000, 35.14],
            [1354834800000, 35.48],
            [1355094000000, 35.75],
            [1355180400000, 35.54],
            [1355266800000, 35.96],
            [1355353200000, 35.53],
            [1355439600000, 37.56],
            [1355698800000, 37.42],
            [1355785200000, 37.49],
            [1355871600000, 38.09],
            [1355958000000, 37.87],
            [1356044400000, 37.71],
            [1356303600000, 37.53],
            [1356476400000, 37.55],
            [1356562800000, 37.3],
            [1356649200000, 36.9],
            [1356908400000, 37.68],
            [1357081200000, 38.34],
            [1357167600000, 37.75],
            [1357254000000, 38.13],
            [1357513200000, 37.94],
            [1357599600000, 38.14],
            [1357686000000, 38.66],
            [1357772400000, 38.62],
            [1357858800000, 38.09],
            [1358118000000, 38.16],
            [1358204400000, 38.15],
            [1358290800000, 37.88],
            [1358377200000, 37.73],
            [1358463600000, 37.98],
            [1358809200000, 37.95],
            [1358895600000, 38.25],
            [1358982000000, 38.1],
            [1359068400000, 38.32],
            [1359327600000, 38.24],
            [1359414000000, 38.52],
            [1359500400000, 37.94],
            [1359586800000, 37.83],
            [1359673200000, 38.34],
            [1359932400000, 38.1],
            [1360018800000, 38.51],
            [1360105200000, 38.4],
            [1360191600000, 38.07],
            [1360278000000, 39.12],
            [1360537200000, 38.64],
            [1360623600000, 38.89],
            [1360710000000, 38.81],
            [1360796400000, 38.61],
            [1360882800000, 38.63],
            [1361228400000, 38.99],
            [1361314800000, 38.77],
            [1361401200000, 38.34],
            [1361487600000, 38.55],
            [1361746800000, 38.11],
            [1361833200000, 38.59],
            [1361919600000, 39.6],
          ],
        },
      ],

      options: {
        colors: ["#6259ca"],
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          id: "area-datetime",
          type: "area",
          height: 385,
          toolbar: {
            show: false,
          },
        },
        annotations: {
          yaxis: [
            {
              y: 30,
              borderColor: "#999",
              label: {
                text: "Support",
                style: {
                  color: "#fff",
                  background: "#00E396",
                },
              },
            },
          ],
          xaxis: [
            {
              x: new Date("14 Nov 2012").getTime(),
              borderColor: "#999",
              label: {
                style: {
                  color: "#fff",
                  background: "#775DD0",
                },
              },
            },
          ],
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        xaxis: {
          type: "datetime",
          min: new Date("01 Mar 2012").getTime(),
          tickAmount: 6,
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy",
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 90, 100],
          },
        },
        stroke: {
          lineCap: "butt",
          width: 2,
        },
      },

      selection: "one_year",
    };
  }

  updateData(timeline) {
    this.setState({
      selection: timeline,
    });

    switch (timeline) {
        case "one_month":
          ApexCharts.exec(
            "area-datetime",
            "zoomX",
            new Date(2013, 0, 28).getTime(),
            new Date(2013, 1, 27).getTime()
          );
          break;
        case "six_months":
          ApexCharts.exec(
            "area-datetime",
            "zoomX",
            new Date(2012, 8, 27).getTime(),
            new Date(2013, 1, 27).getTime()
          );
          break;
        case "one_year":
          ApexCharts.exec(
            "area-datetime",
            "zoomX",
            new Date(2012, 1, 27).getTime(),
            new Date(2013, 1, 27).getTime()
          );
          break;
        default:
      }      
  }

  render() {
    return (
      <Card.Body className="">
        <div className="d-sm-flex mb-0">
          <div>
            <p className="tx-13 text-muted mb-2"> Bitcoin [BTC] Price Chart </p>
            <h3>
              {" "}
              $3468.42
              <span className="text-success fs-15 ms-2">
                {" "}
                <i className="fas fas fa-dollar-sign"></i> 23.5{" "}
              </span>{" "}
            </h3>
          </div>
          <div className="ms-auto toolbar">
            <Nav>
              <Nav.Item>
                <Nav.Link
                  id="one_month"
                  onClick={() => this.updateData("one_month")}
                  className={`me-2 border-0 ${
                    this.state.selection === "one_month" ? "active" : ""
                  }`}
                >
                  1m
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  id="six_months"
                  onClick={() => this.updateData("six_months")}
                  className={`me-2 border-0 ${
                    this.state.selection === "six_months" ? "active" : ""
                  }`}
                >
                  6M
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  id="one_year"
                  onClick={() => this.updateData("one_year")}
                  className={`me-2 border-0 ${
                    this.state.selection === "one_year" ? "active" : ""
                  }`}
                >
                  1Y
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </div>
        <Row>
          <Col lg={9} xl={10} md={8}>
            <div id="chart-timeline">
              <ReactApexChart
                options={this.state.options}
                series={this.state.series}
                type="area"
                height={385}
              />
            </div>
          </Col>
          <Col lg={3} xl={2} md={4}>
            <Card className="bg-light custom-card">
              <Card.Body>
                <span className="text-muted fs-13">
                  <b>BNB</b> / BUSD
                </span>
                <h5 className="my-1">29.83267</h5>
                <span className="text-danger">-0.04%</span>
              </Card.Body>
            </Card>
            <Card className=" bg-light custom-card">
              <Card.Body>
                <span className="text-muted fs-13">
                  <b>ETH</b> / BUSD
                </span>
                <h5 className="my-1">34.25356</h5>
                <span className="text-success">+0.03%</span>
              </Card.Body>
            </Card>
            <Card className=" bg-light custom-card mb-0">
              <Card.Body>
                <span className="text-muted fs-13">
                  <b>EOS</b> / BUSD
                </span>
                <h5 className="my-1">22.32315</h5>
                <span className="text-danger">-0.02%</span>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    );
  }
}

export class RevenueChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Order",
          data: [20, 60, 38, 72, 45, 63, 43, 76],
        },
        {
          name: "Sale",
          data: [15, 45, 75, 38, 85, 35, 62, 40],
        },
      ],

      options: {
        chart: {
          height: 265,
          type: "line",
          zoom: {
            enabled: false,
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 3,
            color: "#000",
            opacity: 0.1,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          position: "top",
          horizontalAlign: "center",
          offsetX: -15,
          fontWeight: "bold",
        },
        stroke: {
          curve: "smooth",
          width: 3,
          dashArray: [0, 5],
        },
        grid: {
          borderColor: "#f2f6f7",
        },
        colors: ["var(--primary-color)", "rgba(var(--primary-rgb), 0.3)"],
        yaxis: {
          title: {
            // text: 'Statistics',
            style: {
              color: "#adb5be",
              fontSize: "14px",
              fontFamily: "poppins, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          axisBorder: {
            show: true,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: true,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
          },
          labels: {
            rotate: -90,
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart-timeline">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={265}
        />
      </div>
    );
  }
}

export class RecentOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [83],

      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 285,
          type: "radialBar",
          offsetY: -10,
        },
        colors: ["var(--primary-color)"],
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            dataLabels: {
              name: {
                fontSize: "16px",
                color: undefined,
                offsetY: 10,
              },
              value: {
                offsetY: 0,
                fontSize: "22px",
                color: undefined,
                formatter: function (val) {
                  return val + "%";
                },
              },
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91],
          },
        },
        stroke: {
          dashArray: 4,
        },
        labels: [""],
      },
    };
  }

  render() {
    return (
      <div id="chart-timeline">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="radialBar"
          height={285}
        />
      </div>
    );
  }
}

// ------>>>>>>>>>>>>>>>>>>>>>>>Apex chart<<<<<<<<<<<<<<<<<<<<<<<<<<<----
export class LineChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
      ],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 320,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        colors: ["#6366f1"],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
          width: 3,
        },
        grid: {
          borderColor: "rgba(119, 119, 142, 0.05)",
        },
        title: {
          text: "Product Trends by Month",
          align: "left",
          style: {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8c9097",
          },
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
          ],
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="line"
        />
      </div>
    );
  }
}

let AreaPrices = [
  8107.85, 8128.0, 8122.9, 8165.5, 8340.7, 8423.7, 8423.5, 8514.3, 8481.85,
  8487.7, 8506.9, 8626.2, 8668.95, 8602.3, 8607.55, 8512.9, 8496.25, 8600.65,
  8881.1, 9340.85,
];

let AreaDate = [
  "13 Nov 2017",
  "14 Nov 2017",
  "15 Nov 2017",
  "16 Nov 2017",
  "17 Nov 2017",
  "20 Nov 2017",
  "21 Nov 2017",
  "22 Nov 2017",
  "23 Nov 2017",
  "24 Nov 2017",
  "27 Nov 2017",
  "28 Nov 2017",
  "29 Nov 2017",
  "30 Nov 2017",
  "01 Dec 2017",
  "04 Dec 2017",
  "05 Dec 2017",
  "06 Dec 2017",
  "07 Dec 2017",
  "08 Dec 2017",
];

export class AreaChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "STOCK ABC",
          data: AreaPrices,
        },
      ],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "area",
          height: 320,
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        subtitle: {
          // text: 'Price Movements',
          align: "left",
          style: {
            fontSize: "11px",
            fontWeight: "normal",
            color: "#8c9097",
          },
        },
        grid: {
          borderColor: "rgba(119, 119, 142, 0.05)",
        },
        labels: AreaDate,
        title: {
          // text: 'Fundamental Analysis of Stocks',
          align: "left",
          style: {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8c9097",
          },
        },
        colors: ["#6366f1"],
        xaxis: {
          type: "datetime",
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          opposite: true,
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        legend: {
          horizontalAlign: "left",
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="area"
        />
      </div>
    );
  }
}

export class ColumnChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Net Profit",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
        {
          name: "Revenue",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
        },
        {
          name: "Free Cash Flow",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
        },
      ],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "bar",
          height: 320,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
          },
        },
        grid: {
          borderColor: "rgba(119, 119, 142, 0.05)",
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#6366f1", "#60a5fa", "#f43f63"],
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        legend: {
          show: true,
          labels: {
            colors: "#74767c",
          },
        },
        xaxis: {
          categories: [
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
          ],
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          title: {
            style: {
              color: "#8c9097",
            },
          },
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val + " thousands";
            },
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="bar"
        />
      </div>
    );
  }
}

export class BarChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
      ],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "bar",
          height: 320,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        colors: ["#6366f1"],
        grid: {
          borderColor: "rgba(119, 119, 142, 0.05)",
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [
            "South Korea",
            "Canada",
            "United Kingdom",
            "Netherlands",
            "Italy",
            "France",
            "Japan",
            "United States",
            "China",
            "Germany",
          ],
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="bar"
        />
      </div>
    );
  }
}

export class LineAndColumnChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Website Blog",
          type: "column",
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
        },
        {
          name: "Social Media",
          type: "line",
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
        },
      ],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 320,
          type: "line",
        },
        stroke: {
          width: [0, 4],
        },
        grid: {
          borderColor: "rgba(119, 119, 142, 0.05)",
        },
        title: {
          // text: 'Traffic Sources',
          align: "left",
          style: {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8c9097",
          },
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
        },
        legend: {
          show: true,
          labels: {
            colors: "#74767c",
          },
        },
        colors: ["#6366f1", "#60a5fa"],
        labels: [
          "01 Jan 2001",
          "02 Jan 2001",
          "03 Jan 2001",
          "04 Jan 2001",
          "05 Jan 2001",
          "06 Jan 2001",
          "07 Jan 2001",
          "08 Jan 2001",
          "09 Jan 2001",
          "10 Jan 2001",
          "11 Jan 2001",
          "12 Jan 2001",
        ],
        xaxis: {
          type: "datetime",
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: [
          {
            title: {
              style: {
                color: "#8c9097",
              },
            },
            labels: {
              show: true,
              style: {
                colors: "#8c9097",
                fontSize: "11px",
                fontWeight: 600,
                cssClass: "apexcharts-yaxis-label",
              },
            },
          },
          {
            opposite: true,
            title: {
              style: {
                color: "#8c9097",
              },
            },
          },
        ],
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="bar"
        />
      </div>
    );
  }
}

export class TimelineBasic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: [
            {
              x: "Code",
              y: [
                new Date("2019-03-02").getTime(),
                new Date("2019-03-04").getTime(),
              ],
            },
            {
              x: "Test",
              y: [
                new Date("2019-03-04").getTime(),
                new Date("2019-03-08").getTime(),
              ],
            },
            {
              x: "Validation",
              y: [
                new Date("2019-03-08").getTime(),
                new Date("2019-03-12").getTime(),
              ],
            },
            {
              x: "Deployment",
              y: [
                new Date("2019-03-12").getTime(),
                new Date("2019-03-18").getTime(),
              ],
            },
          ],
        },
      ],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 320,
          type: "rangeBar",
        },
        grid: {
          borderColor: "rgba(119, 119, 142, 0.05)",
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        colors: ["#6366f1"],
        xaxis: {
          type: "datetime",
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="rangeBar"
        />
      </div>
    );
  }
}

export class CandleStick extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: [
            {
              x: new Date(1538778600000),
              y: [6629.81, 6650.5, 6623.04, 6633.33],
            },
            {
              x: new Date(1538780400000),
              y: [6632.01, 6643.59, 6620, 6630.11],
            },
            {
              x: new Date(1538782200000),
              y: [6630.71, 6648.95, 6623.34, 6635.65],
            },
            {
              x: new Date(1538784000000),
              y: [6635.65, 6651, 6629.67, 6638.24],
            },
            {
              x: new Date(1538785800000),
              y: [6638.24, 6640, 6620, 6624.47],
            },
            {
              x: new Date(1538787600000),
              y: [6624.53, 6636.03, 6621.68, 6624.31],
            },
            {
              x: new Date(1538789400000),
              y: [6624.61, 6632.2, 6617, 6626.02],
            },
            {
              x: new Date(1538791200000),
              y: [6627, 6627.62, 6584.22, 6603.02],
            },
            {
              x: new Date(1538793000000),
              y: [6605, 6608.03, 6598.95, 6604.01],
            },
            {
              x: new Date(1538794800000),
              y: [6604.5, 6614.4, 6602.26, 6608.02],
            },
            {
              x: new Date(1538796600000),
              y: [6608.02, 6610.68, 6601.99, 6608.91],
            },
            {
              x: new Date(1538798400000),
              y: [6608.91, 6618.99, 6608.01, 6612],
            },
            {
              x: new Date(1538800200000),
              y: [6612, 6615.13, 6605.09, 6612],
            },
            {
              x: new Date(1538802000000),
              y: [6612, 6624.12, 6608.43, 6622.95],
            },
            {
              x: new Date(1538803800000),
              y: [6623.91, 6623.91, 6615, 6615.67],
            },
            {
              x: new Date(1538805600000),
              y: [6618.69, 6618.74, 6610, 6610.4],
            },
            {
              x: new Date(1538807400000),
              y: [6611, 6622.78, 6610.4, 6614.9],
            },
            {
              x: new Date(1538809200000),
              y: [6614.9, 6626.2, 6613.33, 6623.45],
            },
            {
              x: new Date(1538811000000),
              y: [6623.48, 6627, 6618.38, 6620.35],
            },
            {
              x: new Date(1538812800000),
              y: [6619.43, 6620.35, 6610.05, 6615.53],
            },
            {
              x: new Date(1538814600000),
              y: [6615.53, 6617.93, 6610, 6615.19],
            },
            {
              x: new Date(1538816400000),
              y: [6615.19, 6621.6, 6608.2, 6620],
            },
            {
              x: new Date(1538818200000),
              y: [6619.54, 6625.17, 6614.15, 6620],
            },
            {
              x: new Date(1538820000000),
              y: [6620.33, 6634.15, 6617.24, 6624.61],
            },
            {
              x: new Date(1538821800000),
              y: [6625.95, 6626, 6611.66, 6617.58],
            },
            {
              x: new Date(1538823600000),
              y: [6619, 6625.97, 6595.27, 6598.86],
            },
            {
              x: new Date(1538825400000),
              y: [6598.86, 6598.88, 6570, 6587.16],
            },
            {
              x: new Date(1538827200000),
              y: [6588.86, 6600, 6580, 6593.4],
            },
            {
              x: new Date(1538829000000),
              y: [6593.99, 6598.89, 6585, 6587.81],
            },
            {
              x: new Date(1538830800000),
              y: [6587.81, 6592.73, 6567.14, 6578],
            },
            {
              x: new Date(1538832600000),
              y: [6578.35, 6581.72, 6567.39, 6579],
            },
            {
              x: new Date(1538834400000),
              y: [6579.38, 6580.92, 6566.77, 6575.96],
            },
            {
              x: new Date(1538836200000),
              y: [6575.96, 6589, 6571.77, 6588.92],
            },
            {
              x: new Date(1538838000000),
              y: [6588.92, 6594, 6577.55, 6589.22],
            },
            {
              x: new Date(1538839800000),
              y: [6589.3, 6598.89, 6589.1, 6596.08],
            },
            {
              x: new Date(1538841600000),
              y: [6597.5, 6600, 6588.39, 6596.25],
            },
            {
              x: new Date(1538843400000),
              y: [6598.03, 6600, 6588.73, 6595.97],
            },
            {
              x: new Date(1538845200000),
              y: [6595.97, 6602.01, 6588.17, 6602],
            },
            {
              x: new Date(1538847000000),
              y: [6602, 6607, 6596.51, 6599.95],
            },
            {
              x: new Date(1538848800000),
              y: [6600.63, 6601.21, 6590.39, 6591.02],
            },
            {
              x: new Date(1538850600000),
              y: [6591.02, 6603.08, 6591, 6591],
            },
            {
              x: new Date(1538852400000),
              y: [6591, 6601.32, 6585, 6592],
            },
            {
              x: new Date(1538854200000),
              y: [6593.13, 6596.01, 6590, 6593.34],
            },
            {
              x: new Date(1538856000000),
              y: [6593.34, 6604.76, 6582.63, 6593.86],
            },
            {
              x: new Date(1538857800000),
              y: [6593.86, 6604.28, 6586.57, 6600.01],
            },
            {
              x: new Date(1538859600000),
              y: [6601.81, 6603.21, 6592.78, 6596.25],
            },
            {
              x: new Date(1538861400000),
              y: [6596.25, 6604.2, 6590, 6602.99],
            },
            {
              x: new Date(1538863200000),
              y: [6602.99, 6606, 6584.99, 6587.81],
            },
            {
              x: new Date(1538865000000),
              y: [6587.81, 6595, 6583.27, 6591.96],
            },
            {
              x: new Date(1538866800000),
              y: [6591.97, 6596.07, 6585, 6588.39],
            },
            {
              x: new Date(1538868600000),
              y: [6587.6, 6598.21, 6587.6, 6594.27],
            },
            {
              x: new Date(1538870400000),
              y: [6596.44, 6601, 6590, 6596.55],
            },
            {
              x: new Date(1538872200000),
              y: [6598.91, 6605, 6596.61, 6600.02],
            },
            {
              x: new Date(1538874000000),
              y: [6600.55, 6605, 6589.14, 6593.01],
            },
            {
              x: new Date(1538875800000),
              y: [6593.15, 6605, 6592, 6603.06],
            },
            {
              x: new Date(1538877600000),
              y: [6603.07, 6604.5, 6599.09, 6603.89],
            },
            {
              x: new Date(1538879400000),
              y: [6604.44, 6604.44, 6600, 6603.5],
            },
            {
              x: new Date(1538881200000),
              y: [6603.5, 6603.99, 6597.5, 6603.86],
            },
            {
              x: new Date(1538883000000),
              y: [6603.85, 6605, 6600, 6604.07],
            },
            {
              x: new Date(1538884800000),
              y: [6604.98, 6606, 6604.07, 6606],
            },
          ],
        },
      ],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "candlestick",
          height: 350,
        },
        title: {
          // text: 'CandleStick Chart',
          align: "left",
          style: {
            color: "#8c9097",
            fontSize: "13px",
            fontWeight: "bold",
          },
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: "#6366f1",
              downward: "#60a5fa",
            },
          },
        },
        grid: {
          borderColor: "rgba(119, 119, 142, 0.05)",
        },
        xaxis: {
          type: "datetime",
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="candlestick"
        />
      </div>
    );
  }
}

export class Boxplot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          type: "boxPlot",
          data: [
            {
              x: "Jan 2015",
              y: [54, 66, 69, 75, 88],
            },
            {
              x: "Jan 2016",
              y: [43, 65, 69, 76, 81],
            },
            {
              x: "Jan 2017",
              y: [31, 39, 45, 51, 59],
            },
            {
              x: "Jan 2018",
              y: [39, 46, 55, 65, 71],
            },
            {
              x: "Jan 2019",
              y: [29, 31, 35, 39, 44],
            },
            {
              x: "Jan 2020",
              y: [41, 49, 58, 61, 67],
            },
            {
              x: "Jan 2021",
              y: [54, 59, 66, 71, 88],
            },
          ],
        },
      ],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "boxPlot",
          height: 350,
        },
        title: {
          // text: 'Basic BoxPlot Chart',
          align: "left",
          style: {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8c9097",
          },
        },
        grid: {
          borderColor: "#77778e0d",
        },
        plotOptions: {
          boxPlot: {
            colors: {
              upper: "#6366f1",
              lower: "#60a5fa",
            },
          },
        },
        xaxis: {
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="boxPlot"
        />
      </div>
    );
  }
}

function generateData(baseval, count, yrange) {
  let i = 0;
  let series = [];
  while (i < count) {
    const x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
    const y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

    series.push([x, y, z]);
    baseval += 86400000;
    i++;
  }
  return series;
}
export class Bubble3D extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Product1",
          data: generateData(new Date("11 Feb 2017 GMT").getTime(), 20, {
            min: 10,
            max: 60,
          }),
        },
        {
          name: "Product2",
          data: generateData(new Date("11 Feb 2017 GMT").getTime(), 20, {
            min: 10,
            max: 60,
          }),
        },
        {
          name: "Product3",
          data: generateData(new Date("11 Feb 2017 GMT").getTime(), 20, {
            min: 10,
            max: 60,
          }),
        },
        {
          name: "Product4",
          data: generateData(new Date("11 Feb 2017 GMT").getTime(), 20, {
            min: 10,
            max: 60,
          }),
        },
      ],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 320,
          type: "bubble",
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          type: "gradient",
        },
        grid: {
          borderColor: "rgba(119, 119, 142, 0.05)",
        },
        colors: ["#6366f1", "#60a5fa", "#f43f63"],
        title: {
          // text: '3D Bubble Chart',
          align: "left",
          style: {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8c9097",
          },
        },
        legend: {
          show: true,
          position: "top",
          labels: {
            colors: "#74767c",
          },
        },
        xaxis: {
          tickAmount: 12,
          type: "datetime",
          labels: {
            rotate: 0,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          max: 70,
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
        },
        theme: {
          palette: "palette2",
        },
      },
    };
  }
  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="bubble"
        />
      </div>
    );
  }
}

function generateDayWiseTimeSeries(baseval, count, yrange) {
  let i = 0;
  let series = [];
  while (i < count) {
    const y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push([baseval, y]);
    baseval += 86400000;
    i++;
  }
  return series;
}

export class ScatterChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "TEAM 1",
          data: generateDayWiseTimeSeries(
            new Date("11 Feb 2017 GMT").getTime(),
            20,
            {
              min: 10,
              max: 60,
            }
          ),
        },
        {
          name: "TEAM 2",
          data: generateDayWiseTimeSeries(
            new Date("11 Feb 2017 GMT").getTime(),
            20,
            {
              min: 10,
              max: 60,
            }
          ),
        },
        {
          name: "TEAM 3",
          data: generateDayWiseTimeSeries(
            new Date("11 Feb 2017 GMT").getTime(),
            30,
            {
              min: 10,
              max: 60,
            }
          ),
        },
        {
          name: "TEAM 4",
          data: generateDayWiseTimeSeries(
            new Date("11 Feb 2017 GMT").getTime(),
            10,
            {
              min: 10,
              max: 60,
            }
          ),
        },
        {
          name: "TEAM 5",
          data: generateDayWiseTimeSeries(
            new Date("11 Feb 2017 GMT").getTime(),
            30,
            {
              min: 10,
              max: 60,
            }
          ),
        },
      ],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 320,
          type: "scatter",
          zoom: {
            type: "xy",
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#6366f1", "#60a5fa", "#f43f63", "#b95d4b", "#5e9aa6"],
        grid: {
          borderColor: "rgba(119, 119, 142, 0.05)",
        },
        legend: {
          show: true,
          position: "top",
          labels: {
            colors: "#74767c",
          },
        },
        xaxis: {
          type: "datetime",
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          max: 70,
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
        },
      },
    };
  }
  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="scatter"
        />
      </div>
    );
  }
}

function generateData1(count, yrange) {
  let i = 0;
  let series = [];
  while (i < count) {
    const x = "w" + (i + 1).toString();
    const y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push({
      x: x,
      y: y,
    });
    i++;
  }
  return series;
}
export class BasicHeatMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Metric1",
          data: generateData1(18, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: "Metric2",
          data: generateData1(18, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: "Metric3",
          data: generateData1(18, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: "Metric4",
          data: generateData1(18, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: "Metric5",
          data: generateData1(18, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: "Metric6",
          data: generateData1(18, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: "Metric7",
          data: generateData1(18, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: "Metric8",
          data: generateData1(18, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: "Metric9",
          data: generateData1(18, {
            min: 0,
            max: 90,
          }),
        },
      ],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 350,
          type: "heatmap",
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#6366f1"],
        grid: {
          borderColor: "rgba(119, 119, 142, 0.05)",
        },
        title: {
          // text: 'HeatMap Chart (Single color)',
          align: "left",
          style: {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8c9097",
          },
        },
        xaxis: {
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
        },
      },
    };
  }
  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="heatmap"
        />
      </div>
    );
  }
}

export class TreeMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: [
            {
              x: "New Delhi",
              y: 218,
            },
            {
              x: "Kolkata",
              y: 149,
            },
            {
              x: "Mumbai",
              y: 184,
            },
            {
              x: "Ahmedabad",
              y: 55,
            },
            {
              x: "Bangaluru",
              y: 84,
            },
            {
              x: "Pune",
              y: 31,
            },
            {
              x: "Chennai",
              y: 70,
            },
            {
              x: "Jaipur",
              y: 30,
            },
            {
              x: "Surat",
              y: 44,
            },
            {
              x: "Hyderabad",
              y: 68,
            },
            {
              x: "Lucknow",
              y: 28,
            },
            {
              x: "Indore",
              y: 19,
            },
            {
              x: "Kanpur",
              y: 29,
            },
          ],
        },
      ],
      options: {
        legend: {
          show: false,
        },
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 350,
          type: "treemap",
        },
        colors: ["#6366f1"],
        title: {
          // text: 'Basic Treemap',
          align: "left",
          style: {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8c9097",
          },
        },
      },
    };
  }
  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="treemap"
        />
      </div>
    );
  }
}

export class PieChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [44, 55, 13, 43, 22],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          width: 350,
          type: "pie",
        },
        colors: ["#6366f1", "#60a5fa", "#f43f63", "#5e9aa6", "#b95d4b"],
        labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
        legend: {
          position: "bottom",
          labels: {
            colors: "#74767c",
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
            },
          },
        ],
        dataLabels: {
          dropShadow: {
            enabled: false,
          },
        },
      },
    };
  }
  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="pie"
        />
      </div>
    );
  }
}

export class DonutChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [44, 55, 41, 17, 15],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "donut",
          height: 290,
        },
        legend: {
          position: "bottom",
          labels: {
            colors: "#74767c",
          },
        },
        colors: ["#6366f1", "#60a5fa", "#f43f63", "#5e9aa6", "#b95d4b"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                height: 250,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        dataLabels: {
          dropShadow: {
            enabled: false,
          },
        },
      },
    };
  }
  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="donut"
        />
      </div>
    );
  }
}

export class RadialChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [70],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 350,
          type: "radialBar",
        },
        colors: ["#6366f1"],
        plotOptions: {
          radialBar: {
            hollow: {
              size: "70%",
            },
          },
        },
        labels: ["Cricket"],
        responsive: [
          {
            breakpoint: 350,
            options: {
              chart: {
                height: 300,
              },
            },
          },
        ],
      },
    };
  }
  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="radialBar"
        />
      </div>
    );
  }
}

export class StrokedCircularGauge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [67],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 350,
          type: "radialBar",
          offsetY: -10,
        },
        colors: ["#6366f1"],
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            dataLabels: {
              name: {
                fontSize: "16px",
                color: undefined,
                offsetY: 120,
              },
              value: {
                offsetY: 76,
                fontSize: "22px",
                color: undefined,
                formatter: function (val) {
                  return val + "%";
                },
              },
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91],
          },
        },
        stroke: {
          dashArray: 4,
        },
        labels: ["Median Ratio"],
      },
    };
  }
  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="radialBar"
        />
      </div>
    );
  }
}

export class RaderChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Series 1",
          data: [80, 50, 30, 40, 100, 20],
        },
        {
          name: "Series 2",
          data: [20, 30, 40, 80, 20, 80],
        },
        {
          name: "Series 3",
          data: [44, 76, 78, 13, 43, 10],
        },
      ],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 350,
          type: "radar",
          dropShadow: {
            enabled: true,
            blur: 1,
            left: 1,
            top: 1,
          },
        },
        title: {
          // text: 'Radar Chart - Multi Series',
          align: "left",
          style: {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8c9097",
          },
        },
        legend: {
          labels: {
            colors: "#74767c",
          },
        },
        colors: ["#6366f1", "#60a5fa", "#f43f63"],
        stroke: {
          width: 2,
        },
        fill: {
          opacity: 0.1,
        },
        markers: {
          size: 0,
        },
        xaxis: {
          categories: ["2011", "2012", "2013", "2014", "2015", "2016"],
        },
      },
    };
  }
  render() {
    return (
      <div id="chart">
        <ReactApexChart
          height={320}
          options={this.state.options}
          series={this.state.series}
          type="radar"
        />
      </div>
    );
  }
}

export class PolarAreaChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
      options: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          type: "polarArea",
          width: 400,
        },
        stroke: {
          colors: ["#fff"],
        },
        fill: {
          opacity: 0.8,
        },
        legend: {
          position: "bottom",
          labels: {
            colors: "#74767c",
          },
        },
        colors: [
          "#6366f1",
          "#60a5fa",
          "#f43f63",
          "#5e9aa6",
          "#b95d4b",
          "#76a65e",
          "#a65e76",
          "#5e9aa6",
          "#5b67c7",
        ],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    };
  }
  render() {
    return (
      <div id="chart">
        <ReactApexChart
          className="flex justify-center"
          height={400}
          options={this.state.options}
          series={this.state.series}
          type="polarArea"
        />
      </div>
    );
  }
}

// ------>>>>>>>>>>>>>>>>>>>>>>>Apex chart<<<<<<<<<<<<<<<<<<<<<<<<<<<----

// ------>>>>>>>>>>>>>>>>>>>>>>>E chart<<<<<<<<<<<<<<<<<<<<<<<<<<<----

export function LineEChart() {
  const options = {
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
        splitLine: {
          lineStyle: {
            color: "rgba(142, 156, 173,0.1)",
          },
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
      },
    ],
    color: "#6259ca",
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function SmoothlineChart() {
  const options = {
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: "line",
        smooth: true,
      },
    ],
    color: "#6259ca",
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function BasicAreaChart() {
  const options = {
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: "line",
        areaStyle: {},
      },
    ],
    color: "#6259ca",
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function StackedlineChart() {
  const options = {
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
      textStyle: {
        color: "#777",
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    series: [
      {
        name: "Email",
        type: "line",
        stack: "Total",
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "Union Ads",
        type: "line",
        stack: "Total",
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: "Video Ads",
        type: "line",
        stack: "Total",
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: "Direct",
        type: "line",
        stack: "Total",
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: "Search Engine",
        type: "line",
        stack: "Total",
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
    color: ["#6259ca", "#00cccc", "#ff9b21", "#01b8ff", "#fd6074"],
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function StackedAreaChart() {
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
      textStyle: {
        color: "#777",
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisLine: {
          lineStyle: {
            color: "#8c9097",
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#8c9097",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(142, 156, 173,0.1)",
          },
        },
      },
    ],
    series: [
      {
        name: "Email",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "Union Ads",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: "Video Ads",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: "Direct",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: "Search Engine",
        type: "line",
        stack: "Total",
        label: {
          show: true,
          position: "top",
        },
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
    color: ["#6259ca", "#00cccc", "#ff9b21", "#01b8ff", "#fd6074"],
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function StepLineChart() {
  const options = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Step Start", "Step Middle", "Step End"],
      textStyle: {
        color: "#777",
      },
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    series: [
      {
        name: "Step Start",
        type: "line",
        step: "start",
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "Step Middle",
        type: "line",
        step: "middle",
        data: [220, 282, 201, 234, 290, 430, 410],
      },
      {
        name: "Step End",
        type: "line",
        step: "end",
        data: [450, 432, 401, 454, 590, 530, 510],
      },
    ],
    color: ["#6259ca", "#00cccc", "#ff9b21", "#01b8ff", "#fd6074"],
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function BasicbarChart() {
  const options = {
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "bar",
      },
    ],
    color: "#6259ca",
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function BarBackgroundChart() {
  const options = {
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
    color: "#6259ca",
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function BarsingleChart() {
  const options = {
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    series: [
      {
        data: [
          120,
          {
            value: 200,
            itemStyle: {
              color: "#00cccc",
            },
          },
          150,
          80,
          70,
          110,
          130,
        ],
        type: "bar",
      },
    ],
    color: "#6259ca",
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function WaterfallChart() {
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        var tar = params[1];
        return tar.name + "<br/>" + tar.seriesName + " : " + tar.value;
      },
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      splitLine: { show: false },
      data: ["Total", "Rent", "Utilities", "Transportation", "Meals", "Other"],
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    series: [
      {
        name: "Placeholder",
        type: "bar",
        stack: "Total",
        itemStyle: {
          borderColor: "transparent",
          color: "transparent",
        },
        emphasis: {
          itemStyle: {
            borderColor: "transparent",
            color: "transparent",
          },
        },
        data: [0, 1700, 1400, 1200, 300, 0],
      },
      {
        name: "Life Cost",
        type: "bar",
        stack: "Total",
        label: {
          show: true,
          position: "inside",
        },
        data: [2900, 1200, 300, 200, 900, 300],
      },
    ],
    color: "#6259ca",
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function NegativeValue() {
  const labelRight = {
    position: "right",
  };
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      position: "top",
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    yAxis: {
      type: "category",
      axisLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      data: [
        "ten",
        "nine",
        "eight",
        "seven",
        "six",
        "five",
        "four",
        "three",
        "two",
        "one",
      ],
      // axisLine: {
      //     lineStyle: {
      //         color: "#8c9097"
      //     }
      // },
      // splitLine: {
      //     lineStyle: {
      //         color: "rgba(142, 156, 173,0.1)"
      //     }
      // }
    },
    series: [
      {
        name: "Cost",
        type: "bar",
        stack: "Total",
        label: {
          show: true,
          formatter: "{b}",
        },
        data: [
          { value: -0.07, label: labelRight },
          { value: -0.09, label: labelRight },
          0.2,
          0.44,
          { value: -0.23, label: labelRight },
          0.08,
          { value: -0.17, label: labelRight },
          0.47,
          { value: -0.36, label: labelRight },
          0.18,
        ],
      },
    ],
    color: "#6259ca",
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function HorizontalBarChart() {
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      textStyle: {
        color: "#777",
      },
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    yAxis: {
      type: "category",
      data: ["Brazil", "Indonesia", "USA", "India", "China", "World"],
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    series: [
      {
        name: "2011",
        type: "bar",
        data: [18203, 23489, 29034, 104970, 131744, 630230],
      },
      {
        name: "2012",
        type: "bar",
        data: [19325, 23438, 31000, 121594, 134141, 681807],
      },
    ],
    color: ["#6259ca", "#00cccc"],
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function StackedHorizontalBarChart() {
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // Use axis to trigger tooltip
        type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
      },
    },
    legend: {
      textStyle: {
        color: "#777",
      },
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "20%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    yAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    series: [
      {
        name: "Direct",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [320, 302, 301, 334, 390, 330, 320],
      },
      {
        name: "Mail Ad",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "Affiliate Ad",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: "Video Ad",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [150, 212, 201, 154, 190, 330, 410],
      },
      {
        name: "Search Engine",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: [820, 832, 901, 934, 1290, 1330, 1320],
      },
    ],
    color: ["#6259ca", "#00cccc", "#ff9b21", "#fd6074", "#01b8ff"],
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function PieEChart() {
  const options = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: {
        color: "#777",
      },
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
    color: ["#6259ca", "#00cccc", "#ff9b21", "#fd6074", "#01b8ff"],
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function DoughnutEChart() {
  const options = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "0%",
      left: "center",
      textStyle: {
        color: "#777",
      },
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "17",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
      },
    ],
    color: ["#6259ca", "#00cccc", "#ff9b21", "#fd6074", "#01b8ff"],
  };

  return <ReactEcharts className="chartsh" option={options} />;
}
export function BubbleEChart() {
  const data = [
    [
      [28604, 77, 17096869, "Australia", 1990],
      [31163, 77.4, 27662440, "Canada", 1990],
      [1516, 68, 1154605773, "China", 1990],
      [13670, 74.7, 10582082, "Cuba", 1990],
      [28599, 75, 4986705, "Finland", 1990],
      [29476, 77.1, 56943299, "France", 1990],
      [31476, 75.4, 78958237, "Germany", 1990],
      [28666, 78.1, 254830, "Iceland", 1990],
      [1777, 57.7, 870601776, "India", 1990],
      [29550, 79.1, 122249285, "Japan", 1990],
      [2076, 67.9, 20194354, "North Korea", 1990],
      [12087, 72, 42972254, "South Korea", 1990],
      [24021, 75.4, 3397534, "New Zealand", 1990],
      [43296, 76.8, 4240375, "Norway", 1990],
      [10088, 70.8, 38195258, "Poland", 1990],
      [19349, 69.6, 147568552, "Russia", 1990],
      [10670, 67.3, 53994605, "Turkey", 1990],
      [26424, 75.7, 57110117, "United Kingdom", 1990],
      [37062, 75.4, 252847810, "United States", 1990],
    ],
    [
      [44056, 81.8, 23968973, "Australia", 2015],
      [43294, 81.7, 35939927, "Canada", 2015],
      [13334, 76.9, 1376048943, "China", 2015],
      [21291, 78.5, 11389562, "Cuba", 2015],
      [38923, 80.8, 5503457, "Finland", 2015],
      [37599, 81.9, 64395345, "France", 2015],
      [44053, 81.1, 80688545, "Germany", 2015],
      [42182, 82.8, 329425, "Iceland", 2015],
      [5903, 66.8, 1311050527, "India", 2015],
      [36162, 83.5, 126573481, "Japan", 2015],
      [1390, 71.4, 25155317, "North Korea", 2015],
      [34644, 80.7, 50293439, "South Korea", 2015],
      [34186, 80.6, 4528526, "New Zealand", 2015],
      [64304, 81.6, 5210967, "Norway", 2015],
      [24787, 77.3, 38611794, "Poland", 2015],
      [23038, 73.13, 143456918, "Russia", 2015],
      [19360, 76.5, 78665830, "Turkey", 2015],
      [38225, 81.4, 64715810, "United Kingdom", 2015],
      [53354, 79.1, 321773631, "United States", 2015],
    ],
  ];

  const options = {
    // backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [
    //     {
    //         offset: 0,
    //         color: 'transparent'
    //     },
    //     {
    //         offset: 1,
    //         color: 'transparent'
    //     }
    // ]),
    legend: {
      right: "10%",
      top: "3%",
      data: ["1990", "2015"],
      textStyle: {
        color: "#777",
      },
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
    },
    xAxis: {
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "rgba(142, 156, 173,0.1)",
        },
      },
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: "#8c9097",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(142, 156, 173,0.1)",
        },
      },
      scale: true,
    },
    series: [
      {
        name: "1990",
        data: data[0],
        type: "scatter",
        symbolSize: function (data) {
          return Math.sqrt(data[2]) / 5e2;
        },
        emphasis: {
          focus: "series",
          label: {
            show: true,
            formatter: function (param) {
              return param.data[3];
            },
            position: "top",
          },
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(98, 89, 202, 0.5)",
          shadowOffsetY: 5,
          // color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
          //     {
          //         offset: 0,
          //         color: 'rgb(98, 89, 202)'
          //     },
          //     {
          //         offset: 1,
          //         color: 'rgb(98, 89, 202)'
          //     }
          // ])
        },
      },
      {
        name: "2015",
        data: data[1],
        type: "scatter",
        symbolSize: function (data) {
          return Math.sqrt(data[2]) / 5e2;
        },
        emphasis: {
          focus: "series",
          label: {
            show: true,
            formatter: function (param) {
              return param.data[3];
            },
            position: "top",
          },
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(241, 56, 139, 0.5)",
          shadowOffsetY: 5,
          // color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
          //     {
          //         offset: 0,
          //         color: 'rgb(241, 56, 139)'
          //     },
          //     {
          //         offset: 1,
          //         color: 'rgb(241, 56, 139)'
          //     }
          // ])
        },
      },
    ],
    color: ["#01b8ff", "#fd6074"],
  };

  return <ReactEcharts className="chartsh" option={options} />;
}

// ------>>>>>>>>>>>>>>>>>>>>>>>E chart<<<<<<<<<<<<<<<<<<<<<<<<<<<----

// ------>>>>>>>>>>>>>>>>>>>>>>>ChartJS chart<<<<<<<<<<<<<<<<<<<<<<<<<<<----

(Chart.defaults.borderColor = "rgba(142, 156, 173,0.1)"),
  (Chart.defaults.color = "#8c9097");
const LineData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgb(98, 89, 202)",
      borderColor: "rgb(98, 89, 202)",
      data: [0, 10, 5, 2, 20, 30, 45],
    },
  ],
};

const LineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 90,
};

export function LineChartJS() {
  return (
    <Line width={753} height={300} options={LineOptions} data={LineData} />
  );
}

const BarData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        "rgba(98, 89, 202, 0.2)",
        "rgba(1, 184, 255, 0.2)",
        "rgba(255, 155, 33, 0.2)",
        "rgba(0, 204, 204, 0.2)",
        "rgba(253, 96, 116, 0.2)",
        "rgba(25, 177, 89, 0.2)",
        "rgba(35, 35, 35, 0.2)",
      ],
      borderColor: [
        "rgb(98, 89, 202)",
        "rgb(1, 184, 255)",
        "rgb(255, 155, 33)",
        "rgb(0, 204, 204)",
        "rgb(253, 96, 116)",
        "rgb(25, 177, 89)",
        "rgb(35, 35, 35)",
      ],
      borderWidth: 1,
    },
  ],
};

const BarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 90,
};

export function BarChartJS() {
  return <Bar width={753} height={300} options={BarOptions} data={BarData} />;
}

const MixedData = {
  labels: ["January", "February", "March", "April"],
  datasets: [
    {
      type: "bar",
      label: "Bar Dataset",
      data: [10, 20, 30, 40],
      borderColor: "rgb(98, 89, 202)",
      backgroundColor: "rgba(98, 89, 202, 0.2)",
    },
    {
      type: "line",
      label: "Line Dataset",
      data: [50, 50, 50, 50],
      fill: false,
      borderColor: "rgb(35, 183, 229)",
    },
  ],
};

const MixedOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 90,
};

export function MixedChartJS() {
  return (
    <Bar width={753} height={300} options={MixedOptions} data={MixedData} />
  );
}

const PolarData = {
  labels: ["Red", "pink", "Yellow", "Grey", "teal"],
  datasets: [
    {
      label: "My First Dataset",
      data: [11, 16, 7, 3, 14],
      backgroundColor: [
        "rgb(98, 89, 202)",
        "rgb(241, 56, 139)",
        "rgb(255, 155, 33)",
        "rgb(201, 203, 207)",
        "rgb(0, 204, 204)",
      ],
    },
  ],
};

const PolarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 90,
};

export function PolarChartJS() {
  return (
    <PolarArea
      width={753}
      height={300}
      options={PolarOptions}
      data={PolarData}
    />
  );
}

const PieData = {
  labels: ["purple", "PInk", "Teal"],
  datasets: [
    {
      label: "My First Dataset",
      data: [300, 50, 100],
      backgroundColor: [
        "rgb(98, 89, 202)",
        "rgb(241, 56, 139)",
        "rgb(0, 204, 204)",
      ],
      hoverOffset: 4,
    },
  ],
};

const PieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 90,
};

export function PieChartJS() {
  return (
    <Doughnut width={753} height={300} options={PieOptions} data={PieData} />
  );
}

const radialData = {
  labels: [
    "Eating",
    "Drinking",
    "Sleeping",
    "Designing",
    "Coding",
    "Cycling",
    "Running",
  ],
  datasets: [
    {
      label: "My First Dataset",
      data: [65, 59, 90, 81, 56, 55, 40],
      fill: true,
      backgroundColor: "rgba(98, 89, 202, 0.2)",
      borderColor: "rgb(98, 89, 202)",
      pointBackgroundColor: "rgb(98, 89, 202)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(98, 89, 202)",
    },
    {
      label: "My Second Dataset",
      data: [28, 48, 40, 19, 96, 27, 100],
      fill: true,
      backgroundColor: "rgba(35, 183, 229, 0.2)",
      borderColor: "rgb(35, 183, 229)",
      pointBackgroundColor: "rgb(35, 183, 229)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(35, 183, 229)",
    },
  ],
};

const radialOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 90,
};

export function RadialChartJS() {
  return (
    <Radar width={753} height={300} options={radialOptions} data={radialData} />
  );
}

// ------>>>>>>>>>>>>>>>>>>>>>>>ChartJS chart<<<<<<<<<<<<<<<<<<<<<<<<<<<----
