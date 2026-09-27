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
                            <span class="title">分析日期</span>
                            <div class="c-date-box">
                                <el-date-picker v-model="dateKey[dateType.key1]" :type="dateType.type" :format="dateType.format" :value-format="dateType.valueFormat" :picker-options="pickerOptions" placeholder="选择日期" @change="getHourLineCharts(),getStatisticsData()">
                                </el-date-picker>
                            </div>
                        </div>
                        <div>
                            <span class="title">基准日期</span>
                            <div class="c-date-box">
                                <el-date-picker v-model="dateKey[dateType.key2]" :type="dateType.type" :format="dateType.format" :value-format="dateType.valueFormat" :picker-options="pickerOptions" placeholder="选择日期" @change="getHourLineCharts(),getStatisticsData()">
                                </el-date-picker>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="s-right">
                    <div class="s-right-info">
                        <div class="flex" style="max-width: 50%;flex-wrap:wrap;align-items: center;">
                            <li v-for="(item,i) in statistics">
                                <p style="text-align: center;">
                                    <img style="width: 36px;height: 36px;" :src="item.icon" alt="">
                                </p>
                                <p>
                                    <b>{{item.value}}</b>
                                    <em>{{item.unit}}</em>
                                    <img :src="item.updown>0?assetUrl('../assets/image/screen/c/up1.png'):item.updown<0?assetUrl('../assets/image/screen/c/down1.png'):''" alt="">
                                    <span>{{item.name}}</span>
                                </p>
                            </li>
                        </div>
                        <div class="flex" style="border: 1px solid #3B94F3;padding:8px;">
                            <div class="s-map" id="sMap"></div>
                        </div>
                    </div>
                    <div class="s-right-chart">
                        <div style="height: 50%;display: flex;flex-direction: column;">
                            <div class="ect-select-box" v-if="ectTypes">
                                <div class="ect-select" v-for="item in ectTypes[menu.value].type1" v-show="dataType==1">
                                    <span class="title">{{item.title}}</span>
                                    <el-select v-model="ectTypes[menu.value].keys[item.key]" @change="getHourLineCharts()">
                                        <el-option v-for="item in item.data" :key="item.value" :label="item.name" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="ect-select" v-for="item in tableTypes[menu.value].types" v-show="dataType==2">
                                    <span class="title">{{item.title}}</span>
                                    <el-select v-model=" tableTypes[menu.value].keys[item.key]" @change="page = 1,getStatisticsList()">
                                        <el-option v-for="item in item.data" :key="item.value" :label="item.name" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="ect-select" v-for="(item,i) in tableTypes1[menu.value].types" v-show="dataType==3">
                                    <span class="title">{{item.title}}</span>
                                    <el-select v-model=" tableTypes1[menu.value].keys[item.key]" @change="page = 1,getDetailList()" v-if="item.type=='select'">
                                        <el-option v-for="item in item.data" :key="i+item.value" :label="item.name" :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="tableTypes1[menu.value].keys[item.key]" placeholder="回车搜索" v-if="item.type=='input'" @keydown="inputKeydown"></el-input>
                                </div>
                                <div class="ect-select" v-show="dataType==2||dataType==3">
                                    <span class="title">开始时间</span>
                                    <el-date-picker style="flex:1;min-width: 120px;" v-model="startTime" ttype="date" value-format="yyyy-MM-dd" placeholder="选择日期" @change="page = 1,getStatisticsList(),getDetailList()">
                                    </el-date-picker>
                                </div>
                                <div class="ect-select" v-show="dataType==2||dataType==3">
                                    <span class="title">结束时间</span>
                                    <el-date-picker style="flex:1;min-width: 120px;" v-model="endTime" ttype="date" value-format="yyyy-MM-dd" placeholder="选择日期" @change="page = 1,getStatisticsList(),getDetailList()">
                                    </el-date-picker>
                                </div>
                                <div class="data-type-btn" v-show="dataType==1" @click="dataType=2">
                                    <i class="el-icon-s-grid"></i>
                                    <span>数据统计</span>
                                </div>
                                <div class="data-type-btn" v-show="dataType==1" @click="dataType=3">
                                    <i class="el-icon-s-grid"></i>
                                    <span>事件详情</span>
                                </div>
                                <div class="data-type-btn" v-show="dataType==2||dataType==3" @click="dataType=1">
                                    <i class="el-icon-s-data"></i>
                                    <span>图表展示</span>
                                </div>
                                <div class="data-type-btn" v-show="dataType==2||dataType==3" @click="exportCsv()">
                                    <i class="el-icon-upload2"></i>
                                    <span>导出</span>
                                </div>
                            </div>
                            <div class="ect-box" v-show="dataType==1">
                                <div style="flex:1;display: flex;flex-direction: column;">
                                    <div id="line" style="flex:1;"></div>
                                </div>
                            </div>
                        </div>
                        <div style="height: 48%;margin-top:2%;" v-show="dataType==1">
                            <div style="height: 100%;display: flex;flex-direction: column;">
                                <div class="ect-select-box" v-if="ectTypes">
                                    <div class="ect-select" v-for="item in ectTypes[menu.value].type2">
                                        <span class="title">{{item.title}}</span>
                                        <el-select v-model="ectTypes[menu.value].keys[item.key]" @change="getHourLineCharts()">
                                            <el-option v-for="item in item.data" :key="item.value" :label="item.name" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="ect-box" v-show="dataType==1">
                                    <div style="flex:1;display: flex;flex-direction: column;">
                                       
                                        <div id="line0" style="flex:1;"></div>
                                    </div>
                                    <div style="flex:1;display: flex;flex-direction: column;">
                                       
                                        <div id="line1" style="flex:1;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="table" v-if="dataType==2&&listData">
                            <el-table :data="tableData.resultList" style="background: none;" :max-height="445" border :header-row-class-name="'list-header'" :row-class-name="'dir-row'">
                                <el-table-column v-for="item in listData.title" :label="item.label" :prop="item.prop" :key="item.prop" v-if="!item.button">
                                </el-table-column>
                                <el-table-column label="操作" width="100" v-for="item in listData.title" :label="item.label" :key="item.prop" v-if="item.button">
                                    <template #default="scope">
                                        <el-button type="text" size="small">{{scope.row.handleName}}</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="table" v-if="dataType==3&&listData1">
                            <el-table :data="tableData1.resultList" style="background: none;" :max-height="445" border :header-row-class-name="'list-header'" :row-class-name="'dir-row'">
                                <el-table-column v-for="item in listData1.title" :label="item.label" :prop="item.prop" :key="item.prop" v-if="!item.button">
                                </el-table-column>
                                <el-table-column label="操作" width="100" v-for="item in listData1.title" :label="item.label" :key="item.prop" v-if="item.button">
                                    <template #default="scope">
                                        <el-button @click="handleClick(scope.row)" type="text" size="small">{{scope.row.handleName}}</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="page-box" v-if="dataType==3&&tableData1">
                            <el-pagination small background layout=" prev, pager, next" prev-text="上一页" next-text="下一页" :total="tableData1.totalNum" @current-change="currentChange" :current-page="page" :page-size="pageSize" style="float:right;">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import http from '@/api/http';
