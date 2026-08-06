const chartInstances = new Map();

function bindResizeListener() {
    if (bindResizeListener.bound) {
        return;
    }
    bindResizeListener.bound = true;
    window.addEventListener('resize', function() {
        chartInstances.forEach(function(chart, domId) {
            if (!chart) {
                chartInstances.delete(domId);
                return;
            }
            var dom = chart.getDom && chart.getDom();
            if (!dom || !document.body.contains(dom)) {
                if (chart.dispose) {
                    chart.dispose();
                }
                chartInstances.delete(domId);
                return;
            }
            chart.resize();
        });
    });
}

function getChartInstance(domId) {
    var dom = document.getElementById(domId);
    if (!dom) {
        return null;
    }
    bindResizeListener();
    var chart = echarts.getInstanceByDom(dom);
    if (!chart) {
        chart = echarts.init(dom);
    }
    chartInstances.set(domId, chart);
    return chart;
}

export default

{
    //仪表盘
    guageChart: function(options, color) {
        var color = color ? color : '#fff'
        var guage_chart = getChartInstance(options.dom);
        if (!guage_chart) {
            return null;
        }
        var option = {
            tooltip: {
                formatter: '拥堵指数' + "{c}"
            },

            series: [{
                type: 'gauge',
                radius: options.radius,
                startAngle: 180,
                center: [options.x, options.y],
                endAngle: 0,
                min: 1,
                max: 2.5,
                splitNumber: 4,
                detail: {
                    // show: true,
                    borderColor: color,
                    shadowColor: color, //默认透明
                    shadowBlur: 5,
                    width: 30,
                    height: 10,
                    color: color,
                    offsetCenter: [0, -20], // x, y，单位rem
                    fontStyle: 'normal',
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'normal',
                        color: color,
                        fontSize: 16
                    },
                    // formatter: '{value}'
                },
                data: [{
                    value: options.data,
                    // name: '拥堵指数'
                }],
                splitLine: {
                    length: -2,
                    lineStyle: {
                        color: '#9cc2e3',
                        width: 3
                    },
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: function(e) {
                        if (e == options.min || e == options.max) {
                            return "";
                        }
                        return e;
                    },
                    // 属性lineStyle控制线条样式
                    fontWeight: 'bold',
                    color: '#9cc2e3',
                    shadowColor: color, //默认透明
                    shadowBlur: 5,
                    distance: -18,
                    show: false

                },
                axisLine: {
                    lineStyle: {
                        color: [
                            [0.20, '#8aff22'],
                            [0.40, '#099223'],
                            [0.60, '#fcff22'],
                            [0.80, '#ffa422'],
                            [1, '#ff2222']
                        ],
                        width: 8,
                    }
                },
                pointer: {
                    width: 3,
                    // shadowColor: color, //默认透明
                    shadowBlur: 5
                },
                itemStyle: {
                    // color: color
                }
            }]
        }
        guage_chart.clear();
        guage_chart.setOption(option);
        return guage_chart;

    },

    lineChart: function(options, color) {
        var color = color ? color : '#fff';
        var line_chart = getChartInstance(options.dom);
        if (!line_chart) {
            return null;
        }
        var option = {

            title: {
                text: options.title,
                x: 'center',
                textStyle: {
                    color: color,
                    fontSize: 14,
                    fontWeight: '500'


                }

            },
            legend: {
                data: options.legend,
                textStyle: {
                    color: color,

                },
                top: 0
            },
            tooltip: {
                trigger: 'axis',
                appendToBody: true
            },

            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: options.xData,
                axisLine: {
                    lineStyle: {
                        color: color,

                    }

                },
                axisTick: {
                    lineStyle: {
                        color: color
                    },
                    show: false
                },

                axisLabel: {
                    textStyle: {
                        color: color
                    },

                },

            },
            grid: {
                left: options.left,
                right: options.right,
                top: options.top,
                bottom: options.bottom,
                containLabel: true
            },
            yAxis: {
                type: 'value',
                min: 1,

                splitLine: {
                    lineStyle: {
                        color: '#ceced8',
                        type: 'dashed',

                    },
                    show: false
                },
                splitNumber: 2,
                axisLine: {
                    lineStyle: {
                        color: color
                    },
                    // show: false
                },
                axisTick: {
                    lineStyle: {
                        color: color
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: color
                    }
                },
            },
            series: [{
                name: options.name1,
                type: 'line',
                data: options.data1,

                showAllSymbol: false,
                itemStyle: {
                    normal: {
                        color: '#FF9E00'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#FF9E00'
                        }, {
                            offset: 1,
                            color: '#ffe'
                        }])
                    }
                },
            }, {
                name: options.name2,
                type: 'line',
                data: options.data2,
                showAllSymbol: false,
                itemStyle: {
                    normal: {
                        color: '#569c4d'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#569c4d'
                        }, {
                            offset: 1,
                            color: '#80e287'
                        }])
                    }
                },
            }, {
                name: options.name3,
                type: 'line',
                data: options.data3,
                showAllSymbol: false,
                itemStyle: {
                    normal: {
                        color: '#bb3f10'
                    }
                }

            }]
        }

        line_chart.clear();
        line_chart.setOption(option);
        return line_chart;
    },

    lineChart2: function(options) {
        var line_chart1 = getChartInstance(options.dom);
        if (!line_chart1) {
            return null;
        }
        line_chart1.showLoading({
            text: '数据正在努力加载...',
            color: '#c23531',
            textColor: '#fff',
            maskColor: 'rgba(33, 36, 37, 0.8)',
        });

        var option = {
            animation: false,
            dom: '',
            colors: ['#FFF636', '#11BFFF', '#2BFBB4', '#2673E8', '#FCFDFC', '#749f83'],
            color: '#fff',
            legendData: {
                textStyle: {
                    color: '#fff',

                },
            },
            xAxisData: [],

            series: [],
            gridLeft: 15,
            gridRight: 35,
            gridTop: 25,
            gridBom: 25,
            legendBom: 'auto',
            legendRight: 'auto',
            legendtextStyle: '',
            title: '',
            titleX:'center',
            min: 0,
            min1: 0,
            splitNumber: 2,
            yAxisName: '',
            yAxisName1: '',
            yAxisShow: false,
            boundaryGap: true,
            yaxisLabelFmt: '{value}',
            yaxisLabelFmt1: '{value}',
            rotate: 0,
            yaxisLine: true,
            yaxisTick: true,
            xaxisTick: false,
            borderWidth: 0,
            borderColor: 'transparent',
            padding: 0,
            ysplitLine: false,
            axisLabelFontSize: 12,
            ysplitLineStyle: {
                color: '#4F565E',
                type: 'dashed'
            },
            xFm: function(value) {
                return value.split(" ").join("\n");
            },
            nameTextStyle: {},
            nameGap: 15
        }
        option = Object.assign(option, options);

        var opt = {
            animation: option.animation,
            color: option.colors,
            title: {
                text: option.title,
                x: option.titleX,
                textStyle: {
                    color: option.color,
                    fontSize:14
                },
                top:20

            },
            legend: option.legendData,
            tooltip: {
                trigger: 'axis',
                appendToBody: true
            },

            xAxis: [{
                type: 'category',
                boundaryGap: option.boundaryGap,
                data: option.xAxisData,
                axisLine: {
                    lineStyle: {
                        color: option.color,

                    },

                },
                axisTick: {
                    lineStyle: {
                        color: option.color
                    },
                    show: option.xaxisTick
                },

                axisLabel: {
                    color: option.color,
                    fontSize: option.axisLabelFontSize,
                    formatter: option.xFm,

                    rotate: option.rotate,
                    borderWidth: option.borderWidth,
                    borderColor: option.borderColor,
                    padding: option.padding
                },

            }],
            grid: {
                left: option.gridLeft,
                right: option.gridRight,
                top: option.gridTop,
                bottom: option.gridBom,
                containLabel: true
            },
            yAxis: [{
                type: 'value',
                min: option.min,
                name: option.yAxisName,
                nameTextStyle: option.nameTextStyle,
                nameGap: option.nameGap,
                splitLine: {
                    lineStyle: option.ysplitLineStyle,
                    show: option.ysplitLine
                },
                splitNumber: option.splitNumber,
                axisLine: {
                    lineStyle: {
                        color: option.color
                    },
                    show: option.yaxisLine
                },
                axisTick: {
                    lineStyle: {
                        color: option.color
                    },
                    show: option.yaxisTick
                },
                axisLabel: {
                    formatter: option.yaxisLabelFmt,

                    color: option.color,
                    fontSize: option.axisLabelFontSize,

                    interval: option.interval,
                    // rotate: option.rotate
                },

            }, {
                type: 'value',
                show: option.yAxisShow,
                min: option.min1,
                name: option.yAxisName1,
               nameTextStyle: option.nameTextStyle,
                nameGap: option.nameGap,
                splitLine: {
                    lineStyle: option.ysplitLineStyle,
                    show: option.ysplitLine
                },
                splitNumber: option.splitNumber,
                axisLine: {
                    lineStyle: {
                        color: option.color
                    },
                    show: option.yaxisLine
                },
                axisTick: {
                    lineStyle: {
                        color: option.color
                    },
                    show: option.yaxisTick
                },
                axisLabel: {
                    formatter: option.yaxisLabelFmt,

                    color: option.color,
                    fontSize: option.axisLabelFontSize,

                    interval: option.interval,
                    // rotate: option.rotate
                },
            }],
            series: option.series
        }
        
        line_chart1.clear();

        line_chart1.setOption(opt, true);

        line_chart1.hideLoading();
        return line_chart1;
    },
   
    reportpie: function(options) {

        var opt = {
            name: '',
            title: '',
            dom: '',
            color: '#ccc',
            legend: [],
            data: [],
            colors: ['#ccc', '#ff8f00'],
            radius: ['20%', '65%'],
            emphasis: {},
            label: {
                show: true,
                position: 'outer',
                alignTo: 'none',
                formatter: '{b}\n{c} ({d}%)',
            },
             labelLine: {},
             labelLayout:{},
             center:['50%','55%']

        }
        options = Object.assign(opt, options);

        var pie = getChartInstance(options.dom);
        if (!pie) {
            return null;
        }
        var option = {
            color: options.colors,
            title: {
                text: options.title,
                bottom: 0,
                left: 'center',
                textStyle: {
                    fontSize: 12,
                    color: options.color,
                },

            },
            tooltip: {
                trigger: 'none'

            },

            legend: {
                
                left: 'center',
               
                data: options.legend,
                textStyle: {
                    color: options.color,
                }
            },
            series: [{
                name: options.name,
                radius: options.radius,
                center:options.center,
                type: 'pie',
                hoverAnimation:false,
                data: options.data,
                label: options.label,
                labelLine:options.labelLine,
                labelLayout:options.labelLayout,
                emphasis: options.emphasis
            }]
        };
        
        pie.clear();
        pie.setOption(option);
        return pie
    },
    barChart: function(options, color) {
        var option = {
            dom: '',
            color: '#fff',
            legendData: {
                textStyle: {
                    color: '#fff',

                },
                selectedMode:false
            },
            xAxisData: [],
            series: [],
            gridLeft: 15,
            gridRight: 35,
            gridTop: 45,
            gridBom: 25,
            legendBom: 'auto',
            title: '',
            min: 0,
            max: 10,
            interval: 1,
            rotate: 0,
            yAxisName: '',
            yaxisLineShow: true,
            yaxisTickShow: false,
            ysplitLineShow: true,
            yaxisLabelShow: false,
            xaxisLineShow: true,
            xaxisTickShow: true,
            axisLabelFontSize: 12,
            XaxisLabelFontSize:12,
            ysplitLineStyle: {
                color: '#4F565E',
                type: 'dashed'

            },
            nameTextStyle: {},
            nameGap: 15,
            formatter: function(value) {
                return value
            },
            splitNumber:2
        }
        option = Object.assign(option, options);
        var bar_Chart = getChartInstance(option.dom);
        if (!bar_Chart) {
            return null;
        }
        var opt = {
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            title: {
                text: option.title,
                left: 'center',
                textStyle: {
                    color: option.color,
                    fontSize:14,
                },

                top:20
            },

            legend: option.legendData,
                
            grid: {
                left: option.gridLeft,
                right: option.gridRight,
                top: option.gridTop,
                bottom: option.gridBom,
                containLabel: true
            },
            xAxis: {

                type: 'category',
                data: option.xAxisData,
                axisLine: {
                    lineStyle: {
                        color: option.color
                    },
                    show: option.xaxisLineShow
                },
                axisTick: {
                    lineStyle: {
                        color: option.color
                    },
                    show: option.xaxisTickShow
                },
                axisLabel: {

                    color: option.color,
                    fontSize: option.axisLabelFontSize,

                    formatter: option.formatter,
                    // interval: option.interval,
                    rotate: option.rotate,
                },
            },
            yAxis: {
                type: 'value',
                name: option.yAxisName,
                nameTextStyle: option.nameTextStyle,
                nameGap: option.nameGap,
                // minInterval: 0,
                 splitNumber: option.splitNumber,
                axisLine: {
                    lineStyle: {
                        color: option.color
                    },
                    show: option.yaxisLineShow
                },
                axisTick: {
                    lineStyle: {
                        color: option.color
                    },
                    show: option.yaxisTickShow
                },
                axisLabel: {
                    textStyle: {
                        color: option.color
                    },
                    fontSize: option.axisLabelFontSize,
                    show: option.yaxisLabelShow
                },
                splitLine: {
                    lineStyle: option.ysplitLineStyle,
                    show: option.ysplitLineShow
                },
            },
            series: option.series
        };
        bar_Chart.clear();
        bar_Chart.setOption(opt);
        return bar_Chart;
    },
    radarChart: function(options) {
        var radar_chart = getChartInstance(options.dom);
        if (!radar_chart) {
            return null;
        }
        radar_chart.showLoading({
            text: '数据正在努力加载...',
            color: '#c23531',
            textColor: '#fff',
            maskColor: 'rgba(33, 36, 37, 0.8)',
        });
        var option = {
            dom: '',
            colors: ['#e36b40', '#439eda'],
            color: '#fff',
            legendData: [],
            backgroundColor: '#999',
            borderRadius: 5,
            padding: [3, 5],
            indicator: [],
            series: [],

        }
        option = Object.assign(option, options);

        var opt = {
            color: option.colors,

            title: {
                text: option.title,
                x: 'center',
                textStyle: {
                    color: option.color,




                }

            },
            legend: {
                data: option.legendData,
                textStyle: {
                    color: option.color,

                },
                bottom: option.legendBom
            },
            tooltip: {

                formatter: function(params) {

                    let str = `${params.data.name}</br>`
                    option.indicator.forEach((item, i) => {
                        str += `${item.name}:${params.value[i]} ${item.per}</br>`
                    })
                    return str
                },
            },
            radar: {
                radius: '55%',
                splitArea: {
                    show: false,

                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        color: '#ccc' // 图表背景网格线的颜色
                    }
                },
                axisLine: { // 坐标轴线
                    show: true,
                    lineStyle: {
                        width: 1,
                        type: 'dotted',
                        color: '#ccc' // 图表背景网格线的颜色
                    }
                },
                name: {
                    textStyle: {
                        color: option.color,

                        padding: option.padding
                    }
                },
                indicator: option.indicator
            },

            series: option.series
        }

        radar_chart.clear();

        radar_chart.setOption(opt, true);
        radar_chart.hideLoading();
        return radar_chart;
    },
    scatterChart: function(options) {
        var scatter_chart = getChartInstance(options.dom);
        if (!scatter_chart) {
            return null;
        }
        // scatter_chart.showLoading({
        //           text: '数据正在努力加载...',
        //           color: '#c23531',
        //  textColor: '#fff',
        //  maskColor: 'rgba(33, 36, 37, 0.8)',
        //       }); 
        var opt = {
            dom: '',
            days: [],
            hours: [],
            data: []

        }
        opt = Object.assign(opt, options);

        var option = {
            tooltip: {
                position: 'bottom'
            },

            title: [],
            singleAxis: [],
            series: []
        };

        echarts.util.each(opt.days, function(day, idx) {

            option.title.push({
                textBaseline: 'middle',
                top: (idx + 0.5) * 100 / 9 + '%',
                text: day,
                textStyle: {
                    color: '#fff',
                    fontSize: 14
                }
            });
            option.singleAxis.push({
                left: 80,
                type: 'category',
                boundaryGap: false,
                data: opt.hours,
                top: (idx * 100 / 9 + 5) + '%',
                height: (100 / 9 - 10) + '%',
                axisLabel: {
                    interval: 1
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
            });
            option.series.push({
                singleAxisIndex: idx,
                coordinateSystem: 'singleAxis',
                type: 'scatter',
                data: [],
                symbolSize: function(dataItem) {
                    return dataItem[1] * 2;
                }
            });
        });

        echarts.util.each(opt.data, function(dataItem) {
            option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
        });

        scatter_chart.clear();

        scatter_chart.setOption(option, true);
        scatter_chart.hideLoading();
        return scatter_chart;
    },
    heatmapChart: function(options) {
        var heatmap = getChartInstance(options.dom);
        if (!heatmap) {
            return null;
        }

        var opt = {
            title:'',
            color:'#fff',
            dom: '',
            days: [],
            hours: [],
            data: [],
            gridTop:0,
            gridBom:10,
            gridRight:40,
            seriesLabel:false,
            visualMapMin:0,
            visualMapMax:1,
            titleFontSize:14,
            gridHight:'55%'
        }
        opt = Object.assign(opt, options);

        var option = {
            title: {
                text: opt.title,
                left: 'center',
                textStyle: {
                    color: opt.color,
                    fontSize: opt.titleFontSize,

                }
            },
            tooltip: {
                position: 'top' 
            },
            animation: false,
            grid: {
                height:opt.gridHight,
                top: opt.gridTop,
                right:opt.gridRight,
                bottom:opt.gridBom
                
            },
            xAxis: {
                type: 'category',
                data: opt.hours,
                splitArea: {
                    show: true
                },
                axisTick: {
                    lineStyle: {
                        color: '#fff'
                    },

                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },

                },
            },
            yAxis: {
                type: 'category',
                data: opt.days,
                splitArea: {
                    show: true
                },
                axisTick: {
                    lineStyle: {
                        color: '#fff'
                    },

                },
                axisLabel: {
                    
                    textStyle: {
                        color: '#fff',
                        fontSize:10
                    },

                },
            },
            visualMap: {
                // type: 'piecewise',
                realtime: false,
                min: opt.visualMapMin,
                max: opt.visualMapMax,
                calculable: true,
                orient: 'vertical',
                right: 0,
                top: 'center',
                textStyle: {
                    color: '#fff'
                },
                inRange: {
                    color: ['#0080FF', '#45A2B9', '#8BC573', '#FFDC00', '#E86B00']
                }
            },
            series: [{
                name: '饱和度',
                type: 'heatmap',
                data: opt.data,
                label: {
                    show: opt.seriesLabel
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };


        heatmap.clear();

        heatmap.setOption(option, true);
        heatmap.hideLoading();
        return heatmap;
    },
}
