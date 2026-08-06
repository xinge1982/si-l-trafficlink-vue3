<template  >
    <div style="width: 100%;height: 100%;overflow: hidden;background: #0d1833;">
        <div class="screen-box">
            <!-- 地图区域 -->
            <div class="screen-map">
                <!-- 地图 -->
                <div class="v-map-box" v-if="!isVehicleQuery && isHome2DMap">
                    <home-track :options="options" :fixed="fixed" :crossData="areaData" :trackPath="trackPath" ref="playBack" @parentMethod="initTracks()"></home-track>
                </div>
                <div class="v-map-box bg">
                </div>
                <div :style="checktoolActive.indexOf(6)>-1?'z-index:80;':''" v-if="checktoolActive.indexOf(6)>-1" class="t-map-box">
                    <cesiumTrack ref="cesiumTrack" :track="options.tracks" @parentMethod="cesiumLoad()" @cameraChanged="handleCesiumCameraChanged()"></cesiumTrack>
                </div>
                <event-info v-if="eventData" :returnHome="eventInfoReturnHome" :eventData="eventData"></event-info>
            </div>
            <!-- 头部 -->
            <div class="screen-header">
                <div class="screen-header-time">
                    <li v-if="realTime">
                        <p>
                            <span>{{realTime.time.split(' ')[0]}}</span>
                            <b>{{realTime.time.split(' ')[1].slice(0,5)}}</b>
                        </p>
                        <p class="week">{{realTime.week}}</p>
                    </li>
                    <i></i>
                    <li v-if="weather">
                        <img :src="weather_img" alt="">
                        <span style="line-height: 43px;">{{weather.real_temp+'℃'}}</span>
                    </li>
                    <i></i>
                    <p v-if="weather">
                        <em>AQI</em>
                        <span class="aqi">{{weather.today_aqi}}</span>
                    </p>
                </div>
                <div class="track-time">{{tracksTime}}</div>
                <div class="screen-header-switch">
                    <div class="select-box">
                        <el-select v-model="demoEventScene" @change="changeDemoEvent()">
                            <el-option  key="none" label="无事件" value="none">
                            </el-option>
                            <el-option  key="person" label="行人" value="person">
                            </el-option>
                            <el-option  key="stopcar" label="异常停车" value="stopcar">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="select-box">
                        <el-select v-model="weatherScene" @change="changeWeather()">
                            <el-option v-for="item in weatherSceneList" :key="item.value" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <el-switch style="display: block" v-model="fullScreen" active-color="#04488D" active-text="全屏" :width="48">
                    </el-switch>
                    <img :src="require('../assets/image/bdh/out.png')" alt="" @click="goLogin()">
                    <p style="line-height: 29px;">{{'V '+version}}</p>
                </div>
            </div>
            <!-- 左侧边栏 -->
            <!-- <div class="screen-left-border"></div> -->
            <div class="screen-left-box" :style="fullScreen?'left:-945px;':'left:0;'">
                <!-- 核心区域概况 -->
                <div class="left-box">
                    <div class="title-box">
                        <span class="sub-title">核心区域概况</span>
                    </div>
                    <div class="road-info-box">
                        <li class="flex" v-for="(item,i) in real1">
                            <img :src="require('../assets/image/bdh/'+item.icon+'_'+i+'.png')" alt="">
                            <b>{{item.name}}</b>
                            <p>
                                <span :style="'color:'+roadInfoListColors[i]">{{item.value}}</span>
                                <em :style="'color:'+roadInfoListColors[i]">{{item.unit}}</em>
                            </p>
                        </li>
                    </div>
                    <div class="road-info-box" style="display: flex;margin-top: 21px;">
                        <div style="width: 336px;">
                            <div class="title">
                                <img :src="require('../assets/image/bdh/sub-title.png')" alt="">
                                <span>车辆分析</span>
                                <!-- <em>单位：量</em> -->
                            </div>
                            <div class="vehicle-number">
                                <img :src="require('../assets/image/bdh/car-type-bg.png')" alt="">
                                <div class="list">
                                    <div class="img-box">
                                        <img :src="require('../assets/image/bdh/car.png')" alt="">
                                    </div>
                                    <div class="list_">
                                        <li v-for="(item,i) in real2">
                                            <i></i>
                                            <b>{{item.name}}</b>
                                            <span>{{item.value}}</span>
                                        </li>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="left-box" style="margin-top: 15px;">
                    <div class="road-info-box">
                        <div style="flex:1;">
                            <div class="title">
                                <img :src="require('../assets/image/bdh/sub-title.png')" alt="">
                                <span>出入车辆趋势分析</span>
                            </div>
                            <div class="line-box" id="line1"></div>
                        </div>
                    </div>
                </div>
                <!-- 路网拥堵态势概况 -->
                <div class="left-box" style="margin-top: 24px;">
                    <div class="title-box">
                        <span class="sub-title">路网拥堵态势分析</span>
                        <b @click="isNetWorkInfo=true">更多分析 ></b>
                    </div>
                    <div class="road-info-box">
                        <div class="road-net">
                            <div class="info">
                                <img :src="require('../assets/image/bdh/road-index.png')" alt="">
                                <li v-for="(item,i) in congest3.slice(0, 2)" :key="i">
                                    <b>{{item.name}}</b>
                                    <span>{{item.value}}</span>
                                </li>
                            </div>
                            <div class="list">
                                <li v-for="(item,i) in congest3.slice(2)" :key="i">
                                    <b>{{item.name.replace('路网', '')}}</b>
                                    <span>{{item.value}}</span>
                                    <em>{{item.unit}}</em>
                                </li>
                            </div>
                        </div>
                    </div>
                    <div class="road-info-box" style="padding-right: 80px;">
                        <div style="flex:1;">
                            <div class="title">
                                <img :src="require('../assets/image/bdh/sub-title.png')" alt="">
                                <span>拥堵指数变化趋势</span>
                            </div>
                            <div class="line-box" style="margin-top: 0;" id="line2"></div>
                        </div>
                        <!--  <div style="flex:1;">
                            <div class="title">
                                <img :src="require('../assets/image/bdh/sub-title.png')" alt="">
                                <span>拥堵里程占比变化趋势</span>
                            </div>
                            <div class="line-box" style="margin-top: 0;" id="line3"></div>
                        </div> -->
                    </div>
                </div>
            </div>
            <!-- 图层显示区域 -->
            <div class="screen-center-box">
                <cross-box v-if="crossData"></cross-box>
                <router-view v-if="isRouterShow" />
            </div>
            <!-- 右侧边栏 -->
            <!--  <div class="screen-right-border"></div>
 -->
            <div class="screen-right-box" :style="fullScreen?'right:-945px;':'right:0;'">
                <div class="right-box">
                    <div class="title-box">
                        <span class="sub-title">路网安全态势分析</span>
                    </div>
                    <div class="road-info-box" style="margin-top: 2px">
                        <div class="event-info-box">
                            <img :src="require('../assets/image/bdh/event-icon.png')" alt="">
                            <div class="evt-menu-box">
                                <li v-for="(item,i) in event1" :key="i">
                                    <span>{{item.name}}</span>
                                    <b>{{item.value}}</b>
                                    <span>{{item.unit}}</span>
                                </li>

                            </div>
                        </div>
                    </div>
                    <div class="road-info-box">
                        <div style="flex:1;">
                            <div class="war-evt-list">
                                <div style="height: 288px;position: relative;padding: 5px;" v-anyNameYouLike>
                                    <div class="evt-timeline-box">
                                        <ul v-for="(item,i) in event3" :key="i" style="cursor: zoom-in" @click="showEventInfo(item)">
                                            <div >
                                                <li style="display: flex;">
                                                    <span style="flex:1;">{{item.time}}</span>
                                                    <img :src="getImagePath(item.stats)" alt="">
                                                    <i :style="{'color': item.stats == 1 ? '#04D475' : item.stats == 2 ? '#FF8817' : '#FF444F'}">{{item.stats==1?'已处理':item.stats==2?'待处理':'已超时'}}</i>
                                                </li>
                                                <li>
                                                    <b>{{item.desc}}</b>
                                                </li>
                                                <li>
                                                    <span>上报时间</span>
                                                    <b style="font-size: 12px;">{{item.updateTime}}</b>
                                                </li>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="road-info-box" style="margin-top: 10px;">
                        <div style="flex:1;">
                            <div class="title">
                                <img :src="require('../assets/image/bdh/sub-title.png')" alt="">
                                <span>设备状态</span>
                                <b style=" position:relative; left:280px; margin-right: 18px; font-family: MicrosoftYaHei; font-size: 12px; color: #14EBFF; cursor: pointer; "
                                   @click="addModel()">刷新</b>
                            </div>
                            <div class="equ-list-box">
                                <ul>
                                    <li>设备名称</li>
                                    <li>上报时间</li>
                                    <li>状态</li>
                                </ul>
                                <div class="list" v-anyNameYouLike>
                                    <ul v-for="(item,i) in deviceList" :key="i" @click="deviceListClick(item)">
                                        <li :title="item.deviceName">{{item.deviceName}}</li>
                                        <li>{{item.updateTime.slice(0,19)}}</li>
                                        <li>{{item.deviceState==1?'在线':'离线'}}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="road-info-box" style="margin-top: 21px;">
                        <div style="flex:1;">
                            <div class="title">
                                <img :src="require('../assets/image/bdh/sub-title.png')" alt="">
                                <span>道路实时视频</span>
                                <div style="flex:1;">
                                    <el-cascader v-model="address" :options="dirList" :props="defaultProps" :key="cascaderKey" @change="cascaderChange()" placeholder="视频选择" style="float: right;margin-right: 16px;background:none;">
                                    </el-cascader>
                                </div>
                            </div>
                            <div>
                                <div class="evt-video-box">
                                    <flv-js v-if="crossVideoShow" :address="crossVideoUrl" ref="flvPlayer"></flv-js>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 底部 -->
            <!--  <div class="screen-bottom">
                <img :src="require('../assets/image/bdh/'+(bomDown?'up.png':'down.png'))" alt="" @click="bomDown=!bomDown">
            </div> -->
            <div class="tool-box">
                <li v-for="item in toolData" @click="toolClick(item)" :class="checktoolActive.indexOf(item.value)>-1?'active':''">
                    <!--  <img :src="checktoolActive.indexOf(item.value)>-1?require('../assets/image/bdh/nav-active.png'):require('../assets/image/bdh/nav.png')" alt=""> -->
                    <span>{{item.name}}</span>
                </li>
            </div>
            <div class="popup-box" v-show="dialogUrl">
                <li>
                    <span @click="dialogUrl=null">x</span>
                </li>
                <iframe :src="dialogUrl" style="width: 100%; height: 100%; border: none;" frameborder="0"></iframe>
            </div>
            <!-- 弹窗区域 -->
            <!-- 路网统计 -->
            <div style="width: 100%;height: 100%;background: rgba(0,0,0,0.6);position: absolute;z-index: 999;top: 0;" v-if="isNetWorkInfo">
                <netWorkInfo></netWorkInfo>
            </div>
            <div style="width: 100%;height: 100%;background: rgba(0,0,0,0.6);position: absolute;z-index: 999;top: 0;" v-if="isRoadEval">
                <roadEvaluate></roadEvaluate>
            </div>
            <!-- 车辆画像 -->
            <div style="width: 100%;height: 100%;background: rgba(0,0,0,0.6);position: absolute;z-index: 999;top: 0;" v-if="isvehiclePort">
                <vehiclePortrait></vehiclePortrait>
            </div>
            <!-- 车辆查询 -->
            <div style="width: 100%;height: 100%;background: rgba(0,0,0,0.6);position: absolute;z-index: 999;top: 0;" v-if="isVehicleQuery">
                <vehicle-query></vehicle-query>
            </div>
            <!-- 事件查询 -->
            <div style="width: 100%;height: 100%;background: rgba(0,0,0,0.6);position: absolute;z-index: 999;top: 0;" v-if="isTtafficEvt">
                <traffic-event :eventClickTime="eventClickTime"></traffic-event>
            </div>
            <!-- 设备运维 -->
            <div style="width: 100%;height: 100%;background: rgba(0,0,0,0.6);position: absolute;z-index: 999;top: 0;" v-if="isequMaintenance">
                <equMaintenance></equMaintenance>
            </div>
        </div>
    </div>
</template>
<script>
import { getPie3D, getParametricEquation } from '../tool/charts.js' //工具类js，页面路径自己修改
import protobuf from "protobufjs";

var color = ['#EA3A15', '#116BDC', '#11C1C8', '#FFCD06', '#00FF84']
var meshArr = [],
    buildingIds = [];
var AwesomeMessage, map, marker, popupArr = [],
    player, playerArr = [],
    cameraLabel = null,
    alarmPopup = null;
protobuf.load("static/carTrackObj.proto", function(err, root) {
    if (err)
        throw err;

    AwesomeMessage = root.lookupType("crossserverpb.CarTrack");

});
import homeTrack from './homeTrack.vue';
import cesiumTrack from './cesiumTrack.vue';
import crossBox from './cross.vue';
import roadAnalyse from './roadAnalyse.vue';
import alarmTable from './alarmTable.vue';
import infoPublish from './infoPublish.vue';
import trafficEvent from './trafficEvent.vue';
import globalConfig from './globalConfig.vue';
import vehicleQuery from './vehicleQuery.vue';
import netWorkInfo from './netWorkInfo.vue'
import roadEvaluate from './roadEvaluate.vue'
import equMaintenance from './equMaintenance.vue'
import vehiclePortrait from './vehiclePortrait.vue'
import Flv from 'flv.js'
import config from '../../package.json'
import FlvJs from "./video/FlvJs.vue";
import FlvExtend from 'flv-extend'
import eventInfo from './eventInfo.vue';

let sharedAudioContext = null;
const alarmAudioBufferCache = {};

function getSharedAudioContext() {
    if (sharedAudioContext) {
        return sharedAudioContext;
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
        return null;
    }
    sharedAudioContext = new AudioContextClass();
    return sharedAudioContext;
}

