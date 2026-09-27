<template>
    <div>
        <div class="main" style="z-index: 99;">
            <div style="flex:1;padding: 30px 40px;display: flex;flex-direction: column;">
                <div class="event-title">
                    <span>车辆轨迹查询</span>
                    <i class="el-icon-close" @click="$parent.isVehicleQuery=false"></i>
                </div>
                <div class="ect-select-box">
                    <div class="ect-select">
                        <span class="title">车辆号牌</span>
                        <el-input v-model="plateNumber"></el-input>
                    </div>
                    <div class="ect-select">
                        <span class="title">时间段</span>
                        <el-select v-model="datetype">
                            <el-option v-for="item in datetypes" :key="item.value" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
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
                        <span class="title">位置</span>
                        <el-select v-model="location">
                            <el-option v-for="item in locationList" :key="item.value" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <el-button type="primary" size="mini" :loading="loading" @click="page=1,getTravelList()">查询</el-button>
                    <el-button type="primary" size="mini" @click="captureShow" v-if="checkDeviceUrl()">卡口抓拍</el-button>
                </div>
                <div style="flex:1;margin-top: 20px;position: relative;">
                    <track-playback :options="trackoptions" :crossData="vehicleData" ref="playBack" ></track-playback>
                    <div class="event-mon-box">
                        <div class="title">车辆查询结果</div>
                        <div class="event-list">
                            <ul class="list-th">
                                <li>车牌号</li>
                                <li>时间</li>
                                <li>位置</li>
                            </ul>
                            <div class="list-tr-box" v-anyNameYouLike style="bottom:15px;">
                                <ul class="list-tr" v-for="(item,index) in travelList" :class="activeId==item.id?'active':''" @click="crossDataChange(item)">
                                    <li>{{item.plateNumber}}</li>
                                    <li>{{item.startTime}}</li>
                                    <li>{{item.location}}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="page-box">
                            <el-pagination small layout=" prev, pager, next" :total="total" @current-change="currentChange" :current-page="page" :page-size="pageSize">
                            </el-pagination>
                        </div>
                    </div>
                    <div class="video-play-box" v-show="crossData">
                        <div ref="videoBox" style="left:0;right: 0;top: 15px;width: auto;background: none;">
                            <flv-js :address="videoUrl" ref="flvPlayer"></flv-js>
                        </div>
                        <div style="display: flex;margin:20px 0 5px 0;">
                            <div class="event-video-btn">视频方向</div>
                            <el-cascader style="width: 180px;" v-model="address" :options="dirList" :props="defaultProps" :key="cascaderKey" @change="cascaderChange()">
                            </el-cascader>
                        </div>
                    </div>
                    <div class="track-tool-bar" style="position: absolute;top: auto;bottom: 15px; transform: translateY(0);right: 12px;" v-show="crossData">
                        <li>
                            <div class="track-date-box">{{date}}</div>
                        </li>
                        <li @click="wsplay=!wsplay" :class="wsplay?'':'active'">
                            <img :src="assetUrl('../assets/image/screen/1920/tzgj.png')" alt="">
                            <span>{{wsplay?'停止轨迹':'播放轨迹'}}</span>
                        </li>
                    </div>
                    <div class="popup-box" v-if="popupUrl">
                        <li>
                            <span @click="popupUrl=null">x</span>
                        </li>
                        <iframe :src="popupUrl" style="width: 100%; height: 100%; border: none;" frameborder="0"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import http from '@/api/http';
import protobuf from "protobufjs";
import trackPlayback from './trackPlayback.vue';
import FlvJs from './video/FlvJs.vue'

