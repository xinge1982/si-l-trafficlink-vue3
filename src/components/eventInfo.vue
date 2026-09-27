<template>
    <div class="main" style="z-index: 999;">
        <div style="flex:1;padding: 30px;display: flex;flex-direction: column;">
            <div class="event-box-title">
                <span>交通事件监测</span>
                <b>{{eventData.crossName||eventInfo.location}}</b>
                <i class="el-icon-close" style="float: right;cursor: pointer;font-size: 18px;" @click="closeEvent()"></i>
            </div>
            <div class="event-info-box">
                <div class="event-left-box">
                    <div class="title-2" style="margin:20px 0;">
                        <span class="index-title">事件信息</span>
                        <img :src="assetUrl('../assets/image/screen/1920/title-2.png')" alt="" style="width: 304px;">
                    </div>
                    <ul class="event-info-list" v-if="eventInfo" style="height: 350px;">
                        <div class="th">
                            <li>
                                <b>事件类型</b>
                            </li>
                            <li v-show="eventInfo.plateNumber!=='--'">
                                <b>车辆号牌</b>
                            </li>
                            <li v-show="eventInfo.vehicleType!=='--'">
                                <b>车辆类型</b>
                            </li>
                            <li>
                                <b>开始时间</b>
                            </li>
                            <li>
                                <b>持续时间</b>
                            </li>
                            <li>
                                <b>事件地点</b>
                            </li>
                            <li>
                                <b>处理状态</b>
                            </li>
                            <li style="flex:2.5;">
                                <b style="border: none;">事件描述</b>
                            </li>
                        </div>
                        <div class="td">
                            <li>
                                <span>{{eventInfo.eventType}}</span>
                            </li>
                            <li v-show="eventInfo.plateNumber!=='--'">
                                <span>{{eventInfo.plateNumber}}</span>
                            </li>
                            <li v-show="eventInfo.vehicleType!=='--'">
                                <span>{{eventInfo.vehicleType}}</span>
                            </li>
                            <li>
                                <span>{{eventInfo.startTime}}</span>
                            </li>
                            <li>
                                <span>{{eventInfo.duration}}</span>
                            </li>
                            <li>
                                <span>{{eventInfo.location}}</span>
                            </li>
                            <li>
                                <span>{{eventInfo.status}}</span>
                            </li>
                            <li style="flex:2.5;position: relative;">
                                <span style="border:none;">{{eventInfo.desc}}</span>
                                <em class="button" @click="DialogVisible=true" v-show="imgs.length>0">查看图片</em>
                            </li>
                        </div>
                    </ul>
                    <div style="display: flex;justify-content: end;margin-top: 10px;">
                        <el-button size="mini" type="primary" @click="captureShow()" v-if="checkDeviceUrl()">卡口抓拍</el-button>
                        <el-button size="mini" type="primary" @click="handleEventById(1)" v-if="eventInfo.statusType!=2">发布事件</el-button>
                        <el-button size="mini" type="danger" @click="handleEventById(2)" v-if="eventInfo.statusType==2">取消发布</el-button>
                    </div>
                    <div class="event-dispose-box" style="height: 187px;">
                        <ul class="type-box" v-show="legend" style="width: auto;height: 24px;margin-right: 0;">
                            <li style="line-height: 24px;" v-for="item in EventIdxTypes" :class="item.value==eventType?'active':''" @click="eventType=item.value,getAccidentLine()">{{item.name}}</li>
                        </ul>
                        <div id="carLine" style="height: 150px;"></div>
                    </div>
                </div>
                <div class="event-right-box">
                    <div id="eventMap" style="width: 100%;height: 100%;">
                        <track-playback :options="trackoptions" :crossData="eventData" :navigation="'bottom-right'" ref="playBack" @parentMethod="loadMap()"></track-playback>
                    </div>
                    <div class="video-play-box">
                        <div class="type-box" style="width: 164px;height: 24px;margin:17px auto;">
                            <li style="line-height: 24px;" @click="radio1=2" :class="radio1==2?'active':''">历史视频</li>
                            <li style="line-height: 24px;" @click="radio1=1" :class="radio1==1?'active':''">
                                事件视频
                            </li>
                        </div>
                        <div class="event-video-bar" v-if="radio1==1">
                            <!--   <video class="video" v-if="radio1==1" :src="address1" controls="controls" loop="loop" style="width:100%;" id="J_video"></video> -->
                            <div v-if="cameraState==1">
                                <el-button size="mini" type="primary" v-if="videoState==0" style="margin:20px 120px;" @click="generateVideo()">{{$t("home.Generatevideo")}}</el-button>
                                <video class="video box" v-if="videoState==1" :src="address1" controls="controls" loop="loop" style="width:100%;height: 100%;" id="J_video"></video>
                                <li v-if="videoState==2" style="text-align: center;margin:20px auto;">
                                    <span>{{$t("home.Video-generation")}}</span>
                                    <i class="el-icon-loading"></i>
                                </li>
                            </div>
                            <div v-if="cameraState!==1">
                                <span>{{cameraDesc}}</span>
                            </div>
                        </div>
                        <div ref="videoBox" style="left:0;right: 0;top: 15px;width: auto;background: none;" v-if="radio1==2">
                            <flv-js :address="videoUrl" ref="flvPlayer"></flv-js>
                        </div>
                        <div style="display: flex;margin:20px 0 5px 0;" v-if="radio1==1&&videoState==1">
                            <div class="event-video-btn">视频方向</div>
                            <el-cascader style="width: 180px;" v-model="expandedKeys" :options="options1" @change="handleChange"></el-cascader>
                        </div>
                        <div v-if="radio1==2" style="display: flex;margin:20px 0 5px 0;">
                            <div class="event-video-btn">视频方向</div>
                            <el-cascader style="width: 180px;" v-model="address" :options="dirList" :props="defaultProps" :key="cascaderKey" @change="cascaderChange()">
                            </el-cascader>
                        </div>
                        <div class="event-video-info" v-if="radio1==1&&videoState==1">
                            <li>
                                <b>开始时间</b>
                                <span>{{eventInfo.startTime}}</span>
                            </li>
                        </div>
                        <div v-if="radio1==2">
                            <p style="display: flex;">
                                <span class="event-video-btn">开始时间</span>
                                <el-date-picker style="width: 180px;" @change="timeChangeStart" v-model="startTime" :clearable=false type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('home.startingTime')">
                                </el-date-picker>
                            </p>
                            <p style="display: flex;margin-top: 5px;">
                                <span class="event-video-btn">结束时间</span>
                                <el-date-picker style="width: 180px;" @change="timeChangeEnd" v-model="endTime" :clearable=false type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('home.endTime')">
                                </el-date-picker>
                            </p>
                        </div>
                    </div>
                    <div class="track-tool-bar" style="position: absolute;top: auto;bottom: 29px; transform: translateY(0);left: 29px;">
                        <li :class="dateType==1?'active':''" @click="dateType=1">
                            <img :src="assetUrl('../assets/image/screen/1920/ssgj.png')" alt="">
                            <span>事件轨迹</span>
                            <div class="track-date-box">{{date}}</div>
                        </li>
                        <li :class="dateType==2?'active':''" @click="dateType=2">
                            <img :src="assetUrl('../assets/image/screen/1920/lsgj.png')" alt="">
                            <span>{{$t("home.historicalTrack")}}</span>
                            <div class="tool-bar-date" v-show="dateType==2">
                                <div style="display: flex;">
                                    <span class="end-time">开始时间:</span>
                                    <div>
                                        <el-date-picker @change="sockettimeChangeStart" v-model="startTime" :clearable=false type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="'选择时间'">
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
        <div v-show="DialogVisible" style="position: absolute;background: rgba(0,0,0,0.8);z-index: 999;top: 30px;bottom: 30px;left:30px;right: 30px;">
            <div class="event-box-title">
                <i class="el-icon-close" style="float: right;cursor: pointer;font-size: 18px;" @click="DialogVisible=false"></i>
            </div>
            <el-carousel :interval="5000" height="650px">
                <el-carousel-item v-for="item in imgs" :key="item">
                    <el-image style="height: 650px;width: 100%;" :src="item" fit="scale-down" :preview-src-list="[item]" :z-index="9999">
                    </el-image>
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="popup-box" v-if="popupUrl">
            <li>
                <span @click="popupUrl=null">x</span>
            </li>
            <iframe :src="popupUrl" style="width: 100%; height: 100%; border: none;" frameborder="0"></iframe>
        </div>
    </div>
