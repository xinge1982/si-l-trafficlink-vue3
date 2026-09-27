<template>
    <div class="component-box">
        <div class="main">
            <div class="alarm-table">
                <div class="header">
                    <h3 class="">{{type=='fireAlarm'?'火灾报警监测列表':'设备报警监测列表'}}</h3>
                    <i @click="$parent.alarmTableType=null">x</i>
                </div>
                <div style="display: flex;height: 680px;margin-top: 20px;">
                    <div style="flex:1;max-width:1200px; position: relative;">
                        <div class="alarm-select-box">
                            <div class="ect-select" v-for="item in selects.type">
                                <span class="title">{{item.title}}</span>
                                <el-select v-model="selects.keys[item.key]" @change="change()" v-if="item.type=='select'">
                                    <el-option v-for="item in item.data" :key="item.value" :label="item.name" :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-input v-model="selects.keys[item.key]" placeholder="回车搜索" v-if="item.type=='input'" @keydown="inputKeydown"></el-input>
                            </div>
                            <div class="ect-select">
                                <span class="title">开始时间</span>
                                <el-date-picker style="flex:1;min-width: 120px;" v-model="startTime" ttype="date" value-format="yyyy-MM-dd" placeholder="选择日期" @change="change()">
                                </el-date-picker>
                            </div>
                            <div class="ect-select">
                                <span class="title">结束时间</span>
                                <el-date-picker style="flex:1;min-width: 120px;" v-model="endTime" ttype="date" value-format="yyyy-MM-dd" placeholder="选择日期" @change="change()">
                                </el-date-picker>
                            </div>
                        </div>
                        <el-table v-if="tableData" :data="tableData.data.resultList" style="background: none;max-width: 1200px;" :max-height="580"  border :header-row-class-name="'list-header'" :row-class-name="tableRowClassName"  :row-style="selectedstyle"  @row-click="rowClick" >
                         <el-table-column style="cursor: pointer;" v-for="item in tableData.title" :label="item.label" :prop="item.prop" :key="item.prop" v-if="!item.button" :width="item.label=='设备编号'?'350':item.label.indexOf('时间')>-1?'170':''">
                            </el-table-column>
                            <el-table-column label="操作" width="100" v-for="item in tableData.title" :label="item.label" :key="item.prop" v-if="item.button">
                                <template #default="scope">
                                    <el-button type="text" size="small" @click.stop="handleClick(scope.row)">{{scope.row.operate}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="page-box">
                            <el-pagination small background layout=" prev, pager, next" :total="evtTotal" @current-change="currentChange" :current-page="page" :page-size="pageSize">
                            </el-pagination>
                        </div>
                    </div>
                    <div class="map-video-box">
                        <div class="alarm-map" id="aMap"></div>
                        <div class="alarm-video-box">
                            <div class="alarm-video-info">
                                <li >
                                    <span class="button" >历史视频</span>
                                    <b style="float: left;transform: scale(0.8);line-height: 27px;color: #409EFF;">点击表格查看历史视频</b>
                                    <span>{{rowData.facilityName}}</span>
                                </li>
                            </div>
                            <div style="text-align: right;" v-if="rowData.deviceType==2">
                                <span style="transform: scale(0.8);display: inline-block;color: #409EFF;cursor: pointer;"  v-if="videoUrl" @click="switchVideo()">切换视频</span>
                            </div>

                            <flv-js :address="videoUrl" ref="flvPlayer"></flv-js>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import http from '@/api/http';

const { SERVICE_URL, SERVICE_URL_v2 } = window.APP_CONFIG;

const assetModules = import.meta.glob('../assets/image/**/*', { eager: true, import: 'default' }) as Record<string, string>;
const assetUrl = (path: string): string => assetModules[path] ?? '';

import FlvJs from './video/FlvJs.vue'
defineOptions({
    props: ['type'],
    components: {
        FlvJs
    },
    data() {
        return {
            selects: '',
            startTime: '',
            endTime: '',
            page: 1,
            pageSize: 10,
            tableData: '',
            evtTotal: 0,
            videoUrl: '',
            aMap: null,
            icon3: assetUrl('../assets/image/screen/12k/video.png'),
            rowData: '',
            getIndex: null,
            videoRid:'',
            videoId:''

        }
    },
    computed: {

    },

    watch: {

    },
    created() {
        this.crossData = JSON.parse(sessionStorage.getItem('crossData'))
        this.startTime = this.mapUtils.getDateYMD('ymd')
        this.endTime = this.mapUtils.getDateYMD('ymd')
    },
    mounted() {
        this.initMap()
        this.getFireMenu()

    },
    unmounted() {
        this.playVideo(1)
    },

    methods: {
        currentChange(val) {
            this.page = val;
            this.getFireEventList()
        },
        change() {
            this.page = 1;
            this.getFireEventList()
        },
        inputKeydown(e) {
            if (e.keyCode == 13) {
                this.page = 1;
                this.getFireEventList()
            }
        },
        initMap() {

            mapabcgl.accessToken = mapabcglToken;
            var _this = this;
            this.aMap = new mapabcgl.Map({
                container: 'aMap',
                style: MIN_MAP_STYLE,
                zoom: 17,
                maxZoom: maxZoom,
                minZoom: minZoom,
                center: MAP_CENTER,
                pitch: 0
            });


            this.aMap.on('load', function() {
                this.loadImage(_this.icon3, function(error, image) {

                    _this.aMap.addImage('icon-camera', image);

                })
            });
            this.aMap.on('click', function(e) {

            });

        },
        getFireMenu() {
            var url = this.type == "fireAlarm" ? 'getFireMenu?' : 'getFacilityMenu?'
            var _this = this;
            var param = {

            };

            http.get(SERVICE_URL_v2 + '/alarm/' + url, { params: param }).then((data) => {
                this.selects = data.data.data;

                this.getFireEventList()
            })
        },
        getFireEventList() {
            this.getIndex = null;
            var url = this.type == "fireAlarm" ? 'getFireEventList?' : 'getFacilityList?'
            var _this = this;
            var keys = this.selects.keys;

            var param = Object.assign({
                startTime: this.startTime,
                endTime: this.endTime,
                currentPage: this.page,
                pageSize: this.pageSize
            }, keys)

            http.get(SERVICE_URL_v2 + '/alarm/' + url, { params: param }).then((data) => {
                this.tableData = data.data.data;
                this.evtTotal = data.data.data.data.totalNum;
                var res = data.data.data.data.resultList,
                    arr = [];
                this.mapUtils.removeLayers('point', this.aMap)
                res.forEach((item, i) => {
                    arr.push([item.cameraX, item.cameraY])

                    var obj = {
                        item: item,
                        maps: this.aMap,
                        id: 'e' + i,
                        coordinates: [item.cameraX, item.cameraY],
                        iconImg: 'icon-camera',
                        type: 'point',
                        iconSize: 0.5,
                        iconOverlap: false,
                        iconPlacement: false,
                        textOverlap: false,
                        textPlacement: false
                    }
                    this.mapUtils.addPoint(obj);

                });

                // this.mapUtils.setBestMap(arr, { maps: this.aMap, left: 0, right: 0, maxZoom: 22 })
            })
        },
        rowClick(row, column) {

            this.rowData = row;
            this.rowData.thermalCamera = false;
            if (this.videoRid&&this.videoRid!==row.rid) {
                this.playVideo(1)
            }
            if (this.getIndex ==row.index) {
                this.getIndex = null;
                this.rowData = ''
                this.playVideo(1)
            }else{
                this.getIndex =row.index
                this.aMap.flyTo({ center: [row.cameraX, row.cameraY]})
                this.playVideo(0)
            }

        },


        selectedstyle({ row, rowIndex }) {
            if ((this.getIndex) === rowIndex) {
                return {
                    "background-color": "#0c3053"
                };
            }
        },
        tableRowClassName({ row, rowIndex }) {
            row.index = rowIndex;
            return 'dir-row'
        },
        handleClick(item){
            this.$emit('parentMethod',item.id);
            this.$parent.alarmTableType=null
        },
        playVideo(operation) {
            var item = this.rowData;
            this.$refs.flvPlayer && this.$refs.flvPlayer.destroy();

            if (operation == 0 && item.deviceType == 2) {
                item.thermalCamera = !item.thermalCamera;
            }
             var cameraCode = item.thermalCamera ? item.thermalCode : item.cameraCode;
            if (this.rowData.startTime) {
                var startTime = this.mapUtils.getDateYMD('ymdhms', 0, this.rowData.startTime,-5);
                var endTime = this.mapUtils.getDateYMD('ymdhms', 0, this.rowData.startTime,+60);
            }else{
                var startTime = ''
                var endTime = ''
            }
            const _this = this;
            var param = {
                rid: this.videoRid?this.videoRid:this.rowData.rid,
                id: this.videoId?this.videoId:cameraCode,
                operation: operation,
                startTime:startTime,
                endTime:endTime
            }
            if (operation==0) {
                this.videoUrl = '';
            }
            http.get(SERVICE_URL + 'VCN/playVideo?', { params: param }).then((data) => {
                this.videoRid = this.rowData.rid;
                this.videoId = cameraCode;
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
                        console.log('play alarm video url:' + this.videoUrl)
                        this.$refs.flvPlayer.play(this.videoUrl);

                    } else {
                        this.videoRid = '';
                        this.videoId = '';
                        this.videoUrl = '';
                    }
                }



            }).catch((data) => {
                console.log(data)
            })
        },
        switchVideo() {
            this.videoRid = '';
            this.videoId = ''
            this.playVideo(0)
        },
    }

});
</script>
<style lang="scss">
.alarm-table {
    flex: 1;
    padding: 30px 30px;


    .header {
        width: 100%;
        height: 30px;
        display: flex;
        line-height: 30px;

        h3 {
            text-align: center;
            flex: 1;

        }

        i {
            float: right;
            font-size: 18px;
            cursor: pointer;

        }
    }

    .alarm-select-box {
        width: 100%;
        height: 30px;
        display: flex;
        margin-bottom: 30px;

        .ect-select {
            margin-right: 20px;
            height: 30px;
            flex: 1;
            display: flex;
            max-width: 200px;

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

    }

    .map-video-box {
        min-width: 320px;
        width: 320px;
        display: flex;
        flex-direction: column;
        margin: 60px 0 40px 20px;


        .alarm-map {
            flex: 1.5;
            margin-bottom: 30px;
        }

        .alarm-video-box {
            flex: 1;

            .alarm-video-info {

                overflow: hidden;

                .button {
                    // background: #166DC7;
                    text-align: center;
                    padding: 0 5px;
                    line-height: 25px;
                    border-radius: 3px;
                    // cursor: pointer;
                    margin-right: 0;
                    float: left;
                }

                span {
                    float: right;
                    text-align: right;
                    line-height: 25px;
                    margin-right: 10px;
                }
            }

            video {
                width: 100%;
                margin-top: 20px;
            }
        }
    }

}
</style>
