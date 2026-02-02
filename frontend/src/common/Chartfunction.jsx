import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Button, Card } from 'react-bootstrap';
import moment from "moment";
import ALLImages from '../common/Imagedata';




//Apex line chart

export class Basicline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: "Desktops",
                data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    zoom: {
                        enabled: false
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ['#7971d2'],
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight',
                    width: 3,
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                title: {
                    text: 'Product Trends by Month',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={300} />

        );
    }
}

export class Linechartwithlabels extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    name: "High - 2013",
                    data: [28, 29, 33, 36, 32, 32, 33]
                },
                {
                    name: "Low - 2013",
                    data: [12, 11, 14, 18, 17, 13, 13]
                }
            ],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    dropShadow: {
                        enabled: true,
                        color: '#000',
                        top: 18,
                        left: 7,
                        blur: 10,
                        opacity: 0.2
                    },
                    toolbar: {
                        show: false
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ['#7971d2', '#26c2ff'],
                dataLabels: {
                    enabled: true,
                },
                stroke: {
                    curve: 'smooth'
                },
                title: {
                    text: 'Average High & Low Temperature',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                markers: {
                    size: 1
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    title: {
                        text: 'Month',
                        style: {
                            color: "#8c9097",
                            fontSize: '13px',
                            fontWeight: 'bold',
                        }
                    },
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    },
                },
                yaxis: {
                    title: {
                        text: 'Temperature',
                        style: {
                            color: "#8c9097",
                            fontSize: '13px',
                            fontWeight: 'bold',
                        }
                    },
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    },
                    min: 5,
                    max: 40
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    floating: true,
                    offsetY: -25,
                    offsetX: -5
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={300} />

        );
    }
}

const dataSeries = [
    [{
        "date": "2014-01-01",
        "value": 20000000
    },
    {
        "date": "2014-01-02",
        "value": 10379978
    },
    {
        "date": "2014-01-03",
        "value": 30493749
    },
    {
        "date": "2014-01-04",
        "value": 10785250
    },
    {
        "date": "2014-01-05",
        "value": 33901904
    },
    {
        "date": "2014-01-06",
        "value": 11576838
    },
    {
        "date": "2014-01-07",
        "value": 14413854
    },
    {
        "date": "2014-01-08",
        "value": 15177211
    },
    {
        "date": "2014-01-09",
        "value": 16622100
    },
    {
        "date": "2014-01-10",
        "value": 17381072
    },
    {
        "date": "2014-01-11",
        "value": 18802310
    },
    {
        "date": "2014-01-12",
        "value": 15531790
    },
    {
        "date": "2014-01-13",
        "value": 15748881
    },
    {
        "date": "2014-01-14",
        "value": 18706437
    },
    {
        "date": "2014-01-15",
        "value": 19752685
    },
    {
        "date": "2014-01-16",
        "value": 21016418
    },
    {
        "date": "2014-01-17",
        "value": 25622924
    },
    {
        "date": "2014-01-18",
        "value": 25337480
    },
    {
        "date": "2014-01-19",
        "value": 22258882
    },
    {
        "date": "2014-01-20",
        "value": 23829538
    },
    {
        "date": "2014-01-21",
        "value": 24245689
    },
    {
        "date": "2014-01-22",
        "value": 26429711
    },
    {
        "date": "2014-01-23",
        "value": 26259017
    },
    {
        "date": "2014-01-24",
        "value": 25396183
    },
    {
        "date": "2014-01-25",
        "value": 23107346
    },
    {
        "date": "2014-01-26",
        "value": 28659852
    },
    {
        "date": "2014-01-27",
        "value": 25270783
    },
    {
        "date": "2014-01-28",
        "value": 26270783
    },
    {
        "date": "2014-01-29",
        "value": 27270783
    },
    {
        "date": "2014-01-30",
        "value": 28270783
    },
    {
        "date": "2014-01-31",
        "value": 29270783
    },
    {
        "date": "2014-02-01",
        "value": 30270783
    },
    {
        "date": "2014-02-02",
        "value": 31270783
    },
    {
        "date": "2014-02-03",
        "value": 32270783
    },
    {
        "date": "2014-02-04",
        "value": 33270783
    },
    {
        "date": "2014-02-05",
        "value": 28270783
    },
    {
        "date": "2014-02-06",
        "value": 27270783
    },
    {
        "date": "2014-02-07",
        "value": 35270783
    },
    {
        "date": "2014-02-08",
        "value": 34270783
    },
    {
        "date": "2014-02-09",
        "value": 28270783
    },
    {
        "date": "2014-02-10",
        "value": 35270783
    },
    {
        "date": "2014-02-11",
        "value": 36270783
    },
    {
        "date": "2014-02-12",
        "value": 34127078
    },
    {
        "date": "2014-02-13",
        "value": 33124078
    },
    {
        "date": "2014-02-14",
        "value": 36227078
    },
    {
        "date": "2014-02-15",
        "value": 37827078
    },
    {
        "date": "2014-02-16",
        "value": 36427073
    },
    {
        "date": "2014-02-17",
        "value": 37570783
    },
    {
        "date": "2014-02-18",
        "value": 38627073
    },
    {
        "date": "2014-02-19",
        "value": 37727078
    },
    {
        "date": "2014-02-20",
        "value": 38827073
    },
    {
        "date": "2014-02-21",
        "value": 40927078
    },
    {
        "date": "2014-02-22",
        "value": 41027078
    },
    {
        "date": "2014-02-23",
        "value": 42127073
    },
    {
        "date": "2014-02-24",
        "value": 43220783
    },
    {
        "date": "2014-02-25",
        "value": 44327078
    },
    {
        "date": "2014-02-26",
        "value": 40427078
    },
    {
        "date": "2014-02-27",
        "value": 41027078
    },
    {
        "date": "2014-02-28",
        "value": 45627078
    },
    {
        "date": "2014-03-01",
        "value": 44727078
    },
    {
        "date": "2014-03-02",
        "value": 44227078
    },
    {
        "date": "2014-03-03",
        "value": 45227078
    },
    {
        "date": "2014-03-04",
        "value": 46027078
    },
    {
        "date": "2014-03-05",
        "value": 46927078
    },
    {
        "date": "2014-03-06",
        "value": 47027078
    },
    {
        "date": "2014-03-07",
        "value": 46227078
    },
    {
        "date": "2014-03-08",
        "value": 47027078
    },
    {
        "date": "2014-03-09",
        "value": 48027078
    },
    {
        "date": "2014-03-10",
        "value": 47027078
    },
    {
        "date": "2014-03-11",
        "value": 47027078
    },
    {
        "date": "2014-03-12",
        "value": 48017078
    },
    {
        "date": "2014-03-13",
        "value": 48077078
    },
    {
        "date": "2014-03-14",
        "value": 48087078
    },
    {
        "date": "2014-03-15",
        "value": 48017078
    },
    {
        "date": "2014-03-16",
        "value": 48047078
    },
    {
        "date": "2014-03-17",
        "value": 48067078
    },
    {
        "date": "2014-03-18",
        "value": 48077078
    },
    {
        "date": "2014-03-19",
        "value": 48027074
    },
    {
        "date": "2014-03-20",
        "value": 48927079
    },
    {
        "date": "2014-03-21",
        "value": 48727071
    },
    {
        "date": "2014-03-22",
        "value": 48127072
    },
    {
        "date": "2014-03-23",
        "value": 48527072
    },
    {
        "date": "2014-03-24",
        "value": 48627027
    },
    {
        "date": "2014-03-25",
        "value": 48027040
    },
    {
        "date": "2014-03-26",
        "value": 48027043
    },
    {
        "date": "2014-03-27",
        "value": 48057022
    },
    {
        "date": "2014-03-28",
        "value": 49057022
    },
    {
        "date": "2014-03-29",
        "value": 50057022
    },
    {
        "date": "2014-03-30",
        "value": 51057022
    },
    {
        "date": "2014-03-31",
        "value": 52057022
    },
    {
        "date": "2014-04-01",
        "value": 53057022
    },
    {
        "date": "2014-04-02",
        "value": 54057022
    },
    {
        "date": "2014-04-03",
        "value": 52057022
    },
    {
        "date": "2014-04-04",
        "value": 55057022
    },
    {
        "date": "2014-04-05",
        "value": 58270783
    },
    {
        "date": "2014-04-06",
        "value": 56270783
    },
    {
        "date": "2014-04-07",
        "value": 55270783
    },
    {
        "date": "2014-04-08",
        "value": 58270783
    },
    {
        "date": "2014-04-09",
        "value": 59270783
    },
    {
        "date": "2014-04-10",
        "value": 60270783
    },
    {
        "date": "2014-04-11",
        "value": 61270783
    },
    {
        "date": "2014-04-12",
        "value": 62270783
    },
    {
        "date": "2014-04-13",
        "value": 63270783
    },
    {
        "date": "2014-04-14",
        "value": 64270783
    },
    {
        "date": "2014-04-15",
        "value": 65270783
    },
    {
        "date": "2014-04-16",
        "value": 66270783
    },
    {
        "date": "2014-04-17",
        "value": 67270783
    },
    {
        "date": "2014-04-18",
        "value": 68270783
    },
    {
        "date": "2014-04-19",
        "value": 69270783
    },
    {
        "date": "2014-04-20",
        "value": 70270783
    },
    {
        "date": "2014-04-21",
        "value": 71270783
    },
    {
        "date": "2014-04-22",
        "value": 72270783
    },
    {
        "date": "2014-04-23",
        "value": 73270783
    },
    {
        "date": "2014-04-24",
        "value": 74270783
    },
    {
        "date": "2014-04-25",
        "value": 75270783
    },
    {
        "date": "2014-04-26",
        "value": 76660783
    },
    {
        "date": "2014-04-27",
        "value": 77270783
    },
    {
        "date": "2014-04-28",
        "value": 78370783
    },
    {
        "date": "2014-04-29",
        "value": 79470783
    },
    {
        "date": "2014-04-30",
        "value": 80170783
    }
    ],
    [{
        "date": "2014-01-01",
        "value": 150000000
    },
    {
        "date": "2014-01-02",
        "value": 160379978
    },
    {
        "date": "2014-01-03",
        "value": 170493749
    },
    {
        "date": "2014-01-04",
        "value": 160785250
    },
    {
        "date": "2014-01-05",
        "value": 167391904
    },
    {
        "date": "2014-01-06",
        "value": 161576838
    },
    {
        "date": "2014-01-07",
        "value": 161413854
    },
    {
        "date": "2014-01-08",
        "value": 152177211
    },
    {
        "date": "2014-01-09",
        "value": 140762210
    },
    {
        "date": "2014-01-10",
        "value": 144381072
    },
    {
        "date": "2014-01-11",
        "value": 154352310
    },
    {
        "date": "2014-01-12",
        "value": 165531790
    },
    {
        "date": "2014-01-13",
        "value": 175748881
    },
    {
        "date": "2014-01-14",
        "value": 187064037
    },
    {
        "date": "2014-01-15",
        "value": 197520685
    },
    {
        "date": "2014-01-16",
        "value": 210176418
    },
    {
        "date": "2014-01-17",
        "value": 196122924
    },
    {
        "date": "2014-01-18",
        "value": 207337480
    },
    {
        "date": "2014-01-19",
        "value": 200258882
    },
    {
        "date": "2014-01-20",
        "value": 186829538
    },
    {
        "date": "2014-01-21",
        "value": 192456897
    },
    {
        "date": "2014-01-22",
        "value": 204299711
    },
    {
        "date": "2014-01-23",
        "value": 192759017
    },
    {
        "date": "2014-01-24",
        "value": 203596183
    },
    {
        "date": "2014-01-25",
        "value": 208107346
    },
    {
        "date": "2014-01-26",
        "value": 196359852
    },
    {
        "date": "2014-01-27",
        "value": 192570783
    },
    {
        "date": "2014-01-28",
        "value": 177967768
    },
    {
        "date": "2014-01-29",
        "value": 190632803
    },
    {
        "date": "2014-01-30",
        "value": 203725316
    },
    {
        "date": "2014-01-31",
        "value": 218226177
    },
    {
        "date": "2014-02-01",
        "value": 210698669
    },
    {
        "date": "2014-02-02",
        "value": 217640656
    },
    {
        "date": "2014-02-03",
        "value": 216142362
    },
    {
        "date": "2014-02-04",
        "value": 201410971
    },
    {
        "date": "2014-02-05",
        "value": 196704289
    },
    {
        "date": "2014-02-06",
        "value": 190436945
    },
    {
        "date": "2014-02-07",
        "value": 178891686
    },
    {
        "date": "2014-02-08",
        "value": 171613962
    },
    {
        "date": "2014-02-09",
        "value": 157579773
    },
    {
        "date": "2014-02-10",
        "value": 158677098
    },
    {
        "date": "2014-02-11",
        "value": 147129977
    },
    {
        "date": "2014-02-12",
        "value": 151561876
    },
    {
        "date": "2014-02-13",
        "value": 151627421
    },
    {
        "date": "2014-02-14",
        "value": 143543872
    },
    {
        "date": "2014-02-15",
        "value": 136581057
    },
    {
        "date": "2014-02-16",
        "value": 135560715
    },
    {
        "date": "2014-02-17",
        "value": 122625263
    },
    {
        "date": "2014-02-18",
        "value": 112091484
    },
    {
        "date": "2014-02-19",
        "value": 98810329
    },
    {
        "date": "2014-02-20",
        "value": 99882912
    },
    {
        "date": "2014-02-21",
        "value": 94943095
    },
    {
        "date": "2014-02-22",
        "value": 104875743
    },
    {
        "date": "2014-02-23",
        "value": 116383678
    },
    {
        "date": "2014-02-24",
        "value": 125028841
    },
    {
        "date": "2014-02-25",
        "value": 123967310
    },
    {
        "date": "2014-02-26",
        "value": 133167029
    },
    {
        "date": "2014-02-27",
        "value": 128577263
    },
    {
        "date": "2014-02-28",
        "value": 115836969
    },
    {
        "date": "2014-03-01",
        "value": 119264529
    },
    {
        "date": "2014-03-02",
        "value": 109363374
    },
    {
        "date": "2014-03-03",
        "value": 113985628
    },
    {
        "date": "2014-03-04",
        "value": 114650999
    },
    {
        "date": "2014-03-05",
        "value": 110866108
    },
    {
        "date": "2014-03-06",
        "value": 96473454
    },
    {
        "date": "2014-03-07",
        "value": 104075886
    },
    {
        "date": "2014-03-08",
        "value": 103568384
    },
    {
        "date": "2014-03-09",
        "value": 101534883
    },
    {
        "date": "2014-03-10",
        "value": 115825447
    },
    {
        "date": "2014-03-11",
        "value": 126133916
    },
    {
        "date": "2014-03-12",
        "value": 116502109
    },
    {
        "date": "2014-03-13",
        "value": 130169411
    },
    {
        "date": "2014-03-14",
        "value": 124296886
    },
    {
        "date": "2014-03-15",
        "value": 126347399
    },
    {
        "date": "2014-03-16",
        "value": 131483669
    },
    {
        "date": "2014-03-17",
        "value": 142811333
    },
    {
        "date": "2014-03-18",
        "value": 129675396
    },
    {
        "date": "2014-03-19",
        "value": 115514483
    },
    {
        "date": "2014-03-20",
        "value": 117630630
    },
    {
        "date": "2014-03-21",
        "value": 122340239
    },
    {
        "date": "2014-03-22",
        "value": 132349091
    },
    {
        "date": "2014-03-23",
        "value": 125613305
    },
    {
        "date": "2014-03-24",
        "value": 135592466
    },
    {
        "date": "2014-03-25",
        "value": 123408762
    },
    {
        "date": "2014-03-26",
        "value": 111991454
    },
    {
        "date": "2014-03-27",
        "value": 116123955
    },
    {
        "date": "2014-03-28",
        "value": 112817214
    },
    {
        "date": "2014-03-29",
        "value": 113029590
    },
    {
        "date": "2014-03-30",
        "value": 108753398
    },
    {
        "date": "2014-03-31",
        "value": 99383763
    },
    {
        "date": "2014-04-01",
        "value": 100151737
    },
    {
        "date": "2014-04-02",
        "value": 94985209
    },
    {
        "date": "2014-04-03",
        "value": 82913669
    },
    {
        "date": "2014-04-04",
        "value": 78748268
    },
    {
        "date": "2014-04-05",
        "value": 63829135
    },
    {
        "date": "2014-04-06",
        "value": 78694727
    },
    {
        "date": "2014-04-07",
        "value": 80868994
    },
    {
        "date": "2014-04-08",
        "value": 93799013
    },
    {
        "date": "2014-04-09",
        "value": 99042416
    },
    {
        "date": "2014-04-10",
        "value": 97298692
    },
    {
        "date": "2014-04-11",
        "value": 83353499
    },
    {
        "date": "2014-04-12",
        "value": 71248129
    },
    {
        "date": "2014-04-13",
        "value": 75253744
    },
    {
        "date": "2014-04-14",
        "value": 68976648
    },
    {
        "date": "2014-04-15",
        "value": 71002284
    },
    {
        "date": "2014-04-16",
        "value": 75052401
    },
    {
        "date": "2014-04-17",
        "value": 83894030
    },
    {
        "date": "2014-04-18",
        "value": 90236528
    },
    {
        "date": "2014-04-19",
        "value": 99739114
    },
    {
        "date": "2014-04-20",
        "value": 96407136
    },
    {
        "date": "2014-04-21",
        "value": 108323177
    },
    {
        "date": "2014-04-22",
        "value": 101578914
    },
    {
        "date": "2014-04-23",
        "value": 115877608
    },
    {
        "date": "2014-04-24",
        "value": 112088857
    },
    {
        "date": "2014-04-25",
        "value": 112071353
    },
    {
        "date": "2014-04-26",
        "value": 101790062
    },
    {
        "date": "2014-04-27",
        "value": 115003761
    },
    {
        "date": "2014-04-28",
        "value": 120457727
    },
    {
        "date": "2014-04-29",
        "value": 118253926
    },
    {
        "date": "2014-04-30",
        "value": 117956992
    }
    ],
    [{
        "date": "2014-01-01",
        "value": 50000000
    },
    {
        "date": "2014-01-02",
        "value": 60379978
    },
    {
        "date": "2014-01-03",
        "value": 40493749
    },
    {
        "date": "2014-01-04",
        "value": 60785250
    },
    {
        "date": "2014-01-05",
        "value": 67391904
    },
    {
        "date": "2014-01-06",
        "value": 61576838
    },
    {
        "date": "2014-01-07",
        "value": 61413854
    },
    {
        "date": "2014-01-08",
        "value": 82177211
    },
    {
        "date": "2014-01-09",
        "value": 103762210
    },
    {
        "date": "2014-01-10",
        "value": 84381072
    },
    {
        "date": "2014-01-11",
        "value": 54352310
    },
    {
        "date": "2014-01-12",
        "value": 65531790
    },
    {
        "date": "2014-01-13",
        "value": 75748881
    },
    {
        "date": "2014-01-14",
        "value": 47064037
    },
    {
        "date": "2014-01-15",
        "value": 67520685
    },
    {
        "date": "2014-01-16",
        "value": 60176418
    },
    {
        "date": "2014-01-17",
        "value": 66122924
    },
    {
        "date": "2014-01-18",
        "value": 57337480
    },
    {
        "date": "2014-01-19",
        "value": 100258882
    },
    {
        "date": "2014-01-20",
        "value": 46829538
    },
    {
        "date": "2014-01-21",
        "value": 92456897
    },
    {
        "date": "2014-01-22",
        "value": 94299711
    },
    {
        "date": "2014-01-23",
        "value": 62759017
    },
    {
        "date": "2014-01-24",
        "value": 103596183
    },
    {
        "date": "2014-01-25",
        "value": 108107346
    },
    {
        "date": "2014-01-26",
        "value": 66359852
    },
    {
        "date": "2014-01-27",
        "value": 62570783
    },
    {
        "date": "2014-01-28",
        "value": 77967768
    },
    {
        "date": "2014-01-29",
        "value": 60632803
    },
    {
        "date": "2014-01-30",
        "value": 103725316
    },
    {
        "date": "2014-01-31",
        "value": 98226177
    },
    {
        "date": "2014-02-01",
        "value": 60698669
    },
    {
        "date": "2014-02-02",
        "value": 67640656
    },
    {
        "date": "2014-02-03",
        "value": 66142362
    },
    {
        "date": "2014-02-04",
        "value": 101410971
    },
    {
        "date": "2014-02-05",
        "value": 66704289
    },
    {
        "date": "2014-02-06",
        "value": 60436945
    },
    {
        "date": "2014-02-07",
        "value": 78891686
    },
    {
        "date": "2014-02-08",
        "value": 71613962
    },
    {
        "date": "2014-02-09",
        "value": 107579773
    },
    {
        "date": "2014-02-10",
        "value": 58677098
    },
    {
        "date": "2014-02-11",
        "value": 87129977
    },
    {
        "date": "2014-02-12",
        "value": 51561876
    },
    {
        "date": "2014-02-13",
        "value": 51627421
    },
    {
        "date": "2014-02-14",
        "value": 83543872
    },
    {
        "date": "2014-02-15",
        "value": 66581057
    },
    {
        "date": "2014-02-16",
        "value": 65560715
    },
    {
        "date": "2014-02-17",
        "value": 62625263
    },
    {
        "date": "2014-02-18",
        "value": 92091484
    },
    {
        "date": "2014-02-19",
        "value": 48810329
    },
    {
        "date": "2014-02-20",
        "value": 49882912
    },
    {
        "date": "2014-02-21",
        "value": 44943095
    },
    {
        "date": "2014-02-22",
        "value": 104875743
    },
    {
        "date": "2014-02-23",
        "value": 96383678
    },
    {
        "date": "2014-02-24",
        "value": 105028841
    },
    {
        "date": "2014-02-25",
        "value": 63967310
    },
    {
        "date": "2014-02-26",
        "value": 63167029
    },
    {
        "date": "2014-02-27",
        "value": 68577263
    },
    {
        "date": "2014-02-28",
        "value": 95836969
    },
    {
        "date": "2014-03-01",
        "value": 99264529
    },
    {
        "date": "2014-03-02",
        "value": 109363374
    },
    {
        "date": "2014-03-03",
        "value": 93985628
    },
    {
        "date": "2014-03-04",
        "value": 94650999
    },
    {
        "date": "2014-03-05",
        "value": 90866108
    },
    {
        "date": "2014-03-06",
        "value": 46473454
    },
    {
        "date": "2014-03-07",
        "value": 84075886
    },
    {
        "date": "2014-03-08",
        "value": 103568384
    },
    {
        "date": "2014-03-09",
        "value": 101534883
    },
    {
        "date": "2014-03-10",
        "value": 95825447
    },
    {
        "date": "2014-03-11",
        "value": 66133916
    },
    {
        "date": "2014-03-12",
        "value": 96502109
    },
    {
        "date": "2014-03-13",
        "value": 80169411
    },
    {
        "date": "2014-03-14",
        "value": 84296886
    },
    {
        "date": "2014-03-15",
        "value": 86347399
    },
    {
        "date": "2014-03-16",
        "value": 31483669
    },
    {
        "date": "2014-03-17",
        "value": 82811333
    },
    {
        "date": "2014-03-18",
        "value": 89675396
    },
    {
        "date": "2014-03-19",
        "value": 95514483
    },
    {
        "date": "2014-03-20",
        "value": 97630630
    },
    {
        "date": "2014-03-21",
        "value": 62340239
    },
    {
        "date": "2014-03-22",
        "value": 62349091
    },
    {
        "date": "2014-03-23",
        "value": 65613305
    },
    {
        "date": "2014-03-24",
        "value": 65592466
    },
    {
        "date": "2014-03-25",
        "value": 63408762
    },
    {
        "date": "2014-03-26",
        "value": 91991454
    },
    {
        "date": "2014-03-27",
        "value": 96123955
    },
    {
        "date": "2014-03-28",
        "value": 92817214
    },
    {
        "date": "2014-03-29",
        "value": 93029590
    },
    {
        "date": "2014-03-30",
        "value": 108753398
    },
    {
        "date": "2014-03-31",
        "value": 49383763
    },
    {
        "date": "2014-04-01",
        "value": 100151737
    },
    {
        "date": "2014-04-02",
        "value": 44985209
    },
    {
        "date": "2014-04-03",
        "value": 52913669
    },
    {
        "date": "2014-04-04",
        "value": 48748268
    },
    {
        "date": "2014-04-05",
        "value": 23829135
    },
    {
        "date": "2014-04-06",
        "value": 58694727
    },
    {
        "date": "2014-04-07",
        "value": 50868994
    },
    {
        "date": "2014-04-08",
        "value": 43799013
    },
    {
        "date": "2014-04-09",
        "value": 4042416
    },
    {
        "date": "2014-04-10",
        "value": 47298692
    },
    {
        "date": "2014-04-11",
        "value": 53353499
    },
    {
        "date": "2014-04-12",
        "value": 71248129
    },
    {
        "date": "2014-04-13",
        "value": 75253744
    },
    {
        "date": "2014-04-14",
        "value": 68976648
    },
    {
        "date": "2014-04-15",
        "value": 71002284
    },
    {
        "date": "2014-04-16",
        "value": 75052401
    },
    {
        "date": "2014-04-17",
        "value": 83894030
    },
    {
        "date": "2014-04-18",
        "value": 50236528
    },
    {
        "date": "2014-04-19",
        "value": 59739114
    },
    {
        "date": "2014-04-20",
        "value": 56407136
    },
    {
        "date": "2014-04-21",
        "value": 108323177
    },
    {
        "date": "2014-04-22",
        "value": 101578914
    },
    {
        "date": "2014-04-23",
        "value": 95877608
    },
    {
        "date": "2014-04-24",
        "value": 62088857
    },
    {
        "date": "2014-04-25",
        "value": 92071353
    },
    {
        "date": "2014-04-26",
        "value": 81790062
    },
    {
        "date": "2014-04-27",
        "value": 105003761
    },
    {
        "date": "2014-04-28",
        "value": 100457727
    },
    {
        "date": "2014-04-29",
        "value": 98253926
    },
    {
        "date": "2014-04-30",
        "value": 67956992
    }
    ]
];