export default {
    components: {eventInfo, FlvJs, homeTrack, cesiumTrack, crossBox, roadAnalyse, alarmTable, infoPublish, trafficEvent, globalConfig, vehicleQuery, netWorkInfo, roadEvaluate, equMaintenance, vehiclePortrait },
    data() {
        return {
            title: WEB_TITLE_V2,
            isRouterShow: true,
            options: {
                tracks: null,
                tracksPoint: null,
                play: true,
                type: 'area',
                fixed: true
            },
            trackPlay: true,
            trackPath: false,
            areaData: {
                centerX: MAP_CENTER[0],
                centerY: MAP_CENTER[1],
            },
            time: '',
            date: '',
            week: '',
            webType: WEB_TYPE,
            rankType: WEB_TYPE,
            trafficAnalysis: '',
            RoadNetworkOverview: [],
            onDuty: '',
            workConsultation: '',
            colors: ['#FFF636', '#11BFFF', '#2BFBB4', '#2673E8', '#FCFDFC', '#749f83'],
            layerType: null,
            layerTypes: [],
            CongestionAnalysis: '',
            cNav: '',
            BlockAnalysis: '',
            bNav: '',
            trackAnalysis: '',
            HighFatSection: '',
            PassengerCargoRatio: '',
            PassengerCargoRatioList: [],
            stationsVoList: [],
            stationsVoListColor: ['#60CAF0', '#FFF4A5', '#72EDC3'],
            stationsTotal: 0,
            EventRatio: '',
            EventInfo: '',
            EventRealList: [],
            bounds: '',
            crossList: '',
            roadList: '',
            width: document.body.clientWidth,
            stateColors: {
                1: {
                    bgColor: 'rgba(64,247,222,0.4)',
                    boColor: 'rgba(64,247,222,1)'
                },
                2: {
                    bgColor: 'rgba(248,167,52,0.4)',
                    boColor: 'rgba(248,167,52,1)'
                },
                3: {
                    bgColor: 'rgba(199,26,52,0.4)',
                    boColor: 'rgba(199,26,52,1)'
                },
            },
            EventStateCountList: [],
            crossInfoNavMenu: [],
            crossData: '',
            toolData: [{
                name: '路网统计',
                value: 1,
                show: false,
                icon: require('../assets/image/bdh/track-play.png'),
                activeIcon: require('../assets/image/bdh/track-play-1.png'),
                top: '14px'
            }, {
                name: '车辆画像',
                value: 2,
                show: true,
                icon: require('../assets/image/bdh/his-track.png'),
                activeIcon: require('../assets/image/bdh/his-track-1.png'),
                top: '0'
            }, {
                name: '车辆查询',
                value: 3,
                show: true,
                icon: require('../assets/image/bdh/car-info.png'),
                activeIcon: require('../assets/image/bdh/car-info-1.png'),
                top: '-40px'
            }, {
                name: '事件查询',
                value: 4,
                show: true,
                icon: require('../assets/image/bdh/traffic-info.png'),
                activeIcon: require('../assets/image/bdh/traffic-info-1.png'),
                top: '-40px'
            }, {
                name: '设备运维',
                value: 5,
                show: true,
                icon: require('../assets/image/bdh/equ-layer.png'),
                activeIcon: require('../assets/image/bdh/equ-layer-1.png'),
                top: '0'
            }, {
                name: '三维场景',
                value: 6,
                show: true,
                icon: require('../assets/image/bdh/3d.png'),
                activeIcon: require('../assets/image/bdh/3d-1.png'),
                top: '14px'
            }],

            toolActive: 1,
            defaultCheckToolActive: [],
            checktoolActive: [],
            indexTypes: [{
                value: '1',
                label: this.$t("home.flow")
            }, {
                value: '2',
                label: this.$t("home.numberOfStops")
            }, {
                value: '3',
                label: this.$t("home.parkingDelay")
            }, {
                value: '4',
                label: this.$t("home.theLengthOfQueue")
            }],
            index: '1',
            indexUnit: {
                '1': this.$t("home.vehicles"),
                '2': this.$t("home.times"),
                '3': this.$t("home.second"),
                '4': this.$t("home.meter")
            },
            dirs: [],
            times: [{
                value: '1',
                label: this.$t("home.realTime")
            }, {
                value: '2',
                label: '5min'
            }],
            timeType: '1',
            URL: '',
            dirDatas: {},
            lookAt: lookAt,
            tilesets: tilesets,
            modelPath: modelPath,
            skyBoxPath: skyBoxPath,
            facilityPath: facilityPath,
            imagerUrl: imagerUrl,
            tracks: null,
            inter: null,
            ect: null,
            ect1: null,
            pause: true,
            person: 3,
            tracking: { id: '', person: 3 },
            videoUrl: SERVICE_URL + 'video/demo.mp4',
            location: '',
            eventId: null,
            tracksTime: '',
            startTime: '',
            endTime: '',
            timeGry: 5,
            crossName: '',
            evtTotal: 0,
            page: 1,
            pageSize: 100,
            evtOrderType: [],
            evtOrder: null,
            rankTypes: {

                'cross': [{
                    name: '路口排名',
                    value: 'cross',
                    class: 'btn'
                }, {
                    name: '路段排名',
                    value: 'highway',
                    class: 'btn'
                }],
                'highway': [{

                    name: '路段排名',
                    value: 'highway',
                    class: 'btn'

                }]
            },
            username: sessionStorage.getItem('username'),
            videoUrlList: [],
            SERVICE_URL: SERVICE_URL,

            ThreeQuickSpeedList: [],
            threeId: null,
            threeDateType: 'day',
            threeQuickSpeedPage: 1,
            threeQuickSpeedPageSize: 10,
            threeQuickSpeedTotal: 0,
            version: config.version + '_' + config.time,
            cEct: null,
            bEct: null,
            days: [{
                name: '昨天',
                value: 1
            }, {
                name: '今天',
                value: 2
            }],
            day: 2,
            dateTypes: [{
                name: '日',
                value: 1
            }, {
                name: '周',
                value: 2
            }, {
                name: '月',
                value: 3
            }],
            dateType: 1,
            autoPolling: true,
            video: null,
            vList: [],
            vLen: 0,
            curr: 0,
            eLen: 0,
            ecurr: 0,
            autoRefresh: true,
            leftTitle: leftTitle,
            rightTitle: rightTitle,
            websocket: null,
            evtWebsocket: null,
            screenWebsocket: null,
            fireData: null,
            hasAlarmSound: false,
            realAlarmCount: [],
            alarmTableType: null,
            evtWebsocketData: '',
            facilityList: '',
            fireEventList: '',
            publishInfo: '',
            eventTotal: 0,
            isDot: false,
            isHome2DMap: true,
            isTtafficEvt: false,
            isVehicleQuery: false,
            isequMaintenance: false,
            isvehiclePort: false,
            eventClickTime: [],
            fixed: false,
            cameraCodeArr: [],
            isShowGc: false,
            videoEvt: null,
            alarmVideoRid: '',
            alarmVideoId: '',
            fireAlarm: fireAlarm,
            eventData: '',
            eventInfoReturnHome: false,
            routerFlag: false,
            socketMessage: null,
            mouseDownHandler: null,
            websocketState: 1,
            chartResizeHandler: null,
            homeMapMoveEndHandler: null,
            crossPointClickHandler: null,
            crossIndexPointClickHandler: null,
            roadCascaderOptions: [],
            crossListObj: {},
            crossId: [],
            dir: '',
            crossStatusList: [],
            timeInter: null,
            inter1: null,
            inter2: null,
            // qhd
            fullScreen: false,
            realTime: '',
            weather: '',
            weather_img: '',
            real1: [],
            roadInfoListColors: ['#13E2A8', ' #1DCAFF', '#12FFD0'],
            real2: [],
            area2: '',
            vNumPosition: [{
                left: '76px',
                top: '30px'
            }, {
                left: '249px',
                top: '30px'
            }, {
                left: '24px',
                top: '89px'
            }, {
                left: '304px',
                top: '89px'
            }],
            roadNet: [{
                name: '路网拥堵里程',
                value: 68,
                unit: 'km'
            }, {
                name: '路网拥堵里程',
                value: 68,
                unit: 'km/h'
            }, {
                name: '路网拥堵里程',
                value: 68
            }, {
                name: '路网拥堵里程',
                value: 68
            }, {
                name: '路网拥堵里程',
                value: 68
            }],
            roadNetPosition: [{
                left: '176px',
                top: '4px'
            }, {
                left: '290px',
                top: '35px'
            }, {
                left: '298px',
                top: '100px'
            }, {
                left: '70px',
                top: '100px'
            }, {
                left: '70px',
                top: '35px'
            }],
            road1: [],
            road2: [],
            congest1: '',
            congest2: '',
            congest3: [],
            congest4: [],
            event1: [],
            event4: [],
            event5: [],
            event5Position: [0, '70px', '140px'],
            event6: '',
            event7: [],
            optionData: [],
            statusChart: null,
            optionect: {},
            event3: [],
            bomDown: false,
            gltfData: [],
            isNetWorkInfo: false,
            isRoadEval: false,
            videoCrossData: '',
            videoRoadData: '',
            dirList: [],
            address: [],
            cascaderKey: 1,
            defaultProps: {
                children: 'children',
                label: 'name',
                value: 'value'
            },
            videoRid: '',
            videoId: '',
            crossVideoShow: true,
            crossVideoUrl: '',
            deviceList: [],
            viewer: null,
            devInfocontent: null,
            popupPosition: null,
            dialogUrl: null,
            mapDevice:new Map(),
            weatherScene: 'none',
            weatherSceneList: [
                {name: '晴天',value:'none'},
                {name: '雨天',value:'rain'},
                {name: '雪天',value:'snow'},
            ],
            demoEventScene: 'none',
        }
    },
    created() {
        this.startTime = this.mapUtils.getDateYMD('ymdhms', -this.timeGry);
        this.endTime = this.mapUtils.getDateYMD('ymdhms');
        this.date = this.mapUtils.getDateYMD('ymd');

        this.timeInter = setInterval(() => {
            this.time = this.mapUtils.getDateYMD('hms');
        }, 1000)

        // this.getgltfData()



    },
    mounted() {
        this.getscreenwebsocketData();
        this.getRealDirList();

        if (this.webType === 'cross') {
            this.getCrossTop10()
        }
        this.getRoadTop10();

        // 三十分钟无操作重连轨迹websocket服务
        this.mouseDownHandler = function() {
            // _this.clearTimeOff()
            // _this.setTimeOff()
        };
        window.addEventListener('mousedown', this.mouseDownHandler)

    },
    beforeDestroy() {

        this.unbindHomeMapEvents()
        this.unbindChartResizeHandler()
        this.clearIntervalAll()
        if (this.timeInter) {
            clearInterval(this.timeInter)
            this.timeInter = null;
        }
        if (this.statusChart) {
            this.statusChart.dispose();
            this.statusChart = null;
        }
        if (this.mouseDownHandler) {
            window.removeEventListener('mousedown', this.mouseDownHandler)
            this.mouseDownHandler = null
        }
    },
    destroyed() {

        this.routerFlag = true;
        this.unbindHomeMapEvents()
        this.unbindChartResizeHandler()
        if (this.socketMessage) {
            this.socketMessage.close()
            this.socketMessage = null
        }
        this.closeTrackWebsocket()
        this.closeEvtWebsocket()
        this.closeScreenWebsocket()
        if (this.statusChart) {
            this.statusChart.dispose();
            this.statusChart = null;
        }
        if (this.mouseDownHandler) {
            window.removeEventListener('mousedown', this.mouseDownHandler)
            this.mouseDownHandler = null
        }
        this.clearIntervalAll()
        if (this.timeInter) {
            clearInterval(this.timeInter)
            this.timeInter = null;
        }
    },
    watch: {
        index() {
            // this.getCrossGraphInfo()
            var message = JSON.stringify({
                bound: this.getMapBound(),
                isOpen: this.trackPlay ? 1 : 0,
                statDataType: Number(this.index),
                statCrossId: this.crossData ? this.crossData.crossId : ''

            })
            this.sendTrackMessage(message);
        },

        toolActive(val) {

            if (val == 1) {
                this.openSend()
            } else if (val == 2 && this.startTime && this.endTime) {
                this.openSend()
            } else if (val == 2 && this.startTime) {
                // this.startTime = this.mapUtils.getDateYMD('ymdhms', -this.timeGry);
                this.timeChangeStart()

            }


        },
        timeGry() {
            // this.timeChangeStart()
        },

        trackPlay(val) {
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                var message = JSON.stringify({
                    bound: this.getMapBound(),
                    isOpen: this.trackPlay ? 1 : 0,
                    statDataType: Number(this.index),
                    statCrossId: this.crossData ? this.crossData.crossId : ''
                })
                this.sendTrackMessage(message);
            }
        },

        cNav(val) {
            if (this.cEct) {
                var series = this.CongestionAnalysis.echartsVoMap[val].series;
                this.cEct.setOption({
                    series: series
                })
            }
        },

        bNav(val) {
            if (this.bEct) {
                var series = this.BlockAnalysis.echartsVoMap[val].series;
                this.bEct.setOption({
                    series: series
                })
            }

        },
        day() {
            // this.getCongestionAnalysis()
            // this.getDelayAnalysis()
            // this.getTrackAnalysis()
        },
        dateType() {},

        autoRefresh(val) {
            // if (val) {
            //     this.openInterval()
            //     this.eventId = null;
            // } else {
            //     this.clearInterval()
            // }
        },
        person(val) {
            this.tracking.person = val;
            if (val == 2) {
                this.tracking.id = '';

            }

        },
        fullScreen(val) {
            var inter = setInterval(() => {
                this.$refs.playBack.homeMap.resize();
            }, 10)
            var inter1 = setTimeout(() => {
                clearInterval(inter)
                clearInterval(inter1)
            }, 1000)
            if (val) {
                this.bomDown = true;
            } else {
                this.bomDown = false;
            }
        },
        isNetWorkInfo(val) {
            if (!val) {
                this.checktoolActive = this.defaultCheckToolActive
            }
        },
        isRoadEval(val) {
            if (!val) {
                this.checktoolActive = this.defaultCheckToolActive
            }
        },
        isVehicleQuery(val) {
            if (!val) {
                this.checktoolActive = this.defaultCheckToolActive
            }
        },
        isTtafficEvt(val) {
            if (!val) {
                this.checktoolActive = this.defaultCheckToolActive
            }
        },
        isequMaintenance(val) {
            if (!val) {
                this.checktoolActive = this.defaultCheckToolActive
            }
        },
        isvehiclePort(val) {
            console.log(val)
            if (!val) {
                this.checktoolActive = this.defaultCheckToolActive
                console.log(this.checktoolActive)
            }
        }

    },
    methods: {
        closeTrackWebsocket() {
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
                socket.close();
            }
        },
        closeScreenWebsocket() {
            var socket = this.screenWebsocket;
            this.screenWebsocket = null;
            if (!socket) {
                return
            }
            socket.onopen = null;
            socket.onmessage = null;
            socket.onclose = null;
            socket.onerror = null;
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close();
            }
        },
        bindMapEvent(map, eventName, layerId, handlerKey, handlerFactory) {
            if (!map || typeof map.on !== 'function') {
                return
            }
            if (!this[handlerKey]) {
                this[handlerKey] = handlerFactory()
            }
            var handler = this[handlerKey];
            if (typeof map.off === 'function') {
                if (layerId) {
                    map.off(eventName, layerId, handler)
                } else {
                    map.off(eventName, handler)
                }
            }
            if (layerId) {
                map.on(eventName, layerId, handler)
            } else {
                map.on(eventName, handler)
            }
        },
        unbindMapEvent(map, eventName, layerId, handlerKey) {
            var handler = this[handlerKey];
            if (!map || !handler || typeof map.off !== 'function') {
                return
            }
            if (layerId) {
                map.off(eventName, layerId, handler)
            } else {
                map.off(eventName, handler)
            }
        },
        unbindHomeMapEvents() {
            var map = this.$refs.playBack && this.$refs.playBack.homeMap;
            if (!map) {
                return
            }
            this.unbindMapEvent(map, 'moveend', null, 'homeMapMoveEndHandler')
            this.unbindMapEvent(map, 'click', 'cross-point', 'crossPointClickHandler')
            this.unbindMapEvent(map, 'click', 'crossIndex-point', 'crossIndexPointClickHandler')
        },
        bindChartResizeHandler() {
            if (this.chartResizeHandler) {
                return
            }
            this.chartResizeHandler = () => {
                if (this.ect && this.ect.resize) {
                    this.ect.resize()
                }
                if (this.ect1 && this.ect1.resize) {
                    this.ect1.resize()
                }
            }
            window.addEventListener('resize', this.chartResizeHandler)
        },
        unbindChartResizeHandler() {
            if (!this.chartResizeHandler) {
                return
            }
            window.removeEventListener('resize', this.chartResizeHandler)
            this.chartResizeHandler = null
        },
        closeEvtWebsocket() {
            var socket = this.evtWebsocket;
            this.evtWebsocket = null;
            if (!socket) {
                return
            }
            socket.onopen = null;
            socket.onmessage = null;
            socket.onclose = null;
            socket.onerror = null;
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close();
            }
        },
        sendEvtMessage(message) {
            if (this.evtWebsocket && this.evtWebsocket.readyState === WebSocket.OPEN) {
                this.evtWebsocket.send(message);
            }
        },
        getImagePath(stats) {

            try {
                // 尝试获取图片路径
                return require(`../assets/image/bdh/${stats}.png`);
            } catch (e) {
                // 如果图片不存在，返回默认图片路径
                return require('../assets/image/bdh/3.png');
            }
        },
        getMapBound() {
            if (!!this.$refs.playBack) {
                return this.$refs.playBack.homeMap.getBounds()
            } else if (!!this.$refs.cesiumTrack) {
                return this.$refs.cesiumTrack.getViewBounds()
            }
        },
        setTimeOff() {
            var timeOut = timeOut ? timeOut : 1000 * 1800;
            this.timeOff = setTimeout(() => {
                this.request(3)
            }, timeOut);
        },
        clearTimeOff() {
            if (this.timeOff) {
                clearTimeout(this.timeOff)
                this.timeOff = null;
            }
        },
        // 初始化label样式
        setLabel() {
            this.optionData.forEach((item, index) => {
                item.value = Number(item.value)
                item.itemStyle = {
                    color: color[index]
                }
                item.label = {
                    normal: {
                        show: true,
                        color: '#fff',
                        formatter: [
                            '{b|{b}}',
                            '{c|{c}}（个）'
                        ].join('\n'), // 用\n来换行
                        rich: {
                            b: {
                                color: color[index],
                                fontWeight: 400,
                                align: 'left'
                            },
                            c: {
                                fontSize: 20,
                                color: '#fff',
                                fontWeight: 400
                            },
                            d: {
                                color: '#fff',
                                align: 'left'
                            }
                        }
                    }
                }
                item.labelLine = {
                    normal: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(255,255,255,0.7)'
                        }
                    }
                }
            })
        },
        // 图表初始化
        initChart() {
            this.statusChart = echarts.getInstanceByDom(this.$refs.chart) || echarts.init(this.$refs.chart)
            // 传入数据生成 option, 构建3d饼状图, 参数工具文件已经备注的很详细
            this.optionect = getPie3D(this.optionData, 0.8, 200, 20, 20, 0.4)
            this.statusChart.setOption(this.optionect)
            // 是否需要label指引线，如果要就添加一个透明的2d饼状图并调整角度使得labelLine和3d的饼状图对齐，并再次setOption
            this.optionect.series.push({
                name: '', //自己根据场景修改
                backgroundColor: 'transparent',
                type: 'pie',
                label: {
                    show: false,
                    opacity: 1,
                    fontSize: 13,
                    lineHeight: 20
                },
                startAngle: -40, // 起始角度，支持范围[0, 360]。
                clockwise: true, // 饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
                center: ['50%', '60%'],
                data: this.optionData,
                itemStyle: {
                    opacity: 0 //这里必须是0，不然2d的图会覆盖在表面
                }
            })
            this.statusChart.setOption(this.optionect)
            // this.bindListen(this.statusChart)
        },
        // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
        // optionName是防止有多个图表进行定向option传递，单个图表可以不传，默认是opiton
        bindListen(myChart, optionName = 'optionect') {
            let selectedIndex = ''
            let hoveredIndex = ''
            // 监听点击事件，实现选中效果（单选）
            myChart.on('click', (params) => {
                // 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
                const isSelected = !this[optionName].series[params.seriesIndex].pieStatus
                    .selected
                const isHovered =
                    this[optionName].series[params.seriesIndex].pieStatus.hovered
                const k = this[optionName].series[params.seriesIndex].pieStatus.k
                const startRatio =
                    this[optionName].series[params.seriesIndex].pieData.startRatio
                const endRatio =
                    this[optionName].series[params.seriesIndex].pieData.endRatio
                // 如果之前选中过其他扇形，将其取消选中（对 option 更新）
                if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
                    this[optionName].series[
                        selectedIndex
                    ].parametricEquation = getParametricEquation(
                        this[optionName].series[selectedIndex].pieData.startRatio,
                        this[optionName].series[selectedIndex].pieData.endRatio,
                        false,
                        false,
                        k,
                        this[optionName].series[selectedIndex].pieData.value
                    )
                    this[optionName].series[selectedIndex].pieStatus.selected = false
                }
                // 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
                this[optionName].series[
                    params.seriesIndex
                ].parametricEquation = getParametricEquation(
                    startRatio,
                    endRatio,
                    isSelected,
                    isHovered,
                    k,
                    this[optionName].series[params.seriesIndex].pieData.value
                )
                this[optionName].series[params.seriesIndex].pieStatus.selected = isSelected
                // 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
                selectedIndex = isSelected ? params.seriesIndex : null
                // 使用更新后的 option，渲染图表
                myChart.setOption(this[optionName])
            })
            // 监听 mouseover，近似实现高亮（放大）效果
            myChart.on('mouseover', (params) => {

                // 准备重新渲染扇形所需的参数
                let isSelected
                let isHovered
                let startRatio
                let endRatio
                let k
                // 如果触发 mouseover 的扇形当前已高亮，则不做操作
                if (hoveredIndex === params.seriesIndex) {
                    // 否则进行高亮及必要的取消高亮操作
                } else {
                    // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
                    if (hoveredIndex !== '') {
                        // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
                        isSelected = this[optionName].series[hoveredIndex].pieStatus.selected
                        isHovered = false
                        startRatio = this[optionName].series[hoveredIndex].pieData.startRatio
                        endRatio = this[optionName].series[hoveredIndex].pieData.endRatio
                        k = this[optionName].series[hoveredIndex].pieStatus.k
                        // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
                        this[optionName].series[
                            hoveredIndex
                        ].parametricEquation = getParametricEquation(
                            startRatio,
                            endRatio,
                            isSelected,
                            isHovered,
                            k,
                            this[optionName].series[hoveredIndex].pieData.value
                        )
                        this[optionName].series[hoveredIndex].pieStatus.hovered = isHovered
                        // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
                        hoveredIndex = ''
                    }
                    // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
                    if (
                        params.seriesName !== 'mouseoutSeries' &&
                        params.seriesName !== 'pie2d'
                    ) {
                        // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
                        isSelected =
                            this[optionName].series[params.seriesIndex].pieStatus.selected
                        isHovered = true
                        startRatio =
                            this[optionName].series[params.seriesIndex].pieData.startRatio
                        endRatio = this[optionName].series[params.seriesIndex].pieData.endRatio
                        k = this[optionName].series[params.seriesIndex].pieStatus.k
                        // 对当前点击的扇形，执行高亮操作（对 option 更新）
                        this[optionName].series[
                            params.seriesIndex
                        ].parametricEquation = getParametricEquation(
                            startRatio,
                            endRatio,
                            isSelected,
                            isHovered,
                            k,
                            this[optionName].series[params.seriesIndex].pieData.value + 60
                        )
                        this[optionName].series[
                            params.seriesIndex
                        ].pieStatus.hovered = isHovered
                        // 记录上次高亮的扇形对应的系列号 seriesIndex
                        hoveredIndex = params.seriesIndex
                    }
                    // 使用更新后的 option，渲染图表
                    myChart.setOption(this[optionName])
                }
            })
            // 修正取消高亮失败的 bug
            myChart.on('globalout', () => {
                // 准备重新渲染扇形所需的参数
                let isSelected
                let isHovered
                let startRatio
                let endRatio
                let k
                if (hoveredIndex !== '') {
                    // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
                    isSelected = this[optionName].series[hoveredIndex].pieStatus.selected
                    isHovered = false
                    k = this[optionName].series[hoveredIndex].pieStatus.k
                    startRatio = this[optionName].series[hoveredIndex].pieData.startRatio
                    endRatio = this[optionName].series[hoveredIndex].pieData.endRatio
                    // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
                    this[optionName].series[
                        hoveredIndex
                    ].parametricEquation = getParametricEquation(
                        startRatio,
                        endRatio,
                        isSelected,
                        isHovered,
                        k,
                        this[optionName].series[hoveredIndex].pieData.value
                    )
                    this[optionName].series[hoveredIndex].pieStatus.hovered = isHovered
                    // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
                    hoveredIndex = ''
                }
                // 使用更新后的 option，渲染图表
                myChart.setOption(this[optionName])
            })
        },
        // 自适应宽高
        changeSize() {
            this.statusChart.resize()
        },

        getRealDirList() {

            this.address = []
            const _this = this;
            if (!this.videoCrossData && !this.videoRoadData) {
                return
            }

            var param = {
                crossId: this.videoCrossData.crossId
            }
            if (this.webType !== 'cross' && !!this.videoRoadData) {
                param.crossId = this.videoRoadData.roadId
            }

            this.axios.get(SERVICE_URL + 'cameraVideo/getRealDirList?', { params: param }).then((data) => {

                this.dirList = data.data.data;
                this.dirList.forEach(item => {
                    item.children.forEach(c => {
                        c.value = item.rid + ',' + c.id
                    })
                })
                if (this.dirList.length > 0) {
                    this.address = [undefined, this.dirList[0].rid + ',' + this.dirList[0].children[0].id]
                }
                this.cascaderChange()

            })
        },
        cascaderChange() {
            if (this.address.length > 0) {
                this.crossVideo(0);
            }
        },
        crossVideo(operation) {
            this.$refs.flvPlayer && this.$refs.flvPlayer.destroy();
            const _this = this;

            var param = {
                rid: operation === 0 ? this.address[1].split(',')[0] : this.videoRid,
                id: operation === 0 ? this.address[1].split(',')[1] : this.videoId,
                operation: operation
            }

            if (typeof PlayVideoDemo !== 'undefined' && !!PlayVideoDemo) {
                param.demo = 1;
                if (typeof PlayVideoDemoUrl !== 'undefined' && !!PlayVideoDemoUrl) {
                    this.crossVideoUrl = PlayVideoDemoUrl;
                    this.$refs.flvPlayer.play(PlayVideoDemoUrl);
                    return
                }
            } else {
                param.demo = 0;
            }

            console.log('cross video play ' + operation + " " + param)

            this.axios.get(SERVICE_URL + 'VCN/playVideo?', { params: param }).then((data) => {

                if (this.address.length > 0) {
                    this.videoRid = this.address[1].split(',')[0];
                    this.videoId = this.address[1].split(',')[1];
                }

                if (operation === 0) {
                    if (data.data.code === -1) {
                        this.$message({
                            showClose: true,
                            message: data.data.msg,
                            type: 'error',
                            offset: 80
                        });
                    } else {
                        this.crossVideoUrl = data.data.resultObject;
                        this.$refs.flvPlayer.play(data.data.resultObject);
                    }
                } else {
                    this.videoRid = ''
                    this.videoId = ''
                }
            })
        },
        handleSeletEqu(data) {
            if (!!data && !!data.metaData && !!data.metaData.view)
                this.$refs.cesiumTrack.flyToData(data.metaData.view)
        },
        //
        getgltfData() {
            var _this = this;
            var param = {

            }
            this.axios.get('/bdhgltf/bzg.json', { params: param }).then((data) => {
                this.gltfData = data.data.RECORDS;

            })
        },
        initgltf() {
            var map = this.$refs.playBack.homeMap;
            var _this = this;
            map.addLayer({
                id: 'custom_layer',
                type: 'custom',
                onAdd: function(map, mbxContext) {
                    var mesh;
                    const loader = new THREE.GLTFLoader();
                    _this.gltfData.forEach((item, index) => {
                        loader.load(`/bdhgltf/gltf/` + item.type + `.gltf`, (gltf) => {
                            mesh = tb.Object3D({ obj: gltf.scene, units: 'meters' }).setCoords([item.x, item.y].map(Number));
                            mesh.scale.set(0.1, 0.1, 0.1);
                            mesh.position.z = 0;
                            mesh.setRotation({ x: 90, y: 360 - item.angle, z: 0 });
                            mesh.visible = false;
                            tb.add(mesh);
                            meshArr.push(mesh)
                        });

                    });
                },

                render: function(gl, matrix) {
                    tb.update();

                }
            })
        },
        // 添加路况
        addTrafficLayer() {
            var map = this.$refs.playBack.homeMap;
            var options = {
                minzoom: 1, //路况显示的最小级别(1-24)
                maxzoom: 24, //路况显示的最大级别(1-24)
                type: 'vector', //路况图层类型:vector(矢量),raster(栅格)
                refresh: TRAFFIC_REFRESH_TIME, //路况图层刷新时间，毫秒
                source: { tiles: [TRAFFIC_URL + "t={z}-{x}-{y}"], type: "vector" },
                before: 'croad_z9_z23_dferry_symbol_text'
            };
            map.trafficLayer(true, options);
        },
        // 移除路况
        removeTrafficLayer() {
            var map = this.$refs.playBack.homeMap;
            map.trafficLayer(false);
        },
        // 大屏数据
        connectScreenWebsocket() {
            // var url = SERVICE_URL_screen;
            var url = SERVICE_URL_screen.indexOf('https') !== -1 ? SERVICE_URL_screen.replace(/https/, 'wss') : SERVICE_URL_screen.replace(/http/, 'ws');
            this.screenWebsocket = new WebSocket(url + sessionStorage.getItem('userid'));
        },
        reconnectScreenWebsocket() {
            var _this = this;
            setTimeout(() => {
                _this.getscreenwebsocketData()
            }, 5000)
        },
        getscreenwebsocketData() {

            var _this = this;

            if ('WebSocket' in window) {
                _this.connectScreenWebsocket();
            } else {
                alert('不支持 websocket')
            }

            this.screenWebsocket.onopen = function(event) {
                var token = sessionStorage.getItem('token')
                this.send(token);

            }
            this.screenWebsocket.onmessage = function(event) {

                // console.log(JSON.parse(event.data))
                var data = JSON.parse(event.data)

                if (data.time) {
                    _this.realTime = data.time;
                } else {
                    const dateCN = new Date();
                    const formatterCN = new Intl.DateTimeFormat("zh-CN", {
                        timeZone: "Asia/Shanghai",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    });
                    const day = dateCN.getDay() === 0 ? 7 : dateCN.getDay(); // 将周日转换为 7
                    _this.realTime = {
                        time: formatterCN.format(dateCN),
                        week: _this.mapUtils.getDateYMD('week'),
                    }
                }

                this.weatherScene = 'none'
                if (data.weather) {
                    _this.weather = data.weather;
                    if (data.weather.real_weather_img !== 'undefined') {
                      _this.weather_img = require('../assets/image/bdh/weather/w' + data.weather.real_weather_img + '.png')
                    } else {
                      _this.weather_img = require('../assets/image/bdh/weather/w0.png')
                    }
                } else {
                    _this.weather = {
                        real_temp: 12,
                        today_aqi: 50,
                    }
                    _this.weather_img = require('../assets/image/bdh/weather/w0.png')
                }

                if (data.real1) {
                    _this.real1 = data.real1
                    _this.real2 = data.real2
                    if (LargeScreenDemo !== undefined && LargeScreenDemo === 1) {
                      _this.real1 = [
                        {
                          "unit": "公里",
                          "icon": "zlc",
                          "name": "总里程",
                          "value": 1.8
                        },
                        {
                          "unit": "辆",
                          "icon": "zlc",
                          "name": "小时流量",
                          "value": 195
                        }
                      ]
                      _this.real2 = [
                        {"name":"小型客车","value":155},
                        {"name":"中型客车","value":3},
                        {"name":"大型客车","value":0},
                        {"name":"小型货车","value":19},
                        {"name":"中型货车","value":7},
                        {"name":"大型货车","value":11},
                        {"name":"专项作业车","value":0},
                        {"name":"新能源车","value":24}
                      ]
                    }
                }
                if (data.area2) {
                    _this.area2 = data.area2;
                    _this.area2Chart()

                }
                if (data.road1) {
                    _this.road1 = data.road1;

                }
                if (data.road2) {
                    _this.road2 = data.road2;

                }
                if (data.congest1) {
                    _this.congest1 = data.congest1
                    _this.congest1Chart()
                }
                if (data.congest2) {
                    _this.congest2 = data.congest2
                    _this.congest2Chart()
                }
                if (data.congest3) {
                    _this.congest3 = data.congest3
                }
                if (data.congest4) {
                    _this.congest4 = data.congest4
                }
                if (data.event1) {
                    _this.event1 = data.event1;
                    if (LargeScreenDemo !== undefined && LargeScreenDemo === 1) {
                      _this.event1 = [
                        {
                          "unit": "个",
                          "name": "交通违法类事件",
                          "value": 15
                        },
                        {
                          "unit": "个",
                          "name": "交通安全类事件",
                          "value": 0
                        }
                      ]
                    }
                }
                // if (data.event1 && data.event1.length > 0) {
                //     _this.optionData = data.event1;
                //     // _this.setLabel()
                //     // _this.initChart()
                // }
                if (data.event3) {
                    _this.event3 = data.event3;
                    if (LargeScreenDemo !== undefined && LargeScreenDemo === 1) {
                      _this.event3 =
                      [
                        {
                          "stats": 0,
                          "updateTime": "2024-12-31 17:28:47",
                          "time": "2024-12-31 17:28:37",
                          "id": "13EUF0ALN60-547-5-1735637317612",
                          "desc": "小车超高速: 发现车辆 苏CH39U0, 车道公路, 下行, 来向, 车速126km/h"
                        },
                        {
                          "stats": 0,
                          "updateTime": "2024-12-31 17:27:46",
                          "time": "2024-12-31 17:27:36",
                          "id": "13EUF0ALN60-496-5-1735637256960",
                          "desc": "小车超高速: 发现车辆 鲁KR2W62, 车道公路, 下行, 来向, 车速130km/h"
                        },
                        {
                          "stats": 0,
                          "updateTime": "2024-12-31 17:27:16",
                          "time": "2024-12-31 17:27:06",
                          "id": "13EUF0ALN60-472-5-1735637226810",
                          "desc": "小车超高速: 发现车辆 鲁R7566V, 车道公路, 下行, 来向, 车速121km/h"
                        }
                      ]
                    }
                }
                if (data.event4) {
                    _this.event4 = data.event4;
                }
                if (data.event5) {
                    _this.event5 = data.event5
                }
                if (data.event6) {
                    _this.event6 = data.event6
                    _this.event6Chart()
                }
                if (data.event7) {
                    _this.event7 = data.event7
                }

            }

            this.screenWebsocket.onclose = function(err) {
                console.log('screenWebsocket 已关闭, 尝试重连', err)
                _this.reconnectScreenWebsocket()
            }
            this.screenWebsocket.onerror = function(err) {
                console.log('screenWebsocket error, 尝试重连', err)
                _this.reconnectScreenWebsocket()
            }
        },


        // 在途车辆分时段统计
        area2Chart() {
            var _this = this;
            const res = this.area2;
            const lData = []
            const colors = ['#0084FB', '#00E3FF', '#DE7141', '#DE7141'];
            res.series.forEach((item, index) => {
                lData.push(item.name)

                item.smooth = true;
                item.symbol = 'none';
                item.sampling = 'average';
                if (item.name.indexOf('预测') > -1) {
                    item.lineStyle = {
                        type: 'dashed'
                    }
                }
            })

            var options = {
                dom: 'line1',
                color: '#688BAD',
                colors: colors,
                legendData: {
                    itemHeight: 3,
                    itemWidth: 7,
                    icon: 'rect',
                    data: lData,
                    textStyle: {
                        color: '#fff'
                    },
                    right: 10
                },
                xAxisData: res.times,
                gridLeft: 10,
                gridBom: 10,
                gridTop: 30,
                gridRight: 15,
                yaxisTick: false,
                yaxisLine: false,
                ysplitLine: false,
                series: res.series
            }



            this.$nextTick(function() {

                this.ect = this.EchartsLarge.lineChart2(options)
            })

        },

        // 重点道路实时路况
        road() {
            var _this = this;
            var param = {

            }

            this.axios.get(SERVICE_URL_screen + 'road?', { params: param }).then((data) => {
                this.road1 = data.data;

            })
        },
        // 拥堵指数变化趋势
        congest1Chart() {
            var _this = this;
            const res = this.congest1;
            const lData = []
            const colors = ['#FF444F', '#A9686C', '#DE7141', '#DE7141'];
            res.series.forEach((item, index) => {
                lData.push(item.name)

                item.smooth = true;
                item.symbol = 'none';
                item.sampling = 'average';
                if (item.name.indexOf('昨天') > -1) {
                    item.lineStyle = {
                        type: 'dashed'
                    }
                }
                if (item.name.indexOf('今天') > -1) {
                    item.areaStyle = {
                        // 阴影渐变
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(255, 68, 79, 0.2)' },
                            { offset: 1, color: 'rgba(255, 68, 79, 0)' }
                        ])
                    }
                }
            })

            var options = {
                dom: 'line2',
                color: '#688BAD',
                colors: colors,
                legendData: {
                    itemHeight: 3,
                    itemWidth: 7,
                    icon: 'rect',
                    data: lData,
                    textStyle: {
                        color: '#fff'
                    },
                    right: 10
                },
                xAxisData: res.times,
                gridLeft: 10,
                gridBom: 10,
                gridTop: 30,
                gridRight: 15,
                yaxisTick: false,
                yaxisLine: false,
                ysplitLine: false,
                series: res.series
            }



            this.$nextTick(function() {

                this.ect = this.EchartsLarge.lineChart2(options)
            })

        },

        // 拥堵里程占比变化趋势
        congest2Chart() {
            var _this = this;
            const res = this.congest2;
            const lData = []
            const colors = ['#0084FB', '#FFD200', '#DE7141', '#DE7141'];
            res.series.forEach((item, index) => {
                lData.push(item.name)

                item.smooth = true;
                item.symbol = 'none';
                item.sampling = 'average';
                if (item.name.indexOf('预测') > -1) {
                    item.lineStyle = {
                        type: 'dashed'
                    }
                }
            })

            var options = {
                dom: 'line3',
                color: '#688BAD',
                colors: colors,
                legendData: {
                    itemHeight: 3,
                    itemWidth: 7,
                    icon: 'rect',
                    data: lData,
                    textStyle: {
                        color: '#fff'
                    },
                    right: 10,
                    top: 0
                },
                xAxisData: res.times,
                gridLeft: 10,
                gridBom: 10,
                gridTop: 30,
                gridRight: 15,
                yaxisTick: false,
                yaxisLine: false,
                ysplitLine: false,
                series: res.series
            }



            this.$nextTick(function() {

                this.ect = this.EchartsLarge.lineChart2(options)
            })

        },


        event6Chart() {
            var _this = this;
            var param = {

            }

            const res = this.event6;
            const lData = []
            const colors = ['#0084FB', '#00E3FF', '#DE7141', '#DE7141'];
            res.series.forEach((item, index) => {
                lData.push(item.name)

                item.smooth = true;
                item.symbol = 'none';
                item.sampling = 'average';
                if (item.name.indexOf('预测') > -1) {
                    item.lineStyle = {
                        type: 'dashed'
                    }
                }
            })

            var options = {
                dom: 'line4',
                color: '#688BAD',
                colors: colors,
                legendData: {
                    itemHeight: 3,
                    itemWidth: 7,
                    icon: 'rect',
                    data: lData,
                    textStyle: {
                        color: '#fff'
                    },
                    right: 10
                },
                xAxisData: res.times,
                gridLeft: 10,
                gridBom: 10,
                gridTop: 30,
                gridRight: 15,
                yaxisTick: false,
                yaxisLine: false,
                ysplitLine: false,
                series: res.series
            }



            this.$nextTick(function() {

                this.ect = this.EchartsLarge.lineChart2(options)
            })

        },

        changeWeather() {
            this.$refs.cesiumTrack.setWeather(this.weatherScene, MAP_CENTER[0], MAP_CENTER[1])
        },

        changeDemoEvent() {
            this.$refs.cesiumTrack.setDemoEvent(this.demoEventScene)
        },

        closeGcPop() {
            this.isShowGc = false;
        },
        openInterval() {
            this.inter = setInterval(() => {
                this.getEventList();
            }, 1000 * 60 * 10);
        },
        clearInterval() {
            if (this.inter) {
                clearInterval(this.inter)
                this.inter = null;
            }
        },
        openIntervalAll() {
            this.inter1 = setInterval(() => {
                this.getRoadNetworkOverview();
                this.getRealRoadCondition()
                this.getDelayAnalysis()
            }, 1000 * 120);
            this.inter2 = setInterval(() => {
                this.getStatsList()
            }, 1000 * 2)
        },
        clearIntervalAll() {
            if (this.inter) {
                clearInterval(this.inter)
                this.inter = null;
            }

            if (this.inter1) {
                clearInterval(this.inter1)
                this.inter1 = null;
            }
            if (this.inter2) {
                clearInterval(this.inter2)
                this.inter2 = null;
            }
        },
        goLogin() {
            var whetherToExit = this.$t("home.whetherToExit")
            this.$confirm(whetherToExit, {
                confirmButtonText: this.$t("home.determine"),
                cancelButtonText: this.$t("home.cancel"),
                type: 'warning'
            }).then(() => {
                this.$store.commit('del_token');
                this.$router.push('/login');
                sessionStorage.clear();
                // this.axios.delete(LOGO_SERVICE + 'mapabc-admin-system/api/v1/exit?', {
                // }).then(res => {
                //     this.$store.commit('del_token')
                //     this.$router.push('/login')
                //     sessionStorage.clear();
                // }).catch(() => {
                //     this.$message({
                //         type: 'info',
                //         message: '登出失败。'
                //     });
                // });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t("home.cancelled"),
                    offset: 80
                });
            });

        },

        crossIdChange() {

            var item = this.crossListObj[this.crossId[1]]
            this.crossData = item;

            this.crossData.type = this.crossId[0]
            this.lookAt.lng = item.centerX;
            this.lookAt.lat = item.centerY;
            sessionStorage.setItem('crossData', JSON.stringify(item))
            this.$refs.playBack.homeMap.flyTo({ center: [item.centerX, item.centerY], zoom: 18 })
            this.getCrossGraphInfo()
            this.getRoadNetworkOverview()
            this.getCongestionAnalysis()
            this.getDelayAnalysis()
            this.getTrackAnalysis()
        },
        clearcrossId() {
            sessionStorage.setItem('crossData', JSON.stringify({ crossId: '' }))
            this.crossId = [];
        },
        crossClick(item) {

            !!this.$refs.playBack && this.$refs.playBack.homeMap.flyTo({ center: [item.centerX, item.centerY], zoom: 18 })
            this.lookAt.lng = item.centerX;
            this.lookAt.lat = item.centerY;
            this.crossData = item;
            this.crossData.type = 'cross'
            this.crossId = ['cross', item.crossId];
            sessionStorage.setItem('crossData', JSON.stringify(item))
            this.getCrossGraphInfo()
            this.getRoadNetworkOverview()
        },
        roadClick(item) {
            !!this.$refs.playBack && this.$refs.playBack.homeMap.flyTo({ center: [item.centerX, item.centerY], zoom: 18 })
            this.lookAt.lng = item.centerX;
            this.lookAt.lat = item.centerY;
            this.crossId = ['road', item.roadId];
            this.crossData = item;
            this.crossData.type = 'road'
            this.crossData.crossId = item.roadId
            sessionStorage.setItem('crossData', JSON.stringify(item))

            this.getCrossGraphInfo()
        },
        showEventInfo(item) {
            this.eventInfoReturnHome = true;
            var param = {
              id: item.id
            }
            this.axios.get(SERVICE_URL + 'handle/getEventInfoById?', { params: param }).then((data) => {
              var res = data.data.data;
              if (!res.centerX) {
                res.centerX = MAP_CENTER[0]
              }
              if (!res.centerY) {
                res.centerY = MAP_CENTER[1]
              }
              //this.$refs.playBack.homeMap.flyTo({ center: [res.centerX, res.centerY], zoom: 18 })

              this.eventData = data.data.data;
              // this.video.pause()

              // this.toolActive = 2;
              // !!this.$refs.playBack && this.$refs.playBack.homeMap.flyTo({ center: [item.centerX, item.centerY], zoom: 18 })
              //
              this.lookAt.lng = res.centerX;
              this.lookAt.lat = res.centerY;

              if (this.webType === 'cross') {

              } else {

              }

            })
        },
        //三色事件详细数据
        getEventInfoById(item) {
            var _this = this;
            var param = {
                id: item.id
            };

            this.axios.get(SERVICE_URL_v2 + '/getEventInfoById?', { params: param }).then((data) => {
                var res = data.data.data;
                !!this.$refs.playBack && this.$refs.playBack.homeMap.flyTo({ center: [res.centerX, res.centerY], zoom: 18 })

                this.lookAt.lng = res.centerX;
                this.lookAt.lat = res.centerY;
            })
        },
        removeFire() {
            this.$refs.cross3d.removeFire();

        },
        onClick(e) {
            if (!e.properties.name) {

                this.trackID = e.properties.id;
                this.tracking.person = 3;
                this.person = 3;
                this.tracking.id = this.trackID;

            }

        },
        timeChangeStart() {
            var date = new Date(this.startTime)

            date.setMinutes(date.getMinutes() + this.timeGry);
            var m = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
            var d = date.getDate() <= 9 ? '0' + (date.getDate()) : date.getDate();

            var hour = date.getHours();
            var min = date.getMinutes();
            var s = date.getSeconds();
            this.endTime = date.getFullYear() + '-' + m + '-' + d + ' ' + (hour < 10 ? "0" + hour : hour) + ':' + (min < 10 ? "0" + min : min) + ':' + (s < 10 ? "0" + s : s);

            this.openSend()
        },
        traplayClick() {
            this.trackPlay = !this.trackPlay;

        },
        toolClick(item) {
            if (item.value === 1) {
                this.isRoadEval = true;
            };

            if (item.value === 2) {
                this.isvehiclePort = true;
            };
            if (item.value === 3) {
                this.isVehicleQuery = true;
            }

            if (item.value === 4) {
                this.eventClickTime.push(this.mapUtils.getDateYMD('ymdhms'));
                if (this.eventClickTime.length > 2) {
                    this.eventClickTime.shift();
                }


                this.trackPlay = false;
                this.autoPolling = false;
                !!this.$refs.playBack && this.$refs.playBack.homeMap.removeLayer('crossing')
                !!this.$refs.playBack && this.$refs.playBack.crossing.clear()
                this.eventInfoReturnHome = false
                this.isTtafficEvt = true;
            }
            if (item.value === 5) {
                this.isequMaintenance = true;
            }
            if (item.value === 6) {
                if (this.checktoolActive.indexOf(6) > -1) {
                    this.options.play = false;
                    this.pause = false;
                    // meshArr.forEach(item => {
                    //     item.visible = true
                    // })

                    // buildingIds.forEach(item => {
                    //     map.setLayoutProperty(item, 'visibility', 'visible');
                    // })
                    this.defaultCheckToolActive = []
                    this.checktoolActive = this.defaultCheckToolActive
                } else {
                    this.options.play = true;
                    this.pause = true;

                    // meshArr.forEach(item => {
                    //     item.visible = false
                    // })

                    // buildingIds.forEach(item => {
                    //     map.setLayoutProperty(item, 'visibility', 'none');
                    // })
                    this.defaultCheckToolActive = [6]
                    this.checktoolActive = this.defaultCheckToolActive
                }
            }
        },
        // 菜单
        getmodule() {

            var _this = this;
            var param = {

            };

            this.axios.get(LOGO_SERVICE + 'mapabc-admin-system/api/v1/menus/build/module?moduleName=' + moduleName, { params: param }).then((data) => {
                var res = this.crossInfoNavMenu = data.data[0].children;
                var re = /.*[\u4e00-\u9fa5]+.*$/;
                var language = navigator.language; //获取浏览器语言
                var lang = language.indexOf('zh') > -1 ? 'zh' : 'en';
                if (lang === 'zh') {
                    var arr = res.filter(item => re.test(item.name));

                } else {
                    var arr = res.filter(item => !re.test(item.name));
                }
                nextRoute = ['home', 'homeScreen']
                arr.forEach(item => {
                    var param = item.params ? item.params : ''
                    nextRoute.push(item.component)
                })

            })
        },
        request(state) {
            var _this = this;
            this.websocketState = 1;
            var param = {
                bound: this.getMapBound(),
            };
            this.axios.post(WEBSOCKET_URL + 'consul/api/request?', param).then((data) => {
                if (data.data.statusCode === 200) {
                    this.URL = data.data.path ? WEBSOCKET_URL + data.data.path : data.data.url;
                    this.getwebsocketData()
                    this.getStopline(state)

                } else {
                    this.modal = true;
                }

            })
        },
        getStopline(state) {
            if (!this.$refs.playBack) {
                return
            }
            var map = this.$refs.playBack.homeMap
            // if (map.getSource('stopLine')) {
            //     map.removeLayerAndSource('stopLine')
            // };
            // if (map.getSource('textPoint')) {
            //     map.removeLayerAndSource('textPoint')
            // };
            // if (map.getSource('dataArea')) {
            //     map.removeLayerAndSource('dataArea')
            // };
            this.bounds = map.getBounds();
            var _this = this;
            var bounds = this.getMapBound()
            var param = {
                bound: bounds._sw.lng + ',' + bounds._sw.lat + ';' + bounds._ne.lng + ',' + bounds._ne.lat
            };
            this.axios.get(this.URL + 'region/api/getStopline?', {
                params: param
            }).then((data) => {
                this.options.geojson = data.data;
                if (state === 1) {
                    this.$refs.playBack.addLayer();
                }


            })
        },
        getCrossGraphInfo() {
            if (!this.URL) {
                return
            }
            var _this = this;
            var param = {
                crossId: this.crossData.crossId,
                type: this.timeType,
                name: this.index,
                t: new Date().getTime(),
                dir: 8
            };

            this.axios.get(this.URL + 'cross/api/getCrossGraphInfo?', { params: param }).then((data) => {

                const res = data.data;
                this.dirs = res.total;
                // if (res.length > 0) {
                this.dir = res.total[0].name;
                // }
                const lData = [];
                const colors = ['#dcdfe2', '#37EDF6', '#19BCF1', '#f39800'];
                res.total.forEach((item, index) => {
                    lData.push(item.name)
                    if (this.index === '1') {
                        item.stack = '流量';
                        item.areaStyle = {}
                    }
                    item.smooth = true;
                    item.symbol = 'none';
                    item.sampling = 'average';
                })

                var options = {
                    dom: 'home-lineEct',
                    color: 'rgba(255,255,255,0.75)',
                    colors: colors,
                    legendData: {
                        itemHeight: this.width > 3800 ? 14 : 7,
                        itemWidth: this.width > 3800 ? 14 : 7,
                        icon: 'circle',
                        data: lData,
                        textStyle: {
                            color: 'rgba(255,255,255,0.75)',
                            fontSize: this.width > 3800 ? 24 : 12
                        },
                        // right: 10
                    },
                    xAxisData: res.times,
                    yAxisName: '',
                    gridLeft: 10,
                    gridBom: 10,
                    gridTop: this.width > 3800 ? 60 : 30,
                    gridRight: 35,
                    legendRight: 25,
                    yaxisTick: false,
                    yaxisLine: false,

                    axisLabelFontSize: this.width > 3800 ? 24 : 12,
                    ysplitLine: true,
                    series: res.total,
                    boundaryGap: true,
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 16
                    },
                    nameGap: 25,

                }

                this.dirDatas = {};
                res.detail.forEach(item => {

                    this.dirDatas[item.name] = item;
                })
                var lData1 = []
                this.dirDatas[this.dir].list.forEach(item => {
                    lData1.push(item.name)
                    item.smooth = true;
                    item.symbol = 'none';
                    item.sampling = 'average';
                })

                var options1 = {
                    dom: 'home-lineEct1',
                    color: 'rgba(255,255,255,0.75)',
                    colors: colors,
                    legendData: {
                        itemHeight: this.width > 3800 ? 14 : 7,
                        itemWidth: this.width > 3800 ? 14 : 7,
                        icon: 'circle',
                        data: lData1,
                        textStyle: {
                            color: 'rgba(255,255,255,0.75)',
                            fontSize: this.width > 3800 ? 24 : 12
                        },
                        // right: 10
                    },
                    xAxisData: res.times,
                    yAxisName: '',
                    gridLeft: 10,
                    gridBom: 10,
                    gridTop: this.width > 3800 ? 60 : 30,
                    gridRight: 25,
                    legendRight: 25,
                    yaxisTick: false,
                    yaxisLine: false,

                    axisLabelFontSize: this.width > 3800 ? 24 : 12,
                    ysplitLine: true,
                    series: this.dirDatas[this.dir].list,
                    boundaryGap: true,
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 16
                    },
                    nameGap: 25,

                }
                this.$nextTick(function() {

                    this.ect = this.EchartsLarge.lineChart2(options)

                    if (this.webType === 'cross') {
                        this.ect1 = this.EchartsLarge.lineChart2(options1)
                    }
                    this.bindChartResizeHandler()
                })
            })
        },
        getCrossGraphInfo1(ectData) {

            if (this.ect) {


                this.ect.setOption({
                    xAxis: [{
                        data: ectData.times
                    }],
                    series: ectData.total
                })

                this.dirDatas = {};
                ectData.detail.forEach(item => {

                    this.dirDatas[item.name] = item;
                })
                if (this.ect1) {
                    this.ect1.setOption({
                        xAxis: [{
                            data: ectData.times
                        }],
                        series: this.dirDatas[this.dir].list
                    })
                }


            }

        },
        getRealtrack() {
            // this.openFullScreen()
            this.openSend()
            if (!this.$refs.playBack) {
                return;
            }
            var map = this.$refs.playBack.homeMap;
            // map.on('zoomend', function(e) {
            //     _this.openSend()

            // })
            this.bindMapEvent(map, 'moveend', null, 'homeMapMoveEndHandler', () => {
                return () => {
                    if (this.websocketState === 3) {
                        this.request(3)
                        return
                    }
                    this.openSend()
                    this.getStopline(3)
                }
            })


        },

        openSend() {

            if (this.websocketState === 3) {
                return
            }
            var message = JSON.stringify({
                bound: this.getMapBound(),
                isOpen: this.trackPlay ? 1 : 0,
                isTrackPath: this.trackPath ? 1 : 0,
                speed: 1,
                trackType: this.toolActive,
                startTime: this.startTime,
                endTime: this.endTime,
                isProtobuf: isProtobuf,
                language: this.$i18n.locale === 'en' ? 'en-US' : 'zh-CN',
                // zoom: this.$refs.playBack.homeMap.getZoom(),
                // pitch: this.$refs.playBack.homeMap.getPitch(),
                // center: this.$refs.playBack.homeMap.getCenter(),
                statDataType: Number(this.index),
                statCrossId: this.crossData ? this.crossData.crossId : '',
                trackId: this.eventData && this.eventData.trackId,
                plateNumber: this.eventData && this.eventData.plateNumber
            })

            this.sendTrackMessage(message);
        },
        sendTrackMessage(message) {
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.send(message);
            }
        },
        applyTrackSocketData(res) {
            if (res.crossGraph && this.crossData) {
                this.getCrossGraphInfo1(res.crossGraph)
            }
            this.options.tracks = res;
            this.tracksTime = res.time;
            if (res.status === 'begin' || res.status === 'timeout') {
                if (this.loading) {
                    this.loading.close();
                }
            }
            if (res.status === 'tracknotify') {
                this.openAlarmSound('/video/in.mp3')
                this.openNotify(res)
            }
        },
        parseTrackSocketMessage(rawData) {
            if (isProtobuf === 1) {
                if (!AwesomeMessage) {
                    return Promise.resolve()
                }
                var arrayBufferPromise = null;
                if (rawData instanceof ArrayBuffer) {
                    arrayBufferPromise = Promise.resolve(rawData);
                } else if (rawData && rawData.arrayBuffer) {
                    arrayBufferPromise = rawData.arrayBuffer();
                }
                if (!arrayBufferPromise) {
                    return Promise.resolve()
                }
                return arrayBufferPromise.then((arrayBuffer) => {
                    var message = AwesomeMessage.decode(new Uint8Array(arrayBuffer));
                    var res = AwesomeMessage.toObject(message, {
                        enums: String,
                        longs: String,
                        bytes: String,
                        defaults: true,
                        arrays: true,
                        objects: true,
                        oneofs: true
                    });
                    this.applyTrackSocketData(res);
                }).catch(() => {})
            }
            if (typeof rawData === 'string') {
                this.applyTrackSocketData(JSON.parse(rawData));
                return Promise.resolve()
            }
            if (rawData && rawData.text) {
                return rawData.text().then((text) => {
                    this.applyTrackSocketData(JSON.parse(text));
                }).catch(() => {})
            }
            return Promise.resolve()
        },
        openNotify(item) {

            this.$notify({
                title: item.time,
                dangerouslyUseHTMLString: true,
                message: '<li>' + '时间：' + item.data.time + '</li>' + '<li>' + '车牌：' + item.track[0].plateNumber + '</li>',
                duration: 2000,
                customClass: this.checktoolActive.indexOf(7) > -1 ? 'right1' : '',
                offset: 130
            });
        },
        getwebsocketData() {
            var _this = this;
            if (this.socketMessage) {
                this.socketMessage.close()
                this.socketMessage = null
            }
            // if (this.websocket) {
            //     this.websocket.close();
            // }
            if ('WebSocket' in window) {
                var url = this.URL.indexOf('https') !== -1 ? this.URL.replace(/https/, 'wss') : this.URL.replace(/http/, 'ws');

                this.websocket = new WebSocket(url + "websocket/manager");
            } else {
                alert('不支持 websocket')
            }

            this.websocket.onopen = function(event) {

                if (_this.trackPlay) {
                    _this.getRealtrack();
                }


            }
            this.websocket.onmessage = (event) => {
                this.parseTrackSocketMessage(event.data);
            }

            this.websocket.onclose = function(event) {
                console.log('断开了')
                if (!_this.routerFlag) {
                    _this.socketMessage = _this.$message({
                        showClose: true,
                        message: 'websocket已断开，请拖动地图重新连接。',
                        type: 'error',
                        offset: 80,
                        duration: 0
                    });
                    _this.websocketState = 3;

                    // _this.request(3)

                }
            }
            this.websocket.onerror = function(event) {
                console.log('error')


            }
        },
        openEvtSend() {
            var message = JSON.stringify({
                type: "connect",
                data: {
                    open: this.checktoolActive.indexOf(8) > -1 ? true : false
                }

            })
            this.sendEvtMessage(message);
        },
        getEvtwebsocketData() {

            var _this = this;

            this.closeEvtWebsocket()
            if ('WebSocket' in window) {
                var url = SERVICE_URL.indexOf('https') != -1 ? SERVICE_URL.replace(/https/, 'wss') : SERVICE_URL.replace(/http/, 'ws');

                this.evtWebsocket = new WebSocket(url + "websocket/event/" + sessionStorage.getItem('userid'));
            } else {
                alert('不支持 websocket')
            }

            this.evtWebsocket.onopen = function(event) {
                _this.openEvtSend()

            }
            this.evtWebsocket.onmessage = function(event) {

                _this.facilityList = JSON.parse(event.data).facilityList
                _this.fireEventList = JSON.parse(event.data).fireEventList
                var item = JSON.parse(event.data).fireEvent.data;

                if (item.centerX) {
                    _this.openAlarmSound('/video/' + item.typeCode + '.mp3')
                    if (_this.checktoolActive.indexOf(6) > -1) {
                        _this.removeFire()
                        _this.$refs.cross3d.addFire(item, require('../assets/image/fire.png'));


                    } else {
                        _this.addfirePoint(item);
                    }
                }




            }

            this.evtWebsocket.onclose = function(event) {

            }
            this.evtWebsocket.onerror = function(event) {
                console.log('error')
            }
        },
        // 返回火灾信息
        getFireInfoById(id) {

            var _this = this;
            var param = {
                id: id
            };

            this.axios.get(SERVICE_URL_v2 + '/alarm/getFireInfoById?', { params: param }).then((data) => {
                var item = data.data.data;
                item.thermalCamera = false;
                if (_this.checktoolActive.indexOf(6) > -1) {
                    _this.removeFire()
                    _this.$refs.cross3d.addFire(item, require('../assets/image/fire.png'));
                } else {
                    _this.addfirePoint(item);
                }
            })
        },
        // 火灾报警
        addfirePoint(item) {
            if (this.isVehicleQuery) {
                return
            }
            var _this = this;
            var map = this.$refs.playBack.homeMap;
            if (alarmPopup) {
                _this.removealarmPopup(item)
            }
            var obj = {
                item: item,
                maps: map,
                id: 'huo',
                coordinates: [item.centerX, item.centerY],
                iconImg: 'icon-evt',
                type: 'firepoint',
                iconSize: 1.5
            }
            this.mapUtils.addPoint(obj, this.importantEvtClick);
            map.flyTo({ center: [item.centerX, item.centerY] });
            var html = '<div class="alarm-info-box">' +
                '<p><span>' + item.eventTypeName + '</span></p>' +
                '<div>' +
                '<li><span>发生位置：</span><b>' + item.location + '</b></li>' +
                '<li><span>上报时间：</span><b>' + item.reportTime + '</b></li>' +
                // '<li><span>报警来源：</span><b>' + item.source + '</b></li>' +
                '<li><span>设备桩号：</span><b>' + item.kilometerPile + '</b></li>' +
                '<div class="button-box">' +
                (item.state !== "2" ? '<li id="save">确认</li>' : '') + '<li id="esc">撤销</li>' + (item.typeCode == 101 ? '<li id="publish">建议发布信息</li>' : '') + (item.deviceType == 2 ? '<li id="switch">切换视频</li>' : '') +
                '</div>' +
                '</div>' +
                '<video   controls muted autoplay loop id="a' + item.cameraCode + '" ></video>' +
                '</div>';
            alarmPopup = new mapabcgl.Popup({
                    closeOnClick: false,
                    closeButton: false,
                    offset: [0, -20]
                })
                .setHTML(html)
                .setLngLat([item.centerX, item.centerY])
                .addTo(map);

            setTimeout(() => {
                var esc = document.getElementById('esc')
                var publish = document.getElementById('publish')
                if (item.state !== "2") {
                    var save = document.getElementById('save')
                    if (save) {
                        save.onclick = function() {
                            item.state = '2';
                            var message = JSON.stringify({
                                type: "fireEvent",
                                data: item
                            })

                            _this.sendEvtMessage(message);
                            _this.removealarmPopup(item)
                        };
                    }
                }

                if (esc) {
                    esc.onclick = function() {
                        item.state = '3';
                        var message = JSON.stringify({
                            type: "fireEvent",
                            data: item
                        })
                        _this.sendEvtMessage(message);
                        _this.removealarmPopup(item)
                    };
                }
                if (publish) {
                    publish.onclick = function() {

                        _this.publishInfo = item;
                    };
                }

                var switch_ = document.getElementById('switch')
                if (switch_) {
                    switch_.onclick = function() {
                        item.thermalCamera = !item.thermalCamera;
                        _this.addfirePoint(item)

                    };
                }

                this.getalarmVideo(item, 0)
            }, 500)




        },
        removealarmPopup(item) {
            var map = this.$refs.playBack.homeMap;
            alarmPopup.remove()
            alarmPopup = null
            map.removeLayerAndSource('huo');
            this.getalarmVideo(item, 1)

        },
        cofirmFire(item) {
            var message = JSON.stringify({
                type: "fireEvent",
                data: item
            })
            this.sendEvtMessage(message);
        },
        getalarmVideo(item, operation) {
            const _this = this;
            var cameraCode = item.thermalCamera ? item.thermalCode : item.cameraCode;
            var param = {

                rid: this.alarmVideoRid ? this.alarmVideoRid : item.rid,
                id: this.alarmVideoId ? this.alarmVideoId : cameraCode,
                operation: operation

            }
            this.axios.get(SERVICE_URL + 'VCN/playVideo?', { params: param }).then((data) => {
                this.alarmVideoRid = item.rid;
                this.alarmVideoId = cameraCode;
                if (operation == 0) {
                    if (data.data.code == -1) {
                        this.$message({
                            showClose: true,
                            message: data.data.msg,
                            type: 'error',
                            offset: 80
                        });
                    } else {
                        this.supported = Flv.isSupported()
                        this.loadLocalMediaDataSource_alarm(item, data.data.resultObject)
                    }
                }

                if (operation == 1) {
                    this.alarmVideoRid = '';
                    this.alarmVideoId = '';
                }

            }).catch((data) => {
                console.log(data)
            })
        },
        loadLocalMediaDataSource_alarm(item, url) {

            var mediaDataSource = {
                type: 'flv',
                isLive: true,
                url: url,
                hasAudio: false,
                hasVideo: true,
            }
            this.load_alarm(item, mediaDataSource);

        },
        load_alarm(item, mediaDataSource) {
            var id = 'a' + item.cameraCode; //video播放框id
            var Elem = document.getElementById(id)

            player = Flv.createPlayer(mediaDataSource)
            player.attachMediaElement(Elem);
            player.load()
            this.start()
            Elem['disablePictureInPicture'] = true;

        },
        openAlarmSound(path) {
            const audioContext = getSharedAudioContext();
            if (!audioContext) {
                return;
            }
            async function play() {
                if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                }
                let audioBuffer = alarmAudioBufferCache[path];
                if (!audioBuffer) {
                    const res = await fetch(path);
                    const arraybuffer = await res.arrayBuffer();
                    audioBuffer = await audioContext.decodeAudioData(arraybuffer);
                    alarmAudioBufferCache[path] = audioBuffer;
                }
                const source = audioContext.createBufferSource();
                source.connect(audioContext.destination); //连接上实例
                source.buffer = audioBuffer;
                source.start();
            }
            play()

        },
        importantEvtClick(item) {

        },

        // 路口点位
        getCrossLocation() {

            var _this = this;
            var param = {

            };

            this.axios.get(SERVICE_URL_v2 + '/getCrossLocation?', { params: param }).then((data) => {

                var map = this.$refs.playBack.homeMap;
                var res = data.data.data;
                var xys = [],
                    features = [],
                    linefeatures = [];
                for (var key in res) {
                    var obj = {
                        crossId: key,
                        crossName: key == 'road' ? '路段' : '路口',
                        children: res[key]
                    }
                    this.roadCascaderOptions.push(obj)
                    res[key].forEach(item => {
                        this.crossListObj[item.crossId] = item;
                    })
                }
                res.cross.forEach((item, index) => {
                    var obj = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [item.centerX, item.centerY]
                        },

                        "properties": item,
                    };
                    xys.push([item.centerX, item.centerY]);
                    features.push(obj)
                })
                map.addSource("cross-point", {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": features
                    }
                });
                map.addLayer({
                    "id": "cross-point",
                    "type": "circle",
                    "source": "cross-point",

                    paint: {

                        "circle-radius": 8,
                        "circle-opacity": 0.8,
                        "circle-color": 'rgb(243, 152, 0)'


                    },

                });
                this.bindMapEvent(map, 'click', 'cross-point', 'crossPointClickHandler', () => {
                    return (event) => {
                        var item = event.features[0].properties;
                        this.crossClick(item)
                    }
                });
                return
                if (res.road) {
                    res.road.forEach((item, index) => {
                        var wkt = item.wkt.replace('LINESTRING(', '').replace(')', '').split(',')
                        var coordinates = []

                        wkt.forEach(item => {
                            var line = item.split(' ').map(Number)
                            coordinates.push(line)
                        })
                        var obj = {
                            "type": "Feature",
                            "geometry": {
                                "type": "LineString",
                                "coordinates": coordinates
                            },

                            "properties": {},
                        };

                        linefeatures.push(obj)
                    })
                    map.addSource("road-line", {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection",
                            "features": linefeatures
                        }
                    });
                    map.addLayer({
                        "id": "road-line",
                        "type": "line",
                        "source": "road-line",

                        paint: {

                            "line-width": 5,
                            "line-opacity": 0.5,
                            "line-color": 'rgb(243, 152, 0)'


                        },

                    });
                    this.mapUtils.setBestMap(xys, { maps: map, left: 200, right: 200, maxZoom: 24 })
                }


            })
        },
        // 拥堵分析
        getCongestionAnalysis() {

            var _this = this;
            var param = {
                type: this.day,
                id: this.crossData ? this.crossData.crossId : ''
            };

            this.axios.get(SERVICE_URL_v2 + '/getCongestionAnalysis?', { params: param }).then((data) => {
                var res = this.CongestionAnalysis = data.data.data;
                this.cNav = res.lists[0].id;

                res.echartsVoMap[this.cNav].series.forEach(item => {
                    item.smooth = false;
                    item.areaStyle = {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(55, 237, 246,1)'
                        }, {
                            offset: 1,
                            color: 'rgba(55, 237, 246,0.1)'
                        }])
                    }
                })


                var options = {
                    dom: 'ydfxEct',
                    color: 'rgba(255,255,255,.75)',
                    colors: ['#37EDF6', '#19BCF1'],
                    legendData: [],
                    xAxisData: res.echartsVoMap[this.cNav].times,
                    yAxisName: '',
                    gridLeft: 10,
                    gridBom: 0,
                    gridTop: this.width > 3800 ? 30 : 15,
                    gridRight: 0,
                    legendRight: 25,
                    yaxisTick: false,
                    yaxisLine: false,

                    axisLabelFontSize: this.width > 3800 ? 24 : 12,
                    ysplitLine: true,
                    series: res.echartsVoMap[this.cNav].series,
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

                    this.cEct = this.EchartsLarge.lineChart2(options)
                })



            })
        },
        // 延误分析
        getDelayAnalysis() {

            var _this = this;
            var param = {
                type: this.day,
                id: this.crossData ? this.crossData.crossId : ''
            };

            this.axios.get(SERVICE_URL_v2 + '/getDelayAnalysis?', { params: param }).then((data) => {
                var res = this.BlockAnalysis = data.data.data;
                this.bNav = res.list[0].id;
                res.echartsVoMap[this.bNav].series.forEach(item => {
                    item.smooth = false;
                    item.areaStyle = {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(10, 215, 138,1)'
                        }, {
                            offset: 1,
                            color: 'rgba(10, 215, 138,0.1)'
                        }])
                    }
                })
                var options = {
                    dom: 'zdfxEct',
                    color: 'rgba(255,255,255,.75)',
                    colors: ['#0AD78A', '#19BCF1'],
                    legendData: [],
                    xAxisData: res.echartsVoMap[this.bNav].times,
                    yAxisName: '',
                    gridLeft: 0,
                    gridBom: 0,
                    gridTop: this.width > 3800 ? 30 : 15,
                    gridRight: 0,
                    legendRight: 25,
                    yaxisTick: false,
                    yaxisLine: false,

                    axisLabelFontSize: this.width > 3800 ? 24 : 12,
                    ysplitLine: true,
                    series: res.echartsVoMap[this.bNav].series,
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
        // 轨迹分析
        getTrackAnalysis() {

            var _this = this;
            var param = {
                type: this.day,
                id: this.crossData ? this.crossData.crossId : ''
            };

            this.axios.get(SERVICE_URL_v2 + '/getTrackAnalysis?', { params: param }).then((data) => {
                this.trackAnalysis = data.data.data;
                var barres = data.data.data.echartsVo;
                barres.series.forEach(item => {
                    item.itemStyle = {
                        color: new echarts.graphic.LinearGradient(
                            0, 1, 0, 0,
                            [
                                { offset: 1, color: '#08DD92' },
                                { offset: 0.5, color: '#87F8D5' },
                                { offset: 0, color: '#87F8D5' }
                            ]
                        )
                    }
                    item.barWidth = this.width > 3800 ? 20 : 12;
                })
                var baroptions = {
                    dom: 'gjfxEct',
                    color: 'rgba(255,255,255,.75)',
                    legendData: [],
                    xAxisData: barres.times,
                    yAxisName: '',
                    gridLeft: 0,
                    gridBom: 0,
                    gridTop: this.width > 3800 ? 30 : 15,
                    gridRight: 0,
                    legendRight: 25,
                    yaxisTick: false,
                    yaxisLine: false,
                    yaxisLineShow: false,
                    yaxisLabelShow: true,
                    axisLabelFontSize: this.width > 3800 ? 24 : 12,
                    ysplitLine: true,
                    series: barres.series,
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

                    this.EchartsLarge.barChart(baroptions);
                })


            })
        },
        // 高发点位
        getHighPointSection() {

            var _this = this;
            var param = {
                type: this.dateType
            };

            this.axios.get(SERVICE_URL_v2 + '/getHighPointSection?', { params: param }).then((data) => {
                var totalSumAll = 0;
                data.data.data.echartsVo.series[0].data.forEach(item => {
                    totalSumAll += Number(item.value)
                })
                totalSumAll = totalSumAll != 0 ? totalSumAll.toFixed(2) : 0;
                var res = this.HighFatSection = data.data.data;
                this.HighFatSection.totalSumAll = totalSumAll;
                var options = {
                    colors: this.colors,
                    dom: 'scfxEct',
                    name: res.echartsVo.series[0].name,
                    data: res.echartsVo.series[0].data,
                    label: {

                        normal: {
                            show: true,
                            position: 'center',
                            color: '#fff',
                            formatter: function() {
                                return '总时长' + '\n' + totalSumAll
                            }
                        }


                    },

                    radius: ['50%', '60%'],
                    emphasis: {
                        label: {
                            show: false,
                            fontSize: this.width > 3800 ? 40 : 16,
                            fontWeight: 'bold'
                        }
                    }
                }

                this.$nextTick(function() {

                    this.EchartsLarge.reportpie(options);
                    // this.EchartsLarge.barChart(baroptions);
                })


            })
        },
        // 路口拥堵top10

        getCrossTop10() {
            // console.log("getCrossTop10")
            var _this = this;
            var param = {
                type: this.dateType
            };

            this.axios.get(SERVICE_URL_v2 + '/getCrossTop10?', { params: param }).then((data) => {

                this.crossList = data.data.data;
                this.videoCrossData = data.data.data.data[0]
            })
        },
        // 路段拥堵top10

        getRoadTop10() {

            var _this = this;
            var param = {
                type: this.dateType
            };

            return this.axios.get(SERVICE_URL_v2 + '/getRoadTop10?', { params: param }).then((data) => {

                this.roadList = data.data.data;
                this.videoRoadData = data.data.data.data[0]
            })
        },
        // 路网概况
        getRoadNetworkOverview() {

            var _this = this;
            var param = {
                id: this.crossData ? this.crossData.crossId : ''
            };

            this.axios.get(SERVICE_URL_v2 + '/getRoadNetworkOverview?', { params: param }).then((data) => {
                var res = this.RoadNetworkOverview = data.data.data.valueVoList;

                var length
                res.forEach(item => {

                    item.icon = require('../assets/image/screen/center/' + item.icon + '.png')
                    if (item.name.indexOf('事件') > -1) {

                        length = Number(item.value)

                    }
                })
                if (length > this.eventTotal) {
                    this.eventTotal = length;
                    this.isDot = true;
                }

            })
        },
        eventNumClick(item) {
            if (item.name == '交通事件' || item.name == '轨迹事件') {
                this.isDot = false;

                this.eventClickTime.push(this.mapUtils.getDateYMD('ymdhms'));
                if (this.eventClickTime.length > 2) {
                    this.eventClickTime.shift();
                }

                this.isTtafficEvt = true;
                this.trackPlay = false;
                this.autoPolling = false;
                this.eventInfoReturnHome = false;
                this.$refs.playBack.homeMap.removeLayer('crossing')
                this.$refs.playBack.crossing.clear()
            }

        },
        // 事件监测路口数量
        getStatsList() {

            var _this = this;
            var param = {

            };

            this.axios.get(SERVICE_URL_v2 + '/getStatsList?', { params: param }).then((data) => {
                var res = this.crossStatusList = data.data.data;

                res.forEach(item => {
                    item.icon = require('../assets/image/screen/center/' + item.icon + '.png')

                })
            })
        },
        crossStatusClick(item) {
            this.getStatsTop(item)
        },
        // 事件监测路口排名
        getStatsTop(item) {

            var _this = this;
            var param = {
                id: item.id
            };

            this.axios.get(SERVICE_URL_v2 + '/getStatsTop?', { params: param }).then((data) => {
                var res = data.data.data,
                    xys = [],
                    features = [];
                var map = this.$refs.playBack.homeMap;
                map.removeLayerAndSource('crossIndex-point')
                res.forEach((temp, index) => {
                    var obj = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [temp.centerX, temp.centerY]
                        },

                        "properties": temp,
                    };
                    xys.push([temp.centerX, temp.centerY])
                    features.push(obj)
                })


                var options = {
                    maps: map,
                    features: features,
                    id: 'crossIndex-point',
                    iconImg: 'pulsing-dot',
                    iconSize: 1,
                    textHaloColor: '#fff',
                    textColor: '#fff',

                }
                this.mapUtils.addgeojsonPoint(options);
                this.mapUtils.setBestMap(xys, { maps: map, left: 200, right: 200, maxZoom: 24 })
                this.bindMapEvent(map, 'click', 'crossIndex-point', 'crossIndexPointClickHandler', () => {
                    return (event) => {
                        var item = event.features[0].properties;
                        this.crossClick(item)
                    }
                });
            })
        },
        // 路口视频列表
        getCameraList() {

            var _this = this;
            var param = {

            };

            this.axios.get(SERVICE_URL_v2 + '/getCameraList?', { params: param }).then((data) => {

                var res = data.data.data;

                res.forEach((item, i) => {
                    var obj = {
                        item: item,
                        maps: this.$refs.playBack.homeMap,
                        id: item.id + 'c',
                        coordinates: [item.centerX, item.centerY],
                        iconImg: 'icon-camera-' + item.deviceType,
                        type: 'camerapoint',
                        iconSize: 0.5,
                        iconOverlap: false,
                        iconPlacement: false,
                        textOverlap: false,
                        textPlacement: false,

                    }
                    this.mapUtils.addPoint(obj, this.mapCrossClick, this.crossMousemove, this.crossMouseleave);

                });


            })
        },
        // 全息路况
        getRealRoadCondition() {
            if (this.isVehicleQuery) {
                return
            }
            if (!traffic) {
                return
            }
            const map = this.$refs.playBack.homeMap;
            if (map.getSource('si-trafficLayer')) {
                map.removeLayerAndSource('si-trafficLayer')
            }
            var _this = this;
            var param = {

            };

            this.axios.get(SERVICE_URL + 'condition/getRealRoadCondition?', { params: param }).then((data) => {

                var res = data.data.data;
                this.mapUtils.addgeojsonLine({
                    maps: this.$refs.playBack.homeMap,
                    features: res.features,
                    id: 'si-trafficLayer',
                    strokeWeight: 5,
                    beforeId: 'hdmap_dlm_z17_z23_zlevel',
                    visibility: this.checktoolActive.indexOf(11) > -1 ? 'visible' : 'none',
                    color: { //线的颜色
                        "property": "state",
                        "type": "categorical",
                        "stops": [
                            [{
                                    "zoom": 10,
                                    "value": 1
                                },
                                "#0bf007"
                            ],
                            [{
                                    "zoom": 10,
                                    "value": 2
                                },
                                "#3e64f3"
                            ],
                            [{
                                    "zoom": 10,
                                    "value": 3
                                },
                                "#f9f808"
                            ],
                            [{
                                    "zoom": 10,
                                    "value": 4
                                },
                                "#fbbc0d"
                            ],
                            [{
                                    "zoom": 10,
                                    "value": 5
                                },
                                "#f60704"
                            ]
                        ],
                        "default": "#0bf007"
                    }
                })


            })
        },
        crossMousemove(item) {

            this.$refs.playBack.homeMap.getCanvas().style.cursor = 'pointer';
            if (cameraLabel) {
                cameraLabel.remove()
            }
            var el = document.createElement('div')
            el.innerHTML = item.name;
            cameraLabel = new mapabcgl.Marker(el)
                .setOffset([0, 20])
                .setLngLat([item.centerX, item.centerY])
                .addTo(this.$refs.playBack.homeMap);
        },
        crossMouseleave(item) {
            this.$refs.playBack.homeMap.getCanvas().style.cursor = '';
            if (cameraLabel) {
                cameraLabel.remove()
            }
        },
        mapCrossClick(item) {
            var _this = this;
            item.thermalCamera = false;
            this.playVideo(item, 0)
        },
        playVideo(item, operation) {
            const _this = this;
            if (operation == 0 && item.deviceType == 2) {
                item.thermalCamera = !item.thermalCamera;
            }

            var cameraCode = item.thermalCamera ? item.thermalCode : item.cameraCode;
            if (operation == 0) {

                if (this.cameraCodeArr.indexOf(cameraCode) > -1) {
                    console.log('已存在')
                    return
                } else {
                    this.cameraCodeArr.push(cameraCode)
                }
                if (this.cameraCodeArr.length == 4) {
                    this.$message({
                        message: '同时播放实时视频数量已达上限。',
                        type: 'warning',
                        offset: 80
                    });
                    this.cameraCodeArr.pop()
                    return
                }
            }


            var param = {

                rid: item.rid,
                id: cameraCode,
                operation: operation

            }

            this.axios.get(SERVICE_URL + 'VCN/playVideo?', { params: param }).then((data) => {
                if (data.data.code == -1) {
                    this.$message({
                        showClose: true,
                        message: data.data.msg,
                        type: 'error',
                        offset: 80
                    });
                    this.cameraCodeArr.pop()
                } else {
                    if (operation == 0) {

                        var html = '<div class="video-bg" id="test"><p><span>' + item.name + '</span>' + (item.deviceType == 2 ? '<span style="font-size:12px;margin-left:20px;color: #41fdfc;cursor:pointer;" id="s' + cameraCode + '">切换视频</span>' : '') + '<b id="' + cameraCode + '">x</b></p>' + '<video id="c' + cameraCode + '"  controls muted autoplay loop ></video></div>';

                        item.offset = [0, -20]
                        this.addPopup(html, item, this.closePopup, data.data.resultObject, this.switchVideo)
                    } else {

                    }
                }



            }).catch((data) => {
                console.log(data)
            })
        },
        addPopup(html, item, callback, url, callback1) {
            var cameraCode = item.thermalCamera ? item.thermalCode : item.cameraCode;
            var popup = new mapabcgl.Popup({
                    closeOnClick: false,
                    closeButton: false,
                    offset: item.offset
                })
                .setHTML(html)
                .setLngLat([item.centerX, item.centerY])
                .addTo(this.$refs.playBack.homeMap);
            this.supported = Flv.isSupported()
            this.loadLocalMediaDataSource(item, url)
            const drag = popup.getElement();
            this.dragFunc(drag)
            popupArr.push({

                obj: popup
            });

            var popupElem = document.getElementById(cameraCode)

            if (popupElem) {
                popupElem.onclick = function(e) {
                    if (callback) {
                        callback(item, e);
                    }
                };
            }
            var s = document.getElementById('s' + cameraCode)

            if (s) {
                s.onclick = function(e) {
                    if (callback1) {
                        callback1(item, e);
                    }
                };
            }
        },
        dragFunc(Drag) {
            Drag.onmousedown = function(event) {
                var ev = event || window.event;
                event.stopPropagation();
                var disX = ev.clientX - Drag.offsetLeft;
                var disY = ev.clientY - Drag.offsetTop;
                document.onmousemove = function(event) {
                    var ev = event || window.event;
                    Drag.style.left = ev.clientX - disX + "px";
                    Drag.style.top = ev.clientY - disY + "px";
                    Drag.style.cursor = "move";
                };
            };
            Drag.onmouseup = function() {
                document.onmousemove = null;
                this.style.cursor = "default";
            };
        },
        loadLocalMediaDataSource(item, url) {

            var mediaDataSource = {
                type: 'flv',
                isLive: true,
                url: url,
                hasAudio: false,
                hasVideo: true,
            }
            this.load(item, mediaDataSource);

        },
        load(item, mediaDataSource) {
            var cameraCode = item.thermalCamera ? item.thermalCode : item.cameraCode;
            var id = 'c' + cameraCode; //video播放框id
            var Elem = document.getElementById(id)

            player = Flv.createPlayer(mediaDataSource)
            player.attachMediaElement(Elem);
            player.load()
            this.start()
            Elem['disablePictureInPicture'] = true;
            playerArr.push({
                item: item,
                player: player

            });
        },

        start() {
            player && player.play();
        },

        destroy(player, item) {

            if (player) {
                player.pause();
                player.unload();
                player.detachMediaElement();
                player.destroy();
                player = null;

                this.playVideo(item, 1)
            }
        },
        closePopup(item) {
            var cameraCode = item.thermalCamera ? item.thermalCode : item.cameraCode;
            this.cameraCodeArr.forEach((p, index) => {
                if (p == cameraCode) {
                    popupArr[index].obj.remove()

                    popupArr.splice(index, 1)
                    this.cameraCodeArr.splice(index, 1)
                    this.destroy(playerArr[index].player, item)

                }

            })


            playerArr.splice(playerArr.findIndex(pop => pop.item.cameraCode === item.cameraCode), 1)
            // this.playVideo(item, 1)
        },
        switchVideo(item) {

            this.closePopup(item)
            this.playVideo(item, 0)
        },


        initTracks() {
            var map = this.$refs.playBack.homeMap;
            var datas = map.getStyle().layers;
            datas.forEach(item => {
                if (item.source == 'buildingsource') {
                    buildingIds.push(item.id)
                }
            })
            buildingIds.forEach(item => {
                map.setLayoutProperty(item, 'visibility', 'none');
            })
            map.addControl(new mapabcgl.NavigationControl(), 'bottom-right');
            var _this = this;

            // this.getRealRoadCondition()
            // this.getCrossLocation()
            this.bounds = this.$refs.playBack.homeMap.getBounds()
            this.request(1)
            // this.getCameraList()
            // this.initgltf()
            // this.addTrafficLayer()
            this.getRoadTop10().then(() => {
                this.getRealDirList()
            })
        },
        cesiumLoad() {
            this.viewer = this.$refs.cesiumTrack.viewer

            // this.add3dPopup()
            this.addModel()
            this.add3dTiles()

        },
        add3dTiles() {
            var _this = this;
            var tileUrl = DEVICESERVICE_URL + `api/model/tileset/tileset.json`
            // 加载模型
            Cesium.Cesium3DTileset.fromUrl(tileUrl, {
                show: true, // 是否显示（默认 true）
                maximumScreenSpaceError: 2, // 最大屏幕空间误差，数值越小精度越高，性能越低
                maximumMemoryUsage: 512, // 最大内存使用量（单位 MB），超出后瓦片将被移除
                dynamicScreenSpaceError: true, // 动态调整屏幕空间误差
                dynamicScreenSpaceErrorDensity: 0.002, // 动态误差密度
                dynamicScreenSpaceErrorFactor: 4.0, // 动态误差系数
                skipLevelOfDetail: true, // 跳过部分细节层级以提高性能
                preloadWhenHidden: false, // 是否预加载隐藏的瓦片
                preloadFlightDestinations: true, // 预加载飞行路径的目标瓦片
                preferLeaves: true, // 优先加载叶子瓦片，提高最终分辨率
                cullWithChildrenBounds: true, // 使用子瓦片边界裁剪
                cullRequestsWhileMoving: true, // 在相机移动时裁剪请求
                progressiveResolutionHeightFraction: 0.5, // 瓦片加载的渐进分辨率因子
                shadows: Cesium.ShadowMode.ENABLED // 启用阴影
            }).then(tileset => {
                _this.viewer.scene.primitives.add(tileset);
                _this.viewer.zoomTo(tileset).then(() => {
                    console.log("zoomTo")
                    _this.request(1);
                });
            });

        },
        deviceListClick(item) {
            this.dialogUrl = null
            if (!!item.metadata) {
                var meta = JSON.parse(item.metadata)
                if (meta.popupUrl) {
                    var url = DEVICESERVICE_URL + meta.popupUrl + '?deviceId=' + item.deviceId
                    this.popupPosition = Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 0);
                    this.add3dPopup(url)
                } else if (meta.dialogUrl) {
                    this.dialogUrl = DEVICESERVICE_URL + meta.dialogUrl + '?deviceId=' + item.deviceId
                }
            }
        },
        add3dPopup(url) {
            this.viewer.scene.postRender.removeEventListener(this.popupUpdate);
            if (this.devInfocontent) {
                this.viewer.container.removeChild(this.devInfocontent);
            }


            this.devInfocontent = document.createElement('div');
            this.viewer.container.appendChild(this.devInfocontent);
            this.devInfocontent.className = 'cesium-popup'
            this.devInfocontent.id = 'content';

            this.devInfocontent.innerHTML =
                `
            <li>
                <span id="close">x</span>
            </li>
              <iframe
                  src ="${url}"
                  style="width: 100%; height: 100%; border: none;"
                  frameborder="0">
              </iframe>
             `;



            const close = document.getElementById('close')
            if (close) {
                close.onclick = () => {

                    this.viewer.scene.postRender.removeEventListener(this.popupUpdate);
                    this.viewer.container.removeChild(this.devInfocontent);
                    this.devInfocontent = null
                };
            }
            this.viewer.scene.postRender.addEventListener(this.popupUpdate)

        },
        popupUpdate() {

            this.devInfocontent = document.getElementById('content')
            var cartsain = this.AnglesToCartesian3(this.popupPosition);
            var eyeOffset = new Cesium.Cartesian3(0.0, 2.0, 0.0)
            var pixelOffset = new Cesium.Cartesian2(0, 15)
            var pixel = this.cartesianWithEyeOffsetToCanvasCoordinates(this.viewer.scene, cartsain, eyeOffset);

            if (pixel && pixel.x) {
                var x = pixel.x - (this.devInfocontent.offsetWidth) / 2;
                var y = pixel.y - (this.devInfocontent.offsetHeight);
                x += pixelOffset.x;
                y += pixelOffset.y;
                this.devInfocontent.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
                this.devInfocontent.style.display = 'block';
            }
        },
        AnglesToCartesian3(value, isRadian) {
            if (value instanceof Array) {
                if (value.length > 2) {
                    value = isRadian ? Cesium.Cartesian3.fromRadians(value[0], value[1], value[2]) : Cesium.Cartesian3.fromDegrees(value[0], value[1], value[2]);
                }
            }
            return value;
        },
        cartesianWithEyeOffsetToCanvasCoordinates(scene, position, eyeOffset, result) {
            return Cesium.SceneTransforms.worldWithEyeOffsetToWindowCoordinates(
                scene,
                position,
                eyeOffset,
                result
            );
        },
        addModel() {
            fetch(DEVICESERVICE_URL + 'api/device/list', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pageSize: 1000, pageNum: 1 })
            }).then(res => res.json()).then(json => {
                if (json.code === 200) {
                    this.deviceList = json.data
                    json.data.forEach(item => {

                        if (!!item.metadata) {
                            var meta = JSON.parse(item.metadata)
                            if (meta.modelUrl) {
                                this.addEntity(meta,item.deviceId)
                            }
                        }
                    })
                }
            })
        },
        async addEntity(item,id) {
            console.log(item)
            this.mapDevice.forEach((model, key) => {
                this.viewer.scene.primitives.remove(model);
            })
            this.mapDevice.clear()
            // 添加实体模型
            let cartesian = Cesium.Cartesian3.fromDegrees(item.position[0], item.position[1], item.position[2]);
            let headingPitchRoll = Cesium.HeadingPitchRoll.fromDegrees(item.rotation[0], item.rotation[1], item.rotation[2]);
            let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(cartesian, headingPitchRoll, Cesium.Ellipsoid.WGS84, Cesium.Transforms.eastNorthUpToFixedFrame, new Cesium.Matrix4());

            var path = DEVICESERVICE_URL + `api/model/device/` + item.modelUrl
            var rootPath = this.extractPath(path) + "/"

            fetch(path)
                .then(response => response.json())
                .then(gltf => {
                    // 修改材质的纹理
                    gltf.images.forEach(image => {
                        if (!!image.uri) {
                            image.uri = rootPath + image.uri+'?t='+Date.now()+'&deviceId='+id
                        }
                    })
                    gltf.buffers.forEach(buf => {
                        if (!!buf.uri) {
                            buf.uri = rootPath + buf.uri
                        }
                    })
                    return Cesium.Model.fromGltfAsync({
                        gltf: gltf,
                        modelMatrix: modelMatrix,
                        scale: 1,
                        incrementallyLoadTextures: false,
                    });
                })
                .then(model => {

                    // model.userData = { id: item.id, type: item.type };
                    // model.customShader = customShader

                    model.readyEvent.addEventListener(() => {
                        console.log('Model loaded:', model);
                    });
                    model.texturesReadyEvent.addEventListener((data) => {
                        console.log('Model textures ready:', data);
                    });
                    this.mapDevice.set(id, model)


                    this.viewer.scene.primitives.add(model);

                });
        },
        extractPath(url) {
            const lastSlashIndex = url.lastIndexOf('/');
            return lastSlashIndex !== -1 ? url.slice(0, lastSlashIndex) : url;
        },
        handleCesiumCameraChanged() {
            var bound = this.$refs.cesiumTrack.getViewBounds()
            if (!!bound) {
                this.openSend();
            }
        }
    }

}
</script>
<style lang="scss">
.cesium-popup {
    position: absolute;
    width: 800px;
    height: 450px;
    // display: none;
    z-index: 1000;
    background: #16263D;
    left: 0;
    top: 0;

    li {
        list-style: none;
        text-align: right;
        background: #16263D;
        font-size: 14px;
        font-weight: 800;
        padding-right: 10px;
        cursor: pointer;
    }
}

