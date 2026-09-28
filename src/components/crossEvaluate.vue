<template>
    <div class="component-box">
        <div class="main">
            <div style="flex:1;padding: 30px;display: flex;">
                <div class="cross-evaluate-left">
                    <div style="width: 240px;">
                        <cross-select @change="crossIdChange"></cross-select>
                    </div>
                    <div class="bar-box">
                        <div class="bar-date-box">
                            <span>分析日期</span>
                            <div class="date-box">
                                <el-date-picker v-model="analysisTime1" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions" @change="dateChange()">
                                </el-date-picker>
                            </div>-
                            <div class="date-box">
                                <el-date-picker v-model="analysisTime2" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions" @change="dateChange()">
                                </el-date-picker>
                            </div>
                        </div>
                        <div class="bar-date-box">
                            <span>基准日期</span>
                            <div class="date-box">
                                <el-date-picker v-model="baseTime1" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions" @change="dateChange()">
                                </el-date-picker>
                            </div>-
                            <div class="date-box">
                                <el-date-picker v-model="baseTime2" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions" @change="dateChange()">
                                </el-date-picker>
                            </div>
                        </div>
                    </div>
                    <div class="cross-info" v-if="CrossStatistics">
                        <div class="cross-level">
                            <div style="overflow: hidden;">
                                <li class="bg-none" style="float: left;">
                                    <img :src="assetUrl('../assets/image/screen/c/jx.png')" alt="">
                                    <span>{{CrossStatistics.crossLevel.name}}</span>
                                    <b>{{CrossStatistics.crossLevel.level}}</b>
                                    <img :src="CrossStatistics.crossLevel.upDown<0?assetUrl('../assets/image/screen/c/down.png'):CrossStatistics.crossLevel.upDown>0?assetUrl('../assets/image/screen/c/up.png'):''" alt="" v-show="CrossStatistics.crossLevel.upDown!==0">
                                </li>
                                <li class="bg-none" style="float: right;display: flex;">
                                    <span>{{CrossStatistics.flow.name}}</span>
                                    <b style="margin:0 5px 0 15px;">{{CrossStatistics.flow.value}}</b>
                                    <em style="font-size: 12px;margin-top: 3px;">{{CrossStatistics.flow.unit}}</em>
                                </li>
                            </div>
                            <div class="mark-box">{{CrossStatistics.crossLevel.assess}}</div>
                        </div>
                        <div class="cross-level" style="cursor: pointer;display: flex;" v-for="item in CrossStatistics.crossInfo" @click="levelClick(item)">
                            <li :class="levelId==item.id?'active':''">
                                <span>{{item.name}}</span>
                            </li>
                            <b>{{item.level}}</b>
                            <p>
                                <span>{{item.ratio}}</span>
                                <img :src="item.upDown<0?assetUrl('../assets/image/screen/c/down.png'):item.upDown>0?assetUrl('../assets/image/screen/c/up.png'):''" alt="">
                            </p>
                        </div>
                        <div style="display: flex;margin:10px auto;" class="type-box" v-if="tableData[0].id">
                            <li :class="tableDataType==item.id?'active':''" v-for="item in tableData" @click="tableDataTypeClick(item)">{{item.name}}</li>
                        </div>
                        <el-table v-if="dirList" :data="dirList.data" style="width: 476px;margin-top: 30px;background: none;font-size: 10px;" :height="300"  :max-height="300" :header-row-class-name="'list-header'" :row-class-name="'dir-row'" @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands">
                            <el-table-column type="expand">
                                <template #default="props">
                                    <el-form label-position="left" inline class="demo-table-expand">
                                        <el-table :data="props.row.child" :height="180" style="width: 476px;background: none;" :show-header="false" :header-row-class-name="'list-header'" :row-class-name="'dir-row dir-row-c'">
                                            <el-table-column v-for="item in dirList.title" :prop="item.prop" :key="item.prop">
                                            </el-table-column>
                                        </el-table>
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column v-for="item in dirList.title" :label="item.label" :prop="item.prop" :key="item.prop">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="cross-evaluate-right">
                    <div class="flex">
                        <div style="flex:1.5;">
                            <p class="cross-evaluate-right-title">
                                <img :src="assetUrl('../assets/image/screen/c/jx.png')" alt="">
                                <span>{{levelName}}</span>
                                <span>{{crossData.crossName}}</span>
                                <i>
                                    <</i> <span>{{row?row.name:'分方向分析'}}</span>
                                        <i v-show="row">
                                            <</i> <span v-show="row">分转向分析</span>
                            </p>
                            <div style="display: flex;margin:10px auto;" class="type-box" v-if="types.length>0">
                                <li :class="type==item.value?'active':''" v-for="item in types" @click="typeClick(item)">{{item.name}}</li>
                            </div>
                            <div class="bar-ect" id="barEct"></div>
                        </div>
                        <div class="cross-dir-map">
                            <div id="dirMap" style="width: 100%;height: 100%;"></div>
                            <span>{{laneTime}}</span>
                        </div>
                    </div>
                    <div class="cross-ev-charts">
                        <div style="height: 50%; border-bottom: 2px dashed #364D72;">
                            <div style="padding: 10px 0;overflow: hidden;">
                                <el-checkbox-group style="float:left;" v-model="checkList" :min="1" @change="checkChange()">
                                    <el-checkbox label="分析时间">{{'分析时间（'+analysisTime1+' 至 '+analysisTime2+'）'}}</el-checkbox>
                                    <el-checkbox label="基准时间">{{'基准时间（'+baseTime1+' 至 '+baseTime2+'）'}}</el-checkbox>
                                </el-checkbox-group>
                                <el-button type="primary" size="mini" :icon="Upload" style="float: right;" @click="exportCsv()" :loading="exportLoading">导出</el-button>
                            </div>
                            <div id="lineEct" style="height: 80%;"></div>
                        </div>
                        <div style="height: 50%;overflow: hidden;padding-top: 10px;">
                            <div style="float:left;width: 50%;height: 100%;" id="heatMap0"></div>
                            <div style="float:left;width: 50%;height: 100%;" id="heatMap1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Upload } from '@element-plus/icons-vue';