let ts2 = 1484418600000;
const dates = [];
//   var spikes = [5, -5, 3, -3, 8, -8]
for (let i = 0; i < 120; i++) {
    ts2 = ts2 + 86400000;
    const innerArr = [ts2, dataSeries[1][i].value];
    dates.push(innerArr);
}

export class Zoomabletime extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                name: 'XYZ MOTORS',
                data: dates
            }],
            options: {
                chart: {
                    type: 'area',
                    stacked: false,
                    height: 320,
                    zoom: {
                        type: 'x',
                        enabled: true,
                        autoScaleYaxis: true
                    },
                    toolbar: {
                        autoSelected: 'zoom'
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                markers: {
                    size: 0,
                },
                title: {
                    text: 'Stock Price Movement',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        inverseColors: false,
                        opacityFrom: 0.5,
                        opacityTo: 0,
                        stops: [0, 90, 100]
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                colors: ["#7971d2"],
                yaxis: {
                    labels: {
                        formatter: function (val) {
                            return (val / 1000000).toFixed(0);
                        },
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    },
                    title: {
                        text: 'Price',
                        style: {
                            color: "#8c9097",
                            fontSize: '13px',
                            fontWeight: 'bold',
                        }
                    },
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    },
                },
                tooltip: {
                    shared: false,
                    y: {
                        formatter: function (val) {
                            return (val / 1000000).toFixed(0);
                        }
                    }
                }
            },

        };

    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={300} />

        );
    }
}

const series1 =
{
    "monthDataSeries1": {
        "prices": [
            8107.85,
            8128.0,
            8122.9,
            8165.5,
            8340.7,
            8423.7,
            8423.5,
            8514.3,
            8481.85,
            8487.7,
            8506.9,
            8626.2,
            8668.95,
            8602.3,
            8607.55,
            8512.9,
            8496.25,
            8600.65,
            8881.1,
            9340.85
        ],
        "dates": [
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
            "08 Dec 2017"
        ]
    },
    "monthDataSeries2": {
        "prices": [
            8423.7,
            8423.5,
            8514.3,
            8481.85,
            8487.7,
            8506.9,
            8626.2,
            8668.95,
            8602.3,
            8607.55,
            8512.9,
            8496.25,
            8600.65,
            8881.1,
            9040.85,
            8340.7,
            8165.5,
            8122.9,
            8107.85,
            8128.0
        ],
        "dates": [
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
            "08 Dec 2017"
        ]
    },
    "monthDataSeries3": {
        "prices": [
            7114.25,
            7126.6,
            7116.95,
            7203.7,
            7233.75,
            7451.0,
            7381.15,
            7348.95,
            7347.75,
            7311.25,
            7266.4,
            7253.25,
            7215.45,
            7266.35,
            7315.25,
            7237.2,
            7191.4,
            7238.95,
            7222.6,
            7217.9,
            7359.3,
            7371.55,
            7371.15,
            7469.2,
            7429.25,
            7434.65,
            7451.1,
            7475.25,
            7566.25,
            7556.8,
            7525.55,
            7555.45,
            7560.9,
            7490.7,
            7527.6,
            7551.9,
            7514.85,
            7577.95,
            7592.3,
            7621.95,
            7707.95,
            7859.1,
            7815.7,
            7739.0,
            7778.7,
            7839.45,
            7756.45,
            7669.2,
            7580.45,
            7452.85,
            7617.25,
            7701.6,
            7606.8,
            7620.05,
            7513.85,
            7498.45,
            7575.45,
            7601.95,
            7589.1,
            7525.85,
            7569.5,
            7702.5,
            7812.7,
            7803.75,
            7816.3,
            7851.15,
            7912.2,
            7972.8,
            8145.0,
            8161.1,
            8121.05,
            8071.25,
            8088.2,
            8154.45,
            8148.3,
            8122.05,
            8132.65,
            8074.55,
            7952.8,
            7885.55,
            7733.9,
            7897.15,
            7973.15,
            7888.5,
            7842.8,
            7838.4,
            7909.85,
            7892.75,
            7897.75,
            7820.05,
            7904.4,
            7872.2,
            7847.5,
            7849.55,
            7789.6,
            7736.35,
            7819.4,
            7875.35,
            7871.8,
            8076.5,
            8114.8,
            8193.55,
            8217.1,
            8235.05,
            8215.3,
            8216.4,
            8301.55,
            8235.25,
            8229.75,
            8201.95,
            8164.95,
            8107.85,
            8128.0,
            8122.9,
            8165.5,
            8340.7,
            8423.7,
            8423.5,
            8514.3,
            8481.85,
            8487.7,
            8506.9,
            8626.2
        ],
        "dates": [
            "02 Jun 2017",
            "05 Jun 2017",
            "06 Jun 2017",
            "07 Jun 2017",
            "08 Jun 2017",
            "09 Jun 2017",
            "12 Jun 2017",
            "13 Jun 2017",
            "14 Jun 2017",
            "15 Jun 2017",
            "16 Jun 2017",
            "19 Jun 2017",
            "20 Jun 2017",
            "21 Jun 2017",
            "22 Jun 2017",
            "23 Jun 2017",
            "27 Jun 2017",
            "28 Jun 2017",
            "29 Jun 2017",
            "30 Jun 2017",
            "03 Jul 2017",
            "04 Jul 2017",
            "05 Jul 2017",
            "06 Jul 2017",
            "07 Jul 2017",
            "10 Jul 2017",
            "11 Jul 2017",
            "12 Jul 2017",
            "13 Jul 2017",
            "14 Jul 2017",
            "17 Jul 2017",
            "18 Jul 2017",
            "19 Jul 2017",
            "20 Jul 2017",
            "21 Jul 2017",
            "24 Jul 2017",
            "25 Jul 2017",
            "26 Jul 2017",
            "27 Jul 2017",
            "28 Jul 2017",
            "31 Jul 2017",
            "01 Aug 2017",
            "02 Aug 2017",
            "03 Aug 2017",
            "04 Aug 2017",
            "07 Aug 2017",
            "08 Aug 2017",
            "09 Aug 2017",
            "10 Aug 2017",
            "11 Aug 2017",
            "14 Aug 2017",
            "16 Aug 2017",
            "17 Aug 2017",
            "18 Aug 2017",
            "21 Aug 2017",
            "22 Aug 2017",
            "23 Aug 2017",
            "24 Aug 2017",
            "28 Aug 2017",
            "29 Aug 2017",
            "30 Aug 2017",
            "31 Aug 2017",
            "01 Sep 2017",
            "04 Sep 2017",
            "05 Sep 2017",
            "06 Sep 2017",
            "07 Sep 2017",
            "08 Sep 2017",
            "11 Sep 2017",
            "12 Sep 2017",
            "13 Sep 2017",
            "14 Sep 2017",
            "15 Sep 2017",
            "18 Sep 2017",
            "19 Sep 2017",
            "20 Sep 2017",
            "21 Sep 2017",
            "22 Sep 2017",
            "25 Sep 2017",
            "26 Sep 2017",
            "27 Sep 2017",
            "28 Sep 2017",
            "29 Sep 2017",
            "03 Oct 2017",
            "04 Oct 2017",
            "05 Oct 2017",
            "06 Oct 2017",
            "09 Oct 2017",
            "10 Oct 2017",
            "11 Oct 2017",
            "12 Oct 2017",
            "13 Oct 2017",
            "16 Oct 2017",
            "17 Oct 2017",
            "18 Oct 2017",
            "19 Oct 2017",
            "23 Oct 2017",
            "24 Oct 2017",
            "25 Oct 2017",
            "26 Oct 2017",
            "27 Oct 2017",
            "30 Oct 2017",
            "31 Oct 2017",
            "01 Nov 2017",
            "02 Nov 2017",
            "03 Nov 2017",
            "06 Nov 2017",
            "07 Nov 2017",
            "08 Nov 2017",
            "09 Nov 2017",
            "10 Nov 2017",
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
            "28 Nov 2017"
        ]
    }
};

//annotations
export class Annotations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                data: series1.monthDataSeries2.prices
            }],
            options: {
                colors: ["#7971d2"],
                chart: {
                    height: 320,
                    type: 'line',
                    id: 'areachart-2',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                annotations: {
                    yaxis: [{
                        y: 8200,
                        borderColor: '#00E396',
                        label: {
                            borderColor: '#00E396',
                            style: {
                                color: '#fff',
                                background: '#00E396',
                            },
                            text: 'Support',
                        }
                    }, {
                        y: 8600,
                        y2: 9000,
                        borderColor: '#000',
                        fillColor: '#FEB019',
                        opacity: 0.2,
                        label: {
                            borderColor: '#333',
                            style: {
                                fontSize: '10px',
                                color: '#333',
                                background: '#FEB019',
                            },
                            text: 'Y-axis range',
                        }
                    }],
                    xaxis: [{
                        x: new Date('23 Nov 2017').getTime(),
                        strokeDashArray: 0,
                        borderColor: '#775DD0',
                        label: {
                            borderColor: '#775DD0',
                            style: {
                                color: '#fff',
                                background: '#775DD0',
                            },
                            text: 'Anno Test',
                        }
                    }, {
                        x: new Date('26 Nov 2017').getTime(),
                        x2: new Date('28 Nov 2017').getTime(),
                        fillColor: '#B3F7CA',
                        opacity: 0.4,
                        label: {
                            borderColor: '#B3F7CA',
                            style: {
                                fontSize: '10px',
                                color: '#fff',
                                background: '#00E396',
                            },
                            offsetY: -10,
                            text: 'X-axis range',
                        }
                    }],
                    points: [{
                        x: new Date('01 Dec 2017').getTime(),
                        y: 8607.55,
                        marker: {
                            size: 8,
                            fillColor: '#fff',
                            strokeColor: 'red',
                            radius: 2,
                            cssClass: 'apexcharts-custom-class'
                        },
                        label: {
                            borderColor: '#FF4560',
                            offsetY: 0,
                            style: {
                                color: '#fff',
                                background: '#FF4560',
                            },

                            text: 'Point Annotation',
                        }
                    }, {
                        x: new Date('08 Dec 2017').getTime(),
                        y: 9340.85,
                        marker: {
                            size: 0
                        },
                        image: {
                            path: ALLImages('face1')
                        }
                    }]
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                title: {
                    text: 'Line with Annotations',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                labels: series1.monthDataSeries1.dates,
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

        };

    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={300} />

        );
    }
}

function generateDayWiseTimeSeries(baseval, count, yrange) {
    let i = 0;
    const series = [];
    while (i < count) {
        const x = baseval;
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push([x, y]);
        baseval += 86400000;
        i++;
    }
    return series;
}

const data1 = generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 185, {
    min: 30,
    max: 90
});

//Brush chart
export class Brushchart extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                data: data1
            }],
            options: {
                chart: {
                    id: 'chart2',
                    type: 'line',
                    height: 230,
                    toolbar: {
                        autoSelected: 'pan',
                        show: false
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ['#7971d2'],
                stroke: {
                    width: 3
                },
                dataLabels: {
                    enabled: false
                },
                fill: {
                    opacity: 1,
                },
                markers: {
                    size: 0
                },
                xaxis: {
                    type: 'datetime'
                }
            },

            seriesLine: [{
                data: data1
            }],
            optionsLine: {
                chart: {
                    id: 'chart1',
                    height: 130,
                    type: 'area',
                    brush: {
                        target: 'chart2',
                        enabled: true
                    },
                    selection: {
                        enabled: true,
                        xaxis: {
                            min: new Date('19 Jun 2017').getTime(),
                            max: new Date('14 Aug 2017').getTime()
                        }
                    },
                },
                colors: ['#008FFB'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        opacityFrom: 0.91,
                        opacityTo: 0.1,
                    }
                },
                xaxis: {
                    type: 'datetime',
                    tooltip: {
                        enabled: false
                    }
                },
                yaxis: {
                    tickAmount: 2
                }
            },

        };

    }

    render() {
        return (
            <div id="wrapper">
                <div id="brush-chart1">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={230} />
                </div>
                <div id="brush-chart">
                    <ReactApexChart options={this.state.optionsLine} series={this.state.seriesLine} type="area" height={130} />
                </div>
            </div>

        );
    }
}

//Stepline

export class Stepline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                data: [34, 44, 54, 21, 12, 43, 33, 23, 66, 66, 58]
            }],
            options: {
                chart: {
                    type: 'line',
                    height: 345,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                stroke: {
                    curve: 'stepline',
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                dataLabels: {
                    enabled: false
                },
                colors: ["#7971d2"],
                title: {
                    text: 'Stepline Chart',
                    align: 'left'
                },
                markers: {
                    hover: {
                        sizeOffset: 4
                    }
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

        };

    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
            </div>

        );
    }
}

//gradientline

export class Gradientline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Sales',
                data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                forecastDataPoints: {
                    count: 7
                },
                stroke: {
                    width: 3,
                    curve: 'smooth'
                },
                xaxis: {
                    type: 'datetime',
                    categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001', '4/11/2001', '5/11/2001', '6/11/2001'],
                    tickAmount: 10,
                    labels: {
                        formatter: function (_value, _timestamp, opts) {
                            return opts.dateFormatter(new Date(), 'dd MMM');
                        },
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                title: {
                    text: 'Forecast',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        gradientToColors: ['#7971d2'],
                        shadeIntensity: 1,
                        type: 'horizontal',
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 100, 100, 100]
                    },
                },
                yaxis: {
                    min: -10,
                    max: 40,
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                }
            },

        };

    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
            </div>

        );
    }
}

//Missingnull values

export class Missingnullvalues extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Peter',
                data: [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9]
            }, {
                name: 'Johnny',
                data: [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null]
            }, {
                name: 'David',
                data: [null, null, null, null, 3, 4, 1, 3, 4, 6, 7, 9, 5, null, null, null]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    zoom: {
                        enabled: false
                    },
                    animations: {
                        enabled: false
                    }
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                stroke: {
                    width: [3, 3, 2],
                    curve: 'straight'
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849"],
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
                title: {
                    text: 'Missing data (null values)',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

        };

    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
            </div>

        );
    }
}
//

//dashed
export class Dashed extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                name: "Session Duration",
                data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
            },
            {
                name: "Page Views",
                data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
            },
            {
                name: 'Total Visits',
                data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
            }
            ],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    zoom: {
                        enabled: false
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: [3, 4, 3],
                    curve: 'straight',
                    dashArray: [0, 8, 5]
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849"],
                title: {
                    text: 'Page Statistics',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                legend: {
                    tooltipHoverFormatter: function (val, opts) {
                        return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '';
                    }
                },
                markers: {
                    size: 0,
                    hover: {
                        sizeOffset: 6
                    }
                },
                xaxis: {
                    categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
                        '10 Jan', '11 Jan', '12 Jan'
                    ],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                tooltip: {
                    y: [
                        {
                            title: {
                                formatter: function (val) {
                                    return val + " (mins)";
                                }
                            }
                        },
                        {
                            title: {
                                formatter: function (val) {
                                    return val + " per session";
                                }
                            }
                        },
                        {
                            title: {
                                formatter: function (val) {
                                    return val;
                                }
                            }
                        }
                    ]
                },
                grid: {
                    borderColor: '#f1f1f1',
                }
            },

        };

    }
    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
            </div>

        );
    }
}

//dashed
export class Syncing extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            }],
            options: {
                chart: {
                    id: 'fb',
                    group: 'social',
                    type: 'line',
                    height: 160,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ['#7971d2'],
                stroke: {
                    curve: 'straight',
                    width: 3,
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

            seriesLine2: [{
                data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
                    min: 10,
                    max: 30
                })
            }],
            optionsLine2: {
                chart: {
                    id: 'tw',
                    group: 'social',
                    type: 'line',
                    height: 160
                },
                stroke: {
                    curve: 'straight',
                    width: 3,
                },
                colors: ['#26c2ff'],
                grid: {
                    borderColor: '#f2f5f7',
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

            seriesArea: [{
                data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            }],
            optionsArea: {
                chart: {
                    id: 'yt',
                    group: 'social',
                    type: 'area',
                    height: 160,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                stroke: {
                    curve: 'straight',
                    width: 3,
                },
                colors: ['#f5b849'],
                grid: {
                    borderColor: '#f2f5f7',
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

        };

    }
    render() {
        return (
            <div id="wrapper">
                <div id="chart-line">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={160} />
                </div>
                <div id="chart-line2">
                    <ReactApexChart options={this.state.optionsLine2} series={this.state.seriesLine2} type="line" height={160} />
                </div>
                <div id="chart-area">
                    <ReactApexChart options={this.state.optionsArea} series={this.state.seriesArea} type="area" height={160} />
                </div>
            </div>

        );
    }
}


//Apex Area chart

const series =
{
    "monthDataSeries1": {
        "prices": [
            8107.85,
            8128.0,
            8122.9,
            8165.5,
            8340.7,
            8423.7,
            8423.5,
            8514.3,
            8481.85,
            8487.7,
            8506.9,
            8626.2,
            8668.95,
            8602.3,
            8607.55,
            8512.9,
            8496.25,
            8600.65,
            8881.1,
            9340.85
        ],
        "dates": [
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
            "08 Dec 2017"
        ]
    },
    "monthDataSeries2": {
        "prices": [
            8423.7,
            8423.5,
            8514.3,
            8481.85,
            8487.7,
            8506.9,
            8626.2,
            8668.95,
            8602.3,
            8607.55,
            8512.9,
            8496.25,
            8600.65,
            8881.1,
            9040.85,
            8340.7,
            8165.5,
            8122.9,
            8107.85,
            8128.0
        ],
        "dates": [
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
            "08 Dec 2017"
        ]
    },
    "monthDataSeries3": {
        "prices": [
            7114.25,
            7126.6,
            7116.95,
            7203.7,
            7233.75,
            7451.0,
            7381.15,
            7348.95,
            7347.75,
            7311.25,
            7266.4,
            7253.25,
            7215.45,
            7266.35,
            7315.25,
            7237.2,
            7191.4,
            7238.95,
            7222.6,
            7217.9,
            7359.3,
            7371.55,
            7371.15,
            7469.2,
            7429.25,
            7434.65,
            7451.1,
            7475.25,
            7566.25,
            7556.8,
            7525.55,
            7555.45,
            7560.9,
            7490.7,
            7527.6,
            7551.9,
            7514.85,
            7577.95,
            7592.3,
            7621.95,
            7707.95,
            7859.1,
            7815.7,
            7739.0,
            7778.7,
            7839.45,
            7756.45,
            7669.2,
            7580.45,
            7452.85,
            7617.25,
            7701.6,
            7606.8,
            7620.05,
            7513.85,
            7498.45,
            7575.45,
            7601.95,
            7589.1,
            7525.85,
            7569.5,
            7702.5,
            7812.7,
            7803.75,
            7816.3,
            7851.15,
            7912.2,
            7972.8,
            8145.0,
            8161.1,
            8121.05,
            8071.25,
            8088.2,
            8154.45,
            8148.3,
            8122.05,
            8132.65,
            8074.55,
            7952.8,
            7885.55,
            7733.9,
            7897.15,
            7973.15,
            7888.5,
            7842.8,
            7838.4,
            7909.85,
            7892.75,
            7897.75,
            7820.05,
            7904.4,
            7872.2,
            7847.5,
            7849.55,
            7789.6,
            7736.35,
            7819.4,
            7875.35,
            7871.8,
            8076.5,
            8114.8,
            8193.55,
            8217.1,
            8235.05,
            8215.3,
            8216.4,
            8301.55,
            8235.25,
            8229.75,
            8201.95,
            8164.95,
            8107.85,
            8128.0,
            8122.9,
            8165.5,
            8340.7,
            8423.7,
            8423.5,
            8514.3,
            8481.85,
            8487.7,
            8506.9,
            8626.2
        ],
        "dates": [
            "02 Jun 2017",
            "05 Jun 2017",
            "06 Jun 2017",
            "07 Jun 2017",
            "08 Jun 2017",
            "09 Jun 2017",
            "12 Jun 2017",
            "13 Jun 2017",
            "14 Jun 2017",
            "15 Jun 2017",
            "16 Jun 2017",
            "19 Jun 2017",
            "20 Jun 2017",
            "21 Jun 2017",
            "22 Jun 2017",
            "23 Jun 2017",
            "27 Jun 2017",
            "28 Jun 2017",
            "29 Jun 2017",
            "30 Jun 2017",
            "03 Jul 2017",
            "04 Jul 2017",
            "05 Jul 2017",
            "06 Jul 2017",
            "07 Jul 2017",
            "10 Jul 2017",
            "11 Jul 2017",
            "12 Jul 2017",
            "13 Jul 2017",
            "14 Jul 2017",
            "17 Jul 2017",
            "18 Jul 2017",
            "19 Jul 2017",
            "20 Jul 2017",
            "21 Jul 2017",
            "24 Jul 2017",
            "25 Jul 2017",
            "26 Jul 2017",
            "27 Jul 2017",
            "28 Jul 2017",
            "31 Jul 2017",
            "01 Aug 2017",
            "02 Aug 2017",
            "03 Aug 2017",
            "04 Aug 2017",
            "07 Aug 2017",
            "08 Aug 2017",
            "09 Aug 2017",
            "10 Aug 2017",
            "11 Aug 2017",
            "14 Aug 2017",
            "16 Aug 2017",
            "17 Aug 2017",
            "18 Aug 2017",
            "21 Aug 2017",
            "22 Aug 2017",
            "23 Aug 2017",
            "24 Aug 2017",
            "28 Aug 2017",
            "29 Aug 2017",
            "30 Aug 2017",
            "31 Aug 2017",
            "01 Sep 2017",
            "04 Sep 2017",
            "05 Sep 2017",
            "06 Sep 2017",
            "07 Sep 2017",
            "08 Sep 2017",
            "11 Sep 2017",
            "12 Sep 2017",
            "13 Sep 2017",
            "14 Sep 2017",
            "15 Sep 2017",
            "18 Sep 2017",
            "19 Sep 2017",
            "20 Sep 2017",
            "21 Sep 2017",
            "22 Sep 2017",
            "25 Sep 2017",
            "26 Sep 2017",
            "27 Sep 2017",
            "28 Sep 2017",
            "29 Sep 2017",
            "03 Oct 2017",
            "04 Oct 2017",
            "05 Oct 2017",
            "06 Oct 2017",
            "09 Oct 2017",
            "10 Oct 2017",
            "11 Oct 2017",
            "12 Oct 2017",
            "13 Oct 2017",
            "16 Oct 2017",
            "17 Oct 2017",
            "18 Oct 2017",
            "19 Oct 2017",
            "23 Oct 2017",
            "24 Oct 2017",
            "25 Oct 2017",
            "26 Oct 2017",
            "27 Oct 2017",
            "30 Oct 2017",
            "31 Oct 2017",
            "01 Nov 2017",
            "02 Nov 2017",
            "03 Nov 2017",
            "06 Nov 2017",
            "07 Nov 2017",
            "08 Nov 2017",
            "09 Nov 2017",
            "10 Nov 2017",
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
            "28 Nov 2017"
        ]
    }
};
export class Basicarea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: "STOCK ABC",
                data: series.monthDataSeries1.prices
            }],
            options: {
                chart: {
                    type: 'area',
                    height: 320,
                    zoom: {
                        enabled: false
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight',
                },
                subtitle: {
                    text: 'Price Movements',
                    align: 'left'
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                labels: series.monthDataSeries1.dates,
                title: {
                    text: 'Fundamental Analysis of Stocks',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                colors: ['#7971d2'],
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    opposite: true,
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                legend: {
                    horizontalAlign: 'left'
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={300} />

        );
    }
}

//spiline

export class Spiline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'series1',
                data: [31, 40, 28, 51, 42, 109, 100]
            }, {
                name: 'series2',
                data: [11, 32, 45, 32, 34, 52, 41]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'area',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ["#7971d2", "#26c2ff"],
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                xaxis: {
                    type: 'datetime',
                    categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy HH:mm'
                    },
                },
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={300} />

        );
    }
}