.popup-box {
    position: absolute;
    width: 800px;
    height: 600px;
    background: #16263D;
    left: 50%;
    top: 50%;
    padding: 10px;
    transform: translate(-50%, -50%);
    z-index: 1001;

    li {
        list-style: none;
        text-align: right;
        background: #16263D;
        font-size: 14px;
        font-weight: 800;
        padding-right: 10px;
        cursor: pointer;
    }
}

@font-face {
    font-family: 'DS-Digital';
    src:
        url(../assets/font/DS-Digital/DS-DIGIT-4.ttf),
        url(../assets/font/DS-Digital/DS-DIGII-3.ttf),
        url(../assets/font/DS-Digital/DS-DIGIB-2.ttf),
        url(../assets/font/DS-Digital/DS-DIGI-1.ttf);

}

@font-face {
    font-family: YouSheBiaoTiHei;
    src: url(../assets/font/YHBTH.ttf);
}

.mapabcgl-ctrl-top-right {
    top: 60px;
    z-index: 200;

}

.mapabcgl-ctrl-bottom-right {
    bottom: 20px;
    right: 20px;
}

.screen-box {
    width: 100%;
    height: 1080px;
    margin: 0 auto;

    // background: url(../assets/image/bdh/mask.png) no-repeat;

}

.screen-header {
    width: 100%;
    height: 90px;
    background: url(../assets/image/bdh/head.png) no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99;
    text-align: center;
    .screen-header-gif {
        width: 1768px;
        height: 74px;
        background: url(../assets/image/bdh/head-gif.png) no-repeat;
        position: absolute;
        top: 0;
        right: 21px;
       
    }

    .screen-header-title {
        width: 100%;
        font-size: 40px;
        font-family: YouSheBiaoTiHei;
        font-weight: 400;
        color: #EFF8FC;
        line-height: 80px;
        opacity: 0.89;
        background: linear-gradient(0deg, rgba(119, 186, 255, 0.45)0%, rgba(255, 255, 255, 1) 55%, rgba(255, 255, 255, 1) 100%);
        -webkit-text-fill-color: transparent;

    }

    .screen-header-time {
        position: absolute;
        top: 28px;
        left: 5px;
        z-index: 99;
        display: flex;

        li {
            display: flex;

            p {
                b {
                    display: block;
                    width: 65px;
                    text-align: right;
                    font-size: 14px;
                    font-family: Myriad Pro;
                    font-weight: 400;
                    color: #FFFFFF;

                }

                span {
                    display: block;
                    width: 65px;
                    text-align: right;
                    font-size: 12px;
                    font-family: DIN;
                    font-weight: 400;
                    color: #D6E0F5;
                }

            }

            img {
                display: block;
                width: 40px;
                height: 40px;
            }

            span {
                font-size: 21px;
                font-family: DIN;
                font-weight: 400;
                color: #FFFFFF;

                margin-left: 5px;
            }


        }


        i {
            display: block;
            width: 1px;
            height: 30px;
            border: 1px solid #A7A7A7;
            opacity: 0.3;
            margin: 6.5px 19px 0 19px;

        }

        .week {
            font-size: 20px;
            font-family: Adobe Heiti Std;
            font-weight: normal;
            color: #FFFFFF;
            margin-left: 19px;
            line-height: 43px;
        }

        em {
            font-size: 12px;
            font-family: Myriad Pro;
            font-weight: 400;
            color: #697CA7;
            margin-top: 2px;
            display: block;
            text-align: right;
        }

        .aqi {
            font-size: 15px;
            font-family: DINOT;
            font-weight: 400;
            color: #FFFFFF;
            text-align: right;
            display: block;
        }


    }

    .track-time {
        position: absolute;
        top: 50px;
        right: 45px;
        z-index: 99;
        display: flex;
        line-height: 44px;
    }

    .screen-header-switch {
        position: absolute;
        top: 28px;
        right: 43px;
        z-index: 99;
        display: flex;

        .el-switch__core {
            background: rgba(4, 72, 141, 0.2);
            border: 1px solid #2D80D3;
            margin-right: 9px;
        }

        .el-switch__core:after {
            box-shadow: 0 0 6px 2px rgba(197, 228, 255, 1) inset;
            border: 1px solid #C5E4FF;
            background: none;
        }

        .el-switch__label {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #FFFFFF;

        }

        img {
            margin-top: -10px;
            margin-left: 14px;
            cursor: pointer;
        }
    }

    .user-box {
        right: 30px;
        left: auto;

        b {
            font-size: 14px;
            line-height: 100px;
            display: inline-block;
        }
    }
}