import eventInfo from './eventInfo.vue';
import accidentInfo from './accidentInfo.vue';

defineOptions((() => {
const { SERVICE_URL } = window.APP_CONFIG;

const assetModules = import.meta.glob('../assets/image/**/*', { eager: true, import: 'default' }) as Record<string, string>;
const assetUrl = (path: string): string => assetModules[path] ?? '';

return {

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
            accidentData: ''

        }
    },
    computed: {

    },

    watch: {
        dateType(val) {
            this.getStatisticsData()
            if (this.dataType == 1) {
                this.getHourLineCharts()
            }
        },
        dataType(val) {
            if (val == 1) {
                this.getHourLineCharts()
            } else if (val == 2) {
                this.getStatisticsList()
            } else {
                this.getDetailList()
            }
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
        this.getStatisticsType()
        this.getDetailType()
    },
    unmounted() {

    },

    methods: {

        crossIdChange(item) {
            this.crossData = item;
            this.map.flyTo({ center: [item.centerX, item.centerY] })
            this.getStatisticsData();
            if (this.dataType == 1) {
                this.getMenuList()
            } else if (this.dataType == 2) {
                this.getStatisticsList()
            } else {
                this.getDetailList()
            }
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
                _this.getStatisticsData();
            });
            this.map.on('click', function(e) {

            });

        },
        getEventTypes() {

            var _this = this;
            var param = {

            };

            http.get(SERVICE_URL + 'road/safety/v2/getEventTypes?', { params: param }).then((data) => {
                this.menuData = data.data.data;
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
                this.initMap()

                this.getMenuList()


            })
        },
        getMenuList() {

            var _this = this;
            var param = {
                rid: this.crossData.crossId
            };

            http.get(SERVICE_URL + 'road/safety/v2/getMenuList?', { params: param }).then((data) => {
                this.ectTypes = data.data.data;
                this.getHourLineCharts()
            })
        },

        menuClick(item) {
            this.menu = item;
            this.page = 1;
            this.getStatisticsData()
            if (this.dataType == 1) {
                this.getHourLineCharts()
            } else if (this.dataType == 2) {
                this.getStatisticsList()
            } else {
                this.getDetailList()
            }
        },
        getStatisticsData() {
            var _this = this;
            var param = {
                rid: this.crossData.crossId,
                menuId: this.menu.value,
                dateType: this.dateType.type,
                analysisTime: this.dateKey[this.dateType.type + '1'],
                baseTime: this.dateKey[this.dateType.type + '2']

            };
            http.get(SERVICE_URL + 'road/safety/v2/getStatisticsData?', { params: param }).then((data) => {
                var res = data.data.data;
                this.statistics = res.statistics;
                this.statistics.forEach(async (item) => {
                    try {
                        var url = assetUrl('../assets/image/screen/c/' + item.icon + '.png');
                        item.icon = url
                    } catch (e) {}
                });

                this.map.removeLayerAndSource('heatmapLayer')
                var features = []
                res.hot.forEach(item => {
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

        // 小时统计线图数据
        getHourLineCharts() {
            this.getDayLineCharts()
            if (this.dateType.type == 'week') {
                if (typeof this.dateKey.week1 !== 'string') {
                    this.dateKey.week1 = this.dateToString(this.dateKey.week1);
                    this.dateKey.week2 = this.dateToString(this.dateKey.week2);
                };
            }

            var param = {
                keys: this.ectTypes[this.menu.value].keys,
                rid: this.crossData.crossId,
                menuId: this.menu.value,
                dateType: this.dateType.type,
                analysisTime: this.dateKey[this.dateType.type + '1'],
                baseTime: this.dateKey[this.dateType.type + '2']
            }

            http.post(SERVICE_URL + 'road/safety/v2/getHourLineCharts?', param).then((data) => {

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
                var linelegendData = [];
                res.series.forEach((item, i) => {
                    linelegendData.push(item.name)

                })
                var c = []
                colors.forEach(item => {
                    c.push(item[0])
                })
                var lineoptions = {
                    dom: 'line',
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
                    title: '小时统计',
                    titleX: 'left',
                    xAxisData: res.times,
                    yAxisName: res.yaxisName,
                    gridLeft: 10,
                    gridBom: 10,
                    gridTop: 80,
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
                        fontSize: 12,

                    },
                    nameGap: 15,

                    xaxisTickShow: false,
                    interval: 0,

                }

                this.$nextTick(function() {
                    this.EchartsLarge.lineChart2(lineoptions);
                });

            }).catch((data) => {



            })
        },
        // 日统计线图数据
        getDayLineCharts() {

            if (this.dateType.type == 'week') {
                if (typeof this.dateKey.week1 !== 'string') {
                    this.dateKey.week1 = this.dateToString(this.dateKey.week1);
                    this.dateKey.week2 = this.dateToString(this.dateKey.week2);
                };
            }

            var param = {
                keys: this.ectTypes[this.menu.value].keys,
                rid: this.crossData.crossId,
                menuId: this.menu.value,
                dateType: this.dateType.type,
                analysisTime: this.dateKey[this.dateType.type + '1'],
                baseTime: this.dateKey[this.dateType.type + '2']
            }

            http.post(SERVICE_URL + 'road/safety/v2/getDayLineCharts?', param).then((data) => {

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
                var time = [res.times,res.times2]
                res.series.forEach((item, i) => {
                    var linelegendData = [];
                    linelegendData.push(item.name)
                    var dom = 'line' + i;
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
                        title: '日统计',

                        titleX: 'left',
                        xAxisData: time[i],
                      
                        yAxisName: res.yaxisName,
                        gridLeft: 10,
                        gridBom: 10,
                        gridTop: 80,
                        gridRight: 30,
                        legendRight: 25,
                        yaxisTick: false,
                        yaxisLine: false,
                        yaxisLabelShow: true,
                        axisLabelFontSize: 12,
                        XaxisLabelFontSize: 12,
                        ysplitLine: true,
                        series: item,
                        boundaryGap: true,
                        nameTextStyle: {
                            color: 'rgba(255,255,255,.75)',
                            fontSize: 12,

                        },
                        nameGap: 15,

                        xaxisTickShow: false,
                        interval: 0,

                    }

                    this.$nextTick(function() {
                        this.EchartsLarge.lineChart2(lineoptions);
                    });

                })


            }).catch((data) => {



            })
        },
        getStatisticsType() {

            var _this = this;
            var param = {

            };

            http.get(SERVICE_URL + 'road/safety/v2/getStatisticsType?', { params: param }).then((data) => {
                this.tableTypes = data.data.data;
            })
        },
        getStatisticsList() {

            var keys = this.tableTypes[this.menu.value].keys

            var param = Object.assign({

                rid: this.crossData.crossId,
                menuId: this.menu.value,
                startTime: this.startTime,
                endTime: this.endTime,
                currentPage: 1,
                pageSize: 20
            }, keys)

            http.get(SERVICE_URL + 'road/safety/v2/getStatisticsList?', { params: param }).then((data) => {

                var res = this.listData = data.data.data;
                this.tableData = res.data;
            }).catch((data) => {



            })

        },
        getDetailType() {

            var _this = this;
            var param = {

            };

            http.get(SERVICE_URL + 'road/safety/v2/getDetailType?', { params: param }).then((data) => {
                this.tableTypes1 = data.data.data;
            })
        },
        getDetailList() {

            var keys = this.tableTypes1[this.menu.value].keys

            var param = Object.assign({

                rid: this.crossData.crossId,
                menuId: this.menu.value,
                startTime: this.startTime,
                endTime: this.endTime,
                currentPage: this.page,
                pageSize: this.pageSize
            }, keys)

            http.get(SERVICE_URL + 'road/safety/v2/getDetailList?', { params: param }).then((data) => {

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
                row.crossId = this.crossData.crossId;
                this.accidentData = Object.assign(this.crossData, row)

            } else {
                row.crossId = this.crossData.crossId;
                this.accidentData = '';
                this.eventData = Object.assign(this.crossData, row)
            }
        },
        exportCsv() {
            if (this.dataType == 2) {
                var keys = this.tableTypes[this.menu.value].keys
                var uri = 'safety/v2/statisticsExport?'
            } else {
                var keys = this.tableTypes1[this.menu.value].keys
                var uri = 'safety/v2/detailExport?'
            }

            var param = Object.assign({
                rid: this.crossData.crossId,
                menuId: this.menu.value,
                startTime: this.startTime,
                endTime: this.endTime,
                token: this.$store.state.store.token
            }, keys)
            var str = '';
            for (var key in param) {
                str += key + '=' + param[key] + '&'
            };
            str = str.substr(0, str.length - 1);
            var url = SERVICE_URL + 'road/' + uri + str;

            window.location.href = url;
        }
    }

} })());
</script>
<style lang="scss">
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
    position: relative;
    margin-left: 16px;

    padding-right: 15px;

    .s-right-info {
        width: 100%;
        height: 130px;
        display: flex;
        margin-bottom: 50px;

        .flex {
            flex: 1;
            display: flex;

            li {
                display: flex;
                margin-right: 30px;




                p {
                    flex: 1;
                    margin-right: 15px;
                    white-space: nowrap;

                    span {
                        display: block;
                        font-size: 15px;
                        font-family: PingFang SC;
                        font-weight: 400;
                        opacity: 0.7;
                    }

                    b {
                        font-size: 40px;
                        font-family: DIN Condensed;
                        font-weight: bold;
                        color: #FFFFFF;
                        display: inline-block;
                        // height: 50px;
                        // min-width: 40px;
                        text-align: center;
                        // border-radius: 50%;
                    }

                    em {
                        font-size: 12px;
                        opacity: 0.7;
                    }
                }
            }

            .s-map {
                flex: 1;

            }
        }
    }

    .s-right-chart {
        position: absolute;
        top: 180px;
        bottom: 0;
        width: 100%;

        .el-table__body-wrapper,
        .is-scrolling-none {
            min-height: auto;
        }

        .ect-select-box {
            width: 100%;
            height: 30px;
            display: flex;

            .ect-select {
                margin-right: 20px;
                height: 30px;
                flex: 1;
                display: flex;
                max-width: 200px;

                .title {
                    margin-right: 10px;
                    line-height: 30px;
                    white-space: nowrap;
                }

                .el-select {
                    flex: 1;
                }

                .el-input {
                    flex: 1;
                }

                .el-input--suffix .el-input__inner {
                    padding-right: 0;
                }

                .el-input__inner {
                    border: 1px solid #076294;
                    background: rgba(12, 44, 103, .53);
                }
            }

            .title {
                margin-right: 10px;
            }

            .data-type-btn {
                background: #166DC7;
                text-align: center;
                padding: 0 5px;
                line-height: 30px;
                border-radius: 3px;
                cursor: pointer;
                margin-right: 20px;
            }
        }

        .ect-box {
            margin-top: 10px;
            flex: 1;
            display: flex;

            .title-2 {

                margin-bottom: 10px;

                span {
                    font-size: 14px;
                }

                img {
                    width: 535px;
                }
            }
        }

        .table {
            width: 100%;

            position: absolute;
            top: 50px;
            bottom: 40px;

            .el-table--border th.gutter:last-of-type {
                border-bottom: 1px solid #2A4165;
            }

            .el-table__body-wrapper {
                bottom: 1px;
            }
        }
    }
}
</style>