//negative
export class Negative extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'north',
                data: [{
                    x: 1996,
                    y: 322
                },
                {
                    x: 1997,
                    y: 324
                },
                {
                    x: 1998,
                    y: 329
                },
                {
                    x: 1999,
                    y: 342
                },
                {
                    x: 2000,
                    y: 348
                },
                {
                    x: 2001,
                    y: 334
                },
                {
                    x: 2002,
                    y: 325
                },
                {
                    x: 2003,
                    y: 316
                },
                {
                    x: 2004,
                    y: 318
                },
                {
                    x: 2005,
                    y: 330
                },
                {
                    x: 2006,
                    y: 355
                },
                {
                    x: 2007,
                    y: 366
                },
                {
                    x: 2008,
                    y: 337
                },
                {
                    x: 2009,
                    y: 352
                },
                {
                    x: 2010,
                    y: 377
                },
                {
                    x: 2011,
                    y: 383
                },
                {
                    x: 2012,
                    y: 344
                },
                {
                    x: 2013,
                    y: 366
                },
                {
                    x: 2014,
                    y: 389
                },
                {
                    x: 2015,
                    y: 334
                }
                ]
            }, {
                name: 'south',
                data: [
                    {
                        x: 1996,
                        y: 162
                    },
                    {
                        x: 1997,
                        y: 90
                    },
                    {
                        x: 1998,
                        y: 50
                    },
                    {
                        x: 1999,
                        y: 77
                    },
                    {
                        x: 2000,
                        y: 35
                    },
                    {
                        x: 2001,
                        y: -45
                    },
                    {
                        x: 2002,
                        y: -88
                    },
                    {
                        x: 2003,
                        y: -120
                    },
                    {
                        x: 2004,
                        y: -156
                    },
                    {
                        x: 2005,
                        y: -123
                    },
                    {
                        x: 2006,
                        y: -88
                    },
                    {
                        x: 2007,
                        y: -66
                    },
                    {
                        x: 2008,
                        y: -45
                    },
                    {
                        x: 2009,
                        y: -29
                    },
                    {
                        x: 2010,
                        y: -45
                    },
                    {
                        x: 2011,
                        y: -88
                    },
                    {
                        x: 2012,
                        y: -132
                    },
                    {
                        x: 2013,
                        y: -146
                    },
                    {
                        x: 2014,
                        y: -169
                    },
                    {
                        x: 2015,
                        y: -184
                    }
                ]
            }],
            options: {
                chart: {
                    type: 'area',
                    height: 355,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },

                title: {
                    text: 'Area with Negative Values',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    }
                },
                xaxis: {
                    type: 'datetime',
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    },
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    tickAmount: 4,
                    floating: false,

                    labels: {
                        style: {
                            colors: '#8c9097',
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                        offsetY: -7,
                        offsetX: 0,
                    },
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false
                    }
                },
                colors: ["#7971d2", "#26c2ff"],
                fill: {
                    opacity: 0.5
                },
                tooltip: {
                    x: {
                        format: "yyyy",
                    },
                    fixed: {
                        enabled: false,
                        position: 'topRight'
                    }
                },
                grid: {
                    borderColor: '#f2f5f7',
                    yaxis: {
                        lines: {
                            offsetX: -30
                        }
                    },
                    padding: {
                        left: 20
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={300} />

        );
    }
}

//github

const githubdata = {
    series: [
        {
            x: 1352592000000,
            a: 306,
            d: 33,
            y: 13
        },
        {
            x: 1353196800000,
            a: 77,
            d: 41,
            y: 11
        },
        {
            x: 1353801600000,
            a: 97,
            d: 52,
            y: 13
        },
        {
            x: 1354406400000,
            a: 349,
            d: 231,
            y: 27
        },
        {
            x: 1355011200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1355616000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1356220800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1356825600000,
            a: 93,
            d: 16,
            y: 12
        },
        {
            x: 1357430400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1358035200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1358640000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1359244800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1359849600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1360454400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1361059200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1361664000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1362268800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1362873600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1363478400000,
            a: 47,
            d: 20,
            y: 6
        },
        {
            x: 1364083200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1364688000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1365292800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1365897600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1366502400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1367107200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1367712000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1368316800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1368921600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1369526400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1370131200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1370736000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1371340800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1371945600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1372550400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1373155200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1373760000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1374364800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1374969600000,
            a: 22,
            d: 16,
            y: 9
        },
        {
            x: 1375574400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1376179200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1376784000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1377388800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1377993600000,
            a: 104,
            d: 79,
            y: 12
        },
        {
            x: 1378598400000,
            a: 60,
            d: 17,
            y: 9
        },
        {
            x: 1379203200000,
            a: 27,
            d: 36,
            y: 3
        },
        {
            x: 1379808000000,
            a: 283,
            d: 199,
            y: 20
        },
        {
            x: 1380412800000,
            a: 1,
            d: 1,
            y: 1
        },
        {
            x: 1381017600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1381622400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1382227200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1382832000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1383436800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1384041600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1384646400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1385251200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1385856000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1386460800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1387065600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1387670400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1388275200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1388880000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1389484800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1390089600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1390694400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1391299200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1391904000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1392508800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1393113600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1393718400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1394323200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1394928000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1395532800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1396137600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1396742400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1397347200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1397952000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1398556800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1399161600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1399766400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1400371200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1400976000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1401580800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1402185600000,
            a: 115,
            d: 38,
            y: 11
        },
        {
            x: 1402790400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1403395200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1404000000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1404604800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1405209600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1405814400000,
            a: 598,
            d: 209,
            y: 34
        },
        {
            x: 1406419200000,
            a: 195,
            d: 119,
            y: 18
        },
        {
            x: 1407024000000,
            a: 174,
            d: 54,
            y: 13
        },
        {
            x: 1407628800000,
            a: 1,
            d: 1,
            y: 1
        },
        {
            x: 1408233600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1408838400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1409443200000,
            a: 2,
            d: 2,
            y: 1
        },
        {
            x: 1410048000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1410652800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1411257600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1411862400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1412467200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1413072000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1413676800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1414281600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1414886400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1415491200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1416096000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1416700800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1417305600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1417910400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1418515200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1419120000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1419724800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1420329600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1420934400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1421539200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1422144000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1422748800000,
            a: 46,
            d: 43,
            y: 8
        },
        {
            x: 1423353600000,
            a: 20,
            d: 4,
            y: 1
        },
        {
            x: 1423958400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1424563200000,
            a: 18,
            d: 11,
            y: 4
        },
        {
            x: 1425168000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1425772800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1426377600000,
            a: 54,
            d: 63,
            y: 4
        },
        {
            x: 1426982400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1427587200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1428192000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1428796800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1429401600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1430006400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1430611200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1431216000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1431820800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1432425600000,
            a: 10,
            d: 11,
            y: 1
        },
        {
            x: 1433030400000,
            a: 296,
            d: 172,
            y: 18
        },
        {
            x: 1433635200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1434240000000,
            a: 10,
            d: 13,
            y: 2
        },
        {
            x: 1434844800000,
            a: 20,
            d: 16,
            y: 3
        },
        {
            x: 1435449600000,
            a: 24,
            d: 10,
            y: 3
        },
        {
            x: 1436054400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1436659200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1437264000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1437868800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1438473600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1439078400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1439683200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1440288000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1440892800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1441497600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1442102400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1442707200000,
            a: 275,
            d: 129,
            y: 12
        },
        {
            x: 1443312000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1443916800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1444521600000,
            a: 1213,
            d: 837,
            y: 5
        },
        {
            x: 1445126400000,
            a: 299,
            d: 54,
            y: 3
        },
        {
            x: 1445731200000,
            a: 30,
            d: 33,
            y: 1
        },
        {
            x: 1446336000000,
            a: 202,
            d: 185,
            y: 18
        },
        {
            x: 1446940800000,
            a: 554,
            d: 292,
            y: 39
        },
        {
            x: 1447545600000,
            a: 9030,
            d: 44,
            y: 7
        },
        {
            x: 1448150400000,
            a: 8,
            d: 1,
            y: 1
        },
        {
            x: 1448755200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1449360000000,
            a: 18,
            d: 12,
            y: 5
        },
        {
            x: 1449964800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1450569600000,
            a: 4,
            d: 3,
            y: 2
        },
        {
            x: 1451174400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1451779200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1452384000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1452988800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1453593600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1454198400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1454803200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1455408000000,
            a: 2,
            d: 2,
            y: 1
        },
        {
            x: 1456012800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1456617600000,
            a: 32,
            d: 43,
            y: 1
        },
        {
            x: 1457222400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1457827200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1458432000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1459036800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1459641600000,
            a: 23,
            d: 13,
            y: 3
        },
        {
            x: 1460246400000,
            a: 421,
            d: 335,
            y: 9
        },
        {
            x: 1460851200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1461456000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1462060800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1462665600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1463270400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1463875200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1464480000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1465084800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1465689600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1466294400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1466899200000,
            a: 6,
            d: 1,
            y: 1
        },
        {
            x: 1467504000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1468108800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1468713600000,
            a: 886,
            d: 49,
            y: 15
        },
        {
            x: 1469318400000,
            a: 38,
            d: 26,
            y: 4
        },
        {
            x: 1469923200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1470528000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1471132800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1471737600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1472342400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1472947200000,
            a: 2,
            d: 2,
            y: 1
        },
        {
            x: 1473552000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1474156800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1474761600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1475366400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1475971200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1476576000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1477180800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1477785600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1478390400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1478995200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1479600000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1480204800000,
            a: 8,
            d: 0,
            y: 1
        },
        {
            x: 1480809600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1481414400000,
            a: 1,
            d: 1,
            y: 1
        },
        {
            x: 1482019200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1482624000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1483228800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1483833600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1484438400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1485043200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1485648000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1486252800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1486857600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1487462400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1488067200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1488672000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1489276800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1489881600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1490486400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1491091200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1491696000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1492300800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1492905600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1493510400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1494115200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1494720000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1495324800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1495929600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1496534400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1497139200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1497744000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1498348800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1498953600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1499558400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1500163200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1500768000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1501372800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1501977600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1502582400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1503187200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1503792000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1504396800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1505001600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1505606400000,
            a: 2,
            d: 2,
            y: 2
        },
        {
            x: 1506211200000,
            a: 49,
            d: 10,
            y: 4
        },
        {
            x: 1506816000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1507420800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1508025600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1508630400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1509235200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1509840000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1510444800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1511049600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1511654400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1512259200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1512864000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1513468800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1514073600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1514678400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1515283200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1515888000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1516492800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1517097600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1517702400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1518307200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1518912000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1519516800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1520121600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1520726400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1521331200000,
            a: 768,
            d: 2125,
            y: 12
        },
        {
            x: 1521936000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1522540800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1523145600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1523750400000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1524355200000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1524960000000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1525564800000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1526169600000,
            a: 0,
            d: 0,
            y: 0
        },
        {
            x: 1526774400000,
            a: 1,
            d: 0,
            y: 1
        }
    ]
};

export class Github extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                name: 'commits',
                data: githubdata.series
            }],
            options: {
                chart: {
                    id: 'chartyear',
                    type: 'area',
                    height: 130,
                    toolbar: {
                        show: false,
                        autoSelected: 'pan'
                    },
                    events: {
                        mounted: function (chart) {
                            var commitsEl = document.querySelector('.cmeta span.commits');
                            var commits = chart.getSeriesTotalXRange(chart.w.globals.minX, chart.w.globals.maxX)

                            commitsEl.innerHTML = commits
                        },
                        updated: function (chart) {
                            var commitsEl = document.querySelector('.cmeta span.commits');
                            var commits = chart.getSeriesTotalXRange(chart.w.globals.minX, chart.w.globals.maxX)

                            commitsEl.innerHTML = commits
                        }
                    }
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                colors: ['#b94eed'],
                stroke: {
                    width: 0,
                    curve: 'smooth'
                },
                dataLabels: {
                    enabled: false
                },
                fill: {
                    opacity: 1,
                    type: 'solid'
                },
                yaxis: {
                    show: false,
                    tickAmount: 3,
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                }
            },

            seriesYears: [{
                name: 'commits',
                data: githubdata.series
            }],
            optionsYears: {
                chart: {
                    height: 200,
                    type: 'area',
                    background: 'transparent',
                    toolbar: {
                        autoSelected: 'selection',
                    },
                    brush: {
                        enabled: true,
                        target: 'chartyear'
                    },
                    selection: {
                        enabled: true,
                        xaxis: {
                            min: new Date('26 Jan 2014').getTime(),
                            max: new Date('29 Mar 2015').getTime()
                        }
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ['#26c2ff'],
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: 0,
                    curve: 'smooth'
                },
                fill: {
                    opacity: 1,
                    type: 'solid'
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left'
                },
                xaxis: {
                    type: 'datetime'
                },
            },

        };
    }

    render() {
        return (
            <div id="wrapper">
                <div id="chart-months">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={130} />
                </div>

                <div className="github-style d-flex align-items-center">
                    <div className="me-2">
                        <img className="userimg rounded" src={ALLImages('face1')}
                            data-hovercard-user-id="634573" alt="" width="38" height="38" />
                    </div>
                    <div className="userdetails lh-1">
                        <a className="username fw-semibold fs-14">coder</a>
                        <span className="cmeta d-block mt-1">
                            <span className="commits"></span> commits
                        </span>
                    </div>
                </div>

                <div id="chart-years">
                    <ReactApexChart options={this.state.optionsYears} series={this.state.seriesYears} type="area" height={140} />
                </div>
            </div>

        );
    }
}

//Stacked
const generateDayWiseTimeSeries1 = function (baseval, count, yrange) {
    let i = 0;
    const series = [];
    while (i < count) {
        const x = baseval;
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
        series.push([x, y]);
        baseval += 86400000;
        i++;
    }
    return series;
};
export class Stacked extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [
                {
                    name: 'South',
                    data: generateDayWiseTimeSeries1(new Date('11 Feb 2017 GMT').getTime(), 20, {
                        min: 10,
                        max: 60
                    })
                },
                {
                    name: 'North',
                    data: generateDayWiseTimeSeries1(new Date('11 Feb 2017 GMT').getTime(), 20, {
                        min: 10,
                        max: 20
                    })
                },
                {
                    name: 'Central',
                    data: generateDayWiseTimeSeries1(new Date('11 Feb 2017 GMT').getTime(), 20, {
                        min: 10,
                        max: 15
                    })
                }
            ],
            options: {
                chart: {
                    type: 'area',
                    height: 350,
                    stacked: true,
                    events: {
                        selection: function (_chart, e) {
                            console.log(new Date(e.xaxis.min));
                        },
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ['#7971d2', '#26c2ff', '#e6eaeb'],
                grid: {
                    borderColor: '#f2f5f7',
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        opacityFrom: 0.2,
                        opacityTo: 0.6,
                    }
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left'
                },
                xaxis: {
                    type: 'datetime'
                },
            },

        };
    }

    render() {
        return (
            <div id="chart-months">
                <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={350} />
            </div>
        );
    }
}

// nullarea chart

export class Nullarea extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                name: 'Network',
                data: [{
                    x: 'Dec 23 2017',
                    y: null
                },
                {
                    x: 'Dec 24 2017',
                    y: 44
                },
                {
                    x: 'Dec 25 2017',
                    y: 31
                },
                {
                    x: 'Dec 26 2017',
                    y: 38
                },
                {
                    x: 'Dec 27 2017',
                    y: null
                },
                {
                    x: 'Dec 28 2017',
                    y: 32
                },
                {
                    x: 'Dec 29 2017',
                    y: 55
                },
                {
                    x: 'Dec 30 2017',
                    y: 51
                },
                {
                    x: 'Dec 31 2017',
                    y: 67
                },
                {
                    x: 'Jan 01 2018',
                    y: 22
                },
                {
                    x: 'Jan 02 2018',
                    y: 34
                },
                {
                    x: 'Jan 03 2018',
                    y: null
                },
                {
                    x: 'Jan 04 2018',
                    y: null
                },
                {
                    x: 'Jan 05 2018',
                    y: 11
                },
                {
                    x: 'Jan 06 2018',
                    y: 4
                },
                {
                    x: 'Jan 07 2018',
                    y: 15,
                },
                {
                    x: 'Jan 08 2018',
                    y: null
                },
                {
                    x: 'Jan 09 2018',
                    y: 9
                },
                {
                    x: 'Jan 10 2018',
                    y: 34
                },
                {
                    x: 'Jan 11 2018',
                    y: null
                },
                {
                    x: 'Jan 12 2018',
                    y: null
                },
                {
                    x: 'Jan 13 2018',
                    y: 13
                },
                {
                    x: 'Jan 14 2018',
                    y: null
                }
                ],
            }],
            options: {
                colors: ["#7971d2"],
                chart: {
                    type: 'area',
                    height: 350,
                    animations: {
                        enabled: false
                    },
                    zoom: {
                        enabled: false
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                fill: {
                    opacity: 0.8,
                    type: 'pattern',
                    pattern: {
                        style: ['verticalLines', 'horizontalLines'],
                        width: 5,
                        height: 6
                    },
                },
                markers: {
                    size: 5,
                    hover: {
                        size: 9
                    }
                },
                title: {
                    text: 'Network Monitoring',
                },
                tooltip: {
                    intersect: true,
                    shared: false
                },
                theme: {
                    palette: 'palette1'
                },
                xaxis: {
                    type: 'datetime',
                },
                yaxis: {
                    title: {
                        text: 'Bytes Received'
                    }
                }
            },

        };
    }

    render() {
        return (
            <div id="chart-months">
                <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={350} />
            </div>
        );
    }
}

//Date & time axis chart

export class Datetimexaxis extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                data: [
                    [1327359600000, 30.95],
                    [1327446000000, 31.34],
                    [1327532400000, 31.18],
                    [1327618800000, 31.05],
                    [1327878000000, 31.00],
                    [1327964400000, 30.95],
                    [1328050800000, 31.24],
                    [1328137200000, 31.29],
                    [1328223600000, 31.85],
                    [1328482800000, 31.86],
                    [1328569200000, 32.28],
                    [1328655600000, 32.10],
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
                    [1330556400000, 33.10],
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
                    [1332712800000, 34.40],
                    [1332799200000, 34.63],
                    [1332885600000, 34.46],
                    [1332972000000, 34.48],
                    [1333058400000, 34.31],
                    [1333317600000, 34.70],
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
                    [1335218400000, 32.40],
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
                    [1336687200000, 32.20],
                    [1336946400000, 32.23],
                    [1337032800000, 32.33],
                    [1337119200000, 32.36],
                    [1337205600000, 32.01],
                    [1337292000000, 31.31],
                    [1337551200000, 32.01],
                    [1337637600000, 32.01],
                    [1337724000000, 32.18],
                    [1337810400000, 31.54],
                    [1337896800000, 31.60],
                    [1338242400000, 32.05],
                    [1338328800000, 31.29],
                    [1338415200000, 31.05],
                    [1338501600000, 29.82],
                    [1338760800000, 30.31],
                    [1338847200000, 30.70],
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
                    [1341957600000, 30.20],
                    [1342044000000, 30.14],
                    [1342130400000, 30.65],
                    [1342389600000, 30.40],
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
                    [1344895200000, 32.10],
                    [1344981600000, 32.91],
                    [1345068000000, 33.65],
                    [1345154400000, 33.80],
                    [1345413600000, 33.92],
                    [1345500000000, 33.75],
                    [1345586400000, 33.84],
                    [1345672800000, 33.50],
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
                    [1348524000000, 32.90],
                    [1348610400000, 32.53],
                    [1348696800000, 32.80],
                    [1348783200000, 32.44],
                    [1349042400000, 32.62],
                    [1349128800000, 32.57],
                    [1349215200000, 32.60],
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
                    [1351116000000, 33.40],
                    [1351202400000, 34.01],
                    [1351638000000, 34.02],
                    [1351724400000, 34.36],
                    [1351810800000, 34.39],
                    [1352070000000, 34.24],
                    [1352156400000, 34.39],
                    [1352242800000, 33.47],
                    [1352329200000, 32.98],
                    [1352415600000, 32.90],
                    [1352674800000, 32.70],
                    [1352761200000, 32.54],
                    [1352847600000, 32.23],
                    [1352934000000, 32.64],
                    [1353020400000, 32.65],
                    [1353279600000, 32.92],
                    [1353366000000, 32.64],
                    [1353452400000, 32.84],
                    [1353625200000, 33.40],
                    [1353884400000, 33.30],
                    [1353970800000, 33.18],
                    [1354057200000, 33.88],
                    [1354143600000, 34.09],
                    [1354230000000, 34.61],
                    [1354489200000, 34.70],
                    [1354575600000, 35.30],
                    [1354662000000, 35.40],
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
                    [1356562800000, 37.30],
                    [1356649200000, 36.90],
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
                    [1358982000000, 38.10],
                    [1359068400000, 38.32],
                    [1359327600000, 38.24],
                    [1359414000000, 38.52],
                    [1359500400000, 37.94],
                    [1359586800000, 37.83],
                    [1359673200000, 38.34],
                    [1359932400000, 38.10],
                    [1360018800000, 38.51],
                    [1360105200000, 38.40],
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
                    [1361919600000, 39.60],
                ]
            }],
            options: {
                chart: {
                    id: 'area-datetime',
                    type: 'area',
                    height: 350,
                    zoom: {
                        autoScaleYaxis: true
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ["#7971d2"],
                annotations: {
                    yaxis: [{
                        y: 30,
                        borderColor: '#999',
                        label: {
                            // show: true,
                            text: 'Support',
                            style: {
                                color: "#fff",
                                background: '#00E396'
                            }
                        }
                    }],
                    xaxis: [{
                        x: new Date('14 Nov 2012').getTime(),
                        borderColor: '#999',
                        //   yAxisIndex: 0,
                        label: {
                            // show: true,
                            text: 'Rally',
                            style: {
                                color: "#fff",
                                background: '#775DD0'
                            }
                        }
                    }]
                },
                dataLabels: {
                    enabled: false
                },
                markers: {
                    size: 0,
                    // style: 'hollow',
                },
                xaxis: {
                    type: 'datetime',
                    min: new Date('01 Mar 2012').getTime(),
                    tickAmount: 6,
                },
                tooltip: {
                    x: {
                        format: 'dd MMM yyyy'
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops: [0, 100]
                    }
                },
            },

            selection: 'one_year',

        };
    }

    updateData(timeline) {
        this.setState({
            selection: timeline
        });

        switch (timeline) {
            case 'one_month':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date('28 Jan 2013').getTime(),
                    new Date('27 Feb 2013').getTime()
                );
                break;
            case 'six_months':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date('27 Sep 2012').getTime(),
                    new Date('27 Feb 2013').getTime()
                );
                break;
            case 'one_year':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date('27 Feb 2012').getTime(),
                    new Date('27 Feb 2013').getTime()
                );
                break;
            case 'ytd':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date('01 Jan 2013').getTime(),
                    new Date('27 Feb 2013').getTime()
                );
                break;
            case 'all':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date('23 Jan 2012').getTime(),
                    new Date('27 Feb 2013').getTime()
                );
                break;
            default:
        }
    }

    render() {
        return (
            <div id="chart">
                <Card.Header className="d-flex">
                    <Card.Title as="h6">Area Chart-Datetime X-Axis Chart</Card.Title>
                    <div className="btn-group ms-auto">
                        <Button size="sm" variant="primary" id="one_month"
                            onClick={() => this.updateData('one_month')} className={(this.state.selection === 'one_month' ? 'active' : '')}>
                            1M
                        </Button>
                        <Button size="sm" variant="primary" id="six_months"
                            onClick={() => this.updateData('six_months')} className={(this.state.selection === 'six_months' ? 'active' : '')}>
                            6M
                        </Button>
                        <Button size="sm" variant="primary" id="one_year"
                            onClick={() => this.updateData('one_year')} className={(this.state.selection === 'one_year' ? 'active' : '')}>
                            1Y
                        </Button>
                        <Button size="sm" variant="primary" id="ytd"
                            onClick={() => this.updateData('ytd')} className={(this.state.selection === 'ytd' ? 'active' : '')}>
                            YTD
                        </Button>
                        <Button size="sm" variant="primary" id="all"
                            onClick={() => this.updateData('all')} className={(this.state.selection === 'all' ? 'active' : '')}>
                            ALL
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div id="area-datetime">
                        <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={320} />
                    </div>
                </Card.Body>
            </div>
        );
    }
}


