const teacherBarOptions = {
    scales: {
        yAxis: {
            min: 0,
            max: 100,
            ticks: {
                callback: function (value: number) {
                    return value + "%"
                }
            }
        }
    },
    plugins: {
        legend: {
            position: 'bottom' as const,
        },
        title: {
            display: true,
            text: 'Attempts containing each concept',
        },
        datalabels: {
            borderRadius: 25,
            borderWidth: 3,
            color: "black",
            font: {
                weight: "bold"
            },
            padding: 6
        },
    }
};
const teacherdoughnutOptions = {
    plugins: {
        legend: {
            position: 'bottom' as const,
        }
    }
};

function teacherLinesGraphOptions(data: [], dataGroup: [], graphType: string, graph: string, dialogCallback: Function) {
    let xTitle = "";
    let yTitle = "";
    let binWidth = 0;
    switch (graph) {
        case "0":
            xTitle = "Lines of code";
            yTitle = "Students";
            binWidth = 5;
            break;
        case "1":
            xTitle = "Count of concept";
            yTitle = "Students";
            binWidth = 1;
            break;
        case "2":
            xTitle = "Minutes spent on exercise";
            yTitle = "Students";
            binWidth = 5;
    }

    return {
        config: {
            chart: {},
            title: {
                text: null
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: true
            },
            xAxis: [
                {
                    min: 0,
                    title: {
                        text: ""
                    },
                    visible: true
                },
                {
                    title: {
                        text: xTitle
                    },
                    opposite: true,
                    visible: true
                }
            ],

            yAxis: [
                {
                    title: {
                        text: ""
                    },
                    visible: false
                },
                {
                    title: {
                        text: yTitle
                    },
                    opposite: true,
                    visible: true
                }
            ],
            plotOptions: {
                series: {
                    enableMouseTracking: graphType === "histogram",
                    cursor: "pointer",
                    point: {
                        events: {
                            click: function (event: any) {
                                dialogCallback(event.point.category, event.point.y, binWidth, event.point.series.name, graph);
                            }
                        }
                    }
                }
            },
            series: [{
                name: 'Solo attempts',
                type: graphType,
                xAxis: 1,
                yAxis: 1,
                baseSeries: "d1",
                binWidth: binWidth,
                zIndex: -1,
                color: "rgba(245,10,57,0.62)",
            }, {
                name: 'Solo Data',
                type: 'line',
                data: data,
                visible: false,
                id: "d1",
                marker: {
                    radius: 1.5
                },
            }, {
                name: 'Group attempts',
                type: graphType,
                xAxis: 1,
                yAxis: 1,
                baseSeries: "d2",
                binWidth: binWidth,
                zIndex: -1,
                color: 'rgba(10,84,245,0.62)',
            }, {
                name: "Group Data",
                type: 'line',
                data: dataGroup,
                id: "d2",
                visible: false,
                marker: {
                    radius: 1.5
                },
            }
            ],
        }
    }
}

export {teacherBarOptions, teacherdoughnutOptions, teacherLinesGraphOptions};
