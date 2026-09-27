<template>
    <div class="main" style="z-index: 999;">
        <div style="flex:1;padding: 30px;display: flex;flex-direction: column;">
            <div class="a-box-title">
                <span>{{$t("home.trafficAccidentMonitoring")}} </span>
                <b>{{accidentData.crossName||accidentInfo.accidentLocation}}</b>
                <i class="el-icon-close" style="float: right;cursor: pointer;font-size: 18px;" @click="$parent.accidentData=null"></i>
            </div>
            <div style="flex:1;display: flex;">
                <div class="a-box">
                    <div style="display: flex;">
                        <ul class="dir-menu-box" style="overflow: auto">
                            <p>{{$t("home.evidenceVideo")}}</p>
                            <div class="dir-menu">
                                <ul v-for="item in options1">
                                    <i :class="item.id==expandedKeys1?'el-icon-caret-bottom':'el-icon-caret-right'" @click="dirClick1(item)"></i>
                                    <span @click="dirClick1(item)">{{item.name}}</span>
                                    <li v-for="t in item.children" v-text="t.name" v-show="item.id==expandedKeys1" :class="t.url==address2?'dirActive':''" @click="handleNodeClick1(t)"></li>
                                </ul>
                            </div>
                        </ul>
                        <div class="a-video-box">
                            <video class="video" :src="address1" controls="controls" loop="loop" style="width:100%;" id="J_video"></video>
                        </div>
                    </div>
                    <div class="a-info-box">
                        <div class="a-info">
                            <h4>{{$t("home.accidentAssistance")}}</h4>
                            <p>
                                <i></i>
                                <span>{{$t("home.realTimeAnalysis")}}</span>
                            </p>
                            <div class="info">
                                <h3>{{$t("home.suspectedAccidentDetectionTime")}}</h3>
                                <h3 style="margin-top: 10px;">{{accidentInfo.checkTime+' s'}}</h3>
                            </div>
                            <div class="a-info-list">
                                <ul style="flex:1;">
                                    <span>{{$t("home.accidentTime")}}</span>
                                    <b>{{accidentInfo.startTime}}</b>
                                </ul>
                                <ul>
                                    <span>{{$t("home.accidentLocation")}}</span>
                                    <b>{{accidentInfo.accidentLocation}}</b>
                                </ul>
                                <ul style="flex:3;">
                                    <span>{{$t("home.accidentDescription")}}</span>
                                    <b>{{accidentInfo.accidentDescribe}}</b>
                                </ul>
                                <ul style="flex:3;">
                                    <span>{{$t("home.liabilityRecommendation")}}</span>
                                    <b>{{accidentInfo.responsibility}}</b>
                                </ul>
                                <ul>
                                    <span>{{$t("home.supplementaryInformation")}}</span>
                                    <b>{{accidentInfo.auxiliaryInfo}}</b>
                                </ul>
                            </div>
                        </div>
                        <div class="a-info" style="margin-left: 8px;">
                            <h4>{{$t("home.trafficImpactReport")}}</h4>
                            <p>
                                <i></i>
                                <span>{{$t("home.impactAssessment")}}</span>
                            </p>
                            <div class="a-info-list">
                                <ul>
                                    <li v-for=" item in accidentSpots" :class="accidentInfo.place==item.key?'active':''">{{item.value}}</li>
                                </ul>
                                <ul>
                                    <li v-for=" item in accidentTimes" :class="accidentInfo.timeSlot==item.key?'active':''">{{item.value}}</li>
                                </ul>
                                <ul>
                                    <li v-for=" item in accidentCars" :class="accidentInfo.vehicleNum==item.key?'active':''">{{item.value}}</li>
                                </ul>
                                <ul>
                                    <li v-for=" item in pedestrians" :class="accidentInfo.hasPedestrian==item.key?'active':''">{{item.value}}</li>
                                </ul>
                                <ul>
                                    <li v-for=" item in motorVehicles" :class="accidentInfo.hasNonMotorVehicle==item.key?'active':''">{{item.value}}</li>
                                </ul>
                                <ul>
                                    <li>{{$t("home.accidentDuration")}}</li>
                                    <li>{{durationTime}}</li>
                                </ul>
                            </div>
                            <p style="margin-top: 10px;">
                                <i></i>
                                <span>{{$t("home.influenceLevel")}}</span>
                            </p>
                            <div class="affect-box">
                                <ul>
                                    <li v-for="item in colors" style="width: 20px;height: 10px;">
                                        <i class="el-icon-caret-bottom" v-if="item.key==influenceDegree" style="font-size: 16px;margin-left: -5px;"></i>
                                    </li>
                                </ul>
                                <ul>
                                    <li v-for="item in colors" style="width: 20px;height: 18px;">
                                        <span :style="'background:'+item.color" style="width: 8px;height: 18px;border-radius: 5px;display: block;"></span>
                                    </li>
                                </ul>
                                <ul>
                                    <li v-for="item in colors" style="width: 20px;height: 20px;">
                                        <b style="display: block;width: 30px;">{{item.value}}</b>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="evnent-map-box" style="position: relative;">
                    <div id="eventMap" style="width: 100%;height: 100%;">
                        <track-playback :options="trackoptions" :crossData="accidentData" ref="playBack" @parentMethod="loadMap()"></track-playback>
                    </div>
                    <div class="video-box" ref="videoBox" v-if="videoUrl">
                        <flv-js :address="videoUrl" ref="flvPlayer"></flv-js>
                    </div>
                    <div class="track-tool-bar" style="position: absolute;top: auto;bottom: 140px; transform: translateY(0);right: 12px;">
                        <li :class="dateType==1?'active':''" @click="dateType=1">
                            <img :src="assetUrl('../assets/image/screen/1920/ssgj.png')" alt="">
                            <span>事故轨迹</span>
                            <div class="track-date-box">{{date}}</div>
                        </li>
                        <li :class="dateType==2?'active':''" @click="dateType=2">
                            <img :src="assetUrl('../assets/image/screen/1920/lsgj.png')" alt="">
                            <span>{{$t("home.historicalTrack")}}</span>
                            <div class="tool-bar-date" v-show="dateType==2">
                                <div style="display: flex;">
                                    <span class="end-time">开始时间:</span>
                                    <div>
                                        <el-date-picker @change="timeChangeStart" v-model="startTime" :clearable=false type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="'选择时间'">
                                        </el-date-picker>
                                    </div>
                                </div>
                                <div class="time-gry-box">
                                    <el-radio-group v-model="timeGry">
                                        <el-radio :label="2">2分钟</el-radio>
                                        <el-radio :label="5">5分钟</el-radio>
                                        <el-radio :label="10">10分钟</el-radio>
                                    </el-radio-group>
                                </div>
                            </div>
                        </li>
                        <li @click="wsplay=!wsplay" :class="wsplay?'':'active'">
                            <img :src="assetUrl('../assets/image/screen/1920/tzgj.png')" alt="">
                            <span>停止轨迹</span>
                        </li>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import http from '@/api/http';
