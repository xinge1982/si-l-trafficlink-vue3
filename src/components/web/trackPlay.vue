<template>
    <div class="crossInfo">
        <div class="play_box" style="left:20px;right: 20px;width: auto;">
            <div style="overflow: hidden;">
            </div>
            <div class="play_tool">
                <div class="play_btn_box">
                    <div @click="autoPlay()" style="width: 50px;">
                        <i :class="play?'el-icon-video-pause':'el-icon-video-play'"></i>
                        <b v-text="play?'暂停':'播放'" style="display: block;"></b>
                    </div>
                    <div style="width: 180px;">
                        <el-select @change="layerChange()" v-model="lays" multiple style="margin-top: 8px;" collapse-tags placeholder="图层选择">
                            <el-option v-for="item in mapLayers" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="width: 180px;">
                        <el-cascader placeholder="视频选择" style="float:left;" v-model="address" :options="dirList" :props="defaultProps" @change="videoUrlChange()">
                        </el-cascader>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import http from '@/api/http';

const { SERVICE_URL } = window.APP_CONFIG;
const CS_WEBSOCKET_URL = window.APP_CONFIG.CS_WEBSOCKET_URL
    ?? window.APP_CONFIG.WEBSOCKET_URL.replace(/^http/, 'ws');


var route = [],
    point = [],
    steps, counter, Intertime;
var size = 200;

export default defineComponent({

    props: ["crossData"],
    data() {
        return {
            checked: true,
            checked1: true,
            checked2: false,
            play: true,

            playBtn: true,


            crossStat: '',
            dirList: [],

            videoPlay: false,
            defaultProps: {
                children: 'children',
                label: 'name',
                value: 'key'
            },
            address: '',
            mapLayers: [{
                value: 1,
                label: '车辆号牌'
            }, {
                value: 2,
                label: '车辆轨迹'
            }, {
                value: 3,
                label: '标志杆'
            }, {
                value: 4,
                label: '高精地图'
            }, {
                value: 5,
                label: '栅格影像'
            }, {
                value: 6,
                label: '倾斜摄影'
            }],
            lays: csLayer,
            websocket: null


        }
    },

    created() {
        this.startTime = this.mapUtils.getDateYMD('ymdhm', -10) + ':00';
        this.endTime = this.mapUtils.getDateYMD('ymdhm') + ':00'
        this.creationWebsocket()

    },
    mounted() {

        this.getRealDirList()

    },
    watch: {

    },

    beforeUnmount() {

        clearInterval(this.invt);
        this.invt = null;
        this.closeWebsocket();

    },
    methods: {
        getRealDirList() {
            const _this = this;

            var param = {
                crossId: this.crossData.crossId,
                flag: cs ? 1 : 2


            }

            http.get(SERVICE_URL + 'cameraVideo/getRealDirList?', { params: param }).then((data) => {

                this.dirList = data.data.data;
                this.dirList.forEach(item => {
                    item.children.forEach(c => {
                        c.key = item.name + '/' + c.name + ',' + c.url
                    })

                })


            })
        },

        creationWebsocket() {
            const _this = this;

            this.closeWebsocket();
            if ('WebSocket' in window) {

                this.websocket = new WebSocket(CS_WEBSOCKET_URL);
            } else {
                alert('不支持 websocket')
            }

            this.websocket.onopen = function(event) {


                _this.layerChange()
            }
            this.websocket.onmessage = function(event) {


                // var res =  JSON.parse(event.data);

            }

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
                socket.close();
            }
        },
        openSend() {



        },
        autoPlay() {

            this.play = !this.play;

            var message = JSON.stringify({ "crossId": this.crossData.crossId, "type": "trackMonitorPlay", "isOpen": this.play, "realTrack": this.checked1 })
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.send(message);
            }
        },
        visibility() {
            var message = JSON.stringify({ "crossId": this.crossData.crossId, "type": "trackMonitorShowPlate", "value": this.checked })
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.send(message);
            }
        },
        visibility1() {
            var message = JSON.stringify({ "crossId": this.crossData.crossId, "type": "trackMonitorPlay", "isOpen": this.play, "realTrack": this.checked1 })
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.send(message);
            }
        },
        visibility2() {
            var message = JSON.stringify({ "crossId": this.crossData.crossId, "type": "trackMonitorShowDevice3D", "value": this.checked2 })
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.send(message);
            }
        },
        layerChange() {

            var obj = {
                trackMonitorShowPlate: this.arrIndexof(1),
                trackMonitorShowPath: this.arrIndexof(2),
                trackMonitorShowDevice3D: this.arrIndexof(3),
                trackMonitorShowHDMap: this.arrIndexof(4),
                trackMonitorShowTileImage: this.arrIndexof(5),
                trackMonitorShowTiltPhoto: this.arrIndexof(6)


            }
            var message = JSON.stringify({ "crossId": this.crossData.crossId, "type": "layer", "layer": obj })
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.send(message);
            }
        },
        arrIndexof(val) {
            if (this.lays.indexOf(val) > -1) {
                return true
            } else {
                return false
            }
        },
        videoUrlChange() {
            var arr = this.address[1].split(',');

            this.videoPlay = !this.videoPlay;
            var message = JSON.stringify({ "crossId": this.crossData.crossId, "type": "videoPlay", "channels": this.dirList, "name": arr[0], "url": arr[1] })
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.send(message);
            }
        },
        start() {

            if (!this.address[1]) {
                this.$message({
                    message: '请选择视频通道',
                    type: 'warning'
                });
                return
            }

        }


    },

});
</script>
<style scoped>
.crossInfo {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0;


}

.crossInfo_content {
    width: 100%;
    height: 100%;
}

.crossInfo_header {
    width: 100%;
    line-height: 35px;
    border-bottom: 1px solid rgb(55, 59, 88);
    background: rgba(13, 20, 27, 0.7);
    position: absolute;
    top: -1px;
    left: 0;
    z-index: 1000;
    /* text-align: center */
}

.crossInfo_header span {
    margin-left: 20px;
    font-size: 14px;
    color: #fff;
}

.crossInfo_header em {
    float: right;
    margin-right: 15px;
    font-size: 20px;
    font-weight: normal;
    cursor: pointer;
}

.roadMap {
    width: 100%;
    height: 100%;

}

.crossInfo_left {
    width: 320px;
    position: absolute;
    bottom: 22px;
    left: 20px;
    border: 1px solid #3767a4;
    background: rgb(36, 49, 62, 0.66);
    padding: 0 8px 11px 8px;
    z-index: 100;
    height: 28%;
}

.crossInfo_left ul {
    height: 100%;
}

.crossInfo_left li {
    float: left;
    width: 48%;
    height: 46%;
    margin-top: 8px;
    border: 1px solid #4bffff;
}

.crossInfo_left li:nth-child(2n) {
    margin-left: 2.5%;
}

.crossInfo_left li img {
    width: 100%;
    height: 100%;
}

.crossInfo_left li span {
    height: 100%;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
}

.crossInfo_left_tit {
    width: 10%;
    margin: 0 auto;
    line-height: 23px;
    text-align: center;
}

.crossInfo_left_img {
    width: 87%;
}

.play_box {
    position: fixed;
    right: 20px;
    bottom: 22px;

    z-index: 1000;
    width: 500px;
    padding: 10px;

}

.play_tool {
    margin-top: 10px;
    border: 1px solid #7a7e84;
    width: 100%;
    height: 45px;
    overflow: hidden;
    padding: 10px 0;
}

.play_tool p {
    padding: 10px 15px;
    float: left;
}

.play_btn_box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
}

.play_btn_box li {
    padding-top: 3px;
    margin: 0 10px 0 5px;
    /*flex:1;*/
    text-align: center;
    border-radius: 3px;
    line-height: 20px;
    cursor: pointer;
}

.play_btn_box i {
    font-size: 20px;
}

.play_line {

    height: 5px;
    background: #fff;
    position: absolute;
    bottom: 30px;
    left: 15px;
    right: 15px;
    border-radius: 5px;
}

.play_line i {
    position: absolute;
    top: -18px;

    font-size: 22px;
    color: #366692;
}

.play_line span {
    position: absolute;
    top: -27px;
}

.crossInfo_right {
    width: 320px;
    position: absolute;
    top: 43px;
    right: 60px;
    border: 1px solid #3767a4;
    background: rgb(36, 49, 62, 0.66);
    border-radius: 5px;
    z-index: 100;
    border-bottom: none;
}

.line_box {

    height: 150px;
    position: fixed;
    right: 60px;
    bottom: 100px;
    background: rgb(36, 49, 62, 0.66);
    z-index: 1000;
    width: 500px;
    border-radius: 5px;
}

.crossInfo_right li {
    line-height: 35px;
    border-bottom: 1px solid #3767a4;
    display: flex;
}

.crossInfo_right b {
    flex: 1;
    border-right: 1px solid #3767a4;
    text-align: center;
}

.crossInfo_right span {
    flex: 3;
    padding-left: 12px;
}

.laneInfo {
    left: 20px;
    right: auto;
    height: 288px;
    width: 570px;
    position: absolute;
    top: 43px;
    right: 60px;
    border: 1px solid #3767a4;
    background: rgb(36, 49, 62, 0.66);
    border-radius: 5px;
    z-index: 100;

}

.laneInfo ul {
    display: flex;
    border-bottom: 1px solid #3767a4;
    padding-left: 15px;
}

.laneInfo ul li {
    flex: 1;
    line-height: 35px;
    text-align: left;
}

.vehicle-info {
    position: absolute;
    width: 220px;
    /* height: 400px;*/
    left: 20px;
    bottom: 40px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    z-index: 2000;
    transition: all 0.8s;
}

.vehicle-info-list {
    flex: 1;
    margin-top: 10px;
}

.vehicle-info-list li {
    display: flex;
    padding: 8px 0;
}

.vehicle-info-list li:nth-child(2n) {
    background: rgba(42, 52, 56, .7);

}

.vehicle-info-list b {
    width: 75px;
    min-width: 60px;
}

.vehicle-info-list span {
    flex: 1;
}
</style>
