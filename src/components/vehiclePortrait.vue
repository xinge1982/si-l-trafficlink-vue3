<template>
    <div>
        <div class="main" style="z-index: 99;">
            <div style="flex:1;padding: 30px 40px;display: flex;flex-direction: column;">
                <div class="event-title">
                    <span>车辆画像</span>
                    <i class="el-icon-close" @click="$parent.isvehiclePort = false"></i>
                </div>
                <div class="ect-select-box">
                    <div class="ect-select">
                        <span class="title">车辆号牌</span>
                        <el-autocomplete v-model="plateNumber" :fetch-suggestions="querySearch" @select="handleSelect"></el-autocomplete>
                    </div>
                    <div class="ect-select">
                    <span class="title">开始时间</span>
                        <el-date-picker style="flex:1;max-width: 200px;" v-model="startTime" ttype="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1" placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <div class="ect-select">
                    <span class="title">结束时间</span>
                        <el-date-picker style="flex:1;max-width: 200px;" v-model="endTime" ttype="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions2" placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <div class="ect-select">
                        <span class="title">出现次数</span>
                        <el-input v-model="times"></el-input>
                    </div>
                    <div class="ect-select">
                        <span class="title">行驶里程</span>
                        <el-input v-model="travelDistanceMin"></el-input>
                        <span class="title" style="margin-left: 2px; margin-right: 2px">-</span>
                        <el-input v-model="travelDistanceMax"></el-input>
                        <span class="title" style="margin-left: 2px; margin-right: 2px"> 米</span>

                    </div>
                    <!-- <el-button type="primary" size="mini" @click="getVehiclePortrait()">查询</el-button> -->
                </div>
                <div style="flex:1;margin-top: 20px;display: flex;">
                    <div style="width:380px;">
                        <div style="margin:10px 0;font-size: 14px;">车辆信息</div>
                        <div class="port-mon-box" style="background: #003666;" v-if="ports">
                            <li><span>车辆号牌：</span><span>{{ports.plateNo}}</span></li>
                            <li><span>车辆品牌：</span><span>{{vehicleInfo.vehicleBrand}}</span></li>
                            <li><span>车辆型号：</span><span>{{vehicleInfo.vehicleModel}}</span></li>
                            <li><span>车辆颜色：</span><span>{{vehicleInfo.VehicleColor}}</span></li>
                            <li><span>车辆类型：</span><span>{{vehicleInfo.vehicleClass}}</span></li>
                            <li><span>车牌颜色：</span><span>{{vehicleInfo.plateColor}}</span></li>
                            <li><span>车牌类型：</span><span>{{vehicleInfo.plateClass}}</span></li>
                        </div>
                    </div>
                    <div style="flex:1;margin:0 25px;">
                        <div style="margin:10px;font-size: 14px;">车辆画像信息（依据最近月统计数据）</div>
                        <div style="height: 685px;">
                            <div style="display: flex;">
                                <img :src="assetUrl('../assets/image/bdh/car-info.png')" alt="" style="width: 111px;height: 86px;">
                                <div class="vp-info" v-if="ports">
                                    <li>
                                        <b>常驶线路</b>
                                        <span>{{vehicleBehavior.location}}</span>
                                    </li>
                                    <li>
                                        <b>车辆特征</b>
                                        <span>{{vehicleBehavior.feature}}</span>
                                    </li>
                                    <li>
                                        <b>平均速度</b>
                                        <span>{{vehicleBehavior.speed+'km/h'}}</span>
                                    </li>
                                    <li>
                                        <b>平均次数</b>
                                        <span>{{vehicleBehavior.frequency+'次/天'}}</span>
                                    </li>
                                    <li>
                                        <b>行驶里程</b>
                                        <span>{{vehicleBehavior.travelDistance ? vehicleBehavior.travelDistance+' 米' : '1100 米' }}</span>
                                    </li>
                                </div>
                            </div>
                            <div style="height:320px;margin-top:80px; ">
                                <div style="margin:10px 0;font-size: 14px;">出行时段统计</div>
                                <div style="height:300px;width: 100%;" id="barEct">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="width:450px; ">
                        <div style="margin:10px;font-size: 14px;">出行区域分布</div>
                        <div class="port-mon-box" style="width: 420px;" id="areaMap">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import http from '@/api/http';
import protobuf from "protobufjs";

