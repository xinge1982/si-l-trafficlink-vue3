<template>
    <div class="component-box">
        <div class="main">
            <div style="flex:1;padding:40px 30px;display: flex;">
                <div style="position: absolute;width: 240px;">
                    <cross-select @change="crossIdChange"></cross-select>
                </div>
                <div class="s-left">
                    <ul class="c-nav-box">
                        <li v-for="item in menuData" @click="menuClick(item)">
                            <img :src="item.value==menu.value?item.icon1:item.icon" alt="">
                            <span :style="'color:'+(item.value==menu.value?'#fff':'')">{{item.name}}</span>
                        </li>
                    </ul>
                    <div class="date-type-box">
                        <label v-for="item in dateTypes" :key="item.value" :class="dateType.value==item.value?'active':''" @click="dateType=item">{{item.name}}</label>
                    </div>
                    <div class="date-time-box">
                        <div>
                            <span class="title">分析日期</span>
                            <div class="c-date-box">
                                <el-date-picker v-model="dateKey[dateType.key1]" :type="dateType.type" :format="dateType.format" :value-format="dateType.valueFormat" :picker-options="pickerOptions" placeholder="选择日期" @change="getBarCharts()">
                                </el-date-picker>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="s-right">
                    <div class="s-right-chart" style="top: 0;">
                        <div style="display: flex;margin-bottom: 20px;" v-if="menu&&menu.value=='1'">
                            <li class="title" :class="type==item.value?'active':''" v-for="item in types" @click="typeClick(item)">{{item.name}}</li>
                        </div>
                        <div style="height: 50%;display: flex;">
                            <div class="ect-box">
                                <div style="flex:1;" id="bar0"></div>
                                <div style="flex:1;" id="bar1" v-if="menu&&menu.value!=='1'"></div>
                            </div>
                        </div>
                        <div style="display: flex;" :style="menu&&menu.value=='1'?'height:45%;':'height:50%;'">
                            <div class="ect-box">
                                <div style="flex:1;" id="line0"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {

    components: {

    },
    data() {
        return {
            dateTypes: [{
                    name: '日',
                    type: 'date',
                    value: 'day',
                    valueFormat: 'yyyy-MM-dd',
                    format: '',
                    key1: 'day1',

                },
                {
                    name: '周',
                    type: 'week',
                    valueFormat: '',
                    format: 'yyyy 第 WW 周',
                    key1: 'week1',
                    value: 'week'

                }, {
                    name: '月',
                    type: 'month',
                    valueFormat: 'yyyy-MM',
                    format: '',
                    key1: 'month1',
                    value: 'month'

                }, {
                    name: '季',
                    type: 'month',
                    valueFormat: 'yyyy-MM',
                    format: '',
                    key1: 'quarter1',
                    value: 'quarter',

                }, {
                    name: '年',
                    type: 'year',
                    valueFormat: 'yyyy',
                    format: '',
                    key1: 'year1',
                    value: 'year'

                }
            ],
            dateType: {
                name: '日',
                value: 'day',
                valueFormat: 'yyyy-MM-dd',
                format: '',
                key1: 'day1',
                type: 'date'

            },
            dateKey: {
                day1: '',
                week1: '',
                month1: '',
                quarter1: '',
                year1: ''
            },

            pickerOptions: {

                firstDayOfWeek: 1
            },
            map: null,
            menuData: [],
            menu: null,

            analysisTime: '',
            baseTime: '',
            statistics: [],


            keys: '',
            types1: [],
            types2: [],
            value: 1,
            tableTypes: '',
            dataType: 1,
            startTime: '',
            endTime: '',
            listData: [],
            tableData: '',
            ectTypes: '',
            page: 1,
            pageSize: 20,
            types: [{
                name: '方向分析',
                value: '1'
            }, {
                name: '车道分析',
                value: '2'
            }],
            type: '1'

        }
    },
    computed: {

    },

    watch: {
        dateType(val) {


            this.getBarCharts()

        },
        dataType(val) {

            this.getBarCharts()

        }
    },
    created() {
        this.crossData = JSON.parse(sessionStorage.getItem('crossData'))
        this.dateKey.day1 = this.mapUtils.getDateYMD('ymd', -60 * 24)
        this.dateKey.month1 = this.mapUtils.getDateYMD('ym', -60 * 24 * 30)
        this.dateKey.week1 = this.mapUtils.getDateYMD('ymd', -60 * 24 * 7)
        this.dateKey.quarter1 = this.mapUtils.getDateYMD('ym', -60 * 24 * 30)
        this.dateKey.year1 = this.mapUtils.getDateYMD('y') + ''
        var now = new Date();
        var day = now.getDay();
        var date = new Date() - ((7 + day - 2) * 24 * 60 * 60 * 1000)
        var week = this.datevalue = new Date(date)

        this.startTime = this.mapUtils.getDateYMD('ymd', -60 * 24)
        this.endTime = this.mapUtils.getDateYMD('ymd', -60 * 24)
    },
    mounted() {
        this.getMenuList()
        // this.getType()
    },
    destroyed() {

    },

    methods: {

        crossIdChange(item) {
            this.crossData = item;
            this.getBarCharts();
        },
        dateToString(date) {
            var year = date.getFullYear();
            var month = (date.getMonth() + 1).toString();
            var day = (date.getDate()).toString();
            if (month.length == 1) {
                month = "0" + month;
            }
            if (day.length == 1) {
                day = "0" + day;
            }
            var dateTime = year + "-" + month + "-" + day;
            return dateTime;
        },
        initMap() {

            mapabcgl.accessToken = mapabcglToken;
            var _this = this;
            this.map = new mapabcgl.Map({
                container: 'sMap',
                style: MAP_STYLE,
                zoom: 17,
                maxZoom: maxZoom,
                minZoom: minZoom,
                center: [this.crossData.centerX, this.crossData.centerY],
                pitch: 0
            });


            this.map.on('load', function() {

            });
            this.map.on('click', function(e) {

            });

        },
        getMenuList() {

            var _this = this;
            var param = {

            };

            this.axios.get(SERVICE_URL + 'report/getEventTypes?', { params: param }).then((data) => {
                this.menuData = data.data.data;
                this.menuData.forEach(async (item) => {
                    try {
                        var url = require('../assets/image/screen/c/' + item.icon + '.png');
                        var url1 = require('../assets/image/screen/c/' + item.icon + '-a.png');
                        item.icon = url
                        item.icon1 = url1

                    } catch (e) {


                    }
                });

                this.menu = data.data.data[0];
                this.getBarCharts()



            })
        },


        menuClick(item) {
            this.menu = item;

            this.getBarCharts()

        },
        typeClick(item) {
            this.type = item.value;
            this.getBarCharts()
        },
        getBarCharts() {
            this.getLineCharts()
            if (this.dateType.type == 'week') {
                if (typeof this.dateKey.week1 !== 'string') {
                    this.dateKey.week1 = this.dateToString(this.dateKey.week1);
                };
            }

            var param = {

                crossId: this.crossData.crossId,
                menuId: this.menu.value,
                dateType: this.dateType.value,
                time: this.dateKey[this.dateType.value + '1'],
                type: this.type
            }

            this.axios.get(SERVICE_URL + 'report/getBarCharts?', { params: param }).then((data) => {

                var res = data.data.data;
                var colors = [

                    ['#019EA6', '#2ECAD2'],
                    ['#0067D0', '#2C92FD'],
                    ['#E8AE00', '#FFBF00'],
                    ['#6BBB70', '#7CF07F'],
                    ['#6C35BF', '#9C5FE5'],

                ];
                if (res.bar) {
                    var dom = 'bar0';
                    var legendData = [];
                    res.bar.series.forEach((temp, index) => {
                        legendData.push(temp.name)
                        temp.barWidth = 7.5;
                        temp.itemStyle = {
                            normal: {
                                //柱形图圆角，初始化效果
                                barBorderRadius: [7, 7, 0, 0],
                                color: new echarts.graphic.LinearGradient(
                                    0, 1, 0, 0,
                                    [
                                        { offset: 1, color: colors[index][1] },
                                        { offset: 0.5, color: colors[index][0] },
                                        { offset: 0, color: colors[index][0] }
                                    ]
                                )
                            }


                        }

                    })
                    var baroptions = {
                        dom: dom,
                        color: '#ffffff',
                        title: res.bar.title,
                        legendData: {
                            itemHeight: 7,
                            itemWidth: 14,
                            icon: 'rect',
                            data: legendData,
                            textStyle: {
                                color: '#fff'
                            },
                            right: 30
                        },
                        xAxisData: res.bar.times,
                        yAxisName: res.bar.yaxisName,
                        gridLeft: 10,
                        gridBom: 30,
                        gridTop: 55,
                        gridRight: 30,
                        legendRight: 25,
                        yaxisTick: false,
                        yaxisLine: true,
                        yaxisLabelShow: true,
                        axisLabelFontSize: 12,
                        XaxisLabelFontSize: 12,
                        ysplitLine: true,
                        series: res.bar.series,
                        boundaryGap: false,
                        nameTextStyle: {
                            color: '#fff',
                            fontSize: 12
                        },
                        nameGap: 25,
                        legendtextStyle: {
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: 12,
                            fontFamily: 'Microsoft YaHei'
                        },
                        ysplitLineStyle: {
                            color: '#00A0E9',
                            type: 'solid',
                            opacity: 0.2

                        },
                        xaxisTickShow: false,
                        interval: 0,

                    };

                    this.$nextTick(function() {
                        this.EchartsLarge.barChart(baroptions);
                    });

                }
                if (res.pie) {
                    var legend = []
                    res.pie.series[0].data.forEach(item => {
                        legend.push(item.name)
                    })
                    var options = {
                        legend: legend,
                        colors: ['#019EA6', '#0067D0', '#E8AE00', '#6BBB70', '#6C35BF'],
                        dom: 'bar1',
                        name: res.pie.title,
                        data: res.pie.series[0].data,


                        radius: '50%',

                    }
                    this.$nextTick(function() {

                        this.EchartsLarge.reportpie(options);
                        // this.EchartsLarge.barChart(baroptions);
                    })
                }



            }).catch((data) => {

            })

        },
        getLineCharts() {

            if (this.dateType.type == 'week') {
                if (typeof this.dateKey.week1 !== 'string') {
                    this.dateKey.week1 = this.dateToString(this.dateKey.week1);
                };
            }

            var param = {

                crossId: this.crossData.crossId,
                menuId: this.menu.value,
                dateType: this.dateType.value,
                time: this.dateKey[this.dateType.value + '1'],
                type: this.type
            }

            this.axios.get(SERVICE_URL + 'report/getLineCharts?', { params: param }).then((data) => {

                var res = data.data.data;
                var colors = [

                    ['#019EA6', '#2ECAD2'],
                    ['#0067D0', '#2C92FD'],
                    ['#E8AE00', '#FFBF00'],
                    ['#6BBB70', '#7CF07F'],
                    ['#6C35BF', '#9C5FE5'],

                ];
                var lineColors = [
                    ['rgba(1, 158, 166, 0.3)', 'rgba(1, 158, 166, 0.1)'],
                    ['rgba(0, 103, 208, 0.3)', 'rgba(0, 103, 208, 0.1)'],
                    ['rgba(211, 158, 54, 0.3)', 'rgba(211, 158, 54, .1)'],
                    ['rgba(107, 187, 112, 0.3)', 'rgba(107, 187, 112, .1)'],
                    ['rgba(108, 53, 191, 0.3)', 'rgba(108, 53, 191, .1)'],
                ];

                var dom = 'line0'
                var linelegendData = [];
                res.series.forEach((temp, index) => {
                    linelegendData.push(temp.name)
                    temp.areaStyle = {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: lineColors[index][0]

                        }, {
                            offset: 1,
                            color: lineColors[index][1]
                        }])
                    }

                })
                var c = []
                colors.forEach(item => {
                    c.push(item[0])
                })
                var lineoptions = {
                    dom: dom,
                    color: '#ffffff',
                    colors: c,
                    legendData: {
                        itemHeight: 7,
                        itemWidth: 7,
                        icon: 'circle',
                        data: linelegendData,
                        textStyle: {
                            color: '#fff'
                        },
                        right: 30
                    },
                    title: res.title,
                    xAxisData: res.times,
                    yAxisName: res.yaxisName,
                    gridLeft: 10,
                    gridBom: 0,
                    gridTop: 55,
                    gridRight: 30,
                    legendRight: 25,
                    yaxisTick: false,
                    yaxisLine: true,
                    yaxisLabelShow: true,
                    axisLabelFontSize: 12,
                    XaxisLabelFontSize: 12,
                    ysplitLine: true,
                    series: res.series,
                    boundaryGap: false,
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 12
                    },
                    nameGap: 25,
                    legendtextStyle: {
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 12,
                        fontFamily: 'Microsoft YaHei'
                    },
                    ysplitLineStyle: {
                        color: '#00A0E9',
                        type: 'solid',
                        opacity: 0.2

                    },
                    xaxisTickShow: false,
                    interval: 0,

                }

                this.$nextTick(function() {
                    this.EchartsLarge.lineChart2(lineoptions);
                });


            }).catch((data) => {



            })
        },
        currentChange(val) {
            this.page = val;
            this.getPageList()
        },
        getPageList() {

            var keys = this.tableTypes[this.menu.value].keys,
                str = '';

            for (var key in keys) {
                str += keys[key] + ','
            };
            str = str.substring(0, str.length - 1)

            var param = {
                types: str,
                crossId: this.crossData.crossId,
                menuId: this.menu.value,
                startTime: this.startTime,
                endTime: this.endTime,
                currentPage: this.page,
                pageSize: this.pageSize
            }

            this.axios.get(SERVICE_URL + 'safety/v2/getPageList?', { params: param }).then((data) => {

                var res = this.listData = data.data.data;
                this.tableData = res.data;
            }).catch((data) => {



            })

        },
        handleClick(row) {
            console.log(row)
        },
        exportCsv() {
            var keys = this.tableTypes[this.menu.value].keys,
                str = '';
            for (var key in keys) {
                str += keys[key] + ','
            };
            str = str.substring(0, str.length - 1);
            var url = SERVICE_URL + 'safety/v2/export?crossId=' + this.crossData.crossId + '&menuId=' + this.menu.value + '&types=' + str + '&startTime=' + this.startTime + '&endTime=' + this.endTime;
            window.location.href = url;
        }
    }

};
</script>
<style lang="scss">
.s-left {
    width: 240px;
    background: #0C2750;
    padding-top: 70px;

    .c-nav-box {

        // margin-top: 15px;
        li {

           
            padding: 10px 0;
            display: flex;
            cursor: pointer;
            border-bottom: 1px solid #2A4165;

            span {
                line-height: 47px;
                font-family: Adobe Heiti Std;
                font-weight: normal;
                color: #86889D;
                font-size: 14px;
            }

            img {
                display: block;
                width: 18px;
                height: 18px;
                margin-top: 13px;
                margin-right: 17px;
            }
        }
        p{
            padding-left: 25px;
            flex:1;
            display: flex;
        }
        .active {
            background: #2074C9;
            border-radius: 3px;
        }
    }


    .date-type-box {
        display: flex;
        margin-top: 19px;
        margin-bottom: 36px;
        margin-left: 5px;

        label {
            width: 71px;
            height: 25px;
            background: rgba(58, 78, 173, .6);
            cursor: pointer;
            margin-right: 4px;
            font-size: 14px;
            font-family: Adobe Heiti Std;
            font-weight: normal;
            color: #B5E6FF;
            text-align: center;
            line-height: 25px;
        }

        .active {
            box-shadow: inset 0 0 20px #2B8FEE;
        }
    }

    .date-time-box {
        // margin-left: 5px;

        .title {
            color: #ECF0F5;
            display: block;
            margin: 20px 0;
        }

        .c-date-box {
            width: 240px;
            height: 30px;

           
        }
    }
}

