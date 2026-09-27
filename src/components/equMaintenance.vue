<template>
    <div>
        <div class="main" style="z-index: 99;">
            <div style="flex:1;padding: 30px 40px;display: flex;flex-direction: column;">
                <div class="event-title">
                    <span>设备运维</span>
                    <i class="el-icon-close" @click="$parent.isequMaintenance=false"></i>
                </div>
                <div class="ect-select-box">
                    <div class="ect-select">
                        <span class="title">类型</span>
                        <el-select v-model="devType" @change="deviceList()">
                            <el-option  :key="''" :label="'全部'" :value="''">
                            </el-option>
                            <el-option v-for="item in devTypes" :key="item.deviceType" :label="item.deviceTypeName" :value="item.deviceType">
                            </el-option>
                        </el-select>
                    </div>
                    <!--  <el-button type="primary" size="mini" :loading="loading" @click="page=1,deviceList()">查询</el-button> -->
                </div>
                <div style="flex:1;margin-top: 20px;position: relative;">
                    <track-playback :options="trackoptions" :crossData="vehicleData" ref="playBack" @parentMethod="loadMap()"></track-playback>
                    <div class="event-mon-box">
                        <div class="event-list">
                            <el-table v-if="equList" :data="equList.data" style="width: 476px;margin-top: 10px;background: none;font-size: 12px;" :height="500" :max-height="500" :header-row-class-name="'list-header'" :row-class-name="setRowClass" @row-click="rowClick">
                                <el-table-column v-for="(item,i) in equList.title" :label="item.label" :prop="item.prop" :key="i">
                                </el-table-column>
                                <el-table-column label="状态" width="60">
                                    <template #default="{ row }">
                                        <span :class="row.status === 1 ? 'status-online' : 'status-offline'">
                                            {{ row.status === 1 ? '在线' : '离线' }}
                                        </span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <!--  <div class="page-box">
                            <el-pagination small layout=" prev, pager, next" :total="total" @current-change="currentChange" :current-page="page" :page-size="pageSize">
                            </el-pagination>
                        </div> -->
                    </div>
                    <div class="equ-info">
                        <span v-for="item in equIndex">{{item.name+'：'+item.value}}</span>
                        
                    </div>
                    <div class="event-mon-box" style="left: auto;right: 10px;width: 400px;" v-show="selectedRow">
                        <div class="ect-select-box" style="margin: 0 0 20px 0;">
                            <div class="ect-select">
                                <span class="title">开始时间</span>
                                <el-date-picker style="flex:1;max-width: 150px;" v-model="startTime" ttype="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1" placeholder="选择日期">
                                </el-date-picker>
                            </div>
                            <div class="ect-select">
                                <span class="title">结束时间</span>
                                <el-date-picker style="flex:1;max-width: 150px;" v-model="endTime" ttype="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions2" placeholder="选择日期">
                                </el-date-picker>
                            </div>
                        </div>
                        <div class="event-list">
                            <!-- <ul class="list-th">
                                <li v-for="(item,i) in qeuInfo.title" v-show="i<4">{{item.label}}</li>
                            
                            </ul>
                            <div class="list-tr-box" v-anyNameYouLike style="bottom:15px;">
                             
                                <ul class="list-tr" v-for="(item,index) in qeuInfo.data" :class="activeId==item.id?'active':''" @click="crossDataChange(item)">
                                    <li :title="item[t['prop']]" v-for="(t,n) in qeuInfo.title" v-show="n<4">{{item[t['prop']]}}</li>
                                </ul>
                            </div> -->
                            <el-table v-if="qeuInfo" :data="qeuInfo.data" style="width: 476px;margin-top: 10px;background: none;font-size: 12px;" :height="500" :max-height="500" :header-row-class-name="'list-header'" :row-class-name="'dir-row'" @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands">
                                
                                <!-- 展开行 -->
                                <el-table-column type="expand">
                                    <template  #default="{ row }">
                                      
                                        <el-table :data="row.metadata" style="width: 100%;background: none;font-size: 12px;" border>
                                            <el-table-column prop="name" label="名称" ></el-table-column>
                                            <el-table-column label="内容" width="260">
                                                <template #default="{ row }">
                                                    <img :src="'data:image/jpeg;base64,'+row.value" alt="" v-if="row.name=='图片'" >
                                                    <span v-if="row.name!=='图片'">{{row.value}}</span>
                                                </template>

                                            </el-table-column>
                                        </el-table>
                                        
                                    </template>
                                </el-table-column>
                                <el-table-column v-for="(item,i) in qeuInfo.title" :label="item.label" :prop="item.prop" :key="i">
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="page-box">
                            <el-pagination small layout=" prev, pager, next" :total="total" @current-change="currentChange" :current-page="pageNum" :page-size="pageSize">
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

const { SERVICE_URL_v2, DEVICESERVICE_URL } = window.APP_CONFIG;