defineOptions((() => {
const { SERVICE_URL } = window.APP_CONFIG;

const assetModules = import.meta.glob('../assets/image/**/*', { eager: true, import: 'default' }) as Record<string, string>;
const assetUrl = (path: string): string => assetModules[path] ?? '';

var AwesomeMessage, buffer, websocket;
protobuf.load("static/carTrackObj.proto", function(err, root) {
    if (err)
        throw err;


    AwesomeMessage = root.lookupType("crossserverpb.CarTrack");


});

return {

    data() {
        return {
            areaMap: null,
            ports: null,
            vehicleInfo: null,
            vehicleBehavior: null,
            barEct: null,
            plateNumber: '',
            startTime: '',
            endTime: '',
            times: 1,
            travelDistanceMin: 100,
            travelDistanceMax: 1000,
        }
    },

    created() {

    },
    mounted() {


        this.initMap()
    },
    unmounted() {


    },
    beforeUnmount() {

    },
    watch: {


    },
    methods: {
        querySearch(queryString, cb) {

            var param = {
                vehiclePlate: queryString
            };

            http.get(SERVICE_URL + 'device/getPlateNumberList?', { params: param }).then((data) => {
                var result = data.data.data;
                const formattedResult = result.map(item => ({ value: item }));
                cb(formattedResult); // 返回对象数组
            })
        },
        handleSelect(item) {
            this.getVehiclePortrait()
        },
        inputKeydown(e) {
            if (e.keyCode == 13) {
                this.getVehiclePortrait()
            }
        },
        getVehiclePortrait() {
            this.ports = null;
            this.vehicleInfo = null;
            this.vehicleBehavior = null;
            if (this.barEct) {
                this.barEct.clear()
            }
            this.areaMap.removeLayerAndSource('heatmapLayer')
            if (!this.plateNumber) {
                this.$message({
                    message: '请输入车牌号',
                    type: 'warning'
                });
                return
            }
            var param = {
                vehiclePlate: this.plateNumber
            };

            http.get(SERVICE_URL + 'device/getVehiclePortrait?', { params: param }).then((data) => {

                this.ports = data.data.data;
                this.vehicleInfo = this.ports.vehicleInfo
                this.vehicleBehavior = this.ports.vehicleBehavior
                this.getCarChart()
                this.getHotChart()
            })
        },
        getCarChart() {
            var res = this.ports.vehicleBehavior.occur;
            res.series.forEach(item => {
                item.itemStyle = {
                    color: new echarts.graphic.LinearGradient(
                        0, 1, 0, 0,
                        [
                            { offset: 1, color: '#409eff' },

                        ]
                    )
                }
                item.barWidth = this.width > 3800 ? 20 : 12;
            })
            var baroptions = {

                dom: 'barEct',
                color: 'rgba(255,255,255,.75)',
                legendData: [],
                xAxisData: res.times,
                yAxisName: '',
                gridLeft: 0,
                gridBom: 0,
                gridTop: 60,
                gridRight: 0,
                legendRight: 25,
                yaxisTick: false,
                yaxisLine: false,
                yaxisLineShow: false,
                yaxisLabelShow: true,
                axisLabelFontSize: 12,
                ysplitLine: true,
                series: res.series,
                boundaryGap: true,
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

                // interval: 0,
                xaxisTickShow: false
            }
            this.$nextTick(function() {

                this.barEct = this.EchartsLarge.barChart(baroptions);
            })
        },
        initMap() {
            var _this = this
            mapabcgl.accessToken = mapabcglToken;
            var _this = this;
            this.areaMap = new mapabcgl.Map({
                container: 'areaMap',
                style: MIN_MAP_STYLE,
                zoom: 17,
                maxZoom: maxZoom,
                minZoom: minZoom,
                center: MAP_CENTER,
                pitch: 0
            });
            this.areaMap.on('load', function() {

            });
            this.areaMap.on('click', function(e) {

            });


        },
        getHotChart() {
            this.areaMap.removeLayerAndSource('heatmapLayer')
            var res = this.ports.heatmap.series[0].data,
                features = [];

            res.forEach(item => {
                var obj = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [item[0], item[1]]
                    },
                    "properties": {
                        "mag": item[2]
                    }
                }
                features.push(obj)
            })
            const opt = {
                id: 'heatmapLayer',
                features: features,
                maps: this.areaMap

            };
            this.mapUtils.addHeatmap(opt)

        },
    }

} })());
</script>
<style lang="scss">
.event-title {
    text-align: center;
    font-family: PingFang SC;
    font-weight: 400;
    color: #FFFFFF;

    span {
        font-size: 18px;
    }

    i {
        float: right;
        cursor: pointer;
        font-size: 18px;
        font-weight: 800;
        line-height: 25px;
    }
}

.ect-select-box {
    width: 100%;
    height: 30px;
    display: flex;
    margin-top: 20px;

    .ect-select {
        margin-right: 20px;
        height: 30px;
        flex: 1;
        display: flex;
        max-width: 250px;

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

    .el-radio {
        color: #fff;
        line-height: 30px;
    }


}

.port-mon-box {

    width: 350px;
    // top: 40px;
    // left: 10px;
    padding: 15px;
    height: 600px;
    margin-right: 25px;
    // bottom: 30px;
    // background: #002f58;
    // z-index: 99;

    li {
        line-height: 29px;
    }


}

.vp-info {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-left: 50px;
    font-size: 14px;

    li {
        width: 200px;
        margin-top: 20px;
        margin-bottom: 40px;

        b {
            display: block;
        }

        span {
            color: #00f5f5;
        }
    }
}
</style>