</template>
<script setup lang="ts">
import http from '@/api/http';

const { SERVICE_URL, DEVICESERVICE_URL, WEBSOCKET_URL } = window.APP_CONFIG;

const assetModules = import.meta.glob('../assets/image/**/*', { eager: true, import: 'default' }) as Record<string, string>;
const assetUrl = (path: string): string => assetModules[path] ?? '';

import FlvJs from './video/FlvJs.vue'
import trackPlayback from './trackPlayback.vue';
import protobuf from "protobufjs";
var AwesomeMessage;
protobuf.load("static/carTrackObj.proto", function(err, root) {
    if (err)
        throw err;


    AwesomeMessage = root.lookupType("crossserverpb.CarTrack");


});

defineOptions({
    props: ['eventData', 'type', 'returnHome'],
    components: {
        FlvJs,
        trackPlayback
    },
    data() {
        return {

            eventMap: null,
            options: [],

            options1: [],
            expandedKeys: [],
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
            timeGry: 5,
            startTime: '',
            endTime: '',
            date: '正在连接轨迹服务',
            dirList: [],
            address: [],
            cascaderKey: 1,
            cascaderKey1: 1,
            defaultProps: {
                children: 'children',
                label: 'name',
                value: 'value'
            },
            videoBar: false,
            routerFlag: false,

            eventInfo: '',
            handleType: '',
            handleInfo: '',
            radio1: 2,
            EventIdxTypes: [{
                name: '速度',
                value: 1
            }, {
                name: '加速度',
                value: 2
            }],
            eventType: 1,
            legend: false,
            mp4Show: false,
            cameraState: null,
            videoState: null,
            cameraDesc: '',
            DialogVisible: false,
            imgs: [],
            videoRid: '',
            videoId: '',
            popupUrl: null,
            websocket: null,
            reconnectTimer: null,
            isDestroying: false
        }
    },

    created() {

        // this.startTime = this.eventData.startTime;
        this.startTime = this.mapUtils.getDateYMD('ymdhms', 0, this.eventData.startTime, -20);
        // this.endTime =  this.eventData.endTime;
        this.getendTime()
        // this.crossData = JSON.parse(sessionStorage.getItem('crossData'))



    },
    mounted() {


        // this.getEventHandleType()

        this.getRealDirList()
        this.getHostDirList()
        this.getCameraState()
        // this.getMp4Exist()
        if (this.radio1 == 1) {
            var video = document.getElementById('J_video'),
                _this = this;

            video.addEventListener('play', function(e) {
                if (_this.updateTime) {
                    _this.resettime()
                }

            })
            video.addEventListener('pause', function(e) {
                _this.updateTime = false;
            })
        }



    },
    unmounted() {


    },
    beforeUnmount() {
        this.isDestroying = true;
        this.popupUrl = null;
        this.clearInterval();
        this.clearReconnectTimer();
        this.closeWebsocket();
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
        dateType(val) {
            // if (this.videoUrl) {
            //     this.playVideo(1)
            // }

            this.openSend()

        },
        timeGry() {
            this.sockettimeChangeStart()
        }

    },
    methods: {
        checkDeviceUrl() {
            return typeof DEVICESERVICE_URL !== "undefined" && !!DEVICESERVICE_URL
        },
        captureShow() {

            var param = {
                beginTime: this.eventInfo.startTime ,
                endTime: this.eventInfo.endTime,
                plateNo: this.eventInfo.plateNumber
            }

            var datas = JSON.stringify(param)
            http.post(DEVICESERVICE_URL + 'api/capture/show', datas).then((data) => {
                this.popupUrl = DEVICESERVICE_URL + data.data.data.popupUrl;

            })
        },
        closeEvent() {
            this.popupUrl = null;
            this.routerFlag = true;
            this.clearInterval()
            this.closeWebsocket()
            this.playVideo(1)
            this.$parent.eventData = null
            this.$parent.trackPlay = true;
            if (!!this.returnHome) {
                if (!this.$parent.$refs.playBack) {
                    return
                }
                var map = this.$parent.$refs.playBack.roadMap;
                if (map) {
                  map.addLayer(this.$parent.$refs.playBack.createCustomLayer('crossing'));
                }
                console.log("add layer crossing")
            }
        },
        loadMap() {
            this.getEventInfoById()
            var item = this.eventData;
            var obj = {
                item: '',
                maps: this.$refs.playBack.roadMap,
                id: item.id,
                coordinates: [item.centerX, item.centerY],
                iconImg: 'icon-evt',
                type: 'point',
                iconSize: 1.2,
                iconOverlap: false,
                iconPlacement: false,
                textOverlap: false,
                textPlacement: false
            }
            this.mapUtils.addPoint(obj);
        },
        getAccidentLine() {
            const _this = this;

            var param = {
                crossId: this.eventData.crossId,
                typeCode: this.eventData.typeCode,
                plateNumber: this.eventInfo.plateNumber,
                time: this.eventData.time,
                type: this.eventType


            }
            // this.legend = true;
            http.get(SERVICE_URL + 'cityEvent/getCarLine?', { params: param }).then((data) => {
                const res = data.data.data;
                if (data.data.code == -1) {
                    this.legend = false;
                    return
                }
                this.legend = true;
                const lData = []
                var arr = []
                res.series.forEach((item, index) => {
                    lData.push(item.name)

                    item.smooth = true;
                    item.symbol = 'none';
                    item.sampling = 'average';
                    item.data.forEach(n => {
                        arr.push(n)
                    })
                })
                var min = Math.min(...arr);
                var options = {
                    dom: 'carLine',
                    color: 'rgba(255,255,255,.75)',

                    legendData: [],
                    xAxisData: res.times,
                    gridLeft: 10,
                    gridBom: 20,
                    gridTop: 20,
                    gridRight: 15,
                    yaxisTick: false,
                    yaxisLine: false,
                    axisLabelFontSize: 12,
                    ysplitLine: true,
                    series: res.series,
                    min: min
                }

                this.$nextTick(function() {

                    this.EchartsLarge.lineChart2(options)



                })
            })
        },
        handleEventById(code) {
            const _this = this;
            var param = {
                id: this.eventInfo.id,
                type:code
            }

            http.get(SERVICE_URL + 'handle/handleEventById?', { params: param }).then((data) => {
                if (data.data.code == 1) {
                    this.$message({
                        message: data.data.data,
                        type: 'success'
                    });
                    this.refreshEventInfoById();
                } else {
                    this.$message.error(data.data.data);
                }
            })
        },
        sockettimeChangeStart() {

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
            if (this.dateType == 2) {
                this.openSend()
            }


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

            if (this.videoRid) {
                this.playVideo(1)
            }
            if (this.videoUrl) {
                this.playVideo(0)
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

            if (this.videoRid) {
                this.playVideo(1)
            }
            if (this.videoUrl) {
                this.playVideo(0)
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

            if (this.type == 1) {

                this.$parent.getAccidentList()
            }
            if (this.type == 0) {
                this.$parent.routerFlag = false;
                this.$parent.request()
            }

        },
        getCameraState() {
            const _this = this;

            var param = {
                id: this.eventData.id,


            }

            http.get(SERVICE_URL + 'cameraVideo/getCameraState?', { params: param }).then((data) => {
                this.cameraState = data.data.data.state;
                this.cameraDesc = data.data.data.desc;
                if (this.cameraState == 1) {
                    this.getVideoState()
                    this.openInterval()
                }
            })
        },
        getVideoState() {
            const _this = this;

            var param = {
                id: this.eventData.id,


            }

            http.get(SERVICE_URL + 'cameraVideo/getVideoState?', { params: param }).then((data) => {
                this.videoState = data.data.data.state;
                if (this.videoState == 1) {
                    this.clearInterval()
                }

            })
        },
        generateVideo() {
            const _this = this;
            var param = {
                id: this.eventData.id
            }

            http.get(SERVICE_URL + 'cameraVideo/generateVideo?', { params: param }).then((data) => {
                this.getVideoState()
            })
        },
        openInterval() {
            this.invt = setInterval(() => {
                if (this.videoState == 2) {
                    this.getVideoState()
                }
            }, 1000 * 5)

        },

        clearInterval() {
            if (this.invt) {
                clearInterval(this.invt)
                this.invt = null;
            }

        },

        getMp4Exist() {
            const _this = this;

            var param = {
                id: this.eventData.id,
                crossId: this.eventData.crossId
                // time: this.eventData.time,
                // centerX: this.eventData.centerX,
                // centerY: this.eventData.centerY,
                // typeCode: this.eventData.typeCode

            }

            http.get(SERVICE_URL + 'cameraVideo/getMp4Exist?', { params: param }).then((data) => {
                this.mp4Show = data.data.code == -1 ? false : true;
                this.radio1 == data.data.code == -1 ? 2 : 1;
            })
        },
        getRealDirList() {
            const _this = this;

            var param = {
                id: this.eventData.id,
                crossId: this.eventData.crossId
                // centerX: this.eventData.centerX,
                // centerY: this.eventData.centerY,
                // typeCode: this.eventData.typeCode


            }

            http.get(SERVICE_URL + 'cameraVideo/getHostDirList?', { params: param }).then((data) => {

                this.dirList = data.data.data;

                if (this.dirList.length == 0) {

                    return
                }
                this.dirList.forEach(item => {
                    item.children.forEach(c => {
                        c.value = item.rid + ',' + c.id
                    })
                })

                this.address = [undefined, this.dirList[0].rid + ',' + this.dirList[0].children[0].id]
                this.cascaderChange()
            })
        },
        getHostDirList() {
            const _this = this;
            var param = {
                id: this.eventData.id,
                crossId: this.eventData.crossId
                // time: this.eventData.time,
                // centerX: this.eventData.centerX,
                // centerY: this.eventData.centerY,
                // typeCode: this.eventData.typeCode
            };
            http.get(SERVICE_URL + 'cameraVideo/getHostDirList?', { params: param }).then((data) => {

                this.options1 = data.data.data;

                if (this.options1.length == 0) {

                    return
                }
                this.options1.forEach(item => {
                    item.label = item.name;
                    item.value = item.id;
                    item.children.forEach(c => {
                        c.label = c.name;
                        c.value = c.url;
                    })
                })

                this.expandedKeys.push(this.options1[0].id, this.options1[0].children[0].url)
                this.address1 = SERVICE_URL + this.options1[0].children[0].url;

            })
        },


        handleChange(item) {

            this.address1 = SERVICE_URL + this.expandedKeys[1];

            this.updateTime = true;
        },
        getDurationTime() {
            const _this = this;

            var param = {
                crossId: this.eventData.crossId,
                trackId: this.eventData.trackId,
                time: this.eventData.time


            }

            http.get(SERVICE_URL + 'cameraVideo/getDurationTime?', { params: param }).then((data) => {

                this.durationTime = data.data.data.durationTime;
                this.influenceDegree = data.data.data.influenceDegree;
            })
        },


        getEventInfoById() {
            const _this = this;

            var param = {
                id: this.eventData.id


            }

            http.get(SERVICE_URL + 'handle/getEventInfoById?', { params: param }).then((data) => {

                this.eventInfo = data.data.data;
                if (this.eventInfo.desc.indexOf("大") >= 0) {
                  this.eventInfo.desc = this.eventInfo.desc.replace("大车", "小车");
                }
                this.getAccidentLine()
                this.request();
            })
        },
        refreshEventInfoById() {
            const _this = this;

            var param = {
                id: this.eventData.id
            }

            http.get(SERVICE_URL + 'handle/getEventInfoById?', { params: param }).then((data) => {
                this.eventInfo = data.data.data;
            })
        },

        getEventHandleInfo() {
            const _this = this;

            var param = {
                id: this.eventData.id


            }

            http.get(SERVICE_URL + 'handle/getEventHandleInfo?', { params: param }).then((data) => {


                this.handleInfo = data.data.data;
            })
        },
        getEventHandleType() {
            const _this = this;

            var param = {
                id: this.eventData.id


            }

            http.get(SERVICE_URL + 'handle/getEventHandleType?', { params: param }).then((data) => {

                this.handleType = data.data.data;
                this.getEventHandleInfo()

            })
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
                startTime: this.startTime,
                endTime: this.endTime,
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
                        console.log('play event url:' + this.videoUrl)
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
        cascaderChange() {
            if (this.videoRid) {
                this.playVideo(1)
            }
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
        clearReconnectTimer() {
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
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
        clearLayer() {
            this.$refs.playBack.roadMap.removeLayerAndSource('geojson-point')
            this.$refs.playBack.roadMap.removeLayerAndSource('geojson-line')
        },
        request() {

            var _this = this;

            var param = {
                crossId: this.eventData.crossId

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
                endTime: this.dateType == 2 ? this.endTime : this.eventData.endTime,
                isProtobuf: isProtobuf,
                language: this.$i18n.locale == 'en' ? 'en-US' : 'zh-CN',
                zoom: this.$refs.playBack.roadMap.getZoom(),
                statCrossId: this.eventData.crossId,
                trackId: this.eventData.trackId,
                plateNumber: this.eventInfo ? this.eventInfo.plateNumber : ''
            })
            this.websocket.send(message);
        },
        resettime() {

            var _this = this;

            var param = {
                crossId: this.eventData.crossId,


            };

            http.post(this.URL + 'cross/api/histrack/resettime?', param).then((data) => {


            })
        }



    }

});
</script>
<style lang="scss">
.event-box-title {
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

.event-info-box {
    flex: 1;
    display: flex;

    .event-left-box {
        width: 381px;
        height: 700px;
        border: 1px solid #15436E;

        padding: 0 20px;

        .event-info-list {
            width: 100%;
            height: 400px;
            border: 1px solid #15436E;
            display: flex;

            // flex-direction: column;
            .th {
                width: 70px;
                height: 100%;
                display: flex;
                flex-direction: column;
                background: #13345E;
                padding-left: 12px;
            }

            .td {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding-right: 12px;

                .button {
                    position: absolute;
                    font-size: 12px;
                    transform: scale(0.8);
                    background: #166DC7;
                    bottom: 5px;
                    right: 0;
                    padding: 2px 5px;
                    border-radius: 3px;
                    cursor: pointer;
                }
            }
        }

        li {
            flex: 1;
            // line-height: 62px;


            b {
                // text-align: center;
                margin-top: 18px;
                display: block;
                max-height: 22px;
                font-size: 14px;
                font-family: PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                height: 100%;
                border-bottom: 1px solid #1B436E;

            }

            span {
                margin-top: 18px;
                padding-left: 16px;
                display: block;
                max-height: 22px;
                font-size: 12px;
                font-family: PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                height: 100%;
                border-bottom: 1px solid #1B436E;
            }
        }



    }
}






.event-video-box {
    flex: 1;
    margin: 20px 15px 0 15px;
    border: 1px solid #808080;
}

.evnent-map-box {
    flex: 1;
    /*margin: 20px 15px 0 0;*/

}


.event-dispose-box {
    font-size: 14px;
    margin-top: 10px;
}

.event-dispose-nav {
    margin-bottom: 15px;
    display: flex;
}


.event-right-box {
    flex: 1;
    margin-left: 11px;
    border: 1px solid #15436E;
    position: relative;

    .video-play-box {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 390px;
        // height: 354px;
        background: #0E1835;
        border: 1px solid #123D72;
        box-shadow: 0px 0px 250px 0px rgba(14, 63, 184, 0.2);
        padding: 0 20px 20px 20px;

        .type-box {
            padding: 1px;
            display: flex;
            width: 360px;
            height: 29px;
            background: rgba(26, 39, 95, 0.45);
            border: 1px solid #2E94E1;
            border-radius: 3px;
            margin-right: 24px;

            li {
                cursor: pointer;
                flex: 1;
                font-size: 13px;
                font-family: PingFang SC;
                font-weight: bold;
                color: #FFFFFF;
                line-height: 29px;
                text-align: center;
            }

            .active {
                background: #166DC7;
                // border: 1px solid #00B4FF;
                // border-radius: 2px;
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
}






.event-video-play-box {
    position: absolute;
    padding: 5px 10px;

    left: 10px;
    top: 10px;
    border: 1px solid #808080;
    padding: 10px;
    background: rgba(33, 36, 37, .62);
    z-index: 2006;
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