import FlvJs from './video/FlvJs.vue'
import trackPlayback from './trackPlayback.vue';
import protobuf from "protobufjs";

defineOptions((() => {
const { SERVICE_URL, WEBSOCKET_URL } = window.APP_CONFIG;

const assetModules = import.meta.glob('../assets/image/**/*', { eager: true, import: 'default' }) as Record<string, string>;
const assetUrl = (path: string): string => assetModules[path] ?? '';

var AwesomeMessage
protobuf.load("static/carTrackObj.proto", function(err, root) {
    if (err)
        throw err;


    AwesomeMessage = root.lookupType("crossserverpb.CarTrack");


});

return {
    props: ['accidentData', 'type'],
    components: {
        FlvJs,
        trackPlayback
    },
    data() {
        return {

            eventMap: null,
            options: [],

            options1: [],
            expandedKeys: '',
            expandedKeys1: '',

            address1: '',
            address2: '',
            videoPlay: false,
            accidentSpots: [{
                key: -3,
                value: this.$t("home.locationInvolved")
            }, {
                key: 1,
                value: this.$t("home.intersection")
            }, {
                key: 2,
                value: this.$t("home.roadSection")
            }, {
                key: 3,
                value: this.$t("home.highway")
            }],
            accidentTimes: [{
                key: -3,
                value: this.$t("home.involvedTime")
            }, {
                key: 1,
                value: this.$t("home.morningPeak")
            }, {
                key: 2,
                value: this.$t("home.flatPeak")
            }, {
                key: 3,
                value: this.$t("home.eveningPeak")
            }, {
                key: 4,
                value: this.$t("home.atNight")
            }],
            accidentCars: [{
                key: -3,
                value: this.$t("home.vehicleInvolved")
            }, {
                key: 1,
                value: this.$t("home.bicycle")
            }, {
                key: 2,
                value: this.$t("home.multipleCars")
            }],
            pedestrians: [{
                key: -3,
                value: this.$t("home.pedestrianInvolved")
            }, {
                key: 1,
                value: this.$t("home.have")
            }, {
                key: 0,
                value: this.$t("home.no")
            }],
            motorVehicles: [{
                key: -3,
                value: this.$t("home.nonMotorVehiclesInvolved")
            }, {
                key: 1,
                value: this.$t("home.have")
            }, {
                key: 0,
                value: this.$t("home.no")
            }],
            durationTime: '',
            times: '',
            checked: false,
            wsplay: true,
            invt: null,
            colors: [{
                color: '#1AFD9C',
                value: this.$t("home.low"),
                key: 1

            }, {
                color: '#28ff28',
                value: ''
            }, {
                color: '#C4C400',
                value: this.$t("home.lower"),
                key: 2

            }, {
                color: '#F9F900',
                value: ''

            }, {
                color: '#FFAF60',
                value: this.$t("home.in"),
                key: 3

            }, {
                color: '#FF8000',
                value: ''

            }, {
                color: '#FF5809',
                value: this.$t("home.high"),
                key: 4

            }, {
                color: '#FF5809',
                value: ''

            }, {
                color: '#FF0000',
                value: this.$t("home.higher"),
                key: 5

            }, {
                color: '#CE0000',
                value: ''

            }],
            updateTime: true,
            URL: '',
            influenceDegree: 1,
            trackoptions: {
                tracks: null,
                play: true,
                vehiclePlate: true
            },
            crossData: '',
            videoUrl: '',
            dateType: 1,
            dirList: [],
            startTime: '',
            endTime: '',
            date: '',

            address: [],
            cascaderKey: 1,
            defaultProps: {
                children: 'children',
                label: 'name',
                value: 'value'
            },
            videoBar: false,
            routerFlag: false,
            timeGry: 5,
            accidentInfo: '',
            websocket: null,
            reconnectTimer: null,
            isDestroying: false,
            videoPlayHandler: null,
            videoPauseHandler: null
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
        dateType(val) {
            if (this.videoUrl) {
                this.playVideo(1)
            }

            this.openSend()

        },
        timeGry() {
            this.timeChangeStart()
        }
    },
    created() {
        this.startTime = this.accidentData.startTime;

        this.getendTime()
        // this.crossData = JSON.parse(sessionStorage.getItem('crossData'))



    },
    mounted() {
        if (this.type == 0) {
            this.$parent.routerFlag = true;
            this.$parent.closeWebsocket();
        }
        this.eventHandle()
        this.getDurationTime()
        this.openInterval()

        // this.initMap()
        this.getRealDirList()
        this.getHostDirList()



        var video = document.getElementById('J_video'),
            _this = this;

        this.videoPlayHandler = function() {
            if (_this.updateTime) {
                _this.resettime()
            }
        }
        this.videoPauseHandler = function() {
            _this.updateTime = false;
        }
        video.addEventListener('play', this.videoPlayHandler)
        video.addEventListener('pause', this.videoPauseHandler)


    },
    unmounted() {

    },
    beforeUnmount() {
        this.isDestroying = true;
        this.routerFlag = true;
        this.clearInterval()
        this.clearReconnectTimer()
        this.closeWebsocket()
        if (this.$refs.flvPlayer) {
            this.$refs.flvPlayer.destroy();
        }
        var video = document.getElementById('J_video');
        if (video && this.videoPlayHandler) {
            video.removeEventListener('play', this.videoPlayHandler)
            this.videoPlayHandler = null
        }
        if (video && this.videoPauseHandler) {
            video.removeEventListener('pause', this.videoPauseHandler)
            this.videoPauseHandler = null
        }
        this.playVideo(1)
    },
    methods: {
        clearReconnectTimer() {
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer)
                this.reconnectTimer = null
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
        loadMap() {
            this.request();
            this.getTrafficEventInfoById()
        },
        getTrafficEventInfoById() {
            const _this = this;

            var param = {
                id: this.accidentData.id


            }

            http.get(SERVICE_URL + 'handle/getTrafficEventInfoById?', { params: param }).then((data) => {
                var item = this.accidentInfo = data.data.data;
                var obj = {
                    item: '',
                    maps: this.$refs.playBack.roadMap,
                    id: item.id,
                    coordinates: [item.x, item.y],
                    iconImg: 'icon-evt',
                    type: 'point',
                    iconSize: 1.2,
                    iconOverlap: false,
                    iconPlacement: false,
                    textOverlap: false,
                    textPlacement: false
                }
                this.mapUtils.addPoint(obj);
            })
        },
        timeChangeStart() {

            let time = new Date(this.endTime).getTime() - new Date(this.startTime).getTime()
            if (time <= 1000 * 60 * 30 && time > 0) {

            } else {
                var date = new Date(this.startTime)
                date.setMinutes(date.getMinutes() + this.timeGry);
                var m = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
                var d = date.getDate() <= 9 ? '0' + (date.getDate()) : date.getDate();
                var hour = date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours();
                var min = date.getMinutes();
                this.endTime = date.getFullYear() + '-' + m + '-' + d + ' ' + hour + ':' + (min < 10 ? "0" + min : min) + ':00';
            }
            if (this.videoUrl) {
                this.playVideo(0)
            }
            if (this.dateType == 2) {
                this.openSend()
            }
        },
        timeChangeEnd() {

            if (new Date(this.endTime).getTime() - new Date(this.startTime).getTime() > 1000 * 60 * 30) {

            } else {

                var date = new Date(this.endTime)
                date.setMinutes(date.getMinutes() - this.timeGry);
                var m = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
                var d = date.getDate() <= 9 ? '0' + (date.getDate()) : date.getDate();
                var hour = date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours();

                var min = date.getMinutes();
                this.startTime = date.getFullYear() + '-' + m + '-' + d + ' ' + hour + ':' + (min < 10 ? "0" + min : min) + ':00';

            }
            if (this.videoUrl) {
                this.playVideo(0)
            }
            if (this.dateType == 2) {
                this.openSend()
            }
        },
        getendTime() {
            let time = new Date(this.endTime).getTime() - new Date(this.startTime).getTime()
            if (time <= 1000 * 60 * 30 && time > 0) {

            } else {

                var date = new Date(this.startTime)

                date.setMinutes(date.getMinutes() + this.timeGry);
                var m = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
                var d = date.getDate() <= 9 ? '0' + (date.getDate()) : date.getDate();


                var hour = date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours();
                var min = date.getMinutes();

                this.endTime = date.getFullYear() + '-' + m + '-' + d + ' ' + hour + ':' + (min < 10 ? "0" + min : min) + ':00';


            }
        },
        parentEvt() {
            this.$refs.playBack.roadMap.remove()
            if (this.type == 1) {

                this.$parent.getAccidentList()
            }
            if (this.type == 0) {

                this.$parent.routerFlag = false;
                this.$parent.request()
            }

        },
        openInterval() {
            this.invt = setInterval(() => {

                this.getDurationTime();

            }, 1000 * 3)

        },

        clearInterval() {
            clearInterval(this.invt);
            this.invt = null;

        },

        getRealDirList() {
            const _this = this;

            var param = {
                crossId: this.accidentData.crossId,
                id: this.accidentData.id

            }

            http.get(SERVICE_URL + 'cameraVideo/getRealDirList?', { params: param }).then((data) => {

                this.dirList = data.data.data;
                this.dirList.forEach(item => {
                    item.children.forEach(c => {
                        c.value = item.rid + ',' + c.id
                    })
                })


            })
        },
        getHostDirList() {
            const _this = this;

            var param = {
                crossId: this.accidentData.crossId,
                id: this.accidentData.id

            }

            http.get(SERVICE_URL + 'cameraVideo/getHostDirList?', { params: param }).then((data) => {
                this.updateTime = true;
                this.options1 = data.data.data;
                // this.expandedKeys1 = data.data.data[0].id;
            })
        },

        dirClick1(item) {
            this.expandedKeys1 = this.expandedKeys1 == item.id ? '' : item.id

        },
        handleNodeClick1(item) {

            this.address1 = SERVICE_URL + item.url;
            this.address2 = item.url;
            this.address = [
                "",item.rid + "," + item.id
            ]
            this.updateTime = true;
            console.log("dir click:" + this.address[1])
            this.playVideo(0);
        },
        getDurationTime() {
            const _this = this;

            var param = {
                crossId: this.accidentData.crossId,
                trackId: this.accidentData.trackId,
                time: this.accidentData.time


            }

            http.get(SERVICE_URL + 'cameraVideo/getDurationTime?', { params: param }).then((data) => {

                this.durationTime = data.data.data.durationTime;
                this.influenceDegree = data.data.data.influenceDegree;
            })
        },


        eventHandle() {
            const _this = this;

            var param = {
                crossId: this.accidentData.crossId,
                trackId: this.accidentData.trackId


            }

            http.get(SERVICE_URL + 'cameraVideo/eventHandle?', { params: param }).then((data) => {



            })
        },

        playVideo(operation) {
            const _this = this;
            this.$refs.flvPlayer && this.$refs.flvPlayer.destroy();

            if (this.address.length <= 0) {
                return
            }

            var param = {

                rid: this.address[1].split(',')[0],
                id: this.address[1].split(',')[1],
                startTime: this.accidentData.startTime,
                endTime: this.accidentData.endTime,
                operation: operation

            }

            http.get(SERVICE_URL + 'VCN/playVideo?', { params: param }).then((data) => {
                if (data.data.code == -1) {
                    this.$message({
                        showClose: true,
                        message: data.data.msg,
                        type: 'error'
                    });
                } else {
                    if (operation == 0) {
                        this.videoUrl = data.data.resultObject;
                        console.log('play accident url:' + this.videoUrl)
                        this.$refs.flvPlayer.play(this.videoUrl);
                    } else {
                        this.cascaderKey += 1;
                        this.address = [];
                        this.videoUrl = '';
                    }
                }



            }).catch((data) => {
                console.log(data)
            })
        },
        cascaderChange() {
            this.playVideo(0);
            this.videoBar = false;
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
        },
        clearLayer() {
            this.$refs.playBack.roadMap.removeLayerAndSource('geojson-point')
            this.$refs.playBack.roadMap.removeLayerAndSource('geojson-line')
        },
        request() {

            var _this = this;

            var param = {
                crossId: this.accidentData.crossId

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
            this.clearReconnectTimer();
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
                    if (this.isDestroying || this.routerFlag) {
                        return
                    }
                    this.clearReconnectTimer();
                    this.reconnectTimer = setTimeout(() => {
                        this.reconnectTimer = null;
                        if (!this.isDestroying && !this.routerFlag) {
                            this.request()
                        }
                    }, 1000);
                }
            } else {
                this.$message.error('不支持 websocket')
                this.websocket = null;
            }

        },
        openSend() {
            if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN || !this.$refs.playBack || !this.$refs.playBack.roadMap) {
                return
            }
            var message = JSON.stringify({
                bound: this.$refs.playBack.roadMap.getBounds(),
                isOpen: this.wsplay ? 1 : 0,
                isTrackPath: this.trackPath ? 1 : 0,
                speed: 1,
                trackType: 2,
                startTime: this.startTime,
                endTime: this.dateType == 2 ? this.endTime : this.accidentData.endTime,
                isProtobuf: isProtobuf,
                language: this.$i18n.locale == 'en' ? 'en-US' : 'zh-CN',
                zoom: this.$refs.playBack.roadMap.getZoom(),
                statCrossId: this.accidentData.crossId,
                trackId: this.accidentData.trackId
            })
            this.websocket.send(message);
        },
        resettime() {

            var _this = this;

            var param = {
                crossId: this.accidentData.crossId,


            };

            http.post(this.URL + 'cross/api/histrack/resettime?', param).then((data) => {


            })
        },
        getRealtrack() {

            var _this = this;

            var param = {
                crossId: this.accidentData.crossId,


            };

            http.post(this.URL + 'cross/api/histrack/stop?', param).then((data) => {


            })
        },
        getHistrackDefault() {

            var _this = this;

            var time = this.accidentData.startTime.replace(new RegExp("-", "gm"), "/");
            var time = (new Date(time)).getTime() + this.accidentData.checkTime * 1000;
            var myDate = new Date(time);

            var m = myDate.getMonth() < 9 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
            var d = myDate.getDate() <= 9 ? '0' + (myDate.getDate()) : myDate.getDate();

            var hour = myDate.getHours() < 10 ? '0' + (myDate.getHours()) : myDate.getHours();
            var min = myDate.getMinutes();
            var s = myDate.getSeconds();
            var endTime = myDate.getFullYear() + '-' + m + '-' + d + ' ' + hour + ':' + (min < 10 ? "0" + min : min) + ':' + (s < 10 ? "0" + s : s);

            var param = {
                crossId: this.accidentData.crossId,
                startTime: this.accidentData.startTime,
                endTime: this.accidentData.endTime,
                speed: 1,
                type: 'accident'

            };


            http.post(this.URL + 'cross/api/histrack/search?', param).then((data) => {

                let map1 = this.$refs.playBack.roadMap;
                if (data.data.statusCode == 404 && map1.getSource('geojson-point')) {
                    this.times = data.data.message;
                    map1.getSource('geojson-point').setData({
                        "type": "FeatureCollection",
                        "features": []
                    })
                    map1.getSource('geojson-line').setData({
                        "type": "FeatureCollection",
                        "features": []
                    })
                } else {
                    this.autoPlay()
                }


            })
        },
        getHistrack() {


            var param = {
                crossId: this.accidentData.crossId,
                startTime: this.startTime,
                endTime: this.endTime,
                speed: 1,

            };


            http.post(this.URL + 'cross/api/histrack/search?', param).then((data) => {


                if (data.data.statusCode == 404) {
                    this.times = data.data.message;
                    this.$refs.playBack.roadMap.getSource('geojson-point').setData({
                        "type": "FeatureCollection",
                        "features": []
                    })
                    this.$refs.playBack.roadMap.getSource('geojson-line').setData({
                        "type": "FeatureCollection",
                        "features": []
                    })
                } else {
                    this.autoPlay()
                }


            })
        },
        autoPlay() {

            var id = this.accidentData.trackIds ? this.accidentData.trackIds : this.accidentData.trackId + '';
            var trackId = this.checked ? '' : id;

            if (this.wsplay) {
                var message = JSON.stringify({ "crossId": this.accidentData.crossId, "isOpen": 1, "speed": 1, trackId: trackId, realTrack: false, isProtobuf: isProtobuf })
                if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                    this.websocket.send(message);
                }
            } else {
                var message = JSON.stringify({ "crossId": this.accidentData.crossId, "isOpen": 0, "speed": 1, trackId: trackId, realTrack: false, isProtobuf: isProtobuf })
                if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                    this.websocket.send(message);
                }
            }


        },


    }

} })());
</script>
<style lang="scss">
.a-box-title {
    padding: 18px 0 0 20px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    margin-bottom: 35px;

    span {
        font-size: 18px;
        margin-right: 20px;
    }

    b {
        font-size: 14px;
    }

}


.a-box {
    width: 572px;
    height: 100%;
    margin-right: 8px;
    display: flex;
    flex-direction: column;

    .dir-menu-box {
        width: 141px;
        height: 213px;

        p {
            line-height: 35px;
            text-align: center;
            background: #143673;
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            border-top: 1px solid #0C5AAA;
            border-bottom: 1px solid #0C5AAA;
        }

        .dir-menu {
            background: #13345E;
            height: 176px;
            display: flex;
            flex-direction: column;

            // overflow: hidden;
            ul {
                flex: 1;
                border-top: 1px solid #2A486E;
                text-align: center;
                font-size: 14px;
                padding-top: 5px;

                i {
                    color: #3399FF;
                }

                span {
                    font-size: 14px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;

                    // line-height: 40px;
                }

                li {
                    line-height: 20px;
                    font-size: 12px;
                    cursor: pointer;
                    font-size: 12px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;
                    transform: scale(0.8);
                }

                .dirActive {
                    color: #66CCFF;
                }
            }

            ul:first-child {
                border: none;


            }
        }
    }

    .a-video-box {
        flex: 1;
        height: 211px;
        margin-left: 8px;
        border: 1px solid #1E5A88;
    }

    .a-info-box {
        flex: 1;
        width: 100%;
        display: flex;
        margin-top: 28px;

        .a-info {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            font-size: 12px;
            border: 1px solid #1E5A88;

            h4 {
                text-align: center;
                line-height: 39px;
                border-bottom: 1px solid #1E5A88;
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: 600;
                color: #FFFFFF;
                background: #143673;
            }

            p {
                margin: 20px 0 10px 6px;

                span {
                    font-size: 14px;

                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #FFFFFF;

                }

                i {
                    display: inline-block;
                    width: 3px;
                    height: 12px;
                    background: #CBDBF8;
                }

            }

            .info {

                h3 {
                    text-align: center;
                    font-size: 14px;
                    font-family: PingFang SC;
                    font-weight: 600;
                    color: #66CCFF;
                }

            }

            .a-info-list {
                flex: 1;
                display: flex;
                flex-direction: column;
                margin: 10px 2px 2px;
                border: 1px solid #1E5A88;

                ul {
                    display: flex;
                    flex: 1.5;
                    border-bottom: 1px solid #1B436E;

                    span {
                        font-size: 13px;
                        font-family: Source Han Sans CN;
                        font-weight: 400;
                        color: #FFFFFF;
                        width: 72px;
                        background: #13345E;
                        padding-top: 5px;
                        text-align: center;
                    }

                    b {
                        padding-top: 5px;
                        padding-left: 14px;
                        font-size: 12px;
                        font-family: Source Han Sans CN;
                        font-weight: 400;
                        color: #FFFFFF;
                    }

                    li:first-child {
                        font-size: 13px;
                        font-family: Source Han Sans CN;
                        font-weight: 400;
                        width: 90px;
                        background: #13345E;
                        padding-top: 5px;
                        text-align: left;
                        padding-left: 6px;
                    }

                    li {
                        padding-top: 5px;
                        padding-left: 7px;
                        font-size: 12px;
                        font-family: Source Han Sans CN;
                        font-weight: 400;
                        color: #FFFFFF;
                    }

                    .active {
                        color: #66CCFF;
                    }

                }
            }



        }
    }

}

.evnent-map-box {
    flex: 1;
    height: 100%;
    border: 1px solid #1E5A88;
}








.ws-play-box {
    position: absolute;
    width: 200px;

    right: 10px;
    top: 10px;
    border: 1px solid #808080;
    padding: 10px;
    background: rgba(33, 36, 37, .62);
    z-index: 999;
}

.play-btn-box {
    margin-top: 10px;
    display: flex;
    justify-content: center;
}

.play-btn-box li {
    width: 80px;
    text-align: center;
    border-radius: 3px;
    line-height: 20px;
    cursor: pointer;
}

.play-btn-box i {
    font-size: 20px;
}

.event-video-play-box {
    position: absolute;
    padding: 5px 10px;

    left: 10px;
    top: 10px;
    border: 1px solid #808080;
    padding: 10px;
    background: rgba(33, 36, 37, .62);
    z-index: 999;
}



.affect-box ul {
    display: flex;
    justify-content: center;
}

.affect-box li {
    padding: 8px 0;
}

.el-cascader {
    line-height: 30px;
}

.video-box {
    position: absolute;
    top: 10px;
    background: rgba(0, 0, 0, 0.6);
    right: 10px;
    width: 300px;
    padding: 14px;
}
</style>