//Column Chart

export class Basicolumn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Net Profit',
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
            }, {
                name: 'Revenue',
                data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
            }, {
                name: 'Free Cash Flow',
                data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 320,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '80%',
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                dataLabels: {
                    enabled: false
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849"],
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    title: {
                        text: '$ (thousands)',
                        style: {
                            color: "#8c9097",
                        }
                    },
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return "$ " + val + " thousands";
                        }
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={300} />

        );
    }
}

//column with data labels

export class Columnwithlabels extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Inflation',
                data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'bar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                plotOptions: {
                    bar: {
                        borderRadius: 10,
                        dataLabels: {
                            position: 'top', // top, center, bottom
                        },
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val + "%";
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ["#8c9097"]
                    }
                },
                colors: ["#7971d2"],
                xaxis: {
                    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    position: 'top',
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    },
                    crosshairs: {
                        fill: {
                            type: 'gradient',
                            gradient: {
                                colorFrom: '#D8E3F0',
                                colorTo: '#BED1E6',
                                stops: [0, 100],
                                opacityFrom: 0.4,
                                opacityTo: 0.5,
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                    },
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false,
                    },
                    labels: {
                        show: false,
                        formatter: function (val) {
                            return val + "%";
                        }
                    }

                },
                title: {
                    text: 'Monthly Inflation in Argentina, 2002',
                    floating: true,
                    offsetY: 330,
                    align: 'center',
                    style: {
                        color: '#444'
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={300} />

        );
    }
}

//stacked column

export class Stackedcolumn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'PRODUCT A',
                data: [44, 55, 41, 67, 22, 43]
            }, {
                name: 'PRODUCT B',
                data: [13, 23, 20, 8, 13, 27]
            }, {
                name: 'PRODUCT C',
                data: [11, 17, 15, 15, 21, 14]
            }, {
                name: 'PRODUCT D',
                data: [21, 7, 25, 13, 22, 8]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 320,
                    stacked: true,
                    toolbar: {
                        show: true
                    },
                    zoom: {
                        enabled: true
                    },
                    // events: {
                    //     mounted: (chart) => {
                    //       chart.windowResizeHandler();
                    //     }
                    //   },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849", "#e6533c"],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }],
                plotOptions: {
                    bar: {
                        horizontal: false,
                    },
                },
                xaxis: {
                    type: 'datetime',
                    categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT',
                        '01/05/2011 GMT', '01/06/2011 GMT'
                    ],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                legend: {
                    position: 'right',
                    offsetY: 40
                },
                fill: {
                    opacity: 1
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={300} />

        );
    }
}

// export class Stackedcolumn extends React.Component {
//     constructor(props) {
//         super(props);

//         this.state = {

//             series: [{
//                 name: 'PRODUCT A',
//                 data: [44, 55, 41, 67, 22, 43]
//             }, {
//                 name: 'PRODUCT B',
//                 data: [13, 23, 20, 8, 13, 27]
//             }, {
//                 name: 'PRODUCT C',
//                 data: [11, 17, 15, 15, 21, 14]
//             }, {
//                 name: 'PRODUCT D',
//                 data: [21, 7, 25, 13, 22, 8]
//             }],
//             options: {
//                 chart: {
//                     type: 'bar',
//                     height: 350,
//                     stacked: true,
//                     toolbar: {
//                         show: true
//                     },
//                     zoom: {
//                         enabled: true
//                     }
//                 },
//                 responsive: [{
//                     breakpoint: 480,
//                     options: {
//                         legend: {
//                             position: 'bottom',
//                             offsetX: -10,
//                             offsetY: 0
//                         }
//                     }
//                 }],
//                 plotOptions: {
//                     bar: {
//                         horizontal: false,
//                         borderRadius: 10,
//                         borderRadiusApplication: 'end', // 'around', 'end'
//                         borderRadiusWhenStacked: 'last', // 'all', 'last'
//                         dataLabels: {
//                             total: {
//                                 enabled: true,
//                                 style: {
//                                     fontSize: '13px',
//                                     fontWeight: 900
//                                 }
//                             }
//                         }
//                     },
//                 },
//                 xaxis: {
//                     type: 'datetime',
//                     categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT',
//                         '01/05/2011 GMT', '01/06/2011 GMT'
//                     ],
//                 },
//                 legend: {
//                     position: 'right',
//                     offsetY: 40
//                 },
//                 fill: {
//                     opacity: 1
//                 }
//             },


//         };
//     }



//     render() {
//         return (
//             <div>
//                 <div id="chart">
//                     <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />
//                 </div>
//                 <div id="html-dist"></div>
//             </div>
//         );
//     }
// }

//stacked 100% column

export class Stacked100column extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'PRODUCT A',
                data: [44, 55, 41, 67, 22, 43, 21, 49]
            }, {
                name: 'PRODUCT B',
                data: [13, 23, 20, 8, 13, 27, 33, 12]
            }, {
                name: 'PRODUCT C',
                data: [11, 17, 15, 15, 21, 14, 15, 13]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 320,
                    stacked: true,
                    stackType: '100%',
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }],
                colors: ["#7971d2", "#26c2ff", "#f5b849"],
                xaxis: {
                    categories: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2',
                        '2012 Q3', '2012 Q4'
                    ],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                fill: {
                    opacity: 1
                },
                legend: {
                    position: 'right',
                    offsetX: 0,
                    offsetY: 50
                },
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={300} />

        );
    }
}


//Column chat with markers

export class Markers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    name: 'Actual',
                    data: [
                        {
                            x: '2011',
                            y: 1292,
                            goals: [
                                {
                                    name: 'Expected',
                                    value: 1400,
                                    strokeHeight: 5,
                                    strokeColor: '#775DD0'
                                }
                            ]
                        },
                        {
                            x: '2012',
                            y: 4432,
                            goals: [
                                {
                                    name: 'Expected',
                                    value: 5400,
                                    strokeHeight: 5,
                                    strokeColor: '#775DD0'
                                }
                            ]
                        },
                        {
                            x: '2013',
                            y: 5423,
                            goals: [
                                {
                                    name: 'Expected',
                                    value: 5200,
                                    strokeHeight: 5,
                                    strokeColor: '#775DD0'
                                }
                            ]
                        },
                        {
                            x: '2014',
                            y: 6653,
                            goals: [
                                {
                                    name: 'Expected',
                                    value: 6500,
                                    strokeHeight: 5,
                                    strokeColor: '#775DD0'
                                }
                            ]
                        },
                        {
                            x: '2015',
                            y: 8133,
                            goals: [
                                {
                                    name: 'Expected',
                                    value: 6600,
                                    strokeHeight: 13,
                                    strokeWidth: 0,
                                    strokeLineCap: 'round',
                                    strokeColor: '#775DD0'
                                }
                            ]
                        },
                        {
                            x: '2016',
                            y: 7132,
                            goals: [
                                {
                                    name: 'Expected',
                                    value: 7500,
                                    strokeHeight: 5,
                                    strokeColor: '#775DD0'
                                }
                            ]
                        },
                        {
                            x: '2017',
                            y: 7332,
                            goals: [
                                {
                                    name: 'Expected',
                                    value: 8700,
                                    strokeHeight: 5,
                                    strokeColor: '#775DD0'
                                }
                            ]
                        },
                        {
                            x: '2018',
                            y: 6553,
                            goals: [
                                {
                                    name: 'Expected',
                                    value: 7300,
                                    strokeHeight: 2,
                                    strokeDashArray: 2,
                                    strokeColor: '#775DD0'
                                }
                            ]
                        }
                    ]
                }
            ],
            options: {
                chart: {
                    height: 320,
                    type: 'bar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        columnWidth: '60%'
                    }
                },
                colors: ['#26c2ff'],
                dataLabels: {
                    enabled: false
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                legend: {
                    show: true,
                    showForSingleSeries: true,
                    customLegendItems: ['Actual', 'Expected'],
                    markers: {
                        fillColors: ['#26c2ff', '#775DD0']
                    }
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={300} />

        );
    }
}

//Roatated chat with markers

export class Rotated extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Servings',
                data: [44, 55, 41, 67, 22, 43, 21, 33, 45, 31, 87, 65, 35]
            }],
            options: {
                annotations: {
                    points: [{
                        x: 'Bananas',
                        seriesIndex: 0,
                        label: {
                            borderColor: '#775DD0',
                            offsetY: 0,
                            style: {
                                color: '#fff',
                                background: '#775DD0',
                            },
                            text: 'Bananas are good',
                        }
                    }]
                },
                chart: {
                    height: 320,
                    type: 'bar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        borderRadius: 10,
                        columnWidth: '50%',
                    }
                },
                dataLabels: {
                    enabled: false
                },
                colors: ["#7971d2"],
                stroke: {
                    width: 2
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                xaxis: {
                    labels: {
                        rotate: -35,
                        rotateAlways: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        }
                    },
                    categories: ['Apples', 'Oranges', 'Strawberries', 'Pineapples', 'Mangoes', 'Bananas',
                        'Blackberries', 'Pears', 'Watermelons', 'Cherries', 'Pomegranates', 'Tangerines', 'Papayas'
                    ],
                    tickPlacement: 'on'
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        }
                    },
                    title: {
                        text: 'Servings',
                        style: {
                            color: "#8c9097",
                        }
                    },
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: "horizontal",
                        shadeIntensity: 0.25,
                        gradientToColors: undefined,
                        inverseColors: true,
                        opacityFrom: 0.85,
                        opacityTo: 0.85,
                        stops: [50, 0, 100]
                    },
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={300} />

        );
    }
}

//Negativecolumn chat with markers

export class Negativecolumn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Cash Flow',
                data: [1.45, 5.42, 5.9, -0.42, -12.6, -18.1, -18.2, -14.16, -11.1, -6.09, 0.34, 3.88, 13.07,
                    5.8, 2, 7.37, 8.1, 13.57, 15.75, 17.1, 19.8, -27.03, -54.4, -47.2, -43.3, -18.6, -
                    48.6, -41.1, -39.6, -37.6, -29.4, -21.4, -2.4
                ]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 320,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        colors: {
                            ranges: [{
                                from: -100,
                                to: -46,
                                color: '#e6533c'
                            }, {
                                from: -45,
                                to: 0,
                                color: '#a66a5e'
                            }]
                        },
                        columnWidth: '80%',
                    }
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                colors: ["#7971d2"],
                dataLabels: {
                    enabled: false,
                },
                yaxis: {
                    title: {
                        text: 'Growth',
                        style: {
                            color: "#8c9097",
                        }
                    },
                    labels: {
                        formatter: function (y) {
                            return y.toFixed(0) + "%";
                        },
                        // labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                        // }
                    }
                },
                xaxis: {
                    type: 'datetime',
                    categories: [
                        '2011-01-01', '2011-02-01', '2011-03-01', '2011-04-01', '2011-05-01', '2011-06-01',
                        '2011-07-01', '2011-08-01', '2011-09-01', '2011-10-01', '2011-11-01', '2011-12-01',
                        '2012-01-01', '2012-02-01', '2012-03-01', '2012-04-01', '2012-05-01', '2012-06-01',
                        '2012-07-01', '2012-08-01', '2012-09-01', '2012-10-01', '2012-11-01', '2012-12-01',
                        '2013-01-01', '2013-02-01', '2013-03-01', '2013-04-01', '2013-05-01', '2013-06-01',
                        '2013-07-01', '2013-08-01', '2013-09-01'
                    ],
                    labels: {
                        rotate: -90,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                }
            }
        };

    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={300} />

        );
    }
}

//Rangecolumn chat with markers

export class Rangecolumn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                data: [{
                    x: 'Team A',
                    y: [1, 5]
                }, {
                    x: 'Team B',
                    y: [4, 6]
                }, {
                    x: 'Team C',
                    y: [5, 8]
                }, {
                    x: 'Team D',
                    y: [3, 11]
                }]
            }, {
                data: [{
                    x: 'Team A',
                    y: [2, 6]
                }, {
                    x: 'Team B',
                    y: [1, 3]
                }, {
                    x: 'Team C',
                    y: [7, 8]
                }, {
                    x: 'Team D',
                    y: [5, 9]
                }]
            }],
            options: {
                chart: {
                    type: 'rangeBar',
                    height: 320,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                colors: ["#7971d2", "#26c2ff"],
                plotOptions: {
                    bar: {
                        horizontal: false
                    }
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                dataLabels: {
                    enabled: true
                }
            }
        };

    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={300} />

        );
    }
}

//Loaded chat with markers

const colors = ['#7971d2', '#26c2ff', '#f5b849', '#49b6f5', '#e6533c', '#26bf94', '#5b67c7'];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

const arrayData = [{
    y: 400,
    quarters: [{
        x: 'Q1',
        y: 120
    }, {
        x: 'Q2',
        y: 90
    }, {
        x: 'Q3',
        y: 100
    }, {
        x: 'Q4',
        y: 90
    }]
}, {
    y: 430,
    quarters: [{
        x: 'Q1',
        y: 120
    }, {
        x: 'Q2',
        y: 110
    }, {
        x: 'Q3',
        y: 90
    }, {
        x: 'Q4',
        y: 110
    }]
}, {
    y: 448,
    quarters: [{
        x: 'Q1',
        y: 70
    }, {
        x: 'Q2',
        y: 100
    }, {
        x: 'Q3',
        y: 140
    }, {
        x: 'Q4',
        y: 138
    }]
}, {
    y: 470,
    quarters: [{
        x: 'Q1',
        y: 150
    }, {
        x: 'Q2',
        y: 60
    }, {
        x: 'Q3',
        y: 190
    }, {
        x: 'Q4',
        y: 70
    }]
}, {
    y: 540,
    quarters: [{
        x: 'Q1',
        y: 120
    }, {
        x: 'Q2',
        y: 120
    }, {
        x: 'Q3',
        y: 130
    }, {
        x: 'Q4',
        y: 170
    }]
}, {
    y: 580,
    quarters: [{
        x: 'Q1',
        y: 170
    }, {
        x: 'Q2',
        y: 130
    }, {
        x: 'Q3',
        y: 120
    }, {
        x: 'Q4',
        y: 160
    }]
}];

function makeData() {
    const dataSet = shuffleArray(arrayData);
    const dataYearSeries = [{
        x: "2011",
        y: dataSet[0].y,
        color: colors[0],
        quarters: dataSet[0].quarters
    }, {
        x: "2012",
        y: dataSet[1].y,
        color: colors[1],
        quarters: dataSet[1].quarters
    }, {
        x: "2013",
        y: dataSet[2].y,
        color: colors[2],
        quarters: dataSet[2].quarters
    }, {
        x: "2014",
        y: dataSet[3].y,
        color: colors[3],
        quarters: dataSet[3].quarters
    }, {
        x: "2015",
        y: dataSet[4].y,
        color: colors[4],
        quarters: dataSet[4].quarters
    }, {
        x: "2016",
        y: dataSet[5].y,
        color: colors[5],
        quarters: dataSet[5].quarters
    }];

    return dataYearSeries;
}

function updateQuarterChart(sourceChart, destChartIDToUpdate) {
    let series = [];
    const seriesIndex = 0;
    const colors = [];
    if (sourceChart.w.globals.selectedDataPoints[0]) {
        const selectedPoints = sourceChart.w.globals.selectedDataPoints;
        for (let i = 0; i < selectedPoints[seriesIndex].length; i++) {
            const selectedIndex = selectedPoints[seriesIndex][i];
            const yearSeries = sourceChart.w.config.series[seriesIndex];
            series.push({
                name: yearSeries.data[selectedIndex].x,
                data: yearSeries.data[selectedIndex].quarters
            });
            colors.push(yearSeries.data[selectedIndex].color);
        }

        if (series.length === 0) series = [{
            data: []
        }];
        return ApexCharts.exec(destChartIDToUpdate, 'updateOptions', {
            series: series,
            colors: colors,
            fill: {
                colors: colors
            }
        });
    }
}

export class Loaded extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                data: makeData()
            }],
            options: {
                chart: {
                    id: 'barYear',
                    height: 400,
                    width: '100%',
                    type: 'bar',
                    events: {
                        dataPointSelection: function (e, chart, opts) {
                            var quarterChartEl = document.querySelector("#chart-quarter");
                            var yearChartEl = document.querySelector("#chart-year");

                            if (opts.selectedDataPoints[0].length === 1) {
                                if (quarterChartEl.classList.contains("active")) {
                                    updateQuarterChart(chart, 'barQuarter')
                                } else {
                                    yearChartEl.classList.add("chart-quarter-activated")
                                    quarterChartEl.classList.add("active");
                                    updateQuarterChart(chart, 'barQuarter')
                                }
                            } else {
                                updateQuarterChart(chart, 'barQuarter')
                            }

                            if (opts.selectedDataPoints[0].length === 0) {
                                yearChartEl.classList.remove("chart-quarter-activated")
                                quarterChartEl.classList.remove("active");
                            }

                        },
                        updated: function (chart) {
                            updateQuarterChart(chart, 'barQuarter')
                        }
                    }
                },
                plotOptions: {
                    bar: {
                        distributed: true,
                        horizontal: true,
                        barHeight: '75%',
                        dataLabels: {
                            position: 'bottom'
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    textAnchor: 'start',
                    style: {
                        colors: ['#fff']
                    },
                    formatter: function (val, opt) {
                        return opt.w.globals.labels[opt.dataPointIndex]
                    },
                    offsetX: 0,
                    dropShadow: {
                        enabled: true
                    }
                },

                colors: colors,

                states: {
                    normal: {
                        filter: {
                            type: 'desaturate'
                        }
                    },
                    active: {
                        allowMultipleDataPointsSelection: true,
                        filter: {
                            type: 'darken',
                            value: 1
                        }
                    }
                },
                tooltip: {
                    x: {
                        show: false
                    },
                    y: {
                        title: {
                            formatter: function (val, opts) {
                                return opts.w.globals.labels[opts.dataPointIndex]
                            }
                        }
                    }
                },
                title: {
                    text: 'Yearly Results',
                    offsetX: 15
                },
                subtitle: {
                    text: '(Click on bar to see details)',
                    offsetX: 15
                },
                yaxis: {
                    labels: {
                        show: false
                    }
                }
            },

            seriesQuarter: [{
                data: []
            }],
            optionsQuarter: {
                chart: {
                    id: 'barQuarter',
                    height: 400,
                    width: '100%',
                    type: 'bar',
                    stacked: true
                },
                plotOptions: {
                    bar: {
                        columnWidth: '50%',
                        horizontal: false
                    }
                },
                legend: {
                    show: false
                },
                grid: {
                    yaxis: {
                        lines: {
                            show: false,
                        }
                    },
                    xaxis: {
                        lines: {
                            show: true,
                        }
                    }
                },
                yaxis: {
                    labels: {
                        show: false
                    }
                },
                title: {
                    text: 'Quarterly Results',
                    offsetX: 10
                },
                tooltip: {
                    x: {
                        formatter: function (val, opts) {
                            return opts.w.globals.seriesNames[opts.seriesIndex]
                        }
                    },
                    y: {
                        title: {
                            formatter: function (val, opts) {
                                return opts.w.globals.labels[opts.dataPointIndex]
                            }
                        }
                    }
                }
            },


        };
    }


    changeData() {
        Apex.exec('barYear', 'updateSeries', [{
            data: makeData()
        }])
    }


    render() {
        return (
            <div>
                <div id="wrap">
                    <select id="model" className="flat-select"
                        onChange={() => this.changeData()}
                    >
                        <option value="iphone5">iPhone 5</option>
                        <option value="iphone6">iPhone 6</option>
                        <option value="iphone7">iPhone 7</option>
                    </select>
                    <div id="chart-year">
                        <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={400} />
                    </div>
                    <div id="chart-quarter">
                        <ReactApexChart options={this.state.optionsQuarter} series={this.state.seriesQuarter} type="bar" height={400} />
                    </div>
                </div>
                <div id="html-dist"></div>
            </div>
        );
    }
}

//Distributed chat with markers

export class Distributed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                data: [21, 22, 10, 28, 16, 21, 13, 30]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'bar',
                    events: {
                        click: function (_chart, _w, _e) {
                        },
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },

                },
                colors: ['#7971d2', '#26c2ff', '#f5b849', '#49b6f5', '#e6533c', '#26bf94', '#5b67c7', '#a65e76'],
                plotOptions: {
                    bar: {
                        columnWidth: '45%',
                        distributed: true,
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                xaxis: {
                    categories: [
                        ['John', 'Doe'],
                        ['Joe', 'Smith'],
                        ['Jake', 'Williams'],
                        'Amber',
                        ['Peter', 'Brown'],
                        ['Mary', 'Evans'],
                        ['David', 'Wilson'],
                        ['Lily', 'Roberts'],
                    ],
                    labels: {
                        style: {
                            colors: colors,
                            fontSize: '12px'
                        }
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }
        };

    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />

        );
    }
}

//bar Chart

export class Basicbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 320,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },

                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        horizontal: true,
                    }
                },
                colors: ["#7971d2"],
                grid: {
                    borderColor: '#f2f5f7',
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
                        'United States', 'China', 'Germany'
                    ],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={320} />

        );
    }
}