defineOptions((() => {
const { SERVICE_URL, SERVICE_URL_v2, DEVICESERVICE_URL, WEBSOCKET_URL } = window.APP_CONFIG;

const assetModules = import.meta.glob('../assets/image/**/*', { eager: true, import: 'default' }) as Record<string, string>;
const assetUrl = (path: string): string => assetModules[path] ?? '';

var AwesomeMessage;
protobuf.load("static/carTrackObj.proto", function(err, root) {
    if (err)
        throw err;


    AwesomeMessage = root.lookupType("crossserverpb.CarTrack");


});
return {

    components: { trackPlayback, FlvJs },
    data() {
        return {
            eventMap: null,

            trackoptions: {
                tracks: null,
                play: true,
                vehiclePlate: true
            },
            trackPlay: true,
            trackPath: false,
            vehicleData: {
                centerX: MAP_CENTER[0],
                centerY: MAP_CENTER[1],
            },
            keys: '',
            types: [],
            radio: '1',
            startTime: '',
            endTime: '',
            eventTitle: [],
            eventList: [],
            typeCode: '',
            eventItem: '',
            total: 0,
            page: 1,
            pageSize: 18,
            trackList: [],
            trackTitles: [],
            countType: 1,
            accidentData: '',
            plateNumber: '',
            eventtypes: '',
            datetype: this.mapUtils.getDateYMD('ymd', -60 * 24 * 2) + ',' + this.mapUtils.getDateYMD('ymd'),
            datetypes: [{
                    name: '最近三天',
                    value: this.mapUtils.getDateYMD('ymd', -60 * 24 * 2) + ',' + this.mapUtils.getDateYMD('ymd')
                },
                {
                    name: '最近一周',
                    value: this.mapUtils.getDateYMD('ymd', -60 * 24 * 6) + ',' + this.mapUtils.getDateYMD('ymd')
                }, {
                    name: '最近一月',
                    value: this.mapUtils.getDateYMD('ymd', -60 * 24 * 29) + ',' + this.mapUtils.getDateYMD('ymd')
                }
            ],
            location: '',
            locationList: [],
            travelList: [],
            loading: false,
            videoUrl: '',
            dirList: [],
            address: [],
            defaultProps: {
                children: 'children',
                label: 'name',
                value: 'value'
            },
            cascaderKey: 1,
            crossData: '',
            activeId: '',
            socket: false,
            wsplay: false,
            date: '',
            videoRid: '',
            videoId: '',
            popupUrl: null,
            websocket: null,
            socketInitTimer: null,
            isDestroying: false,
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

    created() {

    },
    mounted() {
        // this.initMap()
        this.startTime = this.datetype.split(',')[0]
        this.endTime = this.datetype.split(',')[1]
        this.getLocationList()
    },
    unmounted() {
        this.popupUrl = null;
    },
    beforeUnmount() {
        this.isDestroying = true;
        this.popupUrl = null;
        if (this.socketInitTimer) {
            clearTimeout(this.socketInitTimer);
            this.socketInitTimer = null;
        }
        this.closeWebsocket()
        if (this.$refs.flvPlayer) {
            this.$refs.flvPlayer.destroy();
        }
    },
    watch: {
        wsplay(val) {
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN && this.$refs.playBack && this.$refs.playBack.roadMap) {
                var message = JSON.stringify({
                    bound: this.$refs.playBack.roadMap.getBounds(),
                    isOpen: this.wsplay ? 1 : 0,
                    statCrossId: this.crossData ? this.crossData.crossId : ''
                })
                this.websocket.send(message);
            }
        },
        countType() {
            this.getCarChart()
        },
        typeCode() {
            this.getHotChart()
        },
        datetype(val) {
            this.startTime = val.split(',')[0]
            this.endTime = val.split(',')[1]
        }
    },
    methods: {
        checkDeviceUrl() {
           return typeof DEVICESERVICE_URL !== "undefined" && !!DEVICESERVICE_URL
        },
        captureShow() {
            if (!this.plateNumber) {
                this.$message({
                    message: '请输入车辆号牌',
                    type: 'warning',
                    offset: 80
                });
                return
            }
            var param = {
                beginTime: this.startTime + ' 00:00:00',
                endTime: this.endTime + ' 23:59:59',
                plateNo: this.plateNumber
            }

            var datas = JSON.stringify(param)
            http.post(DEVICESERVICE_URL + 'api/capture/show', datas).then((data) => {

                this.popupUrl =  DEVICESERVICE_URL+data.data.data.popupUrl;

            })
        },
        getLocationList() {

            var _this = this;
            var param = {

            };

            http.get(SERVICE_URL + 'travel/getLocationList?', { params: param }).then((data) => {

                this.locationList = data.data.data;
                this.location = data.data.data[0].value
            })
        },
        getTravelList() {
            if (!this.plateNumber) {
                this.$message({
                    message: '请输入车辆号牌',
                    type: 'warning',
                    offset: 80
                });
                return
            }
            this.loading = true;
            var _this = this;
            var param = {
                time: this.startTime + ',' + this.endTime,
                plateNumber: this.plateNumber,
                location: this.location,
                currentPage: this.page,
                pageSize: this.pageSize
            };

            http.get(SERVICE_URL + 'travel/getTravelList?', { params: param }).then((data) => {
                this.travelList = data.data.data.resultList;
                this.total = data.data.data.totalNum;
                this.loading = false;
            })
        },
        currentChange(val) {
            this.page = val;
            this.getTravelList();
        },
        getRealDirList() {
            // this.$refs.playBack.roadMap.flyTo({ center: [this.crossData.centerX, this.crossData.centerY], zoom: 18 })
            var map = this.$refs.playBack.roadMap
            map.setCenter([this.crossData.centerX, this.crossData.centerY])
            map.setZoom(18)
            if (this.socketInitTimer) {
                clearTimeout(this.socketInitTimer);
            }
            this.socketInitTimer = setTimeout(() => {
                this.socketInitTimer = null;
                if (this.isDestroying) {
                    return
                }
                if (this.socket) {
                    this.openSend()
                } else {
                    this.request()
                }
                this.socket = true;
            }, 500)

            const _this = this;

            var param = {
                crossId: this.crossData.crossId

            }

            http.get(SERVICE_URL + 'cameraVideo/getRealDirList?', { params: param }).then((data) => {

                this.dirList = data.data.data;

                if (this.dirList.length == 0) {
                    return
                }
                this.dirList.forEach(item => {
                    item.children.forEach(c => {
                        c.value = item.rid + ',' + c.id
                    })
                })



            })
        },
        cascaderChange() {
            if (this.videoRid) {
                this.playVideo(1)
            }
            this.playVideo(0);
            this.videoBar = false;
        },
        playVideo(operation) {
            const _this = this;
            this.$refs.flvPlayer && this.$refs.flvPlayer.destroy();

            if (operation == 0) {
                this.videoUrl = '';
                if (this.address.length <= 0) {
                    return
                }
            }


            var param = {

                rid: operation == 0 ? this.address[1].split(',')[0] : this.videoRid,
                id: operation == 0 ? this.address[1].split(',')[1] : this.videoId,
                startTime: this.crossData.startTime,
                endTime: this.crossData.endTime,
                operation: operation

            }

            http.get(SERVICE_URL + 'VCN/playVideo?', { params: param }).then((data) => {
                this.videoRid = this.address[1].split(',')[0];
                this.videoId = this.address[1].split(',')[1];

                if (data.data.code == -1) {
                    this.$message({
                        showClose: true,
                        message: data.data.msg,
                        type: 'error',
                        offset: 80
                    });
                } else {
                    if (operation == 0) {
                        this.videoUrl = data.data.resultObject;
                        console.log('play vehicle video url:' + this.videoUrl)
                        this.$refs.flvPlayer.play(this.videoUrl);
                    } else {
                        // this.cascaderKey += 1;
                        // this.address = [];
                        // this.videoUrl = '';
                    }
                }



            }).catch((data) => {
                console.log(data)
            })
        },
        crossDataChange(item) {
            this.activeId = item.id;
            this.crossData = item;
            this.getRealDirList();
            this.wsplay = false;
            this.$refs.flvPlayer.destroy();
        },
        request() {

            var _this = this;

            var param = {
                crossId: this.crossData.crossId

            };

            http.post(WEBSOCKET_URL + 'consul/api/request?', param).then((data) => {

                if (data.data.statusCode == 200) {
                    this.URL = data.data.path ? WEBSOCKET_URL + data.data.path : data.data.url;
                    this.getwebsocketData()
                    this.getStopline()

                } else {
                    this.$message({
                        message: '无可用轨迹服务，请稍后刷新重试。',
                        type: 'warning'
                    });
                }

            })
        },
        getStopline() {
            var bounds = this.$refs.playBack.roadMap.getBounds()
            var _this = this;
            var param = {
                bound: bounds._sw.lng + ',' + bounds._sw.lat + ';' + bounds._ne.lng + ',' + bounds._ne.lat


            };

            http.get(this.URL + 'region/api/getStopline?', {
                params: param
            }).then((data) => {
                this.trackoptions.geojson = data.data;
                this.$refs.playBack.addLayer();

            })
        },
        getwebsocketData() {


            this.closeWebsocket();
            if ('WebSocket' in window) {
                var url = this.URL.indexOf('https') != -1 ? this.URL.replace(/https/, 'wss') : this.URL.replace(/http/, 'ws');
                var socket = new WebSocket(url + "/websocket/manager");
                this.websocket = socket;
                socket.onopen = () => {
                    if (socket !== this.websocket || this.isDestroying) {
                        return
                    }
                    this.openSend()
                }
                socket.onmessage = (event) => {
                    if (socket !== this.websocket || this.isDestroying) {
                        return
                    }
                    this.parseTrackMessage(event.data);
                }
                socket.onclose = () => {
                    if (socket !== this.websocket) {
                        return
                    }
                    this.websocket = null;
                    this.socket = false;
                }
            } else {
                this.$message.error('不支持 websocket')
                this.websocket = null;
            }

        },
        updateTrackData(res) {
            this.trackoptions.tracks = res;
            this.date = res.time || '';
        },
        parseTrackMessage(rawData) {
            if (isProtobuf == 1) {
                if (!AwesomeMessage) {
                    return
                }
                var arrayBufferPromise = null;
                if (rawData instanceof ArrayBuffer) {
                    arrayBufferPromise = Promise.resolve(rawData);
                } else if (rawData && rawData.arrayBuffer) {
                    arrayBufferPromise = rawData.arrayBuffer();
                }
                if (!arrayBufferPromise) {
                    return
                }
                arrayBufferPromise.then((arrayBuffer) => {
                    if (this.isDestroying) {
                        return
                    }
                    var message = AwesomeMessage.decode(new Uint8Array(arrayBuffer));
                    var res = AwesomeMessage.toObject(message, {
                        longs: String,
                        enums: String,
                        bytes: String,
                        defaults: true,
                        arrays: true,
                        objects: true,
                        oneofs: true
                    });
                    this.updateTrackData(res);
                }).catch(() => {})
                return
            }
            if (typeof rawData === 'string') {
                var res = JSON.parse(rawData);
                this.updateTrackData(res);
                return
            }
            if (rawData && rawData.text) {
                rawData.text().then((text) => {
                    if (this.isDestroying) {
                        return
                    }
                    var res = JSON.parse(text);
                    this.updateTrackData(res);
                }).catch(() => {})
            }
        },
        openSend() {
            if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN || !this.crossData || !this.$refs.playBack || !this.$refs.playBack.roadMap) {
                return
            }
            var message = JSON.stringify({
                bound: this.$refs.playBack.roadMap.getBounds(),
                isOpen: this.wsplay ? 1 : 0,
                isTrackPath: this.trackPath ? 1 : 0,
                speed: 1,
                trackType: 2,
                startTime: this.crossData.startTime,
                endTime: this.crossData.endTime,
                isProtobuf: isProtobuf,
                language: this.$i18n.locale == 'en' ? 'en-US' : 'zh-CN',
                zoom: this.$refs.playBack.roadMap.getZoom(),
                statCrossId: this.crossData.crossId,
                trackId: this.crossData.trackId,
                plateNumber: this.crossData.plateNumber
            })
            this.websocket.send(message);
        },
        closeWebsocket() {
            var socket = this.websocket;
            this.websocket = null;
            if (!socket) {
                return
            }
            socket.onopen = null;
            socket.onmessage = null;
            socket.onclose = null;
            socket.onerror = null;
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close()
            }
            this.socket = false;
        },








        eventLevelChange(item) {
            this.getMenuEventType()
        },
        getStatisticsList() {
            this.getHotChart()
            this.typeCode = '';
            this.eventItem = '';
            var _this = this;
            var keys = this.keys

            var param = Object.assign({
                time: this.eventClickTime[0],
                startTime: this.startTime,
                endTime: this.endTime,
                polygon: ''

            }, keys)

            http.get(SERVICE_URL_v2 + '/event/getStatisticsList?', { params: param }).then((data) => {
                this.eventTitle = data.data.data.title;
                this.eventList = data.data.data.data;
            })
        },
        getTendencyChart() {
            this.page = 1;
            this.getTrackListPage()
            this.getCarChart()
            var _this = this;
            var keys = this.keys
            var param = Object.assign({
                startTime: this.startTime,
                endTime: this.endTime,
                polygon: '',
                typeCode: this.typeCode

            }, keys)

            http.get(SERVICE_URL_v2 + '/event/getTendencyChart?', { params: param }).then((data) => {
                var res = data.data.data;


                var options = {
                    dom: 'lineEct',
                    color: 'rgba(255,255,255,.75)',
                    legendData: [],
                    title: '',
                    xAxisData: res.times,
                    yAxisName: '',
                    gridLeft: 0,
                    gridBom: 0,
                    gridTop: 15,
                    gridRight: 0,
                    legendRight: 25,
                    yaxisTick: false,
                    yaxisLine: false,

                    axisLabelFontSize: 12,
                    ysplitLine: true,
                    series: res.series,
                    boundaryGap: true,
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 16
                    },
                    nameGap: 25,
                    legendtextStyle: {
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 16,
                        fontFamily: 'Microsoft YaHei'
                    }
                }

                this.$nextTick(function() {

                    this.bEct = this.EchartsLarge.lineChart2(options)
                })

            })
        },
        getTrackListPage() {

            var _this = this;
            var keys = this.keys

            var param = Object.assign({
                typeCode: this.typeCode,
                startTime: this.startTime,
                endTime: this.endTime,
                polygon: '',
                currentPage: this.page,
                pageSize: this.pageSize

            }, keys)

            http.get(SERVICE_URL_v2 + '/event/getTrackListPage?', { params: param }).then((data) => {
                this.trackTitles = data.data.data.title;
                this.trackList = data.data.data.data.resultList;
                this.total = data.data.data.data.totalNum;
            })
        },


        eventClick(item) {

            if (item.typeCode == 6 || item.typeCode == 7) {
                this.eventData = '';

                this.accidentData = item;

            } else {

                this.accidentData = '';
                this.eventData = item;
            }
        },
        getCarChart() {

            var _this = this;
            var keys = this.keys
            var param = Object.assign({
                type: this.countType,
                typeCode: this.typeCode,
                startTime: this.startTime,
                endTime: this.endTime,
                polygon: ''
            }, keys)

            http.get(SERVICE_URL_v2 + '/event/getCarChart?', { params: param }).then((data) => {
                var res = data.data.data;
                var options = {

                    dom: 'pieEct',
                    name: res.title,
                    data: res.series[0].data,
                    colors: ['#FFF636', '#11BFFF', '#2BFBB4', '#2673E8', '#FCFDFC', '#749f83'],
                    radius: '80%',
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 12,
                            fontWeight: 'bold'
                        }
                    }
                }


                this.EchartsLarge.reportpie(options);

            })
        },
        getHotChart() {
            this.eventMap.removeLayerAndSource('heatmapLayer')
            var _this = this;
            var keys = this.keys
            var param = Object.assign({
                typeCode: this.typeCode,
                startTime: this.startTime,
                endTime: this.endTime,
                polygon: ''
            }, keys)

            http.get(SERVICE_URL_v2 + '/event/getHotChart?', { params: param }).then((data) => {

                var res = data.data.data,
                    features = [];
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
                    maps: this.eventMap

                };
                this.mapUtils.addHeatmap(opt)
            })
        },
    }

} })());
</script>
<style lang="scss" scoped>
.video-play-box {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 440px;
    // height: 354px;
    background: #0E1835;
    border: 1px solid #123D72;
    box-shadow: 0px 0px 250px 0px rgba(14, 63, 184, 0.2);
    padding: 0 20px 20px 20px;

    .type-box {
        .disabled {

            cursor: not-allowed !important;
            // pointer-events: none!important;

        }
    }

    .event-video-bar {
        // height: 160px;
        margin: 5px;

    }

    .event-video-btn {

        font-size: 14px;
        line-height: 30px;
        margin-right: 12px;

    }

    .event-video-info {
        width: 100%;

        li {
            margin-bottom: 5px;
            font-size: 14px;
            // text-align: center;

            b {
                font-weight: normal;
                width: 56px;
                text-align: right;
                display: inline-block;
                margin-right: 12px;
            }
        }


    }
}

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

.event-mon-box {
    position: absolute;
    width: 350px;
    top: 10px;
    left: 10px;
    padding: 15px;
    bottom: 30px;
    display: flex;
    flex-direction: column;
    border: 1px solid #2E94E1;
    background: rgba(12, 44, 103, .4);
    z-index: 99;

    .title {
        font-size: 12px;
        margin-bottom: 10px;
    }

    .event-list {
        flex: 1;
        position: relative;

        ul {
            padding-left: 10px;
            // height: 20px;
            display: flex;

            font-size: 12px;
            font-family: PingFang SC;
            color: #FFFFFF;
        }


        .list-th {
            background: #14365F;
            height: 18px;

            li {
                font-size: 12px;
                // transform: scale(0.8);
                font-family: PingFang SC;
                font-weight: 600;
                line-height: 18px;
                flex: 1;
            }

            li:first-child {
                flex: 0.5;
            }



        }

        .list-tr-box {
            position: absolute;
            top: 20px;
            bottom: 0;
            width: 100%;

            ul {
                margin-bottom: 10px;
                cursor: pointer;
                font-weight: 400;

                li {
                    flex: 1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 12px;
                    // transform: scale(0.8);
                    font-family: PingFang SC;
                    font-weight: 400;
                    line-height: 18px;
                }

                li:first-child {
                    flex: 0.5;
                }
            }

            .active {
                background: #14365F;
            }
        }



    }

    .event-ect {
        height: 120px;
        margin-top: 10px;

        .title {
            float: left;
        }

        ul {
            float: right;
            display: flex;

            font-size: 12px;

            .el-radio {
                color: #fff;
                font-size: 12px;
                margin-right: 0;
                margin-left: 15px;
                line-height: 20px;
            }

        }

    }

}
</style>