.s-right {
    flex: 1;
    position: relative;
    margin-left: 16px;

   
    .s-right-chart {
        position: absolute;
          bottom: 0;
        width: 100%;

        .title {
            // width: 120px;
            // height: 30px;
            padding: 2px 10px;
            background: rgba(16, 61, 105, 0.5);
            border: 1px solid #58B6FF;

            font-size: 14px;
            font-family: Adobe Heiti Std;
            font-weight: normal;
            color: #C8DBF4;
            text-align: center;
            margin-right: 10px;
            cursor: pointer;
        }

        .active {
            box-shadow: 0 0 14px 0px #2aa9c0 inset;
        }

        .el-table__body-wrapper,
        .is-scrolling-none {
            min-height: auto;
        }

        .ect-select-box {
            width: 100%;
            height: 30px;
            display: flex;

            .ect-select {
                margin-right: 30px;
                height: 30px;

                .el-input__inner {
                    border: 1px solid #076294;
                    background: rgba(12, 44, 103, .53);
                }
            }

            .title {
                margin-right: 10px;
            }

           
        }

        .ect-box {
            margin-top: 10px;
            flex: 1;
            display: flex;
        }

        .table {
            width: 100%;

            position: absolute;
            top: 40px;
            bottom: 40px;
        }
    }
}
</style>