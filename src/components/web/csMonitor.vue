<template>
    <div class="box cross-valuate-box" :class="cs?'cs-cross-valuate-box':''">
        <track-play :crossData="crossData" ref="trackPlayBox"></track-play>
        <div class="cityindex-info-box" style="display: flex;width:auto;left:20px;right: 20px;">
            <div class="info-count-box">
                <p class="count-title count-title-cs"><span>拥堵指数</span></p>
                <p class="count">{{crossStat.congestionIndex}}</p>
            </div>
            <div class="info-count-box" style=" margin-left:15px;margin-right: 15px;">
                <p class="count-title count-title1 count-title-cs"><span>失衡指数</span></p>
                <p class="count count1">{{crossStat.unbalanceIndex}}</p>
            </div>
            <div class="info-count-box">
                <p class="count-title count-title2 count-title-cs"><span>溢出指数</span></p>
                <p class="count count2">{{crossStat.spilloverIndex}}</p>
            </div>
        </div>
        <div class="box list-right-box" style="width:auto;left:0;right:0;top:165px;bottom: 150px;">
            <p class="chart-box-title">
                <span>
                    <i class="el-icon-stopwatch"></i>
                    <span>车道指标</span>
                </span>
                <span style="float: right;font-size: 14px;cursor: pointer;" @click="laneListShow=false"><i class="el-icon-close" style="font-weight: 800;"></i></span>
            </p>
            <div style="overflow: hidden;">
                <el-select v-model="rid" placeholder="请选择" style="margin-top: 10px;float: left;width:180px;" @change="getRidLaneFlow">
                    <el-option v-for="item in ridList" :key="item.rid" :label="item.dir+'-'+item.direction" :value="item.rid">
                    </el-option>
                </el-select>
                <el-select v-model="time" placeholder="请选择" style="margin-top: 10px;float: right;width:180px;">
                    <el-option v-for="item in times" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
            </div>
            <div class="chart-box-content1 chart-box-content-list">
                <ul v-show="laneNames.length>0" class="lane-list-th">
                    <li style="flex:1.5;">指标名称</li>
                    <li v-for="item in laneNames">{{item}}</li>
                </ul>
                <div class="lane-list" v-show="laneNames.length>0" style="position: absolute;left: 10px;right: 0;top: 100px;bottom: 0;" v-anyNameYouLike>
                    <ul v-for="m in laneDatas[time]">
                        <li style="flex:1.5;">{{m.name}}</li>
                        <li v-for="v in m.list">{{v.toFixed(2)}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="box box-toggle" @click="laneListShow=true;" style="top: 170px;" :style="'right:'+(laneListShow?'-500px':'20px;')">
            <p class="chart-box-title">
                <span>
                    <i class="el-icon-stopwatch"></i>
                    <span>车道指标</span>
                </span>
            </p>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import http from '@/api/http';

const { SERVICE_URL, WEBSOCKET_URL } = window.APP_CONFIG;


import trackPlay from './trackPlay.vue';

export default defineComponent({

    components: {
        trackPlay
    },
    data() {
        return {
            cs: cs,
            ridList: [],
            rid: '',
            laneNames: [],
            laneDatas: [],
            laneListShow: true,
            crossData: {},
            times: [{
                name: '实时',
                key: 'datas'
            }, {
                name: '1分钟',
                key: '1min'
            }, {
                name: '5分钟',
                key: '5min'
            }, {
                name: '15分钟',
                key: '15min'
            }],
            time: 'datas',
            crossStat: ''


        }
    },
    watch: {

    },
    created() {
        this.crossData['crossId'] = this.$route.query.crossId
        this.crossData['crossName'] = this.$route.query.crossName

        this.startTime = this.mapUtils.getDateYMD('ymdhm');

        this.endTime = this.mapUtils.getDateYMD('ymdhm') + ':00';
    },
    mounted() {
        this.getCrossRidInfo()
        // this.trackPlayLoad();
        this.openInterval()
    },
    unmounted() {
        clearInterval(this.invt);
        this.invt = null;
    },
    beforeUnmount() {


        clearInterval(this.invt);
        this.invt = null;
    },
    methods: {

        trackPlayLoad() {
            this.$nextTick(function() {

                this.$refs.trackPlayBox.initMap()

            });
        },
        openInterval() {
            this.invt = setInterval(() => {
                this.getRidLaneFlow();
                this.getCrossFlow()
            }, 1000 * 2)
        },

        cancelQuest() {
            if (typeof this.source === 'function') {

                this.source('终止请求'); //取消请求
            }
        },
        getMsgFlow(item) {
            this.laneList = [];
            var _this = this;
            var param = {
                rid: this.ridActive
            };

            http.get(WEBSOCKET_URL + '/cross/api/getMsgFlow?', {
                params: param,
                cancelToken: new http.CancelToken(function executor(c) {
                    _this.source = c;
                })
            }).then((data) => {

                this.laneList = data.data.data;



            })
        },
        getCrossRidInfo() {
            var _this = this;
            var param = {
                crossId: this.crossData.crossId,

            };

            http.get(SERVICE_URL + 'organize/getCrossRidInfo?', {
                params: param
            }).then((data) => {
                this.ridList = data.data.data;
                this.rid = data.data.data[0].rid;
                this.getRidLaneFlow()

            })
        },
        getRidLaneFlow() {
            const _this = this;

            var param = {
                crossId: this.crossData.crossId,
                rid: this.rid

            }

            http.get(WEBSOCKET_URL + '/cross/api/getRidLaneFlow?', { params: param }).then((data) => {
                this.laneNames = data.data.laneNames;
                this.laneDatas = data.data;

            })
        },
        getCrossFlow() {
            const _this = this;

            var param = {
                crossId: this.crossData.crossId


            }

            http.get(WEBSOCKET_URL + '/cross/api/getCrossFlow?', { params: param }).then((data) => {

                this.crossStat = data.data.data;

            })
        },
        unique(arr) {
            return Array.from(new Set(arr))
        },
        ridClick(item) {

            if (this.ridActive == item.rid) {
                this.ridActive = '';
                this.rids = ''
                this.laneList = []
                this.ridList.forEach(item => {
                    if (item.inOutType == this.crossNav) {
                        this.rids += item.rid + ','
                    }

                })
                this.rids = this.rids.substr(0, this.rids.length - 1)
                this.getMsgFlow()
            } else {
                this.ridActive = item.rid;
                this.getMsgFlow()
                this.rids = item.rid;
            }

            this.$refs.trackPlayBox.openSend();
        },

    }

});
</script>
<style scoped>
.list-right-box {
    width: 400px;
    position: absolute;
    right: 20px;
    top: 70px;
    /*height: 580px;*/
    padding: 10px;
    z-index: 99;
    /* display: flex;
    flex-direction: column;*/
}

.lane-list {
    cursor: pointer;
}

.lane-list ul:nth-child(2n) {
    background: rgba(42, 52, 56, .7);
}

.lane-list li {
    text-align: left;
}

.lane-list-th li {
    text-align: left;
}

.info-count-box {
    flex: 1;

}

.count-title-cs {
    min-width: 50px;
}
</style>
