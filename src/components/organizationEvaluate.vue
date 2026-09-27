<template>
    <div class="component-box">
        <div class="main">
            <div style="flex:1;padding: 30px;display: flex;">
                <!--  <div class=" cross-nav" style="width: 300px;">
                    <div style="width: 240px;">
                        <cross-select @change="crossIdChange"></cross-select>
                    </div>
                    <div class="cross-nav-radio condition_box87">
                        <p class="cross-time-box">
                            <span style="float: left;margin-right: 20px;line-height: 28px;">{{$t("home.startingTime")}}</span>
                            <el-date-picker @change="timeChange" v-model="startTime" :clearable=false type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('home.startingTime')" :picker-options="pickerOptions1">
                            </el-date-picker>
                        </p>
                        <p class="cross-time-box">
                            <span style="float: left;margin-right: 20px;line-height: 28px;">{{$t("home.endTime")}}</span>
                            <el-date-picker @change="timeChange" v-model="endTime" :clearable=false type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('home.endTime')" :picker-options="pickerOptions2">
                            </el-date-picker>
                        </p>
                    </div>
                    <div class="cross-nav-title">{{$t("home.junctionEntrance")}}</div>
                    <div>
                        <ul v-for="item in ridList" class="list_menu list-menu" :class="ridActive==item.rid?'on':''" @click="ridClick(item)">
                            <li>
                                <h4 style="font-weight: normal;">
                                    <span v-text="item.descName" style="font-size: 14px;"></span>
                                </h4>
                            </li>
                        </ul>
                    </div>
                </div> -->
                <div class="ozt-map-box">
                    <!-- <div class="ozt-map" id="topMap"></div> -->
                    <div class="ozt-map" style="position: relative;">
                        <div id="bomMap" style="width: 100%;height: 100%;"></div>
                        <div class=" legend-box">
                            <li v-for="item in legendData">
                                <b style="text-align: right;flex:1;margin-right: 20px;">{{item.label+' km/h'}}</b>
                                <span style="width: 25px;height: 13px;border-radius: 3px;" :style="'background:'+item.color"></span>
                            </li>
                        </div>
                    </div>
                </div>
                <div class="ozt-info">
                    <div style="width: 240px;margin-bottom: -29px;">
                        <cross-select @change="crossIdChange"></cross-select>
                    </div>
                    <div class="cross-nav-radio" style="margin-bottom: 15px;">
                        <p class="cross-time-box">
                            <span style="float: left;margin-right: 20px;line-height: 28px;">{{$t("home.startingTime")}}</span>
                            <el-date-picker @change="timeChange" v-model="startTime" :clearable=false type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('home.startingTime')" :picker-options="pickerOptions1">
                            </el-date-picker>
                        </p>
                        <p class="cross-time-box">
                            <span style="float: left;margin-right: 20px;line-height: 28px;">{{$t("home.endTime")}}</span>
                            <el-date-picker @change="timeChange" v-model="endTime" :clearable=false type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('home.endTime')" :picker-options="pickerOptions2">
                            </el-date-picker>
                        </p>
                        <p class="cross-time-box">
                            <span style="float: left;margin-right: 20px;line-height: 28px;">进口方向</span>
                            <el-select v-model="ridActive" placeholder="请选择" style="float: left;width: 200px;" @change="ridChange()">
                                <el-option :key="''" :label="'全部'" :value="''"></el-option>
                                <el-option v-for="item in ridList" :key="item.rid" :label="item.descName" :value="item.rid">
                                </el-option>
                            </el-select>
                        </p>
                        <p class="cross-time-box">
                            <span style="float: left;margin-right: 20px;line-height: 28px;">出口方向</span>
                            <el-select v-model="outRidActive" placeholder="请选择" style="float: left;width: 200px;" @change="ridChange()">
                                <el-option :key="'all-out'" :label="'全部'" :value="''"></el-option>
                                <el-option v-for="item in outRidList" :key="'out-' + item.rid" :label="item.descName" :value="item.rid">
                                </el-option>
                            </el-select>
                        </p>
                    </div>
                    <div class="evaluate-data-box" style="flex:2;">
                        <div class="cross-nav-title" style="padding:10px 15px;border:none;">{{$t("home.organizationalEvaluationInformation")}}</div>
                        <ul style="font-weight: 700;">
                            <li>{{$t("home.name")}}</li>
                            <li>{{$t("home.mean")}}</li>
                            <li>{{$t("home.reference")}}</li>
                        </ul>
                        <div style="position: absolute;top:75px;bottom: 0;width: 100%;" v-anyNameYouLike>
                            <ul v-for="item in evaluateData" @click="getEvaluateLine(item),active=item.id" :class="active==item.id?'on':''" style="cursor: pointer;">
                                <li>{{item.name}}</li>
                                <li :style="item.state==1?'color:#c23632;':item.state==2?'color:#f1a42f;':''">{{item.value}}</li>
                                <li>{{item.refer}}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="evaluate-data-box" v-anyNameYouLike>
                        <div class="cross-nav-title" style="padding:5px 15px;margin-top: 10px;margin-bottom: 5px;">{{$t("home.organizationalEvaluationTrendsAndRecommendations")}}</div>
                        <div class="evaluate-line" id="evaluateLine"></div>
                        <p style="padding:5px 15px;font-weight: 600;color: #f1a42f;">{{suggestData}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import http from '@/api/http';

const { SERVICE_URL } = window.APP_CONFIG;


defineOptions({


    data() {
        return {

            defaultTime: '',
            startTime: '',
            endTime: '',
            changeTime: '',
            timeGranularity: '1',
            topMap: null,
            bomMap: null,
            roadLayerchecked: false,
            bzgchecked: false,
            tb: null,
            laneList: [],

            isLayer: null,
            source: null, //存放取消的请求方法
            signalData: '',
            evaluateData: [],
            suggestData: '',
            markers: [],
            ridList: [],
            ridActive: '',
            outRidList: [],
            outRidActive: '',
            active: '',
            crossData: {},
            legendData: [],
            queryParams: {
                taskStart: ''
            },
            pickerOptions1: {
                disabledDate: (time) => {
                    return time.getTime() > new Date(this.endTime).getTime() || time.getTime() > Date.now();

                }

            },
            pickerOptions2: {

                disabledDate: (time) => {
                    return time.getTime() < new Date(this.startTime).getTime() || time.getTime() > Date.now();

                }

            }

        }
    },
    watch: {
        timeGranularity() {

            // this.getCrossInfo();
            this.getTrackInfo();
        },

        '$store.state.store.sideVisibility'() {
            setTimeout(() => {
                // if (this.topMap) {
                //     this.topMap.resize();
                // }
                if (this.bomMap) {
                    this.bomMap.resize();
                }
            }, 500)

        }
    },
    created() {
        this.getLegend();
        this.crossData = JSON.parse(sessionStorage.getItem('crossData'))
        if (!this.crossData) {
            this.crossData = {}
            this.crossData['crossId'] = this.$route.query.crossId;
            this.crossData['crossName'] = this.$route.query.crossName;
            this.crossData['centerX'] = this.$route.query.centerX;
            this.crossData['centerY'] = this.$route.query.centerY;
        }
        this.startTime = this.mapUtils.getDateYMD('ymdhm', -60 * 24) + ':00';
        this.endTime = this.mapUtils.getDateYMD('ymdhm') + ':00'

    },
    mounted() {
        // this.inittopMap();
        this.initbomMap();
    },
    unmounted() {
        if (this.topMap && typeof this.topMap.remove === 'function') {
            this.topMap.remove();
        }
        if (this.bomMap && typeof this.bomMap.remove === 'function') {
            this.bomMap.remove();
        }
    },
    methods: {
        crossIdChange(item) {
            this.crossData = item;
            // this.topMap.flyTo({ center: [item.centerX, item.centerY] })
            this.bomMap.flyTo({ center: [item.centerX, item.centerY] })
            this.timeChange()
            this.getCrossRidInfo();
        },
        timeChange() {

            this.markers.forEach(item => {

                item.remove();
            })
            this.markers = [];
            // this.getCrossInfo();
            this.getTrackInfo();
            this.getEvaluateResult();
        },
        timeBefore() {
            var num = this.timeGranularity == 1 ? -5 : this.timeGranularity == 2 ? -15 : -60
            this.changeTime = this.mapUtils.getDateYMD('ymdhm', num, this.changeTime) + ':00';
            // this.getCrossInfo();
            this.getTrackInfo();
            this.getEvaluateResult();

        },
        timeLater() {
            var num = this.timeGranularity == 1 ? 5 : this.timeGranularity == 2 ? 15 : 60
            this.changeTime = this.mapUtils.getDateYMD('ymdhm', num, this.changeTime) + ':00';
            // this.getCrossInfo();
            this.getTrackInfo();
            this.getEvaluateResult();

        },
        inittopMap() {
            const _this = this;
            const item = this.crossData;
            this.getCrossRidInfo();
            this.getEvaluateResult();

            if (this.topMap) {
                this.topMap.flyTo({ center: [item.centerX, item.centerY], zoom: 19 })
                this.getCrossInfo()
                return
            }
            mapabcgl.accessToken = mapabcglToken;

            _this.topMap = new mapabcgl.Map({
                container: 'topMap',
                style: MAP_STYLE,
                zoom: 16,
                maxZoom: maxZoom,
                minZoom: minZoom,
                center: [item.centerX, item.centerY]


            });


            _this.topMap.on('load', function() {


                _this.topMap.addControl(new mapabcgl.NavigationControl(), 'top-left');
                _this.getCrossInfo()

            })


        },
        initbomMap() {
            const _this = this;
            const item = this.crossData;
            this.getCrossRidInfo();
            this.getEvaluateResult();

            if (this.bomMap) {
                this.bomMap.flyTo({ center: [item.centerX, item.centerY], zoom: 19 })
                this.getTrackInfo();
                return
            }
            mapabcgl.accessToken = mapabcglToken;

            _this.bomMap = new mapabcgl.Map({
                container: 'bomMap',
                style: MAP_STYLE,
                zoom: 18,
                maxZoom: maxZoom,
                minZoom: minZoom,
                center: [item.centerX, item.centerY]


            });


            _this.bomMap.on('load', function() {


                _this.bomMap.addControl(new mapabcgl.NavigationControl(), 'top-left');
                _this.getTrackInfo();

            })
            _this.bomMap.on('click', function(e) {
                console.log(e)
            })

        },

        cancelQuest() {
            if (typeof this.source === 'function') {

                this.source('终止请求'); //取消请求
            }
        },
        getCrossRidInfo() {
            this.ridActive = '';
            this.outRidActive = '';
            const inParam = {
                crossId: this.crossData.crossId,
                type: 2
            };
            const outParam = {
                crossId: this.crossData.crossId,
                type: 3
            };

            Promise.all([
                http.get(SERVICE_URL + 'organize/getCrossRidInfo?', {
                    params: inParam
                }),
                http.get(SERVICE_URL + 'organize/getCrossRidInfo?', {
                    params: outParam
                })
            ]).then(([inData, outData]) => {
                this.ridList = inData.data.data || [];
                this.outRidList = outData.data.data || [];
            })
        },
        ridChange() {
            this.getTrackInfo();
            this.getEvaluateResult();
        },
        getDirectionParams() {
            return {
                rid: this.ridActive,
                outRid: this.outRidActive
            }
        },
        getEvaluateResult() {

            var _this = this;
            var param = Object.assign({
                crossId: this.crossData.crossId,
                // interval:this.timeGranularity,
                startTime: this.startTime,
                endTime: this.endTime
            }, this.getDirectionParams());
            this.evaluateData = [];
            http.get(SERVICE_URL + 'organize/getEvaluateResult?', {
                params: param
            }).then((data) => {
                var result = data.data.data || {};
                this.evaluateData = result.dataList || [];
                this.suggestData = result.suggest || '';
                const item = this.evaluateData[0];
                if (item) {
                    this.active = item.id;
                    this.getEvaluateLine(item)
                } else {
                    this.active = '';
                }
            })
        },


        getCrossInfo() {
            if (this.topMap && typeof this.topMap.removeLayerAndSource === 'function') {
                this.topMap.removeLayerAndSource('geojson-line');
            }

            // this.cancelQuest();
            var _this = this;
            var param = {
                crossId: this.crossData.crossId,
                // interval:this.timeGranularity,
                startTime: this.startTime,
                endTime: this.endTime
            };

            http.get(SERVICE_URL + 'organize/getCrossInfo?', {
                params: param
            }).then((data) => {
                const res = data.data.data || [];
                var arr = [],
                    best = []
                res.forEach(item => {
                    var coordinates = []
                    coordinates.push(item.startPoint.split(',').map(Number))
                    coordinates.push(item.endPoint.split(',').map(Number))
                    best.push(item.startPoint.split(',').map(Number), item.endPoint.split(',').map(Number))
                    var obj = {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": coordinates
                        },

                        "properties": item
                    };
                    arr.push(obj);
                    var html = document.createElement('div');
                    html.innerHTML = item.flow;
                    var color = item.inOut == 1 ? 'rgba(51, 177, 0, 0.7)' : 'rgba(222, 0, 0, 0.7)'
                    html.style.cssText = "padding:10px;background:" + color + ";border-radius:50%;"

                    this.addflowMarker(html, coordinates[1], this.topMap)
                })

                var options = {
                    maps: this.topMap,
                    features: arr,
                    opacity: 0.8,
                    color: { //线的颜色
                        "property": "inOut",
                        "type": "categorical",
                        "stops": [
                            [{
                                    "zoom": 10,
                                    "value": 1
                                },
                                "rgba(19, 134, 22, 1)"
                            ],
                            [{
                                    "zoom": 10,
                                    "value": 2
                                },
                                "rgba(222, 29, 29, 1)"
                            ]

                        ],
                        "default": "rgba(124, 124, 122, 1)"
                    },
                    strokeWeight: { //线的宽度
                        "property": "state",
                        "type": "categorical",
                        "stops": [
                            [{
                                    "zoom": 10,
                                    "value": 1
                                },
                                8
                            ],
                            [{
                                    "zoom": 10,
                                    "value": 2
                                },
                                10
                            ],
                            [{
                                    "zoom": 10,
                                    "value": 3
                                },
                                12
                            ],
                            [{
                                    "zoom": 10,
                                    "value": 4
                                },
                                14
                            ],
                            [{
                                    "zoom": 10,
                                    "value": 5
                                },
                                16
                            ]

                        ],
                        "default": 8
                    },

                }
                this.mapUtils.addgeojsonLine(options);
                this.mapUtils.setBestMap(best, { maps: this.topMap, top: 30, bottom: 30 })
            })
        },
        getTrackInfo() {
            this.bomMap.removeLayerAndSource('geojson-line');


            var _this = this;
            var param = Object.assign({
                crossId: this.crossData.crossId,
                // interval:this.timeGranularity,
                startTime: this.startTime,
                endTime: this.endTime
            }, this.getDirectionParams());

            http.get(SERVICE_URL + 'organize/getTrackInfo?', {
                params: param
            }).then((data) => {
                var arr = []
                var result = data.data.data || {};
                var res = result.pathList || [];
                var flowList = result.flowList || [];
                var pointList = result.pointList || [];
                flowList.forEach(item => {
                    var point = item.point.replace('POINT (', '').replace(')', '').split(' ')
                    var html = document.createElement('div');
                    html.innerHTML = item.flow;
                    var color = 'rgba(51, 177, 0, 0.7)';
                    html.style.cssText = "padding:5px 10px;background:" + color + ";border-radius:50%;z-index:99;"
                    this.addflowMarker(html, point, this.bomMap)
                })
                pointList.forEach(item => {
                    var point = item.point.replace('POINT (', '').replace(')', '').split(' ')
                    var html = document.createElement('div');
                    html.innerHTML = item.flow;
                    var color =item.inOut==1? '#fbd966':'#3078e4';
                    html.style.cssText = "padding:5px 10px;background:" + color + ";border-radius:50%;z-index:99;"
                    this.addflowMarker(html, point, this.bomMap)
                })
                res.forEach(item => {
                    var coordinates = [];
                    var path = item.path.split(';')
                    path.forEach(xy => {
                        coordinates.push(xy.split(',').map(Number))
                    })

                    var obj = {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": coordinates
                        },

                        "properties": { state: item.state }
                    };
                    arr.push(obj);
                })
                var options = {
                    maps: this.bomMap,

                    features: arr,
                    opacity: 0.8,
                    color: { //线的颜色
                        "property": "state",
                        "type": "categorical",
                        "stops": [
                            [{
                                    "zoom": 10,
                                    "value": 1
                                },
                                "rgba(19, 134, 22, 1)"
                            ],
                            [{
                                    "zoom": 10,
                                    "value": 2
                                },
                                "rgba(222, 161, 29, 1)"
                            ],
                            [{
                                    "zoom": 10,
                                    "value": 3
                                },
                                "rgba(222, 29, 29, 1)"
                            ],
                            [{
                                    "zoom": 10,
                                    "value": 4
                                },
                                "rgba(98, 3, 3, 1)"
                            ],
                            [{
                                    "zoom": 10,
                                    "value": 5
                                },
                                "rgba(124, 124, 122, 1)"
                            ]
                        ],
                        "default": "rgba(19, 134, 22, 1)"
                    },

                }
                this.mapUtils.addgeojsonLine(options);

            })
        },
        getLegend() {

            var _this = this;
            var param = {

            };

            http.get(SERVICE_URL + 'cross/evaluate/getLegend?', {
                params: param
            }).then((data) => {

                this.legendData = data.data.data;
            })
        },

        getEvaluateLine(item) {

            var _this = this;
            var param = Object.assign({
                crossId: this.crossData.crossId,
                typeId: item.id,
                startTime: this.startTime,
                endTime: this.endTime
            }, this.getDirectionParams());
            this.signalData = '';
            http.get(SERVICE_URL + 'organize/getEvaluateLine?', {
                params: param
            }).then((data) => {
                var result = data.data.data || {};
                const res = result.dataList || [];
                var series = [],
                    legendData = [];
                res.forEach(item => {
                    var obj = {
                        name: item.name,
                        type: 'line',
                        data: item.data,
                        markArea: {
                            data: result.markList || []
                        },

                        showAllSymbol: false
                    };
                    series.push(obj)
                    legendData.push(item.name)
                })
                var options = {
                    dom: 'evaluateLine',
                    // legendData: legendData,
                    legendData: {
                        itemHeight: 7,
                        itemWidth: 7,
                        icon: 'circle',
                        data: legendData,
                        textStyle: {
                            color: '#fff'
                        },
                        right: 20,
                        top: 0
                    },
                    xAxisData: result.timeList || [],
                    gridTop: 40,
                    gridBom: 30,
                    gridRight: 20,
                    legendBom: 0,
                    title: '',
                    splitNumber: 2,
                    min: 0,
                    series: series
                }

                this.EchartsLarge.lineChart2(options);

            })
        },
        addflowMarker(html, xys, maps) {
            var marker = new mapabcgl.Marker(html)
                .setLngLat(xys)
                .addTo(maps);

            this.markers.push(marker)
        }
    }

});
</script>
<style scoped>
.ozt-map-box {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.ozt-map {
    flex: 1;
    border-bottom: 1px solid #333;

}

.cross-lane-box {
    position: absolute;
    top: 145px;
    bottom: 0;
    left: 15px;
    right: 15px;

}

.lane-list-th {
    position: absolute;
    top: 30px;
    bottom: 0;
    width: 100%;

}

.list-menu li {
    padding: 10px 0;
}

.ozt-info {

    width: 350px;
    padding: 0 15px;


    display: flex;
    flex-direction: column;
}

.signal-data-box p {
    padding: 10px 0;
    display: flex;
}

.signal-data-box span {
    flex: 1;
}

.evaluate-data-box {
    position: relative;
    flex: 1;
    border-bottom: 1px solid #333;
}

.evaluate-data-box ul {
    display: flex;
    /*padding-left: 15px;*/
    border-top: 1px solid #333;
}

.evaluate-data-box li {
    flex: 1;
    padding: 10px 0;
    text-align: center;
    border-right: 1px solid #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.evaluate-data-box li:first-child {
    flex: 3.5;

    text-align: left;
}

.evaluate-data-box li:last-child {
    flex: 2;

    border-right: none;
}

.rid-list-th {
    position: absolute;
    top: 30px;
    bottom: 0;
    width: 100%;

}

.evaluate-line {
    height: 150px;
    width: 100%;

    margin-bottom: 15px;
}

.legend-box {
    position: absolute;
    padding: 5px 25px;

    bottom: 10px;
    right: 10px;

    z-index: 999;

}

.legend-box li {
    display: flex;
    width: 100%;
    margin-top: 5px;
}
</style>