//Grouped
export class Grouped extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                data: [44, 55, 41, 64, 22, 43, 21]
            }, {
                data: [53, 32, 33, 52, 13, 44, 32]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 320,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        dataLabels: {
                            position: 'top',
                        },
                    }
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                colors: ["#7971d2", "#26c2ff"],
                dataLabels: {
                    enabled: true,
                    offsetX: -6,
                    style: {
                        fontSize: '10px',
                        colors: ['#fff']
                    }
                },
                stroke: {
                    show: true,
                    width: 1,
                    colors: ['#fff']
                },
                tooltip: {
                    shared: true,
                    intersect: false
                },
                xaxis: {
                    categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={320} />

        );
    }
}

//Stackedbar
export class Stackedbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Marine Sprite',
                data: [44, 55, 41, 37, 22, 43, 21]
            }, {
                name: 'Striking Calf',
                data: [53, 32, 33, 52, 13, 43, 32]
            }, {
                name: 'Tank Picture',
                data: [12, 17, 11, 9, 15, 11, 20]
            }, {
                name: 'Bucket Slope',
                data: [9, 7, 5, 8, 6, 9, 4]
            }, {
                name: 'Reborn Kid',
                data: [25, 12, 19, 32, 25, 24, 10]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 320,
                    stacked: true,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                    },
                },
                stroke: {
                    width: 1,
                    colors: ['#fff']
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849", "#e6533c", "#49b6f5"],
                grid: {
                    borderColor: '#f2f5f7',
                },
                title: {
                    text: 'Fiction Books Sales',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                xaxis: {
                    categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
                    labels: {
                        formatter: function (val) {
                            return val + "K";
                        },
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    title: {
                        text: undefined
                    },
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + "K";
                        }
                    }
                },
                fill: {
                    opacity: 1
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                    offsetX: 40
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={320} />

        );
    }
}

////Stackedbar
export class Stacked100bar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Marine Sprite',
                data: [44, 55, 41, 37, 22, 43, 21]
            }, {
                name: 'Striking Calf',
                data: [53, 32, 33, 52, 13, 43, 32]
            }, {
                name: 'Tank Picture',
                data: [12, 17, 11, 9, 15, 11, 20]
            }, {
                name: 'Bucket Slope',
                data: [9, 7, 5, 8, 6, 9, 4]
            }, {
                name: 'Reborn Kid',
                data: [25, 12, 19, 32, 25, 24, 10]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 320,
                    stacked: true,
                    stackType: '100%',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                    },
                },
                stroke: {
                    width: 1,
                    colors: ['#fff']
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849", "#e6533c", "#49b6f5"],
                grid: {
                    borderColor: '#f2f5f7',
                },
                title: {
                    text: '100% Stacked Bar',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                xaxis: {
                    categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + "K";
                        }
                    }
                },
                fill: {
                    opacity: 1

                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                    offsetX: 40
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={320} />

        );
    }
}

////Negative
export class Negativebar extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                name: 'Males',
                data: [0.4, 0.65, 0.76, 0.88, 1.5, 2.1, 2.9, 3.8, 3.9, 4.2, 4, 4.3, 4.1, 4.2, 4.5,
                    3.9, 3.5, 3
                ]
            },
            {
                name: 'Females',
                data: [-0.8, -1.05, -1.06, -1.18, -1.4, -2.2, -2.85, -3.7, -3.96, -4.22, -4.3, -4.4,
                -4.1, -4, -4.1, -3.4, -3.1, -2.8
                ]
            }
            ],
            options: {
                chart: {
                    type: 'bar',
                    height: 440,
                    stacked: true,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ["#7971d2", "#26c2ff"],
                plotOptions: {
                    bar: {
                        horizontal: true,
                        barHeight: '80%',
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: 1,
                    colors: ["#fff"]
                },

                grid: {
                    xaxis: {
                        lines: {
                            show: false
                        }
                    }
                },
                yaxis: {
                    min: -5,
                    max: 5,
                    title: {
                        // text: 'Age',
                    },
                },
                tooltip: {
                    shared: false,
                    x: {
                        //   formatter: function (val) {
                        //     return val
                        //   }
                        formatter: (val) => val.toString(),
                    },
                    y: {
                        formatter: (val) => Math.abs(val) + '%',
                    }
                },
                title: {
                    text: 'Mauritius population pyramid 2011'
                },
                xaxis: {
                    categories: ['85+', '80-84', '75-79', '70-74', '65-69', '60-64', '55-59', '50-54',
                        '45-49', '40-44', '35-39', '30-34', '25-29', '20-24', '15-19', '10-14', '5-9',
                        '0-4'
                    ],
                    title: {
                        text: 'Percent'
                    },
                    labels: {
                        formatter: (val) => Math.abs(Math.round(val)) + '%',
                    }
                },
            },

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />

        );
    }
}

//Marker
export class Markerbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    name: 'Actual',
                    data: [
                        {
                            x: '2011',
                            y: 12,
                            goals: [
                                {
                                    name: 'Expected',
                                    value: 14,
                                    strokeWidth: 2,
                                    strokeDashArray: 2,
                                    strokeColor: '#775DD0'
                                }
                            ]
                        },
                        {
                            x: '2012',
                            y: 44,
                            goals: [
                                {
                                    name: 'Expected',
                                    value: 54,
                                    strokeWidth: 5,
                                    strokeHeight: 10,
                                    strokeColor: '#775DD0'
                                }
                            ]
                        },
                        {
                            x: '2013',
                            y: 54,
                            goals: [
                                {
                                    name: 'Expected',
                                    value: 52,
                                    strokeWidth: 10,
                                    strokeHeight: 0,
                                    strokeLineCap: 'round',
                                    strokeColor: '#775DD0'
                                }
                            ]
                        },
                        {
                            x: '2014',
                            y: 66,
                            goals: [
                                {
                                    name: 'Expected',
                                    value: 61,
                                    strokeWidth: 10,
                                    strokeHeight: 0,
                                    strokeLineCap: 'round',
                                    strokeColor: '#775DD0'
                                }
                            ]
                        },
                        {
                            x: '2015',
                            y: 81,
                            goals: [
                                {
                                    name: 'Expected',
                                    value: 66,
                                    strokeWidth: 10,
                                    strokeHeight: 0,
                                    strokeLineCap: 'round',
                                    strokeColor: '#775DD0'
                                }
                            ]
                        },
                        {
                            x: '2016',
                            y: 67,
                            goals: [
                                {
                                    name: 'Expected',
                                    value: 70,
                                    strokeWidth: 5,
                                    strokeHeight: 10,
                                    strokeColor: '#775DD0'
                                }
                            ]
                        }
                    ]
                }
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'bar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                    }
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                colors: ['#26c2ff'],
                dataLabels: {
                    formatter: function (val, opt) {
                        const goals =
                            opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex]
                                .goals;

                        if (goals && goals.length) {
                            return `${val} / ${goals[0].value}`;
                        }
                        return val;
                    },
                },
                legend: {
                    show: true,
                    showForSingleSeries: true,
                    customLegendItems: ['Actual', 'Expected'],
                    markers: {
                        fillColors: ['#00E396', '#775DD0']
                    }
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }
        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />

        );
    }
}

//Reversed
export class Reversedbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                data: [400, 430, 448, 470, 540, 580, 690]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 320,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                annotations: {
                    xaxis: [{
                        x: 500,
                        borderColor: '#00E396',
                        label: {
                            borderColor: '#00E396',
                            style: {
                                color: '#fff',
                                background: '#00E396',
                            },
                            text: 'X annotation',
                        }
                    }],
                    yaxis: [{
                        y: 'July',
                        y2: 'September',
                        label: {
                            text: 'Y annotation'
                        }
                    }]
                },
                grid: {
                    borderColor: '#f2f5f7',
                    xaxis: {
                        lines: {
                            show: true
                        }
                    }
                },
                colors: ["#7971d2"],
                plotOptions: {
                    bar: {
                        horizontal: true,
                    }
                },
                dataLabels: {
                    enabled: true
                },
                xaxis: {
                    categories: ['June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                // grid: {
                //     xaxis: {
                //         lines: {
                //             show: true
                //         }
                //     }
                // },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    },
                    reversed: true,
                    axisTicks: {
                        show: true
                    }
                }
            }
        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />

        );
    }
}

//Category
export class Categorybar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 320,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        barHeight: '100%',
                        distributed: true,
                        horizontal: true,
                        dataLabels: {
                            position: 'bottom'
                        },
                    }
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849", "#e6533c", "#49b6f5", "#a65e76", "#5b67c7", "#a65e9a",
                    "#26bf94", "#26c2ff"
                ],
                grid: {
                    borderColor: '#f2f5f7',
                },
                dataLabels: {
                    enabled: true,
                    textAnchor: 'start',
                    style: {
                        colors: ['#fff']
                    },
                    formatter: function (val, opt) {
                        return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
                    },
                    offsetX: 0,
                    dropShadow: {
                        enabled: false
                    }
                },
                stroke: {
                    width: 1,
                    colors: ['#fff']
                },
                xaxis: {
                    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
                        'United States', 'China', 'India'
                    ],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: false
                    }
                },
                title: {
                    text: 'Custom DataLabels',
                    align: 'center',
                    floating: true,
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                subtitle: {
                    text: 'Category Names as DataLabels inside bars',
                    align: 'center',
                },
                tooltip: {
                    theme: 'dark',
                    x: {
                        show: false
                    },
                    y: {
                        title: {
                            formatter: function () {
                                return '';
                            }
                        }
                    }
                }
            }
        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />

        );
    }
}

//Pattern
export class Patternbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Marine Sprite',
                data: [44, 55, 41, 37, 22, 43, 21]
            }, {
                name: 'Striking Calf',
                data: [53, 32, 33, 52, 13, 43, 32]
            }, {
                name: 'Tank Picture',
                data: [12, 17, 11, 9, 15, 11, 20]
            }, {
                name: 'Bucket Slope',
                data: [9, 7, 5, 8, 6, 9, 4]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                    stacked: true,
                    dropShadow: {
                        enabled: true,
                        blur: 1,
                        opacity: 0.25
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        barHeight: '60%',
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: 2,
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849", "#49b6f5"],
                title: {
                    text: 'Compare Sales Strategy',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                xaxis: {
                    categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    title: {
                        text: undefined
                    },
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                },
                tooltip: {
                    shared: false,
                    y: {
                        formatter: function (val) {
                            return val + "K";
                        }
                    }
                },
                fill: {
                    type: 'pattern',
                    opacity: 1,
                    pattern: {
                        style: ['circles', 'slantedLines', 'verticalLines', 'horizontalLines'], // string or array of strings

                    }
                },
                states: {
                    hover: {
                        // filter: 'none'
                    }
                },
                legend: {
                    position: 'right',
                    offsetY: 40
                }
            }
        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />

        );
    }
}

//Image
export class Imagebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'coins',
                data: [2, 4, 3, 4, 3, 5, 5, 6.5, 6, 5, 4, 5, 8, 7, 7, 8, 8, 10, 9, 9, 12, 12,
                    11, 12, 13, 14, 16, 14, 15, 17, 19, 21
                ]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                    animations: {
                        enabled: false
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        barHeight: '100%',
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    colors: ["#fff"],
                    width: 0.2
                },
                labels: Array.from({ length: 39 }, (_, index) => (index + 1).toString()),
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    },
                    labels: {
                        show: false
                    },
                    title: {
                        text: 'Weight',
                        style: {
                            color: "#8c9097",
                        }
                    },
                },
                grid: {
                    position: 'back'
                },
                title: {
                    text: 'Paths filled by clipped image',
                    align: 'right',
                    offsetY: 30,
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                fill: {
                    type: 'image',
                    opacity: 0.87,
                    image: {
                        src: [ALLImages('media34')],
                        width: 466,
                        height: 406
                    }
                },
            }
        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />

        );
    }
}

//Mixed Chart

export class Mixedlinecolumn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Website Blog',
                type: 'column',
                data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
            }, {
                name: 'Social Media',
                type: 'line',
                data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                stroke: {
                    width: [0, 4]
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                title: {
                    text: 'Traffic Sources',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: [1]
                },
                colors: ["#7971d2", "#26c2ff"],
                labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: [{
                    title: {
                        text: 'Website Blog',
                        style: {
                            color: "#8c9097",
                        }
                    },
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }, {
                    opposite: true,
                    title: {
                        text: 'Social Media',
                        style: {
                            color: "#8c9097",
                        }
                    }
                }]
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={320} />

        );
    }
}

// MultipleYaxis

export class MultipleYaxis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [{
                name: 'Income',
                type: 'column',
                data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
            }, {
                name: 'Cashflow',
                type: 'column',
                data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5]
            }, {
                name: 'Revenue',
                type: 'line',
                data: [20, 29, 37, 36, 44, 45, 50, 58]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    stacked: false,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: [1, 1, 4]
                },
                title: {
                    text: 'XYZ - Stock Analysis (2009 - 2016)',
                    align: 'left',
                    offsetX: 110,
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                colors: ["#b94eed", "#45d65b", "#f39c12"],
                xaxis: {
                    categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: [
                    {
                        axisTicks: {
                            show: true,
                        },
                        axisBorder: {
                            show: true,
                            color: '#b94eed'
                        },
                        labels: {
                            style: {
                                colors: '#b94eed',
                            }
                        },
                        title: {
                            text: "Income (thousand crores)",
                            style: {
                                color: '#b94eed',
                            }
                        },
                        // tooltip: {
                        //     enabled: true
                        // }
                    },
                    {
                        // seriesName: 'Income',
                        opposite: true,
                        axisTicks: {
                            show: true,
                        },
                        axisBorder: {
                            show: true,
                            color: '#45d65b'
                        },
                        labels: {
                            style: {
                                colors: '#45d65b',
                            }
                        },
                        title: {
                            text: "Operating Cashflow (thousand crores)",
                            style: {
                                color: '#45d65b',
                            }
                        },
                    },
                    {
                        // seriesName: 'Revenue',
                        opposite: true,
                        axisTicks: {
                            show: true,
                        },
                        axisBorder: {
                            show: true,
                            color: '#f39c12'
                        },
                        labels: {
                            style: {
                                colors: '#f39c12',
                            },
                        },
                        title: {
                            text: "Revenue (thousand crores)",
                            style: {
                                color: '#f39c12',
                            }
                        }
                    },
                ],
                tooltip: {
                    fixed: {
                        enabled: true,
                        position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
                        offsetY: 30,
                        offsetX: 60
                    },
                },
                legend: {
                    horizontalAlign: 'left',
                    offsetX: 40
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={320} />

        );
    }
}

// Linearea

export class Linearea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [{
                name: 'TEAM A',
                type: 'area',
                data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33]
            }, {
                name: 'TEAM B',
                type: 'line',
                data: [55, 69, 45, 61, 43, 54, 37, 52, 44, 61, 43]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                stroke: {
                    curve: 'smooth'
                },
                colors: ["#7971d2", "#26c2ff"],
                grid: {
                    borderColor: '#f2f5f7',
                },
                fill: {
                    type: 'solid',
                    opacity: [0.35, 1],
                },
                labels: ['Dec 01', 'Dec 02', 'Dec 03', 'Dec 04', 'Dec 05', 'Dec 06', 'Dec 07', 'Dec 08', 'Dec 09 ', 'Dec 10', 'Dec 11'],
                markers: {
                    size: 0
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: [
                    {
                        title: {
                            text: 'Series A',
                            style: {
                                color: "#8c9097",
                            }
                        },
                        labels: {
                            show: true,
                            style: {
                                colors: "#8c9097",
                                fontSize: '11px',
                                fontWeight: 600,
                                cssClass: 'apexcharts-yaxis-label',
                            },
                        }
                    },
                    {
                        opposite: true,
                        title: {
                            text: 'Series B',
                            style: {
                                color: "#8c9097",
                            }
                        },
                        labels: {
                            show: true,
                            style: {
                                colors: "#8c9097",
                                fontSize: '11px',
                                fontWeight: 600,
                                cssClass: 'apexcharts-yaxis-label',
                            },
                        }
                    },
                ],
                tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: function (y) {
                            if (typeof y !== "undefined") {
                                return y.toFixed(0) + " points";
                            }
                            return y;
                        }
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={320} />

        );
    }
}

// Linecolumnarea

export class Linecolumnarea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [{
                name: 'TEAM A',
                type: 'column',
                data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
            }, {
                name: 'TEAM B',
                type: 'area',
                data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
            }, {
                name: 'TEAM C',
                type: 'line',
                data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    stacked: false,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                stroke: {
                    width: [0, 2, 5],
                    curve: 'smooth'
                },
                plotOptions: {
                    bar: {
                        columnWidth: '50%'
                    }
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849"],
                grid: {
                    borderColor: '#f2f5f7',
                },
                fill: {
                    opacity: [0.85, 0.25, 1],
                    gradient: {
                        inverseColors: false,
                        shade: 'light',
                        type: "vertical",
                        opacityFrom: 0.85,
                        opacityTo: 0.55,
                        stops: [0, 100, 100, 100]
                    }
                },
                labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003',
                    '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'
                ],
                markers: {
                    size: 0
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    title: {
                        text: 'Points',
                        style: {
                            color: "#8c9097",
                        }
                    },
                    min: 0,
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                },
                tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: function (y) {
                            if (typeof y !== "undefined") {
                                return y.toFixed(0) + " points";
                            }
                            return y;

                        }
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={320} />

        );
    }
}

//Range Area Chart

export class Basicrangearea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    name: 'New York Temperature',
                    data: [
                        {
                            x: 'Jan',
                            y: [-2, 4]
                        },
                        {
                            x: 'Feb',
                            y: [-1, 6]
                        },
                        {
                            x: 'Mar',
                            y: [3, 10]
                        },
                        {
                            x: 'Apr',
                            y: [8, 16]
                        },
                        {
                            x: 'May',
                            y: [13, 22]
                        },
                        {
                            x: 'Jun',
                            y: [18, 26]
                        },
                        {
                            x: 'Jul',
                            y: [21, 29]
                        },
                        {
                            x: 'Aug',
                            y: [21, 28]
                        },
                        {
                            x: 'Sep',
                            y: [17, 24]
                        },
                        {
                            x: 'Oct',
                            y: [11, 18]
                        },
                        {
                            x: 'Nov',
                            y: [6, 12]
                        },
                        {
                            x: 'Dec',
                            y: [1, 7]
                        }
                    ]
                }
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'rangeArea',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: 'New York Temperature (all year round)',
                    style: {
                        color: '#8c9097'
                    },
                },
                colors: ["#7971d2"],
                markers: {
                    hover: {
                        sizeOffset: 5
                    }
                },
                dataLabels: {
                    enabled: false
                },
                yaxis: {
                    labels: {
                        formatter: (val) => {
                            return val + '°C';
                        }
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="rangeArea" height={350} />

        );
    }
}

// Comborangearea

export class Comborangearea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    type: 'rangeArea',
                    name: 'Team B Range',

                    data: [
                        {
                            x: 'Jan',
                            y: [1100, 1900]
                        },
                        {
                            x: 'Feb',
                            y: [1200, 1800]
                        },
                        {
                            x: 'Mar',
                            y: [900, 2900]
                        },
                        {
                            x: 'Apr',
                            y: [1400, 2700]
                        },
                        {
                            x: 'May',
                            y: [2600, 3900]
                        },
                        {
                            x: 'Jun',
                            y: [500, 1700]
                        },
                        {
                            x: 'Jul',
                            y: [1900, 2300]
                        },
                        {
                            x: 'Aug',
                            y: [1000, 1500]
                        }
                    ]
                },

                {
                    type: 'rangeArea',
                    name: 'Team A Range',
                    data: [
                        {
                            x: 'Jan',
                            y: [3100, 3400]
                        },
                        {
                            x: 'Feb',
                            y: [4200, 5200]
                        },
                        {
                            x: 'Mar',
                            y: [3900, 4900]
                        },
                        {
                            x: 'Apr',
                            y: [3400, 3900]
                        },
                        {
                            x: 'May',
                            y: [5100, 5900]
                        },
                        {
                            x: 'Jun',
                            y: [5400, 6700]
                        },
                        {
                            x: 'Jul',
                            y: [4300, 4600]
                        },
                        {
                            x: 'Aug',
                            y: [2100, 2900]
                        }
                    ]
                },

                {
                    type: 'line',
                    name: 'Team B Median',
                    data: [
                        {
                            x: 'Jan',
                            y: 1500
                        },
                        {
                            x: 'Feb',
                            y: 1700
                        },
                        {
                            x: 'Mar',
                            y: 1900
                        },
                        {
                            x: 'Apr',
                            y: 2200
                        },
                        {
                            x: 'May',
                            y: 3000
                        },
                        {
                            x: 'Jun',
                            y: 1000
                        },
                        {
                            x: 'Jul',
                            y: 2100
                        },
                        {
                            x: 'Aug',
                            y: 1200
                        },
                        {
                            x: 'Sep',
                            y: 1800
                        },
                        {
                            x: 'Oct',
                            y: 2000
                        }
                    ]
                },
                {
                    type: 'line',
                    name: 'Team A Median',
                    data: [
                        {
                            x: 'Jan',
                            y: 3300
                        },
                        {
                            x: 'Feb',
                            y: 4900
                        },
                        {
                            x: 'Mar',
                            y: 4300
                        },
                        {
                            x: 'Apr',
                            y: 3700
                        },
                        {
                            x: 'May',
                            y: 5500
                        },
                        {
                            x: 'Jun',
                            y: 5900
                        },
                        {
                            x: 'Jul',
                            y: 4500
                        },
                        {
                            x: 'Aug',
                            y: 2400
                        },
                        {
                            x: 'Sep',
                            y: 2100
                        },
                        {
                            x: 'Oct',
                            y: 1500
                        }
                    ]
                }
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'rangeArea',
                    animations: {
                        speed: 500
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ['#7971d2', '#26c2ff', '#7971d2', '#26c2ff'],
                dataLabels: {
                    enabled: false
                },
                fill: {
                    opacity: [0.24, 0.24, 1, 1]
                },
                forecastDataPoints: {
                    count: 2
                },
                stroke: {
                    curve: 'straight',
                    width: [0, 0, 2, 2]
                },
                legend: {
                    show: true,
                    customLegendItems: ['Team B', 'Team A'],
                    inverseOrder: true
                },
                title: {
                    text: 'Range Area with Forecast Line (Combo)',
                    style: {
                        color: '#8c9097'
                    },
                },
                markers: {
                    hover: {
                        sizeOffset: 5
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="rangeArea" height={350} />

        );
    }
}


//Timeline Chart

export class Basictimeline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    data: [
                        {
                            x: 'Code',
                            y: [
                                new Date('2019-03-02').getTime(),
                                new Date('2019-03-04').getTime()
                            ]
                        },
                        {
                            x: 'Test',
                            y: [
                                new Date('2019-03-04').getTime(),
                                new Date('2019-03-08').getTime()
                            ]
                        },
                        {
                            x: 'Validation',
                            y: [
                                new Date('2019-03-08').getTime(),
                                new Date('2019-03-12').getTime()
                            ]
                        },
                        {
                            x: 'Deployment',
                            y: [
                                new Date('2019-03-12').getTime(),
                                new Date('2019-03-18').getTime()
                            ]
                        }
                    ]
                }
            ],
            options: {
                chart: {
                    height: 320,
                    type: 'rangeBar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },

                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                plotOptions: {
                    bar: {
                        horizontal: true
                    }
                },
                colors: ["#7971d2"],
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="rangeBar" height={350} />

        );
    }
}