.screen-map {
    // flex: 1;
    height: 100%;
    width: 100%;
    position: relative;
    margin: 0 auto;
    transition: all 1s;

    .v-map-box {

        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 50;
    }

    .bg {
        z-index: 90;
        background: url(../assets/image/bdh/bg-1920.png) no-repeat;
        pointer-events: none;
        background-size: 100% 100%;
    }

    .t-map-box {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
}

.screen-left-border {
    position: fixed;
    left: 0;
    top: 21px;
    width: 32px;
    bottom: 0;
    background: url(../assets/image/bdh/left-border.png) no-repeat;
    z-index: 99;
}

.screen-right-border {
    position: absolute;
    right: 0;
    top: 21px;
    width: 32px;
    bottom: 0;
    background: url(../assets/image/bdh/right-border.png) no-repeat;
    z-index: 99;
}

.screen-left-box {
    position: absolute;
    left: 0;
    top: 86px;
    // width: 440px;
    height: 995px;
    // background: url(../assets/image/bdh/left_n.png) no-repeat;
    width: 418px;
    // height: 383px;
    background: rgba(11, 20, 36, 0.5);
    background-size: 100% 100%;
    // background: red;
    z-index: 99;
    transition: all 1s;

    // padding-left: 30px;

    .left-box {
        .road-info-box {
            display: flex;
            margin-top: 16px;

            .flex {
                display: flex;
                // flex: 1;
                width: 191px;
                height: 48px;
                background: #16263D;
                margin-left: 12px;
                line-height: 48px;

                p {
                    flex: 1;
                    text-align: right;
                    line-height: 48px;
                    margin-right: 5px;

                    span {
                        font-family: DINPro-Bold;
                        font-weight: 700;
                        font-size: 22px;
                        color: #13E2A8;
                        letter-spacing: 0;

                    }

                    b {
                        font-family: MicrosoftYaHei;
                        font-size: 14px;
                        color: #BAD6E6;
                        letter-spacing: 0;
                        line-height: 14px;
                    }

                    em {

                        font-family: MicrosoftYaHei;
                        font-size: 12px;
                        color: #13E2A8;

                    }

                }
            }     

            .title {
                display: flex;
                margin-left: 16px;
                margin-bottom: 8px;

                img {
                    height: 20px;
                    margin-right: 5px;
                }

                span {

                    font-family: MicrosoftYaHei-Bold;
                    font-weight: 700;
                    font-size: 14px;
                    color: #EEF9FF;
                }

                em {
                    flex: 1;
                    text-align: right;
                    font-size: 10px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #778FA4;
                    padding-top: 5px;
                }

            }

            .vehicle-number {
                margin-left: 16px;

                background: #16263D;
                width: 386px;
                height: 228px;

                .list {
                    display: flex;
                    height: 164px;

                    .img-box {
                        align-items: center;
                        display: flex;
                        margin-top: -30px;
                        margin-left: 4px;

                        img {
                            width: 128px;
                            height: 62.44px;

                        }
                    }

                    .list_ {
                        margin-left: 29px;
                        margin-right: 18px;
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-evenly;

                        li {
                            display: flex;
                            line-height: 22px;

                            i {
                                display: inline-block;
                                width: 6px;
                                height: 6px;
                                opacity: 0.2;
                                background: #FFFFFF;
                                border-radius: 50%;
                                margin-top: 8px;
                                margin-right: 5px;

                            }

                            b {
                                font-family: MicrosoftYaHei;
                                font-size: 14px;
                                color: #BAD6E6;
                            }

                            span {
                                flex: 1;
                                font-family: DINPro-Bold;
                                font-weight: 700;
                                font-size: 16px;
                                color: #EEF9FF;
                                letter-spacing: 0;
                                text-align: right;
                            }
                        }
                    }

                }

                // li {
                //     position: absolute;
                //     white-space: nowrap;

                //     span {
                //         display: block;
                //         font-size: 14px;
                //         font-family: PingFang SC;
                //         font-weight: 500;
                //         color: #FFFFFF;
                //         margin-bottom: 20px;
                //     }

                //     b {
                //         font-size: 12px;
                //         font-family: PingFang SC;
                //         font-weight: 400;
                //         color: #FFFFFF;
                //         margin-left: -5px;
                //         display: block;
                //         // text-align: center;

                //     }
                // }
            }

            .road-traffic {
                display: flex;
                min-width: 306px;
                height: 44px;
                // margin-bottom: 25px;
                // margin-right: 59px;

                i {
                    width: 13px;
                    height: 13px;
                    border: 1px solid #109AC4;
                    border-radius: 4px;
                    margin-right: 9px;
                    line-height: 13px;
                    text-align: center;
                    margin-top: -8px;
                }

                li {
                    // background: #00FFD8;
                    width: 289px;
                    height: 2px;
                    display: flex;
                    position: relative;

                    span {
                        font-size: 12px;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #FFFFFF;
                        display: block;
                        margin-top: -10px;
                    }

                    .th {
                        flex: 1;
                        text-align: right;
                        margin-top: -12px;
                        margin-right: 5px;

                        em {
                            font-size: 14px;
                            font-family: DIN;
                            font-weight: 400;
                            color: #01F3D0;
                        }

                    }

                    .bg {
                        position: absolute;
                        width: 100%;

                        b {
                            height: 2px;
                            display: inline-block;

                        }
                    }


                }
            }

            .line-box {
                margin-left: 16px;
                width: 386px;
                height: 173px;
                background: #16263D;
            }

            .road-net {
                width: 386px;
                margin-left: 16px;

                .info {
                    display: flex;

                    li {
                        margin-left: 16px;
                        line-height: 62px;

                        b {
                            font-family: MicrosoftYaHei;
                            font-size: 14px;
                            color: #BAD6E6;
                        }

                        span {
                            font-family: DINPro-Bold;
                            font-weight: 700;
                            font-size: 22px;
                            color: #FF444F;
                        }
                    }
                }

                .list {
                    width: 386px;
                    display: flex;
                    justify-content: space-evenly;
                    margin-top: 12px;

                    li {
                        width: 126px;
                        height: 24px;
                        background: url(../assets/image/bdh/road-net-list.png) no-repeat;
                        display: flex;
                        line-height: 24px;

                        b {
                            font-family: MicrosoftYaHei;
                            font-size: 12px;
                            color: #BAD6E6;
                            margin-left: 2px;
                        }

                        span {
                            font-family: DINPro-Bold;
                            font-weight: 700;
                            font-size: 16px;
                            color: #EEF9FF;
                            flex: 1;
                            text-align: right;
                        }

                        em {
                            font-family: MicrosoftYaHei;
                            font-size: 12px;
                            color: #688BAD;
                            letter-spacing: 0;
                            margin-right: 2px;
                        }
                    }
                }
            }

            .road-rank-box {
                display: flex;
                flex-wrap: wrap;
                flex-direction: column;
                height: 170px;
                margin-top: 25px;

                .road-rank {
                    height: 25px;
                    display: flex;
                    margin-top: 20px;
                    margin-right: 12px;
                    margin-left: 5px;

                    i {
                        font-size: 12px;
                        font-family: YouSheBiaoTiHei;
                        font-weight: 400;
                        color: #FF4747;
                        margin-top: -18px;
                        margin-right: 9px;
                    }

                    li {
                        width: 151px;
                        height: 3px;
                        background: #28445B;
                        border-radius: 0px 1px 1px 0px;

                        span {
                            font-size: 12px;
                            font-family: PingFang SC;
                            font-weight: 400;
                            color: #FFFFFF;
                            float: left;
                            margin-top: -20px;

                        }

                        em {
                            margin-top: -20px;
                            font-size: 12px;
                            font-family: DIN;
                            font-weight: 400;
                            color: #FFFFFF;
                            float: right;
                        }
                    }
                }
            }
        }
    }
}




.screen-right-box {
    position: absolute;
    right: 0;
    top: 86px;
    width: 418px;
    height: 994px;
    background: rgba(11, 20, 36, 0.5);
    z-index: 99;
    transition: all 1s;
    // padding-left: 30px;
    // padding-right: 35px;

    .right-box {

        height: 100%;

        .road-info-box {
            display: flex;
            margin-left: 16px;

            // margin-left: 20px;
            .el-table .el-table__cell {
                padding: 0;
            }

            .title {
                display: flex;
                margin-bottom: 8px;

                img {
                    height: 20px;
                    margin-right: 5px;
                }

                span {

                    font-family: MicrosoftYaHei-Bold;
                    font-weight: 700;
                    font-size: 14px;
                    color: #EEF9FF;
                }

                em {
                    flex: 1;
                    text-align: right;
                    font-size: 10px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #778FA4;
                    padding-top: 5px;
                }

            }

            .event-info-box {
                flex: 1;
                display: flex;

                img {
                    width: 65px;
                    height: 52px;
                }

                .evt-menu-box {
                    flex: 1;
                    margin: 0 16px;
                    display: flex;
                    justify-content: space-between;

                    li {
                        line-height: 52px;

                        span {
                            font-family: MicrosoftYaHei;
                            font-size: 14px;
                            color: #BAD6E6;
                        }

                        b {
                            font-family: DINPro-Bold;
                            font-weight: 700;
                            font-size: 22px;
                            color: #FF7E2B;
                        }

                    }
                }

                .report-box {
                    width: 335px;
                    height: 43px;

                    background: linear-gradient(90deg, rgba(61, 109, 168, 0) 0%, rgba(10, 65, 121, 0.3) 100%);
                    position: absolute;
                    display: flex;
                    left: 25px;

                    li {
                        display: flex;
                        margin-top: 8px;

                        p {
                            // width: 95px;
                            height: 19px;
                            background: rgba(28, 197, 253, 0.2);
                            border: 1px solid #1CC5FD;
                            border-radius: 2px;
                            padding: 0 9px;

                            span {
                                font-size: 12px;
                                font-family: PingFang SC;
                                font-weight: 400;
                                color: #FFFFFF;
                                margin-left: 6px;
                                display: inline-block;
                            }
                        }

                        b {
                            font-size: 20px;
                            font-family: DIN;
                            font-weight: 400;
                            color: #FFFFFF;
                            margin-left: 9px;
                        }

                        em {
                            font-size: 12px;
                            font-family: PingFang SC;
                            font-weight: 400;
                            color: #FFFFFF;
                            line-height: 30px;
                            text-shadow: 2px 3px 8px rgba(0, 90, 255, 0.56);
                        }
                    }

                    li:first-child {
                        margin-left: -15px;
                        margin-right: 15px;
                    }
                }

                .chart,
                .bg {
                    width: 100%;
                    height: 100%;
                }

                .bg {
                    position: absolute;
                    bottom: 0px;
                    left: 50%;
                    z-index: -1;
                    width: 159px;
                    height: 69px;
                    background: no-repeat center;
                    background-image: url(../assets/image/bdh/pie.png);
                    background-size: 100% 100%;
                    transform: translateX(-50%);

                    .bg-gif {
                        width: 100%;
                        height: 100%;
                        background: no-repeat center;
                        background-image: url(../assets/image/bdh/pie-gif.png);
                        background-size: 100% 100%;
                    }
                }

            }

            .equ-list-box {
                width: 386px;
                background: #162135;

                ul {
                    display: flex;
                    padding: 0 16px;
                    height: 42px;
                    background: #2B384F;
                    margin-bottom: 2px;

                    li {
                        flex: 1;
                        font-family: MicrosoftYaHei;
                        font-size: 14px;
                        color: #E2EDF2;
                        letter-spacing: 0;
                        line-height: 42px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                    li:last-child {
                        flex: 0.2;
                    }
                }

                .list {
                    height: 190px;
                    position: relative;

                    ul {
                        cursor: pointer;
                    }

                    ul:nth-child(odd) {
                        background: #1E2A40;
                        /* 奇数行背景色 */
                    }

                    ul:nth-child(even) {
                        background: none;
                        /* 奇数行背景色 */
                    }

                }
            }

            .war-evt-list {
                flex: 1;


                .evt-timeline-box {

                    ul {
                        width: 354px;
                        height: 96px;
                        padding: 0 16px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-evenly;

                        li {

                            span {
                                font-family: MicrosoftYaHei;
                                font-size: 12px;
                                color: #597794;
                            }

                            img {
                                width: 14px;
                                height: 14px;
                                margin-right: 4px;
                            }

                            b {
                                font-family: MicrosoftYaHei;
                                font-size: 14px;
                                color: #E2EDF2;
                            }
                        }
                    }

                    ul:nth-child(odd) {
                        background: #1E2A40;
                        /* 奇数行背景色 */
                    }

                    ul:nth-child(even) {
                        background: none;
                        /* 奇数行背景色 */
                    }
                }
            }

            .acc-list {
                flex: 1;
                margin-right: 34px;

                p {
                    width: 155px;
                    height: 34px;
                    font-size: 12px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;
                    text-shadow: 0px 1px 1px rgba(2, 35, 78, 0.69);
                    text-align: center;
                    line-height: 34px;
                }

                .add {
                    background: url(../assets/image/bdh/add.png) no-repeat;
                }

                .avg {
                    background: url(../assets/image/bdh/avg.png) no-repeat;
                }

                li {
                    background: url(../assets/image/bdh/add1-gif.png) no-repeat;
                    width: 145px;
                    height: 96px;

                    margin-top: 32px;
                    display: flex;

                    span {
                        font-size: 20px;
                        font-family: DIN;
                        font-weight: 400;
                        color: #F2F4FF;
                        text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.47);
                        flex: 1;
                        display: block;
                        margin-top: -19px;
                        text-align: right;
                        margin-right: 15px;
                    }

                    em {
                        display: block;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #FFFFFF;
                        flex: 1;
                        margin-top: -14px;

                        text-shadow: 2px 3px 8px rgba(0, 90, 255, 0.56);
                    }
                }

                .avg1 {
                    background: url(../assets/image/bdh/avg1-gif.png) no-repeat;
                }

            }

            .traffic-evt {
                background: url(../assets/image/bdh/t-evt.png) 100% 100%;
                width: 354px;
                height: 184px;
                position: relative;

                li {
                    padding-left: 96px;
                    position: absolute;

                    span {
                        font-size: 14px;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #FFFFFF;
                    }

                    b {
                        font-size: 14px;
                        font-family: DIN;
                        font-weight: 400;
                        color: #FFFFFF;

                    }

                    em {
                        font-size: 12px;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #FFFFFF;
                        line-height: 30px;
                        text-shadow: 2px 3px 8px rgba(0, 90, 255, 0.56);
                    }
                }
            }

            .el-input__inner {
                background: none;
                border: none;
                color: #14EBFF;
                text-align: right;
                padding-right: 0;
            }

            .el-input__suffix {
                display: none;
            }

            .el-input__inner::placeholder {
                color: #14EBFF;
            }


        }
    }
}

.evt-video-box {
    // height: 204px;
    width: 386px;
    // margin-bottom: 20px;
    position: relative;

    .el-form-item__content {
        background: #16386a;
        text-align: right;

        button {
            display: none;
        }
    }

    video {
        // min-height: 204px;
    }

    label {
        display: block;
        position: absolute;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: rgba(255, 255, 255, .6);
        top: 90px;
        line-height: 15px;
        text-align: center;
        left: 10px;

        cursor: pointer;
        z-index: 99;

        i {
            color: #fff;
            font-weight: 800;
        }
    }

    video {
        width: 100%;
        // height: 147px;
        background: #000;
    }

    img {
        width: 100%;
        height: 147px;
    }

    .video-bar {
        width: 100%;
        height: 30px;
        line-height: 30px;
        background: #000;

        b {
            display: inline-block;
            width: 100px;
            background: #1A4F8F;
            text-align: center;

            font-size: 18px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            opacity: 0.85;
        }

        span {
            font-size: 12px;
            font-family: Helvetica;
            font-weight: 400;
            color: #fff;
        }
    }
}

.screen-bottom {
    position: absolute;
    height: 46px;
    width: 639px;
    left: 50%;
    transform: translateX(-50%);
    top: 1034px;
    background: url(../assets/image/bdh/bottom.png) no-repeat;
    z-index: 99;
    display: flex;
    justify-content: center;
    img {
        cursor: pointer;
    }
}

.tool-box {

    position: absolute;
    height: 46px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    bottom: 12px;
    z-index: 999;

    li {
        cursor: pointer;
        width: 129px;
        height: 42px;
        margin-right: 24px;
        background: url(../assets/image/bdh/nav.png) no-repeat;
        text-align: center;
        line-height: 42px;
        transition: all 1s;

        span {
            font-family: MicrosoftYaHei-Bold;
            font-weight: 700;
            font-size: 14px;
            color: #ECF7FF;
            letter-spacing: 0;

        }

    }

    .active {
        background: url(../assets/image/bdh/nav-active.png) no-repeat;
    }
}

.title-box {
    width: 418px;
    height: 36px;
    background-image: linear-gradient(90deg, rgba(22, 41, 69, 0.68) 0%, rgba(35, 59, 103, 0) 100%);
    line-height: 36px;

    b {
        float: right;
        margin-right: 18px;
        font-family: MicrosoftYaHei;
        font-size: 12px;
        color: #14EBFF;
        cursor: pointer;
    }

   
    .title-box-gif {
        width: 400px;
        height: 32px;
        position: absolute;
        background: url(../assets/image/bdh/title-gif.png) no-repeat;
        top: 10px;
       
    }

    .sub-title {
        font-family: MicrosoftYaHei-Bold;
        font-weight: 700;
        font-size: 18px;
        color: #EEF9FF;
        letter-spacing: 0;
        margin-left: 10px;
    }
}


// 秦皇岛截止
.track-tool-bar {
    position: absolute;
    bottom: 602px;
    right: 20px;
    z-index: 199;
    width: 120px;
    background: url(../assets/image/screen/4k/tool-box.png);
    background-size: 100% 100%;

    .tool-bar-date {
        position: absolute;
        background: url(../assets/image/screen/4k/date.png);
        background-size: 100% 100%;
        height: 86px;
        width: 398px;
        padding: 30px;
        position: absolute;
        left: -475px;
        top: 72px;

        .end-time {
            line-height: 30px;
            color: #fff;
            width: 110px;
            white-space: nowrap;
        }

        .time-gry-box {

            margin-top: 20px;
        }
    }

    .tool-bar-person {
        position: absolute;
        background: url(../assets/image/screen/4k/date.png);
        background-size: 100% 100%;
        // height: 33px;
        width: 132px;
        padding: 30px;
        position: absolute;
        left: -209px;
        top: 360px;

        .el-radio {
            padding-right: 0;
            margin-right: 0;
        }
    }

    p {
        position: absolute;
        top: -50px;
        right: 0;
        white-space: nowrap;
        font-size: 12px;
    }

    li {
        margin-bottom: 10px;
        cursor: pointer;
        text-align: center;
       
    }

    .active {
      

        span {
            color: #22F4F1;
        }
    }

    img {
        display: block;
        width: 38px;
        height: 38px;
        margin: 12px auto;
    }

    span {
        display: inline-block;
        font-size: 12px;

        font-family: PingFang SC;
        font-weight: 500;
        color: #3EA4F9;
    }

}


.screen-tool-box {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    z-index: 99;
    background-image: linear-gradient(to left, #1d3c77, rgba(44, 73, 155, 0));
    padding: 27px 19px 0 0;
    width: 300px;


    .title {
        margin-top: 20px;

        span {

            font-size: 20px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            font-style: italic;
            color: #FFFFFF;
            margin-right: 10px;
        }

        b {
            font-size: 20px;
            color: #2BF2FC;
        }
    }

    .border {
        width: 100%;
        height: 2px;
        background: url(../assets/image/screen/right/border.png);
        margin: 8px 0;
    }

    .roster {
        li {
            padding: 0 13px;
            border-left: 3px solid #FFFFFF;
            margin-bottom: 29px;
        }

        span {
            margin-bottom: 3px;
            font-size: 18px;
            font-family: Adobe Heiti Std;
            font-weight: bold;
            color: #FFFFFF;
            display: block;
        }

        b {

            font-size: 20px;
            font-family: Adobe Heiti Std;
            font-weight: bold;
            color: #49E6F7;
        }
    }


}

.weather-box {
    font-size: 12px;
    position: absolute;
    transition: all 0.5s;
    left: 260px;
    right: 10px;

    bottom: 10px;
    z-index: 99;
    display: flex;

    // padding:0 10px;
    .weather-list {
        padding: 0 20px;
        background-image: linear-gradient(to top, #1d3c77, rgba(44, 73, 155, 0));
        flex: 1;
        position: relative;
        height: 460px;

        .el-radio {
            color: #fff;
            font-size: 14px;
        }

        .el-radio__label {
            font-size: 20px;
            line-height: 45px;
        }

        .el-radio__inner {
            width: 18px;
            height: 18px;
            line-height: 45px;
        }

        .el-radio__inner::after {
            width: 7px;
            height: 7px;
        }
    }
}

.rank-list {
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;

    .rank-list-th {


        background: #14365F;
        margin-bottom: 30px;
        height: 36px;


        li {
            font-size: 20px;

            line-height: 36px;
        }
    }

    .rank-list-tbody {
        flex: 1;
        position: relative;

        li {
            // line-height: 33px;
        }

        ul:nth-of-type(odd) {
            // background: #2B3559;
        }
    }

    ul {
        width: 100%;
        display: flex;
        cursor: pointer;
        margin-bottom: 20px;
    }

    .active {
        li {
            color: #1378E0;
        }

    }

    li {
        flex: 1;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        // line-height: 32px;


        span {
            display: inline-block;
            min-width: 60px;
        }
    }
}

.page-box {
    position: absolute;
    height: 40px;
    bottom: 0;
    left: 0;
    right: 0;

    .btn-prev,
    .btn-next {
        background: #14365F !important;
        border: 1px solid #3E495F !important;
        border-radius: 2px !important;
        color: #3E495F !important;

        span {
            min-width: 90px;
            font-size: 14px;
        }
    }

    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
        background: #14365F;
        border: 1px solid #B5B5B5;
        border-radius: 2px;
        font-size: 20px !important;
        width: 33px !important;
        height: 33px !important;
        line-height: 33px !important;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background: #14365F;
        border: 1px solid #fff;
        border-radius: 2px;
        color: #fff !important;
    }

    .el-pager li {
     
        margin: 0 2px !important;
    }
}

.consult-list {
    width: 70%;
    float: right;
    height: 100%;
    display: flex;
    flex-flow: wrap;
    justify-content: space-between;
    align-items: center;

    .legend {
        width: 100%;

        li {
            overflow: hidden;

            i {
                float: left;
                width: 14px;
                height: 14px;

                margin-top: 10px;
                border-radius: 50%;
            }

            span {
                float: left;
                font-size: 20px;
                font-family: PingFang SC;
                font-weight: 600;
                color: #FFFFFF;
                overflow: hidden;
                height: 40px;
                text-overflow: ellipsis;
                margin-left: 10px;
                white-space: nowrap;
            
            }

            b {
                float: right;
                font-size: 28px;
                font-family: DIN;
                font-weight: 400;
                color: #FFFFFF;
                margin-right: 8px;
            }

            em {
                float: right;
                font-size: 16px;
                line-height: 38px;
                font-family: PingFang SC;
                font-weight: 600;
                color: #ffffff;
                opacity: 0.8;
            }

        }

        p {
            width: 100%;
            height: 10px;
            background-color: #424971;

            span {
                display: block;
                height: 10px;
                background-color: #22F4F1;
            }
        }
    }

}

.index-echart-box {
    font-size: 28px;
    position: absolute;
    transition: all 0.5s;
    left: -40px;
    right: 20px;
    height: 414px;
    padding-bottom: 20px;
    bottom: 0;

    background-image: linear-gradient(to top, #0b2b5d 30%, rgba(13, 49, 104, 0.1));
    z-index: 88;

    .index-echart-type {
        display: flex;
        margin-bottom: 58px;

        .title-2 {
            line-height: 64px;
            margin: 0;
            margin-right: 48px;

        }



        img {
            width: 100%;
            flex: 1;
            height: 7px;
        }
    }



    .index-ect {
        height: 300px;
        overflow: hidden;
        display: flex;

        .ect {
            flex: 1;
        }

        .dir-type-box {
            width: 100px;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            margin-top: 40px;

            li {
                max-height: 44px;
                flex: 1;
                font-size: 26px;
                font-family: PingFang SC;
                font-weight: 400;
                color: #FFFFFF;

                opacity: 0.5;
                cursor: pointer;
            }
        }

        .date-type-select {
            position: absolute;
            font-size: 14px;
            top: 60px;
            right: 30px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #C1C1C1;

        }

        .select-title {
            float: left;
            margin-right: 20px;
        }

        .el-input,
        .el-select {
            width: 80px;
        }

        .el-input__inner {
            height: 20px;
            font-size: 12px;
            color: #5498E4;
            width: 80px;
            border-color: #5498E4;
        }

        .el-select .el-input .el-select__caret {
            color: #5498E4;
            font-size: 12px;
            line-height: 20px;
        }

        .unit {
            float: right;
            margin-left: 30px;
        }
    }
}

// .type-box {
//     padding: 2px;
//     display: flex;
//     width: 720px;
//     height: 58px;
//     background: rgba(26, 39, 95, 0.45);
//     border: 2px solid #2E94E1;
//     border-radius: 6px;
//     margin-right: 48px;

//     li {
//         cursor: pointer;
//         flex: 1;
//         font-size: 26px;
//         font-family: PingFang SC;
//         font-weight: bold;
//         color: #FFFFFF;
//         line-height: 58px;
//         text-align: center;
//     }

//     .active {
//         background: #166DC7;
//         // border: 1px solid #00B4FF;
//         // border-radius: 2px;
//     }
// }

.title-1 {
    background-image: url(../assets/image/screen/4k/title-1.png);
    width: 244px;
    height: 64px;
    line-height: 70px;
    text-align: center;

    span {
        font-size: 36px;
        font-family: PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        opacity: 0.95;

    }
}

.title-2 {
    min-height: 45px;
    display: flex;
    overflow: hidden;
    margin: 40px 0;

    .p1 {
        min-width: 300px;
    }

    .p2 {
        min-width: 150px;
    }

    span {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        white-space: nowrap;
    }

    img {
        width: 573px;
        height: 15px;
        margin-top: 14px;
        margin-left: 28px;
    }

    .icon {
        display: inline-block;
        margin: -3px 5px;
        font-size: 32px;
    }

    .btn {
        cursor: pointer;
        flex: 1;
    }

    .btnActive {
        color: #1378E0;
    }


}


.event-video-box {
    position: fixed;
    top: 94px;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    padding-top: 45px;
    background: rgba(0, 0, 0, .5);
    z-index: 3999;
    justify-content: center;
    align-items: center;


    .event-video-box-close {
        font-size: 30px;
        font-weight: 600;
        position: absolute;
        top: 50px;
        right: 20px;
        cursor: pointer;
        color: #11BFFF;
        z-index: 999;
    }
}

.video-bg {
    background: url(../assets/image/screen/12k/video-bg.png) no-repeat;
    width: 400px;
    background-size: 100% 100%;
    padding: 22px;

    p {
        font-size: 18px;
        padding: 10px 0;
        overflow: hidden;

        span {
            float: left;
            color: #fff;
        }

        b {
            float: right;
            font-size: 26px;
            color: #41fdfc;
            cursor: pointer;
            font-weight: normal;

        }
    }

    video {
        width: 400px;
    }
}

.alarm-info-box {
    background-image: linear-gradient(to bottom, #cb3e46, #ca2b32);
    border: 2px solid #000;
    padding: 20px;
    border-radius: 10px 0 0 0;

    p {
        overflow: hidden;
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 2px solid #000;

        span {
            display: inline-block;
            width: 80%;
            text-align: center;
            font-size: 14px;

        }

        b {
            float: right;
            font-weight: 800;
            font-size: 14px;
            cursor: pointer;
        }
    }

    li {
        overflow: hidden;
        line-height: 40px;
    }

    .button-box {
        display: flex;
        justify-content: center;
        margin: 20px 0 30px 0;

        li {
            width: 120px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-radius: 6px;
            border: 2px solid #000;
            background: #fff;
            color: #000;
            margin-right: 50px;
            cursor: pointer;
        }
    }

    video {
        width: 800px;
    }
}

.select-box {
    margin-right: 20px;
    width: 100px;
}
</style>
