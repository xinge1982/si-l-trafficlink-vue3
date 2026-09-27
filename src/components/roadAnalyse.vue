<template>
    <div class="component-box">
        <event-info v-if="eventData" :eventData="eventData"></event-info>
        <accident-info v-if="accidentData" :accidentData="accidentData"></accident-info>
        <div class="main">
            <div style="flex:1;padding:40px 30px;display: flex;">
                <div style="position: absolute;width: 240px;">
                    <cross-select @change="crossIdChange"></cross-select>
                </div>
                <div class="s-left">
                    <ul class="c-nav-box">
                        <li v-for="item in menuData" @click="menuClick(item)">
                            <p :class="item.value==menu.value?'active':''">
                                <img :src="item.value==menu.value?item.icon1:item.icon" alt="">
                                <span :style="'color:'+(item.value==menu.value?'#fff':'')">{{item.name}}</span>
                            </p>
                        </li>
                    </ul>
                    <div class="type-box" style="width: 236px;margin:25px 0;">
                        <li v-for="item in dateTypes" :key="item.type" :class="dateType.type==item.type?'active':''" @click="dateType=item">{{item.name}}</li>
                    </div>
                    <div class="date-time-box">
                        <div>
                            <p class="title">
                                <span>分析日期</span>
                                <b style="float: right;">总流量：{{analysisFlow}}</b>
                            </p>
                            <div class="c-date-box">
                                <el-date-picker v-model="dateKey[dateType.key1]" :type="dateType.type" :format="dateType.format" :value-format="dateType.valueFormat" :picker-options="pickerOptions" placeholder="选择日期" @change="getEventChart(),getLineCharts(),getEventHot(),getStatistics()">
                                </el-date-picker>
                            </div>
                        </div>
                        <div>
                            <p class="title">
                                <span>基准日期</span>
                                <b style="float: right;">总流量：{{baseFlow}}</b>
                            </p>
                            <div class="c-date-box">
                                <el-date-picker v-model="dateKey[dateType.key2]" :type="dateType.type" :format="dateType.format" :value-format="dateType.valueFormat" :picker-options="pickerOptions" placeholder="选择日期" @change="getEventChart(),getLineCharts(),getEventHot(),getStatistics()">
                                </el-date-picker>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="s-right">
                    <div class="s-right-info" v-show="menu.value=='2'"> 
                        <!-- <div style="margin-bottom: 25px;">
                            <el-checkbox-group v-model="checkList" :min="1" @change="checkChange()">
                                <el-checkbox label="分析时间">{{'分析时间（'+dateKey[dateType.type + '1']+'）'}}</el-checkbox>
                                <el-checkbox label="基准时间">{{'基准时间（'+dateKey[dateType.type + '2']+'）'}}</el-checkbox>
                            </el-checkbox-group>
                        </div> -->
                        <div class="checkbox" style="margin-bottom: 25px;" v-if="ectTypes&&menu.value=='2'">
                            <span class="title">{{ectTypes[menu.value].type1[0].title}}</span>
                            <el-checkbox-group v-model="checkboxGroup1" :min="1" :max="5" style="float:left;" @change="getEventChart(),getEventHot()">
                                <el-checkbox-button v-for="item in ectTypes[menu.value].type1[0].data" :label="item.value" :key="item.value">{{item.name}}</el-checkbox-button>
                            </el-checkbox-group>
                        </div>
                        <div class="flex" style="border: 1px solid #3B94F3;padding:8px;" v-show="menu.value=='2'">
                            <div class="s-map" id="sMap"></div>
                        </div>
                    </div>
                    <div class="s-right--chart">
                        <div style="flex:1;width: 100%;" id="lineEct1" v-show="menu.value=='2'"></div>

                        <div style="flex:1.2;width: 100%;" v-if="menu.value==1">
                            <div v-if="ectTypes&&ectTypes[menu.value].type2&&ectTypes[menu.value].type2.length>0" style="overflow: hidden;">
                                <span class="title" style="float: left;line-height: 83px;">{{ectTypes[menu.value].type2[0].title}}</span>
                                <div class="type-box" style="width: 336px;margin :25px 0;float: left;">
                                    <li v-for="item in ectTypes[menu.value].type2[0].data" :key="item.value" :class="index==item.value?'active':''" @click="index=item.value">{{item.name}}</li>
                                </div>
                                <div class="data-type-btn" @click="exportCsv()">
                                    <i class="el-icon-upload2"></i>
                                    <span>导出</span>
                                </div>
                            </div>
                            <div style="width: 100%;height: 75%;" id="lineEct2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import http from '@/api/http';

const { SERVICE_URL } = window.APP_CONFIG;

const assetModules = import.meta.glob('../assets/image/**/*', { eager: true, import: 'default' }) as Record<string, string>;
const assetUrl = (path: string): string => assetModules[path] ?? '';

import eventInfo from './eventInfo.vue';
import accidentInfo from './accidentInfo.vue';
defineOptions({

    components: {
        eventInfo,
        accidentInfo
    },
    data() {
        return {
            dateTypes: [{
                    name: '日',
                    type: 'date',
                    valueFormat: 'yyyy-MM-dd',
                    format: '',
                    key1: 'date1',
                    key2: 'date2',
                },
                {
                    name: '周',
                    type: 'week',
                    valueFormat: '',
                    format: 'yyyy 第 WW 周',
                    key1: 'week1',
                    key2: 'week2'
                }, {
                    name: '月',
                    type: 'month',
                    valueFormat: 'yyyy-MM',
                    format: '',
                    key1: 'month1',
                    key2: 'month2'
                }
            ],
            dateType: {
                name: '日',
                type: 'date',
                valueFormat: 'yyyy-MM-dd',
                format: '',
                key1: 'date1',
                key2: 'date2',
            },
            dateKey: {
                date1: '',
                date2: '',
                week1: '',
                week2: '',
                month1: '',
                month2: '',
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
            tableTypes1: '',
            dataType: 1,
            startTime: '',
            endTime: '',
            listData: [],
            tableData: '',
            listData1: [],
            tableData1: '',
            ectTypes: '',
            page: 1,
            pageSize: 12,
            eventData: '',
            accidentData: '',
            checkList: ['分析时间'],
            checkboxGroup1: [],
            index: '',
            analysisFlow: 0,
            baseFlow: 0

        }
    },
    computed: {

    },

    watch: {
        dateType(val) {

            this.getEventChart()
            this.getEventHot()
            this.getLineCharts()
            this.getStatistics()
        },
        index() {
            this.getLineCharts()
        }

    },
    created() {
        this.crossData = JSON.parse(sessionStorage.getItem('crossData'))
        this.dateKey.date1 = this.mapUtils.getDateYMD('ymd', -60 * 24)
        this.dateKey.date2 = this.mapUtils.getDateYMD('ymd', -60 * 48)
        this.dateKey.month1 = this.mapUtils.getDateYMD('ym', -60 * 24 * 30)
        this.dateKey.month2 = this.mapUtils.getDateYMD('ym', -60 * 24 * 60)
        var now = new Date();
        var day = now.getDay();
        var date = new Date() - ((7 + day - 2) * 24 * 60 * 60 * 1000)
        var week = this.datevalue = new Date(date)
        this.dateKey.week1 = this.mapUtils.getDateYMD('ymd', -60 * 24 * 7)
        this.dateKey.week2 = this.mapUtils.getDateYMD('ymd', -60 * 24 * 14)
        this.startTime = this.mapUtils.getDateYMD('ymd', -60 * 24)
        this.endTime = this.mapUtils.getDateYMD('ymd', -60 * 24)
    },
    mounted() {
        this.getEventTypes()

    },
    unmounted() {

    },

    methods: {

        crossIdChange(item) {
            this.crossData = item;
            this.map.flyTo({ center: [item.centerX, item.centerY] })
            this.getEventChart()
            this.getEventHot()
            this.getLineCharts()
            this.getStatistics()
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
                style: MIN_MAP_STYLE,
                zoom: 17,
                maxZoom: maxZoom,
                minZoom: minZoom,
                center: [this.crossData.centerX, this.crossData.centerY],
                pitch: 0
            });


            this.map.on('load', function() {
                _this.getEventHot()

            });
            this.map.on('click', function(e) {

            });

        },
        getEventTypes() {

            var _this = this;
            var param = {

            };

            http.get(SERVICE_URL + 'expressway/analysis/getEventTypes?', { params: param }).then((data) => {
                this.menuData = data.data.data;
                this.menuData.push({
                    name:'交通指标分析',
                    value:1,
                    icon:'jtzbfx'
                })
                console.log(this.menuData)
                this.menuData.forEach(async (item) => {
                    try {
                        var url = assetUrl('../assets/image/screen/c/' + item.icon + '.png');
                        var url1 = assetUrl('../assets/image/screen/c/' + item.icon + '-a.png');
                        item.icon = url
                        item.icon1 = url1

                    } catch (e) {


                    }
                });

                this.menu = data.data.data[0];

                this.getMenuList()


            })
        },
        getMenuList() {

            var _this = this;
            var param = {

            };

            http.get(SERVICE_URL + 'expressway/analysis/getMenuList?', { params: param }).then((data) => {
                var res = this.ectTypes = data.data.data;
                this.checkboxGroup1.push(res[this.menu.value].type1[0].data[0].value)
                if (res[this.menu.value].type2 && res[this.menu.value].type2.length > 0) {
                    this.index = res[this.menu.value].type2[0].data[0].value;
                }

                this.initMap()
                this.getEventChart()
                this.getLineCharts()
                this.getStatistics()
            })
        },

        menuClick(item) {
            this.menu = item;

            // this.page = 1;
            // this.checkboxGroup1 = []
            // this.checkboxGroup1.push(this.ectTypes[this.menu.value].type1[0].data[0].value)
            
          
            if (item.value==2) {
                this.getEventChart()
             }else{
                this.getLineCharts()
             }
            // this.getEventHot()
            // this.getStatistics()

        },
        getEventHot() {
            var _this = this;
            var param = {
                keys: this.checkboxGroup1.join(','),
                roadId: this.crossData.crossId,
                menuId: this.menu.value,
                dateType: this.dateType.type,
                analysisTime: this.dateKey[this.dateType.type + '1'],
                baseTime: this.dateKey[this.dateType.type + '2']

            };
            http.post(SERVICE_URL + 'expressway/analysis/getEventHot?', param).then((data) => {
                var res = data.data.data;

                this.map.removeLayerAndSource('heatmapLayer')
                var features = []
                res.forEach(item => {
                    var obj = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": item.point
                        },
                        "properties": {
                            "mag": item.num
                        }
                    }
                    features.push(obj)
                })
                const opt = {
                    id: 'heatmapLayer',
                    features: features,
                    maps: this.map

                };
                this.mapUtils.addHeatmap(opt)

            })
        },
        getEventChart() {

            if (this.dateType.type == 'week') {
                if (typeof this.dateKey.week1 !== 'string') {
                    this.dateKey.week1 = this.dateToString(this.dateKey.week1);
                };
            }

            var param = {
                keys: this.checkboxGroup1.join(','),
                roadId: this.crossData.crossId,
                menuId: this.menu.value,
                dateType: this.dateType.type,
                analysisTime: this.dateKey[this.dateType.type + '1'],
                baseTime: this.dateKey[this.dateType.type + '2']
            }

            http.post(SERVICE_URL + 'expressway/analysis/getEventChart?', param).then((data) => {
                var res = data.data.data;
                var colors = [

                    ['#019EA6', '#2ECAD2'],
                    ['#0067D0', '#2C92FD'],
                    ['#E8AE00', '#FFBF00'],
                    ['#6BBB70', '#7CF07F'],
                    ['#6C35BF', '#9C5FE5'],

                ];


                var dom = 'lineEct1';
                var linelegendData = [];
                res.series.forEach((item, index) => {
                    linelegendData.push(item.name)
                    // if (index == this.checkboxGroup1.length-1) {
                    //     item.label = {
                    //         show: true,
                    //         formatter: item.stack,
                    //         color:'rgba(255,255,255,.75)',
                    //         position: 'top',
                    //         rotate:40,
                    //         verticalAlign: 'middle',
                    //     }
                    // }
                    // if (index==res.series.length-1) {
                    //     item.label = {
                    //         show: true,
                    //         formatter: item.stack,
                    //        color:'rgba(255,255,255,.75)',
                    //         position: 'top',
                    //         rotate:-40,
                    //         verticalAlign: 'middle',
                    //     }
                    // }

                })
                var c = []
                colors.forEach(item => {
                    c.push(item[0])
                })
                var lineoptions = {
                    dom: dom,
                    color: 'rgba(255,255,255,.75)',
                    colors: c,
                    legendData: {
                        itemHeight: 7,
                        itemWidth: 7,
                        icon: 'circle',
                        data: linelegendData,
                        textStyle: {
                            color: 'rgba(255,255,255,.75)',
                            fontSize: 12
                        },
                        right: 30,
                        top: 10
                    },
                    // title: item.title,
                    xAxisData: res.times,
                    yAxisName: res.yaxisName,
                    gridLeft: 10,
                    gridBom: 10,
                    gridTop: 50,
                    gridRight: 30,
                    legendRight: 25,
                    yaxisTick: false,
                    yaxisLine: false,
                    yaxisLabelShow: true,
                    axisLabelFontSize: 12,
                    XaxisLabelFontSize: 12,
                    ysplitLine: true,
                    series: res.series,
                    boundaryGap: true,
                    nameTextStyle: {
                        color: 'rgba(255,255,255,.75)',
                        fontSize: 12
                    },
                    nameGap: 25,

                    xaxisTickShow: false,
                    interval: 0,

                }

                this.$nextTick(function() {
                    this.EchartsLarge.lineChart2(lineoptions);
                });





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
                keys: this.index,
                roadId: this.crossData.crossId,
                menuId: this.menu.value,
                dateType: this.dateType.type,
                analysisTime: this.dateKey[this.dateType.type + '1'],
                baseTime: this.dateKey[this.dateType.type + '2']
            }

            http.post(SERVICE_URL + 'expressway/analysis/getIdxChart?', param).then((data) => {

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

                var dom = 'lineEct2';
                var linelegendData = [];
                res.series.forEach((item, index) => {
                    linelegendData.push(item.name)
                    item.areaStyle = {
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
                    color: 'rgba(255,255,255,.75)',
                    colors: c,
                    legendData: {
                        itemHeight: 7,
                        itemWidth: 7,
                        icon: 'circle',
                        data: linelegendData,
                        textStyle: {
                            color: 'rgba(255,255,255,.75)',
                            fontSize: 12
                        },
                        right: 30,
                        top: 10
                    },
                    // title: item.title,
                    xAxisData: res.times,
                    yAxisName: res.yaxisName,
                    gridLeft: 10,
                    gridBom: 10,
                    gridTop: 50,
                    gridRight: 30,
                    legendRight: 25,
                    yaxisTick: false,
                    yaxisLine: false,
                    yaxisLabelShow: true,
                    axisLabelFontSize: 12,
                    XaxisLabelFontSize: 12,
                    ysplitLine: true,
                    series: res.series,
                    boundaryGap: true,
                    nameTextStyle: {
                        color: 'rgba(255,255,255,.75)',
                        fontSize: 12
                    },
                    nameGap: 25,

                    xaxisTickShow: false,
                    interval: 0,

                }

                this.$nextTick(function() {
                    this.EchartsLarge.lineChart2(lineoptions);
                });











            }).catch((data) => {



            })
        },

        getStatisticsType() {

            var _this = this;
            var param = {

            };

            http.get(SERVICE_URL + 'safety/v2/getStatisticsType?', { params: param }).then((data) => {
                this.tableTypes = data.data.data;
            })
        },
        getStatisticsList() {

            var keys = this.tableTypes[this.menu.value].keys

            var param = Object.assign({

                crossId: this.crossData.crossId,
                menuId: this.menu.value,
                startTime: this.startTime,
                endTime: this.endTime,
                currentPage: 1,
                pageSize: 20
            }, keys)

            http.get(SERVICE_URL + 'safety/v2/getStatisticsList?', { params: param }).then((data) => {

                var res = this.listData = data.data.data;
                this.tableData = res.data;
            }).catch((data) => {



            })

        },
        getDetailType() {

            var _this = this;
            var param = {

            };

            http.get(SERVICE_URL + 'safety/v2/getDetailType?', { params: param }).then((data) => {
                this.tableTypes1 = data.data.data;
            })
        },
        getDetailList() {

            var keys = this.tableTypes1[this.menu.value].keys

            var param = Object.assign({

                crossId: this.crossData.crossId,
                menuId: this.menu.value,
                startTime: this.startTime,
                endTime: this.endTime,
                currentPage: this.page,
                pageSize: this.pageSize
            }, keys)

            http.get(SERVICE_URL + 'safety/v2/getDetailList?', { params: param }).then((data) => {

                var res = this.listData1 = data.data.data;
                this.tableData1 = res.data;
            }).catch((data) => {



            })

        },
        currentChange(val) {
            this.page = val;
            this.getDetailList()
        },
        inputKeydown(e) {
            if (e.keyCode == 13) {
                this.page = 1;
                this.getDetailList();
            }

        },
        handleClick(row) {
            if (row.typeCode == 6 || row.typeCode == 7) {
                this.eventData = '';
                this.accidentData = Object.assign(this.crossData, row)
                console.log(this.accidentData)
            } else {
                this.accidentData = '';
                this.eventData = Object.assign(this.crossData, row)
            }
        },
        getStatistics() {

            var _this = this;
            var param = {
                keys: this.checkboxGroup1.join(','),
                roadId: this.crossData.crossId,
                menuId: this.menu.value,
                dateType: this.dateType.type,
                analysisTime: this.dateKey[this.dateType.type + '1'],
                baseTime: this.dateKey[this.dateType.type + '2']
            }


            http.post(SERVICE_URL + 'expressway/analysis/getStatistics?', param).then((data) => {
                this.analysisFlow = data.data.data.analysisFlow;
                this.baseFlow = data.data.data.baseFlow;
            })
        },
        exportCsv() {

            var uri = 'expressway/analysis/export?'
            var param = {
                keys: this.checkboxGroup1.join(','),
                roadId: this.crossData.crossId,
                menuId: this.menu.value,
                dateType: this.dateType.type,
                analysisTime: this.dateKey[this.dateType.type + '1'],
                baseTime: this.dateKey[this.dateType.type + '2'],
                token: this.$store.state.store.token
            }
            var str = '';
            for (var key in param) {
                str += key + '=' + param[key] + '&'
            };
            str = str.substr(0, str.length - 1);
            var url = SERVICE_URL + uri + str;
            window.location.href = url;
        }
    }

});
</script>
<style lang="scss" scoped>
.s-left {
    width: 240px;
    padding-top: 70px;
    border-right: 1px solid rgba(255, 255, 255, 0.12);
    padding-right: 29px;

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

        p {
            padding-left: 25px;
            flex: 1;
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
    display: flex;
        flex-direction: column;
    position: relative;
    margin-left: 16px;
    padding-right: 15px;

    .title {
        float: left;
        margin-right: 10px;
        line-height: 30px;
        white-space: nowrap;
    }

    .s-right-info {
        width: 100%;
        height: 220px;
        display: flex;
        flex-direction: column;
        margin-bottom: 50px;




        .flex {
            flex: 1;
            display: flex;



            .s-map {
                flex: 1;

            }
        }
    }

    .s-right--chart {
        flex:2;
        display: flex;
        flex-direction: column;
        // position: absolute;
        // top: 250px;
        // bottom: 0;
        // width: 100%;

        .data-type-btn {
            background: #166DC7;
            text-align: center;
            padding: 0 5px;
            line-height: 30px;
            border-radius: 3px;
            cursor: pointer;

            float: right;
            margin: 25px 30px;
        }

    }


}
</style>