//
export class Multiplecolored extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    data: [
                        {
                            x: 'Analysis',
                            y: [
                                new Date('2019-02-27').getTime(),
                                new Date('2019-03-04').getTime()
                            ],
                            fillColor: '#7971d2'
                        },
                        {
                            x: 'Design',
                            y: [
                                new Date('2019-03-04').getTime(),
                                new Date('2019-03-08').getTime()
                            ],
                            fillColor: '#26c2ff'
                        },
                        {
                            x: 'Coding',
                            y: [
                                new Date('2019-03-07').getTime(),
                                new Date('2019-03-10').getTime()
                            ],
                            fillColor: '#f5b849'
                        },
                        {
                            x: 'Testing',
                            y: [
                                new Date('2019-03-08').getTime(),
                                new Date('2019-03-12').getTime()
                            ],
                            fillColor: '#49b6f5'
                        },
                        {
                            x: 'Deployment',
                            y: [
                                new Date('2019-03-12').getTime(),
                                new Date('2019-03-17').getTime()
                            ],
                            fillColor: '#e6533c'
                        }
                    ]
                }
            ],
            options: {
                chart: {
                    height: 320,
                    type: 'rangeBar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        distributed: true,
                        dataLabels: {
                            hideOverflowingLabels: false
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: (val, opts) => {
                        const label = opts.w.globals.labels[opts.dataPointIndex];
                        const a = moment(val[0]);
                        const b = moment(val[1]);
                        const diff = b.diff(a, 'days');
                        return label + ': ' + diff + (diff > 1 ? ' days' : ' day');
                    },
                    style: {
                        colors: ['#f3f4f5', '#fff']
                    }
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    show: false
                },
                grid: {
                    borderColor: '#f2f5f7',
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="rangeBar" height={320} />

        );
    }
}

//
export class Advancedmultirange extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    name: 'Bob',
                    data: [
                        {
                            x: 'Design',
                            y: [
                                new Date('2019-03-05').getTime(),
                                new Date('2019-03-08').getTime()
                            ]
                        },
                        {
                            x: 'Code',
                            y: [
                                new Date('2019-03-02').getTime(),
                                new Date('2019-03-05').getTime()
                            ]
                        },
                        {
                            x: 'Code',
                            y: [
                                new Date('2019-03-05').getTime(),
                                new Date('2019-03-07').getTime()
                            ]
                        },
                        {
                            x: 'Test',
                            y: [
                                new Date('2019-03-03').getTime(),
                                new Date('2019-03-09').getTime()
                            ]
                        },
                        {
                            x: 'Test',
                            y: [
                                new Date('2019-03-08').getTime(),
                                new Date('2019-03-11').getTime()
                            ]
                        },
                        {
                            x: 'Validation',
                            y: [
                                new Date('2019-03-11').getTime(),
                                new Date('2019-03-16').getTime()
                            ]
                        },
                        {
                            x: 'Design',
                            y: [
                                new Date('2019-03-01').getTime(),
                                new Date('2019-03-03').getTime()
                            ],
                        }
                    ]
                },
                {
                    name: 'Joe',
                    data: [
                        {
                            x: 'Design',
                            y: [
                                new Date('2019-03-02').getTime(),
                                new Date('2019-03-05').getTime()
                            ]
                        },
                        {
                            x: 'Test',
                            y: [
                                new Date('2019-03-06').getTime(),
                                new Date('2019-03-16').getTime()
                            ],
                            goals: [
                                {
                                    name: 'Break',
                                    value: new Date('2019-03-10').getTime(),
                                    strokeColor: '#CD2F2A'
                                }
                            ]
                        },
                        {
                            x: 'Code',
                            y: [
                                new Date('2019-03-03').getTime(),
                                new Date('2019-03-07').getTime()
                            ]
                        },
                        {
                            x: 'Deployment',
                            y: [
                                new Date('2019-03-20').getTime(),
                                new Date('2019-03-22').getTime()
                            ]
                        },
                        {
                            x: 'Design',
                            y: [
                                new Date('2019-03-10').getTime(),
                                new Date('2019-03-16').getTime()
                            ]
                        }
                    ]
                },
                {
                    name: 'Dan',
                    data: [
                        {
                            x: 'Code',
                            y: [
                                new Date('2019-03-10').getTime(),
                                new Date('2019-03-17').getTime()
                            ]
                        },
                        {
                            x: 'Validation',
                            y: [
                                new Date('2019-03-05').getTime(),
                                new Date('2019-03-09').getTime()
                            ],
                            goals: [
                                {
                                    name: 'Break',
                                    value: new Date('2019-03-07').getTime(),
                                    strokeColor: '#CD2F2A'
                                }
                            ]
                        },
                    ]
                }
            ],
            options: {
                chart: {
                    height: 320,
                    type: 'rangeBar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        barHeight: '80%'
                    }
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849"],
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                stroke: {
                    width: 1
                },
                fill: {
                    type: 'solid',
                    opacity: 0.6
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'center'
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="rangeBar" height={320} />

        );
    }
}

//
export class Timelinegrouped extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                // George Washington
                {
                    name: 'George Washington',
                    data: [
                        {
                            x: 'President',
                            y: [
                                new Date(1789, 3, 30).getTime(),
                                new Date(1797, 2, 4).getTime()
                            ]
                        },
                    ]
                },
                // John Adams
                {
                    name: 'John Adams',
                    data: [
                        {
                            x: 'President',
                            y: [
                                new Date(1797, 2, 4).getTime(),
                                new Date(1801, 2, 4).getTime()
                            ]
                        },
                        {
                            x: 'Vice President',
                            y: [
                                new Date(1789, 3, 21).getTime(),
                                new Date(1797, 2, 4).getTime()
                            ]
                        }
                    ]
                },
                // Thomas Jefferson
                {
                    name: 'Thomas Jefferson',
                    data: [
                        {
                            x: 'President',
                            y: [
                                new Date(1801, 2, 4).getTime(),
                                new Date(1809, 2, 4).getTime()
                            ]
                        },
                        {
                            x: 'Vice President',
                            y: [
                                new Date(1797, 2, 4).getTime(),
                                new Date(1801, 2, 4).getTime()
                            ]
                        },
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1790, 2, 22).getTime(),
                                new Date(1793, 11, 31).getTime()
                            ]
                        }
                    ]
                },
                // Aaron Burr
                {
                    name: 'Aaron Burr',
                    data: [
                        {
                            x: 'Vice President',
                            y: [
                                new Date(1801, 2, 4).getTime(),
                                new Date(1805, 2, 4).getTime()
                            ]
                        }
                    ]
                },
                // George Clinton
                {
                    name: 'George Clinton',
                    data: [
                        {
                            x: 'Vice President',
                            y: [
                                new Date(1805, 2, 4).getTime(),
                                new Date(1812, 3, 20).getTime()
                            ]
                        }
                    ]
                },
                // John Jay
                {
                    name: 'John Jay',
                    data: [
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1789, 8, 25).getTime(),
                                new Date(1790, 2, 22).getTime()
                            ]
                        }
                    ]
                },
                // Edmund Randolph
                {
                    name: 'Edmund Randolph',
                    data: [
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1794, 0, 2).getTime(),
                                new Date(1795, 7, 20).getTime()
                            ]
                        }
                    ]
                },
                // Timothy Pickering
                {
                    name: 'Timothy Pickering',
                    data: [
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1795, 7, 20).getTime(),
                                new Date(1800, 4, 12).getTime()
                            ]
                        }
                    ]
                },
                // Charles Lee
                {
                    name: 'Charles Lee',
                    data: [
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1800, 4, 13).getTime(),
                                new Date(1800, 5, 5).getTime()
                            ]
                        }
                    ]
                },
                // John Marshall
                {
                    name: 'John Marshall',
                    data: [
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1800, 5, 13).getTime(),
                                new Date(1801, 2, 4).getTime()
                            ]
                        }
                    ]
                },
                // Levi Lincoln
                {
                    name: 'Levi Lincoln',
                    data: [
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1801, 2, 5).getTime(),
                                new Date(1801, 4, 1).getTime()
                            ]
                        }
                    ]
                },
                // James Madison
                {
                    name: 'James Madison',
                    data: [
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1801, 4, 2).getTime(),
                                new Date(1809, 2, 3).getTime()
                            ]
                        }
                    ]
                },
            ],
            options: {
                chart: {
                    height: 320,
                    type: 'rangeBar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        barHeight: '50%',
                        rangeBarGroupRows: true
                    }
                },
                colors: [
                    "#7971d2", "#26c2ff", "#f5b849", "#e6533c", "#5b67c7",
                    "#3F51B5", "#546E7A", "#D4526E", "#8D5B4C", "#F86624",
                    "#D7263D", "#1B998B", "#2E294E", "#F46036", "#E2C044"
                ],
                grid: {
                    borderColor: '#f2f5f7',
                },
                fill: {
                    type: 'solid'
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                },
                legend: {
                    position: 'right'
                },
                tooltip: {
                    // custom: function (opts) {
                    //     const fromYear = new Date(opts.y1).getFullYear()
                    //     const toYear = new Date(opts.y2).getFullYear()
                    //     const values = opts.ctx.rangeBar.getTooltipValues(opts)

                    //     return (
                    //         ''
                    //     )
                    // }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="rangeBar" height={320} />

        );
    }
}

//
export class Timelinegrouped1 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    name: 'Bob',
                    data: [
                        {
                            x: 'Design',
                            y: [
                                new Date('2019-03-05').getTime(),
                                new Date('2019-03-08').getTime()
                            ]
                        },
                        {
                            x: 'Code',
                            y: [
                                new Date('2019-03-08').getTime(),
                                new Date('2019-03-11').getTime()
                            ]
                        },
                        {
                            x: 'Test',
                            y: [
                                new Date('2019-03-11').getTime(),
                                new Date('2019-03-16').getTime()
                            ]
                        }
                    ]
                },
                {
                    name: 'Joe',
                    data: [
                        {
                            x: 'Design',
                            y: [
                                new Date('2019-03-02').getTime(),
                                new Date('2019-03-05').getTime()
                            ]
                        },
                        {
                            x: 'Code',
                            y: [
                                new Date('2019-03-06').getTime(),
                                new Date('2019-03-09').getTime()
                            ]
                        },
                        {
                            x: 'Test',
                            y: [
                                new Date('2019-03-10').getTime(),
                                new Date('2019-03-19').getTime()
                            ]
                        }
                    ]
                }
            ],
            options: {
                chart: {
                    height: 320,
                    type: 'rangeBar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: true
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: (val, opts) => {
                        const label = opts.w.globals.labels[opts.dataPointIndex];
                        const a = moment(val[0]);
                        const b = moment(val[1]);
                        const diff = b.diff(a, 'days');
                        return label + ': ' + diff + (diff > 1 ? ' days' : ' day');
                    },
                },
                colors: ["#7971d2", "#26c2ff"],
                grid: {
                    borderColor: '#f2f5f7',
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: 'vertical',
                        shadeIntensity: 0.25,
                        gradientToColors: undefined,
                        inverseColors: true,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [50, 0, 100, 100]
                    }
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                },
                legend: {
                    position: 'top'
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="rangeBar" height={320} />

        );
    }
}

//Candle stick chart

// export class Basiccandlestick extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             series: [{
//                 data: [{
//                     x: new Date(1538778600000),
//                     y: [6629.81, 6650.5, 6623.04, 6633.33]
//                 },
//                 {
//                     x: new Date(1538780400000),
//                     y: [6632.01, 6643.59, 6620, 6630.11]
//                 },
//                 {
//                     x: new Date(1538782200000),
//                     y: [6630.71, 6648.95, 6623.34, 6635.65]
//                 },
//                 {
//                     x: new Date(1538784000000),
//                     y: [6635.65, 6651, 6629.67, 6638.24]
//                 },
//                 {
//                     x: new Date(1538785800000),
//                     y: [6638.24, 6640, 6620, 6624.47]
//                 },
//                 {
//                     x: new Date(1538787600000),
//                     y: [6624.53, 6636.03, 6621.68, 6624.31]
//                 },
//                 {
//                     x: new Date(1538789400000),
//                     y: [6624.61, 6632.2, 6617, 6626.02]
//                 },
//                 {
//                     x: new Date(1538791200000),
//                     y: [6627, 6627.62, 6584.22, 6603.02]
//                 },
//                 {
//                     x: new Date(1538793000000),
//                     y: [6605, 6608.03, 6598.95, 6604.01]
//                 },
//                 {
//                     x: new Date(1538794800000),
//                     y: [6604.5, 6614.4, 6602.26, 6608.02]
//                 },
//                 {
//                     x: new Date(1538796600000),
//                     y: [6608.02, 6610.68, 6601.99, 6608.91]
//                 },
//                 {
//                     x: new Date(1538798400000),
//                     y: [6608.91, 6618.99, 6608.01, 6612]
//                 },
//                 {
//                     x: new Date(1538800200000),
//                     y: [6612, 6615.13, 6605.09, 6612]
//                 },
//                 {
//                     x: new Date(1538802000000),
//                     y: [6612, 6624.12, 6608.43, 6622.95]
//                 },
//                 {
//                     x: new Date(1538803800000),
//                     y: [6623.91, 6623.91, 6615, 6615.67]
//                 },
//                 {
//                     x: new Date(1538805600000),
//                     y: [6618.69, 6618.74, 6610, 6610.4]
//                 },
//                 {
//                     x: new Date(1538807400000),
//                     y: [6611, 6622.78, 6610.4, 6614.9]
//                 },
//                 {
//                     x: new Date(1538809200000),
//                     y: [6614.9, 6626.2, 6613.33, 6623.45]
//                 },
//                 {
//                     x: new Date(1538811000000),
//                     y: [6623.48, 6627, 6618.38, 6620.35]
//                 },
//                 {
//                     x: new Date(1538812800000),
//                     y: [6619.43, 6620.35, 6610.05, 6615.53]
//                 },
//                 {
//                     x: new Date(1538814600000),
//                     y: [6615.53, 6617.93, 6610, 6615.19]
//                 },
//                 {
//                     x: new Date(1538816400000),
//                     y: [6615.19, 6621.6, 6608.2, 6620]
//                 },
//                 {
//                     x: new Date(1538818200000),
//                     y: [6619.54, 6625.17, 6614.15, 6620]
//                 },
//                 {
//                     x: new Date(1538820000000),
//                     y: [6620.33, 6634.15, 6617.24, 6624.61]
//                 },
//                 {
//                     x: new Date(1538821800000),
//                     y: [6625.95, 6626, 6611.66, 6617.58]
//                 },
//                 {
//                     x: new Date(1538823600000),
//                     y: [6619, 6625.97, 6595.27, 6598.86]
//                 },
//                 {
//                     x: new Date(1538825400000),
//                     y: [6598.86, 6598.88, 6570, 6587.16]
//                 },
//                 {
//                     x: new Date(1538827200000),
//                     y: [6588.86, 6600, 6580, 6593.4]
//                 },
//                 {
//                     x: new Date(1538829000000),
//                     y: [6593.99, 6598.89, 6585, 6587.81]
//                 },
//                 {
//                     x: new Date(1538830800000),
//                     y: [6587.81, 6592.73, 6567.14, 6578]
//                 },
//                 {
//                     x: new Date(1538832600000),
//                     y: [6578.35, 6581.72, 6567.39, 6579]
//                 },
//                 {
//                     x: new Date(1538834400000),
//                     y: [6579.38, 6580.92, 6566.77, 6575.96]
//                 },
//                 {
//                     x: new Date(1538836200000),
//                     y: [6575.96, 6589, 6571.77, 6588.92]
//                 },
//                 {
//                     x: new Date(1538838000000),
//                     y: [6588.92, 6594, 6577.55, 6589.22]
//                 },
//                 {
//                     x: new Date(1538839800000),
//                     y: [6589.3, 6598.89, 6589.1, 6596.08]
//                 },
//                 {
//                     x: new Date(1538841600000),
//                     y: [6597.5, 6600, 6588.39, 6596.25]
//                 },
//                 {
//                     x: new Date(1538843400000),
//                     y: [6598.03, 6600, 6588.73, 6595.97]
//                 },
//                 {
//                     x: new Date(1538845200000),
//                     y: [6595.97, 6602.01, 6588.17, 6602]
//                 },
//                 {
//                     x: new Date(1538847000000),
//                     y: [6602, 6607, 6596.51, 6599.95]
//                 },
//                 {
//                     x: new Date(1538848800000),
//                     y: [6600.63, 6601.21, 6590.39, 6591.02]
//                 },
//                 {
//                     x: new Date(1538850600000),
//                     y: [6591.02, 6603.08, 6591, 6591]
//                 },
//                 {
//                     x: new Date(1538852400000),
//                     y: [6591, 6601.32, 6585, 6592]
//                 },
//                 {
//                     x: new Date(1538854200000),
//                     y: [6593.13, 6596.01, 6590, 6593.34]
//                 },
//                 {
//                     x: new Date(1538856000000),
//                     y: [6593.34, 6604.76, 6582.63, 6593.86]
//                 },
//                 {
//                     x: new Date(1538857800000),
//                     y: [6593.86, 6604.28, 6586.57, 6600.01]
//                 },
//                 {
//                     x: new Date(1538859600000),
//                     y: [6601.81, 6603.21, 6592.78, 6596.25]
//                 },
//                 {
//                     x: new Date(1538861400000),
//                     y: [6596.25, 6604.2, 6590, 6602.99]
//                 },
//                 {
//                     x: new Date(1538863200000),
//                     y: [6602.99, 6606, 6584.99, 6587.81]
//                 },
//                 {
//                     x: new Date(1538865000000),
//                     y: [6587.81, 6595, 6583.27, 6591.96]
//                 },
//                 {
//                     x: new Date(1538866800000),
//                     y: [6591.97, 6596.07, 6585, 6588.39]
//                 },
//                 {
//                     x: new Date(1538868600000),
//                     y: [6587.6, 6598.21, 6587.6, 6594.27]
//                 },
//                 {
//                     x: new Date(1538870400000),
//                     y: [6596.44, 6601, 6590, 6596.55]
//                 },
//                 {
//                     x: new Date(1538872200000),
//                     y: [6598.91, 6605, 6596.61, 6600.02]
//                 },
//                 {
//                     x: new Date(1538874000000),
//                     y: [6600.55, 6605, 6589.14, 6593.01]
//                 },
//                 {
//                     x: new Date(1538875800000),
//                     y: [6593.15, 6605, 6592, 6603.06]
//                 },
//                 {
//                     x: new Date(1538877600000),
//                     y: [6603.07, 6604.5, 6599.09, 6603.89]
//                 },
//                 {
//                     x: new Date(1538879400000),
//                     y: [6604.44, 6604.44, 6600, 6603.5]
//                 },
//                 {
//                     x: new Date(1538881200000),
//                     y: [6603.5, 6603.99, 6597.5, 6603.86]
//                 },
//                 {
//                     x: new Date(1538883000000),
//                     y: [6603.85, 6605, 6600, 6604.07]
//                 },
//                 {
//                     x: new Date(1538884800000),
//                     y: [6604.98, 6606, 6604.07, 6606]
//                 },
//                 ]
//             }],
//             options: {
//                 chart: {
//                     type: 'candlestick',
//                     height: 350,
//                     events: {
//                         mounted: (chart) => {
//                           chart.windowResizeHandler();
//                         }
//                       },
//                 },
//                 title: {
//                     text: 'CandleStick Chart',
//                     align: 'left',
//                     style: {
//                         color: "#8c9097",
//                         fontSize: '13px',
//                         fontWeight: 'bold',
//                     }
//                 },
//                 plotOptions: {
//                     candlestick: {
//                         colors: {
//                             upward: '#7971d2',
//                             downward: '#26c2ff'
//                         }
//                     }
//                 },
//                 grid: {
//                     borderColor: '#f2f5f7',
//                 },
//                 xaxis: {
//                     type: 'datetime',
//                     labels: {
//                         show: true,
//                         style: {
//                             colors: "#8c9097",
//                             fontSize: '11px',
//                             fontWeight: 600,
//                             cssClass: 'apexcharts-xaxis-label',
//                         },
//                     }
//                 },
//                 yaxis: {
//                     tooltip: {
//                         enabled: true
//                     },
//                     labels: {
//                         show: true,
//                         style: {
//                             colors: "#8c9097",
//                             fontSize: '11px',
//                             fontWeight: 600,
//                             cssClass: 'apexcharts-yaxis-label',
//                         },
//                     }
//                 }
//             }

//         };
//     }

//     render() {
//         return (
//             <ReactApexChart options={this.state.options} series={this.state.series} type="candlestick" height={350} />

//         );
//     }
// }

const seriesData = [{
    x: new Date(2016, 0o1, 0o1),
    y: [51.98, 56.29, 51.59, 53.85]
},
{
    x: new Date(2016, 0o2, 0o1),
    y: [53.66, 54.99, 51.35, 52.95]
},
{
    x: new Date(2016, 0o3, 0o1),
    y: [52.96, 53.78, 51.54, 52.48]
},
{
    x: new Date(2016, 0o4, 0o1),
    y: [52.54, 52.79, 47.88, 49.24]
},
{
    x: new Date(2016, 0o5, 0o1),
    y: [49.10, 52.86, 47.70, 52.78]
},
{
    x: new Date(2016, 0o6, 0o1),
    y: [52.83, 53.48, 50.32, 52.29]
},
{
    x: new Date(2016, 0o7, 0o1),
    y: [52.20, 54.48, 51.64, 52.58]
},
{
    x: new Date(2016, 8, 0o1),
    y: [52.76, 57.35, 52.15, 57.03]
},
{
    x: new Date(2016, 9, 0o1),
    y: [57.04, 58.15, 48.88, 56.19]
},
{
    x: new Date(2016, 10, 0o1),
    y: [56.09, 58.85, 55.48, 58.79]
},
{
    x: new Date(2016, 11, 0o1),
    y: [58.78, 59.65, 58.23, 59.05]
},
{
    x: new Date(2017, 0o0, 0o1),
    y: [59.37, 61.11, 59.35, 60.34]
},
{
    x: new Date(2017, 0o1, 0o1),
    y: [60.40, 60.52, 56.71, 56.93]
},
{
    x: new Date(2017, 0o2, 0o1),
    y: [57.02, 59.71, 56.04, 56.82]
},
{
    x: new Date(2017, 0o3, 0o1),
    y: [56.97, 59.62, 54.77, 59.30]
},
{
    x: new Date(2017, 0o4, 0o1),
    y: [59.11, 62.29, 59.10, 59.85]
},
{
    x: new Date(2017, 0o5, 0o1),
    y: [59.97, 60.11, 55.66, 58.42]
},
{
    x: new Date(2017, 0o6, 0o1),
    y: [58.34, 60.93, 56.75, 57.42]
},
{
    x: new Date(2017, 0o7, 0o1),
    y: [57.76, 58.08, 51.18, 54.71]
},
{
    x: new Date(2017, 8, 0o1),
    y: [54.80, 61.42, 53.18, 57.35]
},
{
    x: new Date(2017, 9, 0o1),
    y: [57.56, 63.09, 57.00, 62.99]
},
{
    x: new Date(2017, 10, 0o1),
    y: [62.89, 63.42, 59.72, 61.76]
},
{
    x: new Date(2017, 11, 0o1),
    y: [61.71, 64.15, 61.29, 63.04]
}
];

const seriesDataLinear = [{
    x: new Date(2016, 0o1, 0o1),
    y: 3.85
},
{
    x: new Date(2016, 0o2, 0o1),
    y: 2.95
},
{
    x: new Date(2016, 0o3, 0o1),
    y: -12.48
},
{
    x: new Date(2016, 0o4, 0o1),
    y: 19.24
},
{
    x: new Date(2016, 0o5, 0o1),
    y: 12.78
},
{
    x: new Date(2016, 0o6, 0o1),
    y: 22.29
},
{
    x: new Date(2016, 0o7, 0o1),
    y: -12.58
},
{
    x: new Date(2016, 8, 0o1),
    y: -17.03
},
{
    x: new Date(2016, 9, 0o1),
    y: -19.19
},
{
    x: new Date(2016, 10, 0o1),
    y: -28.79
},
{
    x: new Date(2016, 11, 0o1),
    y: -39.05
},
{
    x: new Date(2017, 0o0, 0o1),
    y: 20.34
},
{
    x: new Date(2017, 0o1, 0o1),
    y: 36.93
},
{
    x: new Date(2017, 0o2, 0o1),
    y: 36.82
},
{
    x: new Date(2017, 0o3, 0o1),
    y: 29.30
},
{
    x: new Date(2017, 0o4, 0o1),
    y: 39.85
},
{
    x: new Date(2017, 0o5, 0o1),
    y: 28.42
},
{
    x: new Date(2017, 0o6, 0o1),
    y: 37.42
},
{
    x: new Date(2017, 0o7, 0o1),
    y: 24.71
},
{
    x: new Date(2017, 8, 0o1),
    y: 37.35
},
{
    x: new Date(2017, 9, 0o1),
    y: 32.99
},
{
    x: new Date(2017, 10, 0o1),
    y: 31.76
},
{
    x: new Date(2017, 11, 0o1),
    y: 43.04
}
];

// Candlebrush
export class Candlebrush extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                data: seriesData
            }],
            options: {
                chart: {
                    type: 'candlestick',
                    height: 215,
                    id: 'candles',
                    toolbar: {
                        autoSelected: 'pan',
                        show: false
                    },
                    zoom: {
                        enabled: false
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                plotOptions: {
                    candlestick: {
                        colors: {
                            upward: '#7971d2',
                            downward: '#26c2ff'
                        }
                    }
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

            seriesBar: [{
                name: 'volume',
                data: seriesDataLinear
            }],
            optionsBar: {
                chart: {
                    height: 120,
                    type: 'bar',
                    brush: {
                        enabled: true,
                        target: 'candles'
                    },

                    selection: {
                        enabled: true,
                        xaxis: {
                            min: new Date('20 Jan 2017').getTime(),
                            max: new Date('10 Dec 2017').getTime()
                        },
                        fill: {
                            color: '#ccc',
                            opacity: 0.4
                        },
                        stroke: {
                            color: '#0D47A1',
                        }
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                dataLabels: {
                    enabled: false
                },
                plotOptions: {
                    bar: {
                        columnWidth: '80%',
                        colors: {
                            ranges: [{
                                from: -1000,
                                to: 0,
                                color: '#f5b849'
                            }, {
                                from: 1,
                                to: 10000,
                                color: '#e6533c'
                            }],

                        },
                    }
                },
                stroke: {
                    width: 0
                },
                xaxis: {
                    type: 'datetime',
                    axisBorder: {
                        offsetX: 13
                    },
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: false
                    },
                    style: {
                        colors: "#8c9097",
                        fontSize: '11px',
                        fontWeight: 600,
                        cssClass: 'apexcharts-yaxis-label',
                    },
                }
            },

        };
    }
    render() {
        return (
            <div className="chart-box">
                <div id="chart-candlestick">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="candlestick" height={215} />
                </div>
                <div id="chart-bar">
                    <ReactApexChart options={this.state.optionsBar} series={this.state.seriesBar} type="bar" height={120} />
                </div>
            </div>

        );
    }
}

// Candlexaxis
export class Candlexaxis extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                data: seriesData
            }],
            options: {
                chart: {
                    type: 'candlestick',
                    height: 215,
                    id: 'candles',
                    toolbar: {
                        autoSelected: 'pan',
                        show: false
                    },
                    zoom: {
                        enabled: false
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                plotOptions: {
                    candlestick: {
                        colors: {
                            upward: '#7971d2',
                            downward: '#26c2ff'
                        }
                    }
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

        };
    }
    render() {
        return (
            <div className="chart-box">
                <div id="chart-candlestick">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="candlestick" height={215} />
                </div>
            </div>

        );
    }
}

// Candleline
export class Candleline extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [{
                name: 'line',
                type: 'line',
                data: [
                    {
                        x: new Date(1538778600000),
                        y: 6604
                    }, {
                        x: new Date(1538782200000),
                        y: 6602
                    }, {
                        x: new Date(1538814600000),
                        y: 6607
                    }, {
                        x: new Date(1538884800000),
                        y: 6620
                    }
                ]
            }, {
                name: 'candle',
                type: 'candlestick',
                data: [
                    {
                        x: new Date(1538778600000),
                        y: [6629.81, 6650.5, 6623.04, 6633.33]
                    },
                    {
                        x: new Date(1538780400000),
                        y: [6632.01, 6643.59, 6620, 6630.11]
                    },
                    {
                        x: new Date(1538782200000),
                        y: [6630.71, 6648.95, 6623.34, 6635.65]
                    },
                    {
                        x: new Date(1538784000000),
                        y: [6635.65, 6651, 6629.67, 6638.24]
                    },
                    {
                        x: new Date(1538785800000),
                        y: [6638.24, 6640, 6620, 6624.47]
                    },
                    {
                        x: new Date(1538787600000),
                        y: [6624.53, 6636.03, 6621.68, 6624.31]
                    },
                    {
                        x: new Date(1538789400000),
                        y: [6624.61, 6632.2, 6617, 6626.02]
                    },
                    {
                        x: new Date(1538791200000),
                        y: [6627, 6627.62, 6584.22, 6603.02]
                    },
                    {
                        x: new Date(1538793000000),
                        y: [6605, 6608.03, 6598.95, 6604.01]
                    },
                    {
                        x: new Date(1538794800000),
                        y: [6604.5, 6614.4, 6602.26, 6608.02]
                    },
                    {
                        x: new Date(1538796600000),
                        y: [6608.02, 6610.68, 6601.99, 6608.91]
                    },
                    {
                        x: new Date(1538798400000),
                        y: [6608.91, 6618.99, 6608.01, 6612]
                    },
                    {
                        x: new Date(1538800200000),
                        y: [6612, 6615.13, 6605.09, 6612]
                    },
                    {
                        x: new Date(1538802000000),
                        y: [6612, 6624.12, 6608.43, 6622.95]
                    },
                    {
                        x: new Date(1538803800000),
                        y: [6623.91, 6623.91, 6615, 6615.67]
                    },
                    {
                        x: new Date(1538805600000),
                        y: [6618.69, 6618.74, 6610, 6610.4]
                    },
                    {
                        x: new Date(1538807400000),
                        y: [6611, 6622.78, 6610.4, 6614.9]
                    },
                    {
                        x: new Date(1538809200000),
                        y: [6614.9, 6626.2, 6613.33, 6623.45]
                    },
                    {
                        x: new Date(1538811000000),
                        y: [6623.48, 6627, 6618.38, 6620.35]
                    },
                    {
                        x: new Date(1538812800000),
                        y: [6619.43, 6620.35, 6610.05, 6615.53]
                    },
                    {
                        x: new Date(1538814600000),
                        y: [6615.53, 6617.93, 6610, 6615.19]
                    },
                    {
                        x: new Date(1538816400000),
                        y: [6615.19, 6621.6, 6608.2, 6620]
                    },
                    {
                        x: new Date(1538818200000),
                        y: [6619.54, 6625.17, 6614.15, 6620]
                    },
                    {
                        x: new Date(1538820000000),
                        y: [6620.33, 6634.15, 6617.24, 6624.61]
                    },
                    {
                        x: new Date(1538821800000),
                        y: [6625.95, 6626, 6611.66, 6617.58]
                    },
                    {
                        x: new Date(1538823600000),
                        y: [6619, 6625.97, 6595.27, 6598.86]
                    },
                    {
                        x: new Date(1538825400000),
                        y: [6598.86, 6598.88, 6570, 6587.16]
                    },
                    {
                        x: new Date(1538827200000),
                        y: [6588.86, 6600, 6580, 6593.4]
                    },
                    {
                        x: new Date(1538829000000),
                        y: [6593.99, 6598.89, 6585, 6587.81]
                    },
                    {
                        x: new Date(1538830800000),
                        y: [6587.81, 6592.73, 6567.14, 6578]
                    },
                    {
                        x: new Date(1538832600000),
                        y: [6578.35, 6581.72, 6567.39, 6579]
                    },
                    {
                        x: new Date(1538834400000),
                        y: [6579.38, 6580.92, 6566.77, 6575.96]
                    },
                    {
                        x: new Date(1538836200000),
                        y: [6575.96, 6589, 6571.77, 6588.92]
                    },
                    {
                        x: new Date(1538838000000),
                        y: [6588.92, 6594, 6577.55, 6589.22]
                    },
                    {
                        x: new Date(1538839800000),
                        y: [6589.3, 6598.89, 6589.1, 6596.08]
                    },
                    {
                        x: new Date(1538841600000),
                        y: [6597.5, 6600, 6588.39, 6596.25]
                    },
                    {
                        x: new Date(1538843400000),
                        y: [6598.03, 6600, 6588.73, 6595.97]
                    },
                    {
                        x: new Date(1538845200000),
                        y: [6595.97, 6602.01, 6588.17, 6602]
                    },
                    {
                        x: new Date(1538847000000),
                        y: [6602, 6607, 6596.51, 6599.95]
                    },
                    {
                        x: new Date(1538848800000),
                        y: [6600.63, 6601.21, 6590.39, 6591.02]
                    },
                    {
                        x: new Date(1538850600000),
                        y: [6591.02, 6603.08, 6591, 6591]
                    },
                    {
                        x: new Date(1538852400000),
                        y: [6591, 6601.32, 6585, 6592]
                    },
                    {
                        x: new Date(1538854200000),
                        y: [6593.13, 6596.01, 6590, 6593.34]
                    },
                    {
                        x: new Date(1538856000000),
                        y: [6593.34, 6604.76, 6582.63, 6593.86]
                    },
                    {
                        x: new Date(1538857800000),
                        y: [6593.86, 6604.28, 6586.57, 6600.01]
                    },
                    {
                        x: new Date(1538859600000),
                        y: [6601.81, 6603.21, 6592.78, 6596.25]
                    },
                    {
                        x: new Date(1538861400000),
                        y: [6596.25, 6604.2, 6590, 6602.99]
                    },
                    {
                        x: new Date(1538863200000),
                        y: [6602.99, 6606, 6584.99, 6587.81]
                    },
                    {
                        x: new Date(1538865000000),
                        y: [6587.81, 6595, 6583.27, 6591.96]
                    },
                    {
                        x: new Date(1538866800000),
                        y: [6591.97, 6596.07, 6585, 6588.39]
                    },
                    {
                        x: new Date(1538868600000),
                        y: [6587.6, 6598.21, 6587.6, 6594.27]
                    },
                    {
                        x: new Date(1538870400000),
                        y: [6596.44, 6601, 6590, 6596.55]
                    },
                    {
                        x: new Date(1538872200000),
                        y: [6598.91, 6605, 6596.61, 6600.02]
                    },
                    {
                        x: new Date(1538874000000),
                        y: [6600.55, 6605, 6589.14, 6593.01]
                    },
                    {
                        x: new Date(1538875800000),
                        y: [6593.15, 6605, 6592, 6603.06]
                    },
                    {
                        x: new Date(1538877600000),
                        y: [6603.07, 6604.5, 6599.09, 6603.89]
                    },
                    {
                        x: new Date(1538879400000),
                        y: [6604.44, 6604.44, 6600, 6603.5]
                    },
                    {
                        x: new Date(1538881200000),
                        y: [6603.5, 6603.99, 6597.5, 6603.86]
                    },
                    {
                        x: new Date(1538883000000),
                        y: [6603.85, 6605, 6600, 6604.07]
                    },
                    {
                        x: new Date(1538884800000),
                        y: [6604.98, 6606, 6604.07, 6606]
                    },
                ]
            }],
            options: {
                chart: {
                    height: 350,
                    type: 'line',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                title: {
                    text: 'CandleStick Chart',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                stroke: {
                    width: [3, 1]
                },
                colors: ["#49b6f5"],
                tooltip: {
                    shared: true,
                    custom: [function ({ seriesIndex, dataPointIndex, w }) {
                        return w.globals.series[seriesIndex][dataPointIndex];
                    },
                        // function ({ seriesIndex, dataPointIndex, w }) {
                        //     var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex]
                        //     var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex]
                        //     var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex]
                        //     var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex]
                        //     return (
                        //         ''
                        //     )
                        // }
                    ]
                },
                plotOptions: {
                    candlestick: {
                        colors: {
                            upward: '#7971d2',
                            downward: '#26c2ff'
                        }
                    }
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            },

        };
    }
    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="candlestick" height={350} />

        );
    }
}

//Boxplot Chart

export class Basicboxplot extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    type: 'boxPlot',
                    data: [
                        {
                            x: 'Jan 2015',
                            y: [54, 66, 69, 75, 88]
                        },
                        {
                            x: 'Jan 2016',
                            y: [43, 65, 69, 76, 81]
                        },
                        {
                            x: 'Jan 2017',
                            y: [31, 39, 45, 51, 59]
                        },
                        {
                            x: 'Jan 2018',
                            y: [39, 46, 55, 65, 71]
                        },
                        {
                            x: 'Jan 2019',
                            y: [29, 31, 35, 39, 44]
                        },
                        {
                            x: 'Jan 2020',
                            y: [41, 49, 58, 61, 67]
                        },
                        {
                            x: 'Jan 2021',
                            y: [54, 59, 66, 71, 88]
                        }
                    ]
                }
            ],
            options: {
                chart: {
                    type: 'boxPlot',
                    height: 320,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                title: {
                    text: 'Basic BoxPlot Chart',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                plotOptions: {
                    boxPlot: {
                        colors: {
                            upper: '#7971d2',
                            lower: '#26c2ff'
                        }
                    }
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="boxPlot" height={320} />
            </div>
        );
    }
}

// Boxplotscatter
export class Boxplotscatter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    name: 'box',
                    type: 'boxPlot',
                    data: [
                        {
                            x: new Date('2017-01-01').getTime(),
                            y: [54, 66, 69, 75, 88]
                        },
                        {
                            x: new Date('2018-01-01').getTime(),
                            y: [43, 65, 69, 76, 81]
                        },
                        {
                            x: new Date('2019-01-01').getTime(),
                            y: [31, 39, 45, 51, 59]
                        },
                        {
                            x: new Date('2020-01-01').getTime(),
                            y: [39, 46, 55, 65, 71]
                        },
                        {
                            x: new Date('2021-01-01').getTime(),
                            y: [29, 31, 35, 39, 44]
                        }
                    ]
                },
                {
                    name: 'outliers',
                    type: 'scatter',
                    data: [
                        {
                            x: new Date('2017-01-01').getTime(),
                            y: 32
                        },
                        {
                            x: new Date('2018-01-01').getTime(),
                            y: 25
                        },
                        {
                            x: new Date('2019-01-01').getTime(),
                            y: 64
                        },
                        {
                            x: new Date('2020-01-01').getTime(),
                            y: 27
                        },
                        {
                            x: new Date('2020-01-01').getTime(),
                            y: 78
                        },
                        {
                            x: new Date('2021-01-01').getTime(),
                            y: 15
                        }
                    ]
                }
            ],
            options: {
                chart: {
                    type: 'boxPlot',
                    height: 320,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ['#7971d2', '#26c2ff'],
                grid: {
                    borderColor: '#f2f5f7',
                },
                title: {
                    text: 'BoxPlot - Scatter Chart',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                plotOptions: {
                    boxPlot: {
                        colors: {
                            upper: '#7971d2',
                            lower: '#26c2ff'
                        }
                    }
                },
                xaxis: {
                    type: 'datetime',
                    tooltip: {
                        formatter: function (val) {
                            return new Date(val).getFullYear().toString();
                        }
                    },
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                },
                tooltip: {
                    shared: false,
                    intersect: true
                }
            }

        };
    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="boxPlot" height={320} />
            </div>
        );
    }
}

// Boxplothorizontal
export class Boxplothorizontal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    data: [
                        {
                            x: 'Category A',
                            y: [54, 66, 69, 75, 88]
                        },
                        {
                            x: 'Category B',
                            y: [43, 65, 69, 76, 81]
                        },
                        {
                            x: 'Category C',
                            y: [31, 39, 45, 51, 59]
                        },
                        {
                            x: 'Category D',
                            y: [39, 46, 55, 65, 71]
                        },
                        {
                            x: 'Category E',
                            y: [29, 31, 35, 39, 44]
                        },
                        {
                            x: 'Category F',
                            y: [41, 49, 58, 61, 67]
                        },
                        {
                            x: 'Category G',
                            y: [54, 59, 66, 71, 88]
                        }
                    ]
                }
            ],
            options: {
                chart: {
                    type: 'boxPlot',
                    height: 320,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                title: {
                    text: 'Horizontal BoxPlot Chart',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        barHeight: '50%'
                    },
                    boxPlot: {
                        colors: {
                            upper: '#e9ecef',
                            lower: '#f8f9fa'
                        }
                    }
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                },
                stroke: {
                    colors: ['#6c757d']
                }
            }

        };
    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="boxPlot" height={320} />
            </div>
        );
    }
}

//Bubble Chart

function generateData(baseval, count, yrange) {
    let i = 0;
    const series = [];
    while (i < count) {
        const x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
        const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

        series.push([x, y, z]);
        baseval += 86400000;
        i++;
    }
    return series;
}

export class Simplebubble extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Bubble1',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'Bubble2',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'Bubble3',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'Bubble4',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'bubble',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                fill: {
                    opacity: 0.8
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                title: {
                    text: 'Simple Bubble Chart',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849"],
                xaxis: {
                    tickAmount: 12,
                    type: 'category',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    max: 70,
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bubble" height={350} />

        );
    }
}

//3dbubbles

export class Bubble3D extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Product1',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'Product2',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'Product3',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'Product4',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'bubble',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                fill: {
                    type: 'gradient',
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849"],
                title: {
                    text: '3D Bubble Chart',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                xaxis: {
                    tickAmount: 12,
                    type: 'datetime',
                    labels: {
                        rotate: 0,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    max: 70,
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                },
                theme: {
                    palette: 'palette2'
                }

            }
        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="bubble" height={350} />

        );
    }
}

//Scatter chart