import http from '@/api/http';

defineOptions((() => {
const { SERVICE_URL } = window.APP_CONFIG;

const assetModules = import.meta.glob('../assets/image/**/*', { eager: true, import: 'default' }) as Record<string, string>;
const assetUrl = (path: string): string => assetModules[path] ?? '';

return {

    data() {
        return {
            crossList: [],
            crossData: '',
            crossId: '',
            crossListObj: {},
            analysisTime1: '',
            analysisTime2: '',
            baseTime1: '',
            baseTime2: '',
            timeFrames: [],
            timeFrame: '',
            crossLevelList: [{
                name: "交通安全",
                value: 'A',
                value1: '0.04%',
                icon: assetUrl('../assets/image/screen/c/up.png')
            }, {
                name: "交通效率",
                value: 'C',
                value1: '12.98%',
                icon: assetUrl('../assets/image/screen/c/up.png')
            }, {
                name: "平顺性",
                value: 'C',
                value1: '19.77%',
                icon: assetUrl('../assets/image/screen/c/down.png')
            }],
            CrossStatistics: '',
            urls: [],
            dirList: '',
            dirMap: null,
            levelId: null,
            levelName: null,
            ectData: null,
            ectBox: null,
            pieBox: true,

            expands: [], //只展开一行放入当前行id
            getRowKeys(row) { //设置row-key只展示一行
                return row.id
            },
            row: '',
            types: [],
            type: '',
            checkList: ['分析时间'],
            lineEct: null,
            laneTime: '',
            queryParams: {
                taskStart: null
            },
            pickerOptions: {

                disabledDate(time) {
                    return time.getTime() > Date.now();
                }

            },
            tableData: [],
            tableDataType: '',
            loading: null,
            exportLoading: false,

        }
    },
    watch: {

    },
    created() {
        this.crossData = JSON.parse(sessionStorage.getItem('crossData'));
        this.crossId = this.crossData.crossId;

        this.analysisTime1 = this.mapUtils.getDateYMD('ymd', -60 * 24)
        this.analysisTime2 = this.mapUtils.getDateYMD('ymd', -60 * 24)
        this.baseTime1 = this.mapUtils.getDateYMD('ymd', -60 * 48)
        this.baseTime2 = this.mapUtils.getDateYMD('ymd', -60 * 48)

    },
    mounted() {
        this.getCrossStatistics()
        this.initdirMap()



    },
    unmounted() {
        if (this.dirMap) {
            this.dirMap.remove()
        }


    },
    methods: {
        exportCsv() {
            this.exportLoading = true;
            var time = this.analysisTime1 + ',' + this.analysisTime2;
            var param = {
                crossId: this.crossData.crossId,
                time: time
            };

            http.get(SERVICE_URL + 'cross/evaluate/v3/exportInfo?', { params: param }).then((data) => {


                var url = SERVICE_URL + 'cross/evaluate/v3/exportInfo?crossId=' + this.crossData.crossId + '&time=' + time + '&token=' + sessionStorage.getItem('token');
                document.location.href = url;
                this.exportLoading = false;

            }).catch(() => {
                this.exportLoading = false;
            })

        },
        expandChange(row, expanded) {

            if (expanded.length) { //说明展开了
                this.expands = [];
                if (row) {
                    this.expands.push(row.id); //只展开当前行id
                    if (!!row.child && row.child.length > 0) {
                        this.row = row;
                        this.getEvaluateDetail()
                    }
                }
            } else { //说明收起了
                this.expands = [];
                this.row = '';
                this.getEvaluateDetail()
            }

        },
        dateChange() {
            this.getCrossStatistics()
        },
        crossIdChange(item) {
            this.crossData = item;
            this.dirMap.flyTo({ center: [item.centerX, item.centerY] })
            this.getCrossStatistics()
            this.getLaneStateInfo()
        },
        getCrossStatistics() {

            var _this = this;
            var param = {
                crossId: this.crossData.crossId,
                analysisTime: this.analysisTime1 + ',' + this.analysisTime2,
                baseTime: this.baseTime1 + ',' + this.baseTime2


            };

            http.get(SERVICE_URL + 'cross/evaluate/v3/getCrossStatistics?', { params: param }).then((data) => {

                var res = this.CrossStatistics = data.data.data;

                this.levelId = res.crossInfo[0].id;
                this.levelName = res.crossInfo[0].name;
                this.tableData = res.crossInfo[0].tableData;
                this.tableDataType = res.crossInfo[0].tableData[0].id;
                this.dirList = res.crossInfo[0].tableData[0];
                this.getStatisticsType()
            })
        },
        levelClick(item) {
            console.log(item)
            this.levelId = item.id;
            this.levelName = item.name;
            this.tableData = item.tableData;
            this.tableDataType = item.tableData[0].id ? item.tableData[0].id : '';
            this.dirList = ''
            this.$nextTick(()=>{
                this.dirList = item.tableData[0];
            })

            this.expands = [];
            this.getStatisticsType()

        },
        tableDataTypeClick(item) {
            this.dirList = ''
            this.$nextTick(()=>{
                this.dirList = item;
            })

            this.tableDataType = item.id;
            this.getStatisticsType()
        },
        getStatisticsType() {

            var _this = this;
            var param = {
                id: this.levelId,
                childId: this.tableDataType

            };

            http.get(SERVICE_URL + 'cross/evaluate/v3/getStatisticsType?', { params: param }).then((data) => {
                if (!!data.data.data && data.data.data.length > 0) {
                    var res = this.types = data.data.data;
                    this.type = res[0].value;
                    this.getEvaluateDetail()
                }
            })
        },
        typeClick(item) {
            this.type = item.value;
            this.getEvaluateDetail()
        },
        openFullScreen() {

            this.loading = this.$loading({
                lock: true,
                target: '.cross-evaluate-right',
                text: 'Loading',
                background: 'rgba(13, 20, 27, 0.6)'
            });


        },
        getEvaluateDetail() {
            // this.openFullScreen()
            this.dirMap.removeLayerAndSource('heatmapLayer')
            var _this = this;
            var param = {
                crossId: this.crossData.crossId,
                analysisTime: this.analysisTime1 + ',' + this.analysisTime2,
                baseTime: this.baseTime1 + ',' + this.baseTime2,
                menuId: this.levelId,
                dirId: this.row ? this.row.id : '',
                indexId: this.type

            };

            http.get(SERVICE_URL + 'cross/evaluate/v3/getEvaluateDetail?', { params: param }).then((data) => {
                // this.loading.close()
                var res = this.ectData = data.data.data;

                var colors = [
                    ['#0067D1', '#2E94FF'],
                    ['#7124B9', '#9F51E7'],
                    ['#008CC3', '#2EB9F1'],
                    ['#E40078', '#ED5CA9'],
                    ['#009DA5', '#2ECAD2'],
                    ['#3BA73B', '#68D568'],
                    ['#E42729', '#FA2A2D'],
                    ['#3447c0', '#6174ED'],
                    ['#E86B00', '#FF7500'],
                    ['#E8AE00', '#FFBF00'],
                ];

                this.$nextTick(function() {

                    if (res.bar) {

                        var legendData = [];

                        res.bar.series.forEach((item, index) => {
                            legendData.push(item.name)
                            item.barWidth = 7.5;
                            item.itemStyle = {
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
                            dom: 'barEct',
                            color: '#ffffff',

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
                            gridLeft: 15,
                            gridBom: 0,
                            gridTop: 45,
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
                        this.EchartsLarge.barChart(baroptions);
                    };

                    if (res.line) {

                        var linelegendData = [],
                            series = [];
                        res.line.series.forEach((item, index) => {

                            this.checkList.forEach(c => {
                                if (item.name.indexOf(c) > -1) {
                                    linelegendData.push(item.name)
                                    series.push(item)
                                }
                            })
                        });
                        this.lineSeries = res.line.series;
                        var c = [];
                        colors.forEach(item => {
                            if (!item) {
                                return
                            }
                            c.push(item[0])
                        })
                        var options = {
                            dom: 'lineEct',
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
                                right: 20,
                                top: 15
                            },
                            xAxisData: res.line.times,
                            yAxisName: res.line.yaxisName,
                            gridLeft: 10,
                            gridBom: 0,
                            gridTop: 50,
                            gridRight: 20,
                            legendRight: 25,
                            yaxisTick: false,
                            yaxisLine: true,

                            axisLabelFontSize: 12,
                            ysplitLine: true,
                            series: series,
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
                            }
                        }

                        this.lineEct = this.EchartsLarge.lineChart2(options)
                    }

                    if (res.hot) {
                        res.hot.forEach((item, i) => {
                            var dom = 'heatMap' + i;
                            var hours = item.value.hours;
                            var days = item.value.days;
                            var data = item.value.data;
                            data = data.map(function(item) {
                                return [item[1], item[0], item[2] || '-'];
                            });
                            var option = {
                                title: item.name,
                                dom: dom,
                                days: days,
                                hours: hours,
                                data: data,
                                gridTop: 30,
                                gridRight: 70,
                                gridHight:'70%',
                                visualMapMin: item.value.visualMap.min,
                                visualMapMax: item.value.visualMap.max
                                // seriesLabel:false


                            }
                            this.EchartsLarge.heatmapChart(option)
                        })
                    }
                    // if (res.map) {
                    //     var features = []
                    //     res.map.forEach(item => {
                    //         var obj = {
                    //             "type": "Feature",
                    //             "geometry": {
                    //                 "type": "Point",
                    //                 "coordinates": item.point
                    //             },
                    //             "properties": {
                    //                 "mag": item.num
                    //             }
                    //         }
                    //         features.push(obj)
                    //     })
                    //     const opt = {
                    //         id: 'heatmapLayer',
                    //         features: features,
                    //         maps: this.dirMap

                    //     };
                    //     this.mapUtils.addHeatmap(opt)
                    // }

                })

            }).catch((data) => {

                // this.loading.close()

            })
        },
        // 车道路况
        getLaneStateInfo() {
            const _this = this;
            this.mapUtils.removeLayers('', this.dirMap)
            var param = {
                crossId: this.crossData.crossId,
                type: 1

            }

            http.get(SERVICE_URL + 'cross/evaluate/getLaneStateInfo?', {
                params: param

            }).then((data) => {
                var res = this.laneList = data.data.data.data;
                this.laneTime = data.data.data.time;
                res.forEach((item, index) => {


                    item.lanesWkt.forEach((w, i) => {

                        var lines = [];
                        var line = w.replace('LINESTRING(', '').replace(')', '').split(',')

                        line.forEach(l => {
                            var xy = l.split(' ').map(Number)
                            lines.push(xy)
                        })

                        var state = item.states[i];

                        var color = state == 0 ? 'rgba(124, 124, 122, 1)' : state == 1 ? 'rgba(19, 134, 22, 1)' : state == 2 ? 'rgba(222, 161, 29, 1)' : state == 3 ? 'rgba(222, 29, 29, 1)' : 'rgba(98, 3, 3, 1)';
                        var state1 = i < item.states.length - 1 ? item.states[i + 1] : item.states[0];
                        var color1 = state1 == 0 ? 'rgba(124, 124, 122, 1)' : state1 == 1 ? 'rgba(19, 134, 22, 1)' : state1 == 2 ? 'rgba(222, 161, 29, 1)' : state1 == 3 ? 'rgba(222, 29, 29, 1)' : 'rgba(98, 3, 3, 1)';
                        this.mapUtils.addmapLine({
                            maps: this.dirMap,
                            id: item.laneId + i,
                            lines: lines,
                            arrow: false,
                            type: '',
                            color: color,
                            minzoom: 17,
                            strokeWeight: 8,
                            lineGradient: [
                                'interpolate',
                                ['linear'],
                                ['line-progress'],
                                0, color,
                                0.1, color1
                            ]
                        })
                    })


                })
            }).catch((err) => {
                if (http.isCancel(err)) {
                    console.log('Rquest canceled', err.message); //请求如果被取消，这里是返回取消的message
                } else {
                    //handle error
                    console.log(err);
                }
            })
        },
        checkChange() {
            var linelegendData = [],
                series = [];
            this.lineSeries.forEach((item, index) => {

                this.checkList.forEach(c => {
                    if (item.name.indexOf(c) > -1) {
                        linelegendData.push(item.name)
                        series.push(item)
                    }
                })
            });
            var opt = this.lineEct.getOption();
            opt.legend[0].data = linelegendData;
            opt.series = series;
            this.lineEct.setOption(opt, true)
        },
        getTrafficHot() {

            var _this = this;
            var param = {
                crossId: this.crossData.crossId,
                analysisTime: this.analysisTime1 + ',' + this.analysisTime2,
                baseTime: this.baseTime1 + ',' + this.baseTime2


            };

            http.get(SERVICE_URL + 'cross/evaluate/v2/getTrafficHot?', { params: param }).then((data) => {
                this.dirMap.removeLayerAndSource('heatmapLayer')
                var features = []
                data.data.data.forEach(item => {
                    var obj = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [item.centerX, item.centerY]
                        },
                        "properties": {
                            "mag": item.value
                        }
                    }
                    features.push(obj)
                })
                const opt = {
                    id: 'heatmapLayer',
                    features: features,
                    maps: this.dirMap

                };
                this.mapUtils.addHeatmap(opt)
            })
        },
        initdirMap() {

            mapabcgl.accessToken = mapabcglToken;
            var _this = this;
            this.dirMap = new mapabcgl.Map({
                container: 'dirMap',
                style: MIN_MAP_STYLE,
                zoom: 17,
                maxZoom: maxZoom,
                minZoom: minZoom,
                center: [this.crossData.centerX, this.crossData.centerY],
                pitch: 0
            });


            this.dirMap.on('load', function() {
                _this.getLaneStateInfo()
            });
            this.dirMap.on('click', function(e) {

            });


        },
    }

} })());
</script>
<style lang="scss">
.component-box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: rgba(0, 0, 0, .68);

    .main {

        .cross-evaluate-left {
            width: 497px;
            height: 100%;


            .bar-box {
                width: 465px;
                height: 85px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                margin-bottom: 30px;
                padding-left: 15px;

                .bar-date-box {
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    display: flex;
                    justify-content: space-between;

                    span {
                        white-space: nowrap;
                        display: block;
                        font-size: 12px;
                        font-family: Source Han Sans CN;
                        font-weight: 400;
                        color: #FFFFFF;
                    }

                    .date-box {
                        width: 180px;

                    }

                    .select-box {
                        width: 390px;
                    }



                }

            }

            .cross-info {
                width: 465px;
                height: 475px;

                padding: 0 15px 30px 15px;

                .cross-level {
                    border-bottom: 1px solid #2A4165;
                    padding: 12px 0;
                    line-height: 32px;

                    .active {
                        background-image: url(../assets/image/screen/c/btn-bg.png);
                        background-size: 100% 100%;
                    }

                    li {
                        min-width: 128px;
                        height: 32px;
                        background-image: url(../assets/image/screen/c/bg.png);
                        background-size: 100% 100%;
                        line-height: 32px;
                        text-align: center;

                        span {
                            font-size: 12px;
                            font-family: Kozuka Gothic Pr6N;
                            font-weight: normal;
                            color: #FFFFFF;
                        }
                    }

                    .bg-none {
                        background: none;
                        text-align: left;

                        img {
                            width: 14px;
                            height: 14px;

                        }

                        span {
                            font-size: 14px;
                            margin-left: 10px;
                        }
                    }

                    b {
                        font-size: 22px;
                        font-family: Kozuka Gothic Pr6N;
                        font-weight: normal;
                        color: #4BF3F9;
                        white-space: nowrap;
                        margin-left: 65px;

                    }

                    i {
                        display: block;
                        padding-top: 13px;
                        height: 26px;
                        margin-left: 26px;
                    }

                    p {

                        line-height: 32px;
                        display: flex;
                        text-align: right;
                        width: 290px;

                        span {
                            flex: 1;
                            font-size: 22px;
                            font-family: Kozuka Gothic Pr6N;
                            font-weight: normal;
                            color: #FFFFFF;
                        }

                        img {
                            margin-left: 12px;
                            // padding-top: 13px;
                            height: 26px;
                        }
                    }

                }

                .el-table .dir-row td,
                .el-table th.is-leaf {
                    border: none;

                }
            }

            .cross-mark {
                p {
                    margin-top: 30px;
                    line-height: 40px;

                    span {
                        font-size: 14px;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #FFFFFF;
                        margin-left: 10px;
                    }

                    img {
                        width: 14px;
                        height: 14px;
                    }
                }

                .mark-box {
                    width: 430px;
                    height: 80px;
                    background: #0b295c;
                    border: 1px solid #91A9FF;
                    padding: 10px 15px;
                }


            }
        }

        .cross-evaluate-right {
            flex: 1;
            margin-left: 40px;
            display: flex;
            flex-direction: column;

            padding-right: 15px;

            .cross-evaluate-right-title {
                font-size: 14px;
                font-family: PingFang SC;
                font-weight: 600;
                color: #FFFFFF;
                // border-bottom: 2px dashed #364D72;
                padding-bottom: 10px;

                img {
                    width: 14px;
                    height: 14px;
                }

                span {
                    margin: 0 10px;
                }
            }

            .flex {
                display: flex;
                flex: 1;

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
                    // box-shadow: 0 0 14px 0px #2aa9c0 inset;
                }

                .bar-ect {
                    height: 200px;

                }

                .cross-dir-map {
                    position: relative;
                    flex: 1;
                    margin-top: 40px;

                    span {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                    }
                }
            }

            .cross-ev-charts {
                width: 100%;
                flex: 1.5;
                margin-top: 15px;
                border-top: 2px dashed #364D72;

                .el-checkbox {
                    color: #fff;
                }

                .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
                    background-color: #409EFF;
                }

                .el-checkbox__input.is-disabled+span.el-checkbox__label {
                    color: #409EFF;
                }

                .title {
                    width: 145px;
                    height: 30px;
                    background: rgba(16, 61, 105, 0.5);
                    border: 1px solid #58B6FF;
                    font-size: 14px;
                    font-family: Adobe Heiti Std;
                    font-weight: normal;
                    color: #C8DBF4;
                    line-height: 30px;
                    text-align: center;
                    margin-right: 10px;
                    cursor: pointer;
                }

                .border {
                    border-bottom: 2px dashed #364D72;
                }
            }

        }
    }
}
</style>