import protobuf from "protobufjs";
var AwesomeMessage, buffer, websocket;
protobuf.load("static/carTrackObj.proto", function(err, root) {
    if (err)
        throw err;


    AwesomeMessage = root.lookupType("crossserverpb.CarTrack");


});
import trackPlayback from './trackPlayback.vue';
import FlvJs from './video/FlvJs.vue'
defineOptions({

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
            pageSize: 5,
            pageNum: 1,
            trackList: [],
            trackTitles: [],
            countType: 1,
            accidentData: '',
            plateNumber: '',
            eventtypes: '',
            devTypes: [],
            devType: '',

            location: '',
            locationList: [],
            equList: {

                "title": [{
                        "label": "名称",
                        "prop": "deviceName"
                    },
                    {
                        "label": "桩号",
                        "prop": "roadSegmentStakeCode"
                    },
                    {
                        "label": "地址",
                        "prop": "deviceIp"
                    }

                ],
                "data": []
            },
            deviceId: null,
            qeuInfo: {
                "title": [{
                    "label": "时间",
                    "prop": "time"
                }],
                "data": []
            },
            equIndex:[],
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
            datetype: this.mapUtils.getDateYMD('ymd', -60 * 24 * 7) + ',' + this.mapUtils.getDateYMD('ymd'),
            date: '',
            videoRid: '',
            videoId: '',
            expands: [], //只展开一行放入当前行id
            getRowKeys(row) {

                return row.dataId
            },
            selectedRow: '',
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
        // this.getLocationList()

        this.deviceTypeList()
    },
    unmounted() {


    },
    beforeUnmount() {

    },
    watch: {


    },
    methods: {

        expandChange(row, expanded) {

            if (expanded.length) { //说明展开了
                this.expands = [];
                if (row) {
                    this.expands.push(row.dataId); //只展开当前行id
                    // if (!!row.child && row.child.length > 0) {
                    //     this.row = row;
                    //     this.getEvaluateDetail()
                    // }
                }
            } else { //说明收起了
                this.expands = [];
                this.row = '';
                // this.getEvaluateDetail()
            }

        },
        setRowClass({ row, rowIndex }) {
            // 判断是否为选中行，给选中行添加 'highlight-row' 类
            return this.selectedRow.id === row.id ? 'highlight-row' : '';
        },
        // 行点击事件，记录点击的行
        rowClick(row) {
            this.selectedRow = row;
            this.devicdeviceDataeList()
        },

        loadMap() {


        },
        deviceTypeList() {

            fetch(DEVICESERVICE_URL + 'api/deviceType/list', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pageSize: 1000, pageNum: 1 })
            }).then(res => res.json()).then(json => {
                this.devTypes = json.data;
                // this.devType = json.data[0].deviceType;
                this.deviceList()
                
            })
        },
        deviceList() {
            this.stats()
            fetch(DEVICESERVICE_URL + 'api/device/list', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ deviceType: this.devType, pageNum: 1 })
            }).then(res => res.json()).then(json => {
                console.log(json)
                this.equList.data = json.data;
                this.selectedRow = this.equList.data[0];
                if (json.data.length>0) {
                    this.devicdeviceDataeList()
                }
                
                var map = this.$refs.playBack.roadMap;
                var features = [],
                    xys = [];
                map.removeLayerAndSource('camera-point')
                this.equList.data.forEach((item, i) => {
                    var obj = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [item.lon, item.lat]
                        },
                        "properties": item
                    };

                    features.push(obj)
                    xys.push([item.lon, item.lat]);
                });



                var options = {
                    maps: map,
                    features: features,
                    id: 'camera-point',
                    iconImg: 'icon-camera-1',
                    iconSize: 0.5,
                    textHaloColor: '#fff',
                    textColor: '#fff',

                }
                this.mapUtils.addgeojsonPoint(options);
                var _this = this;
                map.on('click', 'camera-point', function(event) {
                    var item = event.features[0].properties;
                    _this.rowClick(item)
                });
                this.mapUtils.setBestMap(xys, { maps: map, left: 400, right: 400, maxZoom: 24 })
            })
        },
        devicdeviceDataeList() {
            fetch(DEVICESERVICE_URL + 'api/deviceData/list', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    deviceId: this.selectedRow.deviceId,
                    beginTime: this.startTime + ' 00:00:00',
                    endTime: this.endTime + ' 23:59:59',
                    pageSize: this.pageSize,
                    pageNum: this.pageNum
                })
            }).then(res => res.json()).then(json => {
               
                this.qeuInfo.data = json.data
                this.total = json.total;
            })
        },
        stats() {
            fetch(DEVICESERVICE_URL + 'api/device/stats', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    deviceType: this.devType
                })
            }).then(res => res.json()).then(json => {
               this.equIndex = json.data;
                console.log(json)
            })
        },

        currentChange(val) {
            this.pageNum = val;
            this.devicdeviceDataeList()
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

});
</script>
<style lang="scss">
.el-table .highlight-row {
    background: #0d3053;
}

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: auto;
    color: #c0c4cc;
    font-size: 12px;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}

.el-form-item__content {
    font-size: 12px;
    color: #c0c4cc;
}

/* 离线样式 */
.status-offline {
    color: red;

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

.equ-info {
    position: absolute;
    top: 10px;
    height: 35px;
    background: rgba(12, 44, 103, .4);
    z-index: 99;
    left: 430px;
    right: 480px;
    text-align: center;
    line-height: 35px;

    span {
        display: inline-block;
        margin-right: 10px;
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
                flex: 1.2;
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
                    flex: 1.2;
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