export class Basicscatter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: "SAMPLE A",
                data: [
                    [16.4, 5.4], [21.7, 2], [25.4, 3], [19, 2], [10.9, 1], [13.6, 3.2], [10.9, 7.4], [10.9, 0], [10.9, 8.2], [16.4, 0], [16.4, 1.8], [13.6, 0.3], [13.6, 0], [29.9, 0], [27.1, 2.3], [16.4, 0], [13.6, 3.7], [10.9, 5.2], [16.4, 6.5], [10.9, 0], [24.5, 7.1], [10.9, 0], [8.1, 4.7], [19, 0], [21.7, 1.8], [27.1, 0], [24.5, 0], [27.1, 0], [29.9, 1.5], [27.1, 0.8], [22.1, 2]]
            }, {
                name: "SAMPLE B",
                data: [
                    [36.4, 13.4], [1.7, 11], [5.4, 8], [9, 17], [1.9, 4], [3.6, 12.2], [1.9, 14.4], [1.9, 9], [1.9, 13.2], [1.4, 7], [6.4, 8.8], [3.6, 4.3], [1.6, 10], [9.9, 2], [7.1, 15], [1.4, 0], [3.6, 13.7], [1.9, 15.2], [6.4, 16.5], [0.9, 10], [4.5, 17.1], [10.9, 10], [0.1, 14.7], [9, 10], [12.7, 11.8], [2.1, 10], [2.5, 10], [27.1, 10], [2.9, 11.5], [7.1, 10.8], [2.1, 12]]
            }, {
                name: "SAMPLE C",
                data: [
                    [21.7, 3], [23.6, 3.5], [24.6, 3], [29.9, 3], [21.7, 20], [23, 2], [10.9, 3], [28, 4], [27.1, 0.3], [16.4, 4], [13.6, 0], [19, 5], [22.4, 3], [24.5, 3], [32.6, 3], [27.1, 4], [29.6, 6], [31.6, 8], [21.6, 5], [20.9, 4], [22.4, 0], [32.6, 10.3], [29.7, 20.8], [24.5, 0.8], [21.4, 0], [21.7, 6.9], [28.6, 7.7], [15.4, 0], [18.1, 0], [33.4, 0], [16.4, 0]]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'scatter',
                    zoom: {
                        enabled: true,
                        type: 'xy'
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849"],
                xaxis: {
                    tickAmount: 10,
                    labels: {
                        // formatter: function (val) {
                        //     return parseFloat(val).toFixed(1);
                        // },
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    tickAmount: 7,
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="scatter" height={320} />

        );
    }
}

//Datetimescatter

function generateDayWiseTimeSeries3(baseval, count, yrange) {
    let i = 0;
    const series = [];
    while (i < count) {
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push([baseval, y]);
        baseval += 86400000;
        i++;
    }
    return series;
}

export class Datetimescatter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'TEAM 1',
                data: generateDayWiseTimeSeries3(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'TEAM 2',
                data: generateDayWiseTimeSeries3(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'TEAM 3',
                data: generateDayWiseTimeSeries3(new Date('11 Feb 2017 GMT').getTime(), 30, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'TEAM 4',
                data: generateDayWiseTimeSeries3(new Date('11 Feb 2017 GMT').getTime(), 10, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'TEAM 5',
                data: generateDayWiseTimeSeries3(new Date('11 Feb 2017 GMT').getTime(), 30, {
                    min: 10,
                    max: 60
                })
            },
            ],
            options: {
                chart: {
                    height: 320,
                    type: 'scatter',
                    zoom: {
                        type: 'xy'
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849", "#e6533c", "#49b6f5"],
                grid: {
                    borderColor: '#f2f5f7',
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    max: 70,
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="scatter" height={320} />

        );
    }
}

//Imagefillescatter

export class Imagefillescatter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Messenger',
                data: [
                    [16.4, 5.4],
                    [21.7, 4],
                    [25.4, 3],
                    [19, 2],
                    [10.9, 1],
                    [13.6, 3.2],
                    [10.9, 7],
                    [10.9, 8.2],
                    [16.4, 4],
                    [13.6, 4.3],
                    [13.6, 12],
                    [29.9, 3],
                    [10.9, 5.2],
                    [16.4, 6.5],
                    [10.9, 8],
                    [24.5, 7.1],
                    [10.9, 7],
                    [8.1, 4.7],
                    [19, 10],
                    [27.1, 10],
                    [24.5, 8],
                    [27.1, 3],
                    [29.9, 11.5],
                    [27.1, 0.8],
                    [22.1, 2]
                ]
            }, {
                name: 'Instagram',
                data: [
                    [6.4, 5.4],
                    [11.7, 4],
                    [15.4, 3],
                    [9, 2],
                    [10.9, 11],
                    [20.9, 7],
                    [12.9, 8.2],
                    [6.4, 14],
                    [11.6, 12]
                ]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'scatter',
                    animations: {
                        enabled: false,
                    },
                    zoom: {
                        enabled: false,
                    },
                    toolbar: {
                        show: false
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                colors: ['#056BF6', '#D2376A'],
                xaxis: {
                    tickAmount: 10,
                    min: 0,
                    max: 40,
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    tickAmount: 7,
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                },
                markers: {
                    size: 20
                },
                fill: {
                    type: 'image',
                    opacity: 1,
                    image: {
                        src: [ALLImages('face10'), ALLImages('face2')],
                        width: 40,
                        height: 40
                    }
                },
                legend: {
                    labels: {
                        useSeriesColors: true
                    },
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="scatter" height={320} />

        );
    }
}


//Heat map chart

function generateData3(count, yrange) {
    let i = 0;
    const series = [];
    while (i < count) {
        const x = 'w' + (i + 1).toString();
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push({
            x: x,
            y: y
        });
        i++;
    }
    return series;
}

export class Basiheatmap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Metric1',
                data: generateData3(18, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric2',
                data: generateData3(18, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric3',
                data: generateData3(18, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric4',
                data: generateData3(18, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric5',
                data: generateData3(18, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric6',
                data: generateData3(18, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric7',
                data: generateData3(18, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric8',
                data: generateData3(18, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric9',
                data: generateData3(18, {
                    min: 0,
                    max: 90
                })
            }
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'heatmap',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                colors: ["#7971d2"],
                grid: {
                    borderColor: '#f2f5f7',
                },
                title: {
                    text: 'HeatMap Chart (Single color)',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="heatmap" height={350} />

        );
    }
}

//Multiseriesheatmap

const data4 = [
    {
        name: 'W1',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W2',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W3',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W4',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W5',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W6',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W7',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W8',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W9',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W10',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W11',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W12',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W13',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W14',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    },
    {
        name: 'W15',
        data: generateData3(8, {
            min: 0,
            max: 90
        })
    }
];

data4.reverse();

const colors2 = ["#7971d2", "#F27036", "#663F59", "#6A6E94", "#4E88B4", "#00A7C6", "#18D8D8", '#A9D794', '#46AF78', '#A93F55', '#8C5E58', '#2176FF', '#33A1FD', '#7A918D', '#BAFF29'];

colors.reverse();

export class Multiseriesheatmap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: data4,
            options: {
                chart: {
                    height: 350,
                    type: 'heatmap',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                colors: colors2,
                xaxis: {
                    type: 'category',
                    categories: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '01:00', '01:30'],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                title: {
                    text: 'HeatMap Chart (Different color shades for each series)',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                grid: {
                    padding: {
                        right: 20
                    },
                    borderColor: '#f2f5f7',
                },

                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="heatmap" height={350} />

        );
    }
}

//color range
export class Colorrange extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Jan',
                data: generateData3(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Feb',
                data: generateData3(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Mar',
                data: generateData3(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Apr',
                data: generateData3(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'May',
                data: generateData3(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Jun',
                data: generateData3(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Jul',
                data: generateData3(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Aug',
                data: generateData3(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Sep',
                data: generateData3(20, {
                    min: -30,
                    max: 55
                })
            }
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'heatmap',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    heatmap: {
                        shadeIntensity: 0.5,
                        radius: 0,
                        useFillColorAsStroke: true,
                        colorScale: {
                            ranges: [{
                                from: -30,
                                to: 5,
                                name: 'low',
                                color: '#7971d2'
                            },
                            {
                                from: 6,
                                to: 20,
                                name: 'medium',
                                color: '#26c2ff'
                            },
                            {
                                from: 21,
                                to: 45,
                                name: 'high',
                                color: '#f5b849'
                            },
                            {
                                from: 46,
                                to: 55,
                                name: 'extreme',
                                color: '#49b6f5'
                            }
                            ]
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                grid: {
                    borderColor: '',
                },
                stroke: {
                    width: 1
                },
                title: {
                    text: 'HeatMap Chart with Color Range',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                xaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="heatmap" height={350} />

        );
    }
}

//Shadesheatmap
export class Shadesheatmap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Metric1',
                data: generateData3(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric2',
                data: generateData3(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric3',
                data: generateData3(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric4',
                data: generateData3(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric5',
                data: generateData3(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric6',
                data: generateData3(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric7',
                data: generateData3(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric8',
                data: generateData3(20, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Metric8',
                data: generateData3(20, {
                    min: 0,
                    max: 90
                })
            }
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'heatmap',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                stroke: {
                    width: 0
                },
                plotOptions: {
                    heatmap: {
                        radius: 30,
                        enableShades: false,
                        colorScale: {
                            ranges: [{
                                from: 0,
                                to: 50,
                                color: '#7971d2'
                            },
                            {
                                from: 51,
                                to: 100,
                                color: '#26c2ff'
                            },
                            ],
                        },

                    }
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        colors: ['#fff']
                    }
                },
                xaxis: {
                    type: 'category',
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                },
                title: {
                    text: 'Rounded (Range without Shades)',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="heatmap" height={350} />

        );
    }
}

//TreeMap chart

export class Basictreemap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    data: [
                        {
                            x: 'New Delhi',
                            y: 218
                        },
                        {
                            x: 'Kolkata',
                            y: 149
                        },
                        {
                            x: 'Mumbai',
                            y: 184
                        },
                        {
                            x: 'Ahmedabad',
                            y: 55
                        },
                        {
                            x: 'Bangaluru',
                            y: 84
                        },
                        {
                            x: 'Pune',
                            y: 31
                        },
                        {
                            x: 'Chennai',
                            y: 70
                        },
                        {
                            x: 'Jaipur',
                            y: 30
                        },
                        {
                            x: 'Surat',
                            y: 44
                        },
                        {
                            x: 'Hyderabad',
                            y: 68
                        },
                        {
                            x: 'Lucknow',
                            y: 28
                        },
                        {
                            x: 'Indore',
                            y: 19
                        },
                        {
                            x: 'Kanpur',
                            y: 29
                        }
                    ]
                }
            ],
            options: {
                legend: {
                    show: false
                },
                chart: {
                    height: 350,
                    type: 'treemap',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ["#7971d2"],
                title: {
                    text: 'Basic Treemap',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="treemap" height={350} />

        );
    }
}

//Multidimensional
export class Multidimensional extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    name: 'Desktops',
                    data: [
                        {
                            x: 'ABC',
                            y: 10
                        },
                        {
                            x: 'DEF',
                            y: 60
                        },
                        {
                            x: 'XYZ',
                            y: 41
                        }
                    ]
                },
                {
                    name: 'Mobile',
                    data: [
                        {
                            x: 'ABCD',
                            y: 10
                        },
                        {
                            x: 'DEFG',
                            y: 20
                        },
                        {
                            x: 'WXYZ',
                            y: 51
                        },
                        {
                            x: 'PQR',
                            y: 30
                        },
                        {
                            x: 'MNO',
                            y: 20
                        },
                        {
                            x: 'CDE',
                            y: 30
                        }
                    ]
                }
            ],
            options: {
                colors: ["#7971d2", "#26c2ff"],
                legend: {
                    show: false
                },
                chart: {
                    height: 350,
                    type: 'treemap',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                title: {
                    text: 'Multi-dimensional Treemap',
                    align: 'center',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="treemap" height={350} />

        );
    }
}

// Distributedtree
export class Distributedtree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    data: [
                        {
                            x: 'New Delhi',
                            y: 218
                        },
                        {
                            x: 'Kolkata',
                            y: 149
                        },
                        {
                            x: 'Mumbai',
                            y: 184
                        },
                        {
                            x: 'Ahmedabad',
                            y: 55
                        },
                        {
                            x: 'Bangaluru',
                            y: 84
                        },
                        {
                            x: 'Pune',
                            y: 31
                        },
                        {
                            x: 'Chennai',
                            y: 70
                        },
                        {
                            x: 'Jaipur',
                            y: 30
                        },
                        {
                            x: 'Surat',
                            y: 44
                        },
                        {
                            x: 'Hyderabad',
                            y: 68
                        },
                        {
                            x: 'Lucknow',
                            y: 28
                        },
                        {
                            x: 'Indore',
                            y: 19
                        },
                        {
                            x: 'Kanpur',
                            y: 29
                        }
                    ]
                }
            ],
            options: {
                legend: {
                    show: false
                },
                chart: {
                    height: 350,
                    type: 'treemap',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                title: {
                    text: 'Distibuted Treemap (different color for each cell)',
                    align: 'center',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                colors: [
                    '#7971d2',
                    '#a65e76',
                    '#f5b849',
                    '#a66a5e',
                    '#a65e9a',
                    '#26bf94',
                    '#e6533c',
                    '#49b6f5',
                    '#5b67c7',
                    '#2dce89',
                    '#EF6537',
                    '#8c9097'
                ],
                plotOptions: {
                    treemap: {
                        distributed: true,
                        enableShades: false
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="treemap" height={350} />

        );
    }
}

// Colorrangetree
export class Colorrangetree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    data: [
                        {
                            x: 'INTC',
                            y: 1.2
                        },
                        {
                            x: 'GS',
                            y: 0.4
                        },
                        {
                            x: 'CVX',
                            y: -1.4
                        },
                        {
                            x: 'GE',
                            y: 2.7
                        },
                        {
                            x: 'CAT',
                            y: -0.3
                        },
                        {
                            x: 'RTX',
                            y: 5.1
                        },
                        {
                            x: 'CSCO',
                            y: -2.3
                        },
                        {
                            x: 'JNJ',
                            y: 2.1
                        },
                        {
                            x: 'PG',
                            y: 0.3
                        },
                        {
                            x: 'TRV',
                            y: 0.12
                        },
                        {
                            x: 'MMM',
                            y: -2.31
                        },
                        {
                            x: 'NKE',
                            y: 3.98
                        },
                        {
                            x: 'IYT',
                            y: 1.67
                        }
                    ]
                }
            ],
            options: {
                legend: {
                    show: false
                },
                chart: {
                    height: 350,
                    type: 'treemap',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                title: {
                    text: 'Treemap with Color scale',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: '12px',
                    },
                    offsetY: -4
                },
                plotOptions: {
                    treemap: {
                        enableShades: true,
                        shadeIntensity: 0.5,
                        reverseNegativeShade: true,
                        colorScale: {
                            ranges: [
                                {
                                    from: -6,
                                    to: 0,
                                    color: '#7971d2'
                                },
                                {
                                    from: 0.001,
                                    to: 6,
                                    color: '#26c2ff'
                                }
                            ]
                        }
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="treemap" height={350} />

        );
    }
}

//Pie chart

export class Basicpiechart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [44, 55, 13, 43, 22],
            options: {
                chart: {
                    height: 300,
                    type: 'pie',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849", "#49b6f5", "#e6533c"],
                labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
                legend: {
                    position: "bottom"
                },
                dataLabels: {
                    dropShadow: {
                        enabled: false
                    }
                },
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="pie" height={300} />

        );
    }
}

//Simpledonut
export class Simpledonut extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [44, 55, 41, 17, 15],
            options: {
                chart: {
                    type: 'donut',
                    height: 290,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                legend: {
                    position: 'bottom'
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849", "#49b6f5", "#e6533c"],
                dataLabels: {
                    dropShadow: {
                        enabled: false
                    }
                },
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={300} />

        );
    }
}

export class Updatingdonut extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [44, 55, 13, 33],
            colors: ["#7971d2", "#26c2ff", "#f5b849", "#e6533c", "#49b6f5"],
            options: {
                chart: {
                    height: 280,
                    type: 'donut',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849", "#e6533c", "#49b6f5"],
                legend: {
                    position: 'bottom',
                },
            },
        };
    }

    appendData() {
        const arr = this.state.series.slice();
        arr.push(Math.floor(Math.random() * (100 - 1 + 1)) + 1);

        this.setState({
            series: arr,
        });
    }

    removeData() {
        if (this.state.series.length === 1) return;

        const arr = this.state.series.slice();
        arr.pop();

        this.setState({
            series: arr,
        });
    }

    randomize() {
        this.setState({
            series: this.state.series.map(function () {
                return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
            }),
        });
    }

    reset() {
        this.setState({
            series: [44, 55, 13, 33],
        });
    }

    render() {
        return (

            <div>
                <div id="chart">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={280} />
                </div>

                <div className="text-center mt-4">
                    <Button variant='primary' size="sm" className="m-1"
                        onClick={() => this.appendData()}
                    >
                        + ADD
                    </Button>
                    &nbsp;
                    <Button variant='primary' size="sm" className="m-1"
                        onClick={() => this.removeData()}
                    >
                        - REMOVE
                    </Button>
                    &nbsp;
                    <Button variant='primary' size="sm" className="m-1"
                        onClick={() => this.randomize()}
                    >
                        RANDOMIZE
                    </Button>
                    &nbsp;
                    <Button variant='primary' size="sm" className="m-1"
                        onClick={() => this.reset()}
                    >
                        RESET
                    </Button>
                </div>
            </div>
        );
    }
}

//Monochrome
export class Monochrome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [25, 15, 44, 55, 41, 17],
            options: {
                chart: {
                    height: '280',
                    type: 'pie',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                theme: {
                    monochrome: {
                        enabled: true,
                        color: "#7971d2",
                    }
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            offset: -5
                        }
                    }
                },
                title: {
                    text: 'Monochrome Pie',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                dataLabels: {
                    // formatter(val, opts) {
                    //     const name = opts.w.globals.labels[opts.seriesIndex]
                    //     return [name, val.toFixed(1) + '%']
                    // },
                    dropShadow: {
                        enabled: false
                    }
                },
                legend: {
                    show: false
                }
            },

        };
    }

    render() {
        return (

            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="pie" height={280} />
            </div>

        );
    }
}

//Gradientpie
export class Gradientpie extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [44, 55, 41, 17, 15],
            options: {
                chart: {
                    height: 300,
                    type: 'donut',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    pie: {
                        startAngle: -90,
                        endAngle: 270
                    }
                },
                dataLabels: {
                    enabled: false
                },
                fill: {
                    type: 'gradient',
                },
                legend: {
                    formatter: function (val, opts) {
                        return val + " - " + opts.w.globals.series[opts.seriesIndex];
                    },
                    position: 'bottom'
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849", "#49b6f5", "#e6533c"],
                title: {
                    text: 'Gradient Donut with custom Start-angle',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                // legend: {
                //     position: 'bottom'
                // },
            },

        };
    }

    render() {
        return (

            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={300} />
            </div>

        );
    }
}


//Donutwithpattern
export class Donutwithpattern extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [44, 55, 41, 17, 15],
            options: {
                chart: {
                    height: 250,
                    type: 'donut',
                    dropShadow: {
                        enabled: true,
                        color: '#111',
                        top: -1,
                        left: 3,
                        blur: 3,
                        opacity: 0.2
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                stroke: {
                    width: 0,
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: true,
                                total: {
                                    showAlways: true,
                                    show: true
                                }
                            }
                        }
                    }
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849", "#49b6f5", "#e6533c"],
                labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],
                dataLabels: {
                    enabled: true,
                    style: {
                        colors: ['#111']
                    },
                    background: {
                        enabled: true,
                        foreColor: '#fff',
                        borderWidth: 0
                    }
                },
                fill: {
                    type: 'pattern',
                    opacity: 1,
                    pattern: {
                        // enabled: true,
                        style: ['verticalLines', 'squares', 'horizontalLines', 'circles', 'slantedLines'],
                    },
                },
                states: {
                    hover: {
                        // filter: 'none'
                    }
                },
                theme: {
                    palette: 'palette2'
                },
                title: {
                    text: 'Favourite Movie Type',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },

        };
    }

    render() {
        return (

            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={250} />
            </div>

        );
    }
}


//Imagefilledpie
export class Imagefilledpie extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [44, 33, 54, 45],
            options: {
                chart: {
                    height: 300,
                    type: 'pie',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ['#93C3EE', '#E5C6A0', '#669DB5', '#94A74A'],
                fill: {
                    type: 'image',
                    opacity: 0.85,
                    image: {
                        src: [ALLImages('media21'), ALLImages('media22'), ALLImages('media23'), ALLImages('media24')],
                        width: 25
                    },
                },
                stroke: {
                    width: 4
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        colors: ['#111']
                    },
                    background: {
                        enabled: true,
                        foreColor: '#fff',
                        borderWidth: 0
                    }
                },
                legend: {
                    position: 'bottom'
                },
            },

        };
    }

    render() {
        return (

            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="pie" height={300} />
            </div>

        );
    }
}

//Radial bar chart

export class Basicradialbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [70],
            options: {
                chart: {
                    height: 300,
                    type: 'radialBar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ["#7971d2"],
                plotOptions: {
                    radialBar: {
                        hollow: {
                            size: '70%',
                        }
                    },
                },
                labels: ['Cricket'],
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={300} />

        );
    }
}

/// Multipleradial
export class Multipleradial extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [44, 55, 67, 83],
            options: {
                chart: {
                    height: 300,
                    type: 'radialBar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    radialBar: {
                        dataLabels: {
                            name: {
                                fontSize: '22px',
                            },
                            value: {
                                fontSize: '16px',
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888',
                                formatter: function (_w) {
                                    // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                                    return '249';
                                }
                            }
                        }
                    }
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849", "#e6533c"],
                labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={300} />

        );
    }
}

/// Circlechart
export class Circlechart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [76, 67, 61, 90],
            options: {
                chart: {
                    height: 320,
                    type: 'radialBar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    radialBar: {
                        offsetY: 0,
                        startAngle: 0,
                        endAngle: 270,
                        hollow: {
                            margin: 5,
                            size: '30%',
                            background: 'transparent',
                            image: undefined,
                        },
                        dataLabels: {
                            name: {
                                show: false,
                            },
                            value: {
                                show: false,
                            }
                        }
                    }
                },
                colors: ['#7971d2', '#26c2ff', '#f5b849', '#e6533c'],
                labels: ['Vimeo', 'Messenger', 'Facebook', 'LinkedIn'],
                legend: {
                    show: true,
                    floating: true,
                    fontSize: '14px',
                    position: 'left',
                    labels: {
                        useSeriesColors: true,
                    },
                    formatter: function (seriesName, opts) {
                        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
                    },
                    itemMargin: {
                        vertical: 3
                    }
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            show: false
                        }
                    }
                }]
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={320} />

        );
    }
}

/// Gradientcircle
export class Gradientcircle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [75],
            options: {
                chart: {
                    height: 320,
                    type: 'radialBar',
                    toolbar: {
                        show: true
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    radialBar: {
                        startAngle: -135,
                        endAngle: 225,
                        hollow: {
                            margin: 0,
                            size: '70%',
                            background: '#fff',
                            image: undefined,
                            imageOffsetX: 0,
                            imageOffsetY: 0,
                            position: 'front',
                            dropShadow: {
                                enabled: true,
                                top: 3,
                                left: 0,
                                blur: 4,
                                opacity: 0.24
                            }
                        },
                        track: {
                            background: '#fff',
                            strokeWidth: '67%',
                            margin: 0, // margin is in pixels
                            dropShadow: {
                                enabled: true,
                                top: -3,
                                left: 0,
                                blur: 4,
                                opacity: 0.35
                            }
                        },

                        dataLabels: {
                            show: true,
                            name: {
                                offsetY: -10,
                                show: true,
                                color: '#888',
                                fontSize: '17px'
                            },
                            value: {
                                formatter: function (val) {
                                    // return parseInt(val);
                                    return val.toString();
                                },
                                color: '#111',
                                fontSize: '36px',
                                show: true,
                            }
                        }
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        type: 'horizontal',
                        shadeIntensity: 0.5,
                        gradientToColors: ['#26c2ff'],
                        inverseColors: true,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 100]
                    }
                },
                stroke: {
                    lineCap: 'round'
                },
                labels: ['Percent'],
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={320} />

        );
    }
}

/// Circlegauge
export class Circlegauge extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [67],
            options: {
                chart: {
                    height: 320,
                    type: 'radialBar',
                    offsetY: -10,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ["#7971d2"],
                plotOptions: {
                    radialBar: {
                        startAngle: -135,
                        endAngle: 135,
                        dataLabels: {
                            name: {
                                fontSize: '16px',
                                color: undefined,
                                offsetY: 120
                            },
                            value: {
                                offsetY: 76,
                                fontSize: '22px',
                                color: undefined,
                                formatter: function (val) {
                                    return val + "%";
                                }
                            }
                        }
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        shadeIntensity: 0.15,
                        inverseColors: false,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 50, 65, 91]
                    },
                },
                stroke: {
                    dashArray: 4
                },
                labels: ['Median Ratio'],
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={320} />

        );
    }
}

/// Circlewithimage
export class Circlewithimage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [67],
            options: {
                chart: {
                    height: 330,
                    type: 'radialBar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    radialBar: {
                        hollow: {
                            margin: 15,
                            size: '70%',
                            imageWidth: 32,
                            imageHeight: 32,
                            imageClipped: false
                        },
                        dataLabels: {
                            name: {
                                show: false,
                                color: '#fff'
                            },
                            value: {
                                show: true,
                                color: '#333',
                                offsetY: 10,
                                fontSize: '22px'
                            }
                        }
                    }
                },
                fill: {
                    type: 'image',
                    image: {
                        src: [ALLImages('media26')],
                    }
                },
                stroke: {
                    lineCap: 'round'
                },
                labels: ['Volatility'],
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={320} />

        );
    }
}

/// Semicirclegauge
export class Semicirclegauge extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [76],
            options: {
                chart: {
                    type: 'radialBar',
                    height: 320,
                    offsetY: -20,
                    sparkline: {
                        enabled: true
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                plotOptions: {
                    radialBar: {
                        startAngle: -90,
                        endAngle: 90,
                        track: {
                            background: "#fff",
                            strokeWidth: '97%',
                            margin: 5, // margin is in pixels
                            dropShadow: {
                                enabled: false,
                                top: 2,
                                left: 0,
                                color: '#999',
                                opacity: 1,
                                blur: 2
                            }
                        },
                        dataLabels: {
                            name: {
                                show: false
                            },
                            value: {
                                offsetY: -2,
                                fontSize: '22px'
                            }
                        }
                    }
                },
                colors: ["#7971d2"],
                grid: {
                    padding: {
                        top: -10
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        shadeIntensity: 0.4,
                        inverseColors: false,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 50, 53, 91]
                    },
                },
                labels: ['Average Results'],
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={320} />

        );
    }
}

//Radar Chart

export class Basicradar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Series 1',
                data: [80, 50, 30, 40, 100, 20],
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'radar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                title: {
                    text: 'Basic Radar Chart',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                colors: ["#7971d2"],
                xaxis: {
                    categories: ['January', 'February', 'March', 'April', 'May', 'June']
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="radar" height={320} />

        );
    }
}

// Multipleradar
export class Multipleradar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Series 1',
                data: [80, 50, 30, 40, 100, 20],
            }, {
                name: 'Series 2',
                data: [20, 30, 40, 80, 20, 80],
            }, {
                name: 'Series 3',
                data: [44, 76, 78, 13, 43, 10],
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'radar',
                    dropShadow: {
                        enabled: true,
                        blur: 1,
                        left: 1,
                        top: 1
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                title: {
                    text: 'Radar Chart - Multi Series',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849"],
                stroke: {
                    width: 2
                },
                fill: {
                    opacity: 0.1
                },
                markers: {
                    size: 0
                },
                xaxis: {
                    categories: ['2011', '2012', '2013', '2014', '2015', '2016']
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="radar" height={320} />

        );
    }
}

// Polygonradar
export class Polygonradar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Series 1',
                data: [20, 100, 40, 30, 50, 80, 33],
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'radar',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                dataLabels: {
                    enabled: true
                },
                plotOptions: {
                    radar: {
                        size: 80,
                        polygons: {
                            strokeColors: '#e9e9e9',
                        }
                    }
                },
                title: {
                    text: 'Radar with Polygon Fill',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                colors: ['#26c2ff'],
                markers: {
                    size: 4,
                    colors: ['#fff'],
                    // strokeColor: ['#26c2ff'],
                    strokeWidth: 2,
                },
                tooltip: {
                    y: {
                        formatter: (val) => {
                            return val.toString(); // Convert to string
                        }
                    }
                },
                xaxis: {
                    categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                },
                yaxis: {
                    tickAmount: 7,
                    labels: {
                        formatter: (val, i) => {
                            if (i % 2 === 0) {
                                return val.toString(); // Convert to string
                            } else {
                                return '';
                            }
                        }
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="radar" height={320} />

        );
    }
}


//Polar Area Chart

export class Basicpolararea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
            options: {
                chart: {
                    type: 'polarArea',
                    height: 300,
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                stroke: {
                    colors: ['#fff']
                },
                fill: {
                    opacity: 0.8
                },
                legend: {
                    position: 'bottom'
                },
                colors: ["#7971d2", "#26c2ff", "#f5b849", "#49b6f5", "#e6533c", "#26bf94", "#a65e76", "#49b6f5", "#5b67c7"],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="polarArea" height={320} />

        );
    }
}

//Monochromepolar
export class Monochromepolar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [42, 47, 52, 58, 65],
            options: {
                chart: {
                    height: 300,
                    type: 'polarArea',
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                labels: ['Rose A', 'Rose B', 'Rose C', 'Rose D', 'Rose E'],
                fill: {
                    opacity: 1
                },
                stroke: {
                    width: 1,
                    colors: undefined
                },
                yaxis: {
                    show: false
                },
                legend: {
                    position: 'bottom'
                },
                plotOptions: {
                    polarArea: {
                        rings: {
                            strokeWidth: 0
                        },
                        spokes: {
                            strokeWidth: 0
                        },
                    }
                },
                theme: {
                    monochrome: {
                        enabled: true,
                        shadeTo: 'light',
                        shadeIntensity: 0.6,
                        color: "#7971d2",
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart options={this.state.options} series={this.state.series} type="polarArea" height={320} />

        );
    }
}
