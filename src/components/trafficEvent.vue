<template>
    <div>
        <event-info v-if="eventData" :eventData="eventData"></event-info>
        <accident-info v-if="accidentData" :accidentData="accidentData"></accident-info>
        <div class="main" style="z-index: 99;">
            <div style="flex:1;padding: 30px 40px;display: flex;flex-direction: column;">
                <div class="event-title">
                    <span>交通事件</span>
                    <i class="el-icon-close" @click="$parent.isTtafficEvt=false,$parent.trackPlay=true, $parent.autoPolling = true,closeTraffic()"></i>
                </div>
                <div class="ect-select-box">
                    <div class="ect-select" v-for="item in types">
                        <span class="title">{{item.title}}</span>
                        <el-select filterable v-model="keys[item.key]" @change="eventLevelChange(item)" v-if="item.type=='select'">
                            <el-option v-for="item in item.data" :key="item.value" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-cascader v-if="item.type=='cascader'" v-model="keys[item.key]" :options="item.data" filterable :show-all-levels="false" :props="{label:'name',children:'children',emitPath:false}" style="width:100%;" @change="eventLevelChange(item)"></el-cascader>
                    </div>
                    <div class="ect-select">
                        <span class="title">{{eventtypes.title}}</span>
                        <el-select v-model="keys[eventtypes.key]" @change="getStatisticsList()">
                            <el-option v-for="item in eventtypes.data" :key="item.value" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="ect-select">
                        <span class="title">车辆范围</span>
                        <el-select v-model="fileId" @change="getStatisticsList()" clearable>
                            <el-option v-for="item in filesOptions" :key="item.fileId" :label="item.fileName" :value="item.fileId">
                            </el-option>
                        </el-select>
                        <el-button type="text" style="line-height: 30px;font-size: 12px;padding: 0;padding-left: 5px;" @click="dialogTableVisible=true;">管理</el-button>
                    </div>
                    <template>
                        <el-radio v-model="radio" label="1">实时</el-radio>
                        <el-radio v-model="radio" label="2">历史</el-radio>
                    </template>
                    <div class="ect-select" v-show="radio==2">
                        <span class="title">开始时间</span>
                        <el-date-picker style="flex:1;max-width: 200px;" v-model="startTime" ttype="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions1" @change="getStatisticsList()">
                        </el-date-picker>
                    </div>
                    <div class="ect-select" v-show="radio==2">
                        <span class="title">结束时间</span>
                        <el-date-picker style="flex:1;max-width: 200px;" v-model="endTime" ttype="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions2" @change="getStatisticsList()">
                        </el-date-picker>
                    </div>
                </div>
                <div style="flex:1;margin-top: 20px;position: relative;" id="evtMap">
                    <div class="event-mon-box">
                        <div class="title">事件统计</div>
                        <div class="event-list">
                            <ul class="list-th">
                                <li v-for="item in eventTitle" :style="item.label.indexOf('名称')>-1?'flex:2;':''">{{item.label}}</li>
                            </ul>
                            <div class="list-tr-box" v-anyNameYouLike>
                                <ul class="list-tr" v-for="(item,index) in eventList" :class="typeCode==item.typeCode?'active':''" @click="typeCode=item.typeCode,eventItem=item,getTendencyChart()">
                                    <li v-for="t in eventTitle" :style="t.label.indexOf('名称')>-1?'flex:2;':''">{{item[t['prop']]}}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="event-ect" v-show="typeCode">
                            <div>事件发生趋势图</div>
                            <div id="lineEct" style="width: 100%;height: 100px;"></div>
                        </div>
                    </div>
                    <div class="event-mon-box" style="left: auto;right:10px;width: 400px;" v-show="typeCode">
                        <div style="overflow: hidden;margin-bottom: 10px;">
                            <span class="title">{{eventItem.eventName+'详情'}}</span>
                            <i style="float: right;cursor: pointer;" class="el-icon-close" @click="typeCode=null"></i>
                        </div>
                        <div class="event-list">
                            <ul class="list-th">
                                <!--  <li style="flex:1;">车辆号牌</li>
                                <li>车辆类型</li>
                                <li style="flex:2;">开始时间</li>
                                <li style="flex:2;">结束时间</li> -->
                                <li v-for="item in trackTitles" :style="item.label.indexOf('时间')>-1?'flex:2;':item.label.indexOf('事件类型')>-1?'flex:2;':'flex:1;'">{{item.label}}</li>
                            </ul>
                            <div class="list-tr-box" v-anyNameYouLike style="bottom:40px;">
                                <ul class="list-tr" v-for="(item,index) in trackList" @click="eventClick(item)">
                                    <li v-for="t in trackTitles" :style="t.label.indexOf('时间')>-1?'flex:2;':t.label.indexOf('事件类型')>-1?'flex:2;':'flex:1;'">{{item[t['prop']]}}</li>
                                </ul>
                            </div>
                            <div class="page-box">
                                <el-pagination small layout=" prev, pager, next" :total="total" @current-change="currentChange" :current-page="page" :page-size="pageSize">
                                </el-pagination>
                            </div>
                        </div>
                        <div class="event-ect">
                            <div style="overflow: hidden;">
                                <span class="title">分类统计图</span>
                                <ul>
                                    <el-radio v-model="countType" :label="1">按车辆</el-radio>
                                    <el-radio v-model="countType" :label="2">按地点</el-radio>
                                </ul>
                            </div>
                            <div id="pieEct" style="width: 100%;height: 100px;"></div>
                        </div>
                    </div>
                    <div id="back-to-all" class="selected-return" @click="backToAll()" v-if="keys['selected1'] != '99'">
                        <span>查看全部地点</span>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog v-model="dialogTableVisible" top="25vh" append-to-body :close-on-click-modal="false" title="车辆范围管理" custom-class="traffic-dialog">
            <div style="display: flex;margin-bottom: 25px;">
                <el-upload class="upload-demo" :show-file-list="false" :headers="uploadHeaders" :action="SERVICE_URL +'eventByExcel/uploadExcel'" :on-success="handleSuccess" :on-error="handleError">
                    <el-button size="small" type="primary" style="padding: 9px 15px;">上传查询条件</el-button>
                </el-upload>
                <el-button size="small" type="primary" style="margin:0 25px;" @click="downloadTemplate()">下载模板</el-button>
                <el-input v-model="fileName" placeholder="搜索文件名称" style="width: 200px;" @input="searchFile"></el-input>
            </div>
            <template>
                <el-table :data="fileList" style="width: 100%;" height="400">
                   <!--  <el-table-column type="expand">
                        <template #default="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-table :data="props.row.plateNumbers" border  style="background: none;" :header-row-class-name="'list-header'" :row-class-name="'dir-row dir-row-c'">
                                    <el-table-column label="车辆号牌" width="120">
                                        <template #default="scope">
                                            {{scope.row}}
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="fileName" label="文件名称" width="200">
                    </el-table-column>
                    <el-table-column prop="updateTime" label="上传日期" width="180">
                    </el-table-column>
                    <el-table-column prop="userName" label="上传用户">
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template #default="scope">
                            <el-button @click="applyClick(scope.row)" size="small">应用</el-button>
                            <el-button size="small" @click="DownloadClick(scope.row)">下载</el-button>
                            <el-button type="danger" size="small" @click="deleteClick(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import http from '@/api/http';
import eventInfo from './eventInfo.vue';
import accidentInfo from './accidentInfo.vue';

defineOptions((() => {
const { SERVICE_URL, SERVICE_URL_v2, WEB_TYPE } = window.APP_CONFIG;

return {
    props: ['eventClickTime'],
    components: { eventInfo, accidentInfo },
    data() {
        return {
            eventMap: null,
            options: {
                tracks: null,
                play: true,
                type: 'area'
            },
            trackPlay: true,
            trackPath: false,
            areaData: {
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
            crossLngLats: [],
            allLocationNo: 0,
            typeCode: '',
            eventItem: '',
            total: 0,
            page: 1,
            pageSize: 15,
            trackList: [],
            trackTitles: [],
            countType: 1,
            accidentData: '',
            eventData: '',
            eventtypes: '',
            pickerOptions1: {
                disabledDate: (time) => {
                    return time.getTime() > new Date(this.endTime).getTime() || time.getTime() > Date.now();

                }

            },
            pickerOptions2: {

                disabledDate: (time) => {
                    return time.getTime() < new Date(this.startTime).getTime() || time.getTime() > Date.now();

                }

            },
            SERVICE_URL: SERVICE_URL,
            filesOptions: [],
            fileList: [],
            fileId: '',
            dialogTableVisible: false,
            fileName: '',
            uploadHeaders: {
                'Authorization': this.$store.state.store.token
            },
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
        radio(val) {
            if (val == '2') {
                this.startTime = this.mapUtils.getDateYMD('ymd', 0)
                this.endTime = this.mapUtils.getDateYMD('ymd', 0)
            } else {
                this.startTime = ''
                this.endTime = ''
            }
            this.getStatisticsList()
        },
        countType() {
            this.getCarChart()
        },
        typeCode() {
            this.getHotChart()
        }
    },
    methods: {
        handleSuccess(response, file, fileList) {
            this.$message({
                message: response.data,
                type: 'success',
                offset: 80
            });
            this.getFiles()

        },
        handleError(err, file, fileList) {
            this.$message({
                message: err.data,
                type: 'error',
                offset: 80
            });
        },
        getFiles() {

            var _this = this;
            var param = {

            };

            http.get(SERVICE_URL + 'eventByExcel/getFiles?', { params: param }).then((data) => {
                this.fileList = this.filesOptions = data.data.data;


            })
        },
        searchFile() {
            // 筛选后的数据
            this.fileList = this.filesOptions.filter((item) => {
                return item.fileName.indexOf(this.fileName) > -1
            })
        },
         // 下载怒模板
        downloadTemplate() {

            var url = SERVICE_URL + 'eventByExcel/downloadTemplate?&token=' + sessionStorage.getItem('token');
            document.location.href = url;
        },
        // 应用
        applyClick(row) {
            this.fileId = row.fileId;
            this.getStatisticsList()
            this.dialogTableVisible = false;
        },
        // 下载
        DownloadClick(row) {

            var url = SERVICE_URL + 'eventByExcel/downloadFile?id=' + row.fileId+ '&token=' + sessionStorage.getItem('token');
            document.location.href = url;
        },
        // 删除
        deleteClick(row) {
            var _this = this;
            var param = {
                id: row.fileId
            };
            this.$confirm('确认删除？')
                .then(_ => {
                    http.delete(SERVICE_URL + 'eventByExcel/deleteById?', { params: param }).then((data) => {
                        this.$message({
                            message: data.data.data,
                            type: 'success',
                            offset: 80
                        });
                        this.getFiles()
                    })
                })
                .catch(_ => {});


        },
        closeTraffic() {
            if (!this.$parent.$refs.playBack) {
                return
            }
            var map = this.$parent.$refs.playBack.homeMap;
            map.addLayer(this.$parent.$refs.playBack.createCustomLayer('crossing'));
        },
        initMap() {
            const _this = this;
            this.eventMap = new mapabcgl.Map({
                container: "evtMap",
                style: MAP_STYLE,
                zoom: MAP_ZOOM,
                maxZoom: maxZoom,
                minZoom: minZoom,
                pitch: 0,
                center: MAP_CENTER
            });
            this.eventMap.on('load', function() {
                _this.getMenuType()
            })
            this.eventMap.on('style.load', function() {
                _this.getCrossLocation()
            })
        },
        // 路口点位
        getCrossLocation() {
            var _this = this;
            var param = {
            };
            console.log('add cross location points')
            http.get(SERVICE_URL_v2 + '/getCrossLocation?', { params: param }).then((data) => {

                var map = _this.eventMap;
                var res = data.data.data;
                var xys = [],
                    features = [],
                    linefeatures = [];
                this.roadCascaderOptions = []
                for (var key in res) {
                    var obj = {
                        crossId: key,
                        crossName: key == 'road' ? '路段' : '路口',
                        children: res[key]
                    }
                    this.roadCascaderOptions.push(obj)
                }
                res[WEB_TYPE=='highway'?'road':'cross'].forEach((item, index) => {
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
                    "minzoom": 15,
                    paint: {
                        "circle-radius": 12,
                        "circle-opacity": 0.8,
                        "circle-color": 'rgb(243, 152, 0)'
                    },
                });
                map.on('click', 'cross-point', function(event) {
                    var item = event.features[0].properties;
                    _this.crossClick(item)
                });
                _this.crossLngLats = xys;
            })
        },
        crossClick(item) {
            var map = this.eventMap;
            map.flyTo({ center: [item.centerX, item.centerY], zoom: 18 })
            this.keys['selected1'] = item.crossId;
            this.getMenuEventType();
        },
        backToAll() {
            var map = this.eventMap;
            this.keys['selected1'] = "99";
            this.mapUtils.setBestMap(this.crossLngLats, { maps: map, left: 100, right: 100, maxZoom: 14, pitch: 0 })
            this.getMenuEventType();
        },
        getMenuType() {

            var _this = this;
            var param = {

            };

            http.get(SERVICE_URL_v2 + '/event/getMenuType?', { params: param }).then((data) => {
                var res = data.data.data;
                this.keys = res.keys;
                this.types = res.types;
                this.types.forEach(item => {
                    if (item.type == "cascader") {
                        var res = item.data,
                            opt = [];
                        for (var key in res) {
                            var obj = {
                                value: key,
                                name: key == 'road' ? '路段' : '路口',
                                children: res[key]
                            }
                            opt.push(obj)

                        }
                        item.data = opt;

                    }
                })
                this.getMenuEventType()
                this.getFiles()

            })
        },
        getMenuEventType() {

            var _this = this;
            var param = {
                eventLevel: this.keys.selected3,
                crossId: this.keys.selected1
            };

            http.get(SERVICE_URL_v2 + '/event/getMenuEventType?', { params: param }).then((data) => {
                var res = data.data.data;
                for (var k in res.keys) {
                    if (k == res.types[0].key) {
                        this.keys[k] = res.keys[k]
                    }
                }
                this.eventtypes = res.types[0]
                this.getStatisticsList()

            })
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
                polygon: '',
                fileId:this.fileId
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
                typeCode: this.typeCode,
                fileId:this.fileId

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
                pageSize: this.pageSize,
                fileId:this.fileId

            }, keys)

            http.get(SERVICE_URL_v2 + '/event/getTrackListPage?', { params: param }).then((data) => {
                this.trackTitles = data.data.data.title;
                this.trackList = data.data.data.data.resultList;
                this.total = data.data.data.data.totalNum;
            })
        },

        currentChange(val) {
            this.page = val;
            this.getTrackListPage();
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
                polygon: '',
                fileId:this.fileId
            }, keys)

            http.get(SERVICE_URL_v2 + '/event/getCarChart', { params: param }).then((data) => {
                var res = data.data.data;
                var chartData = (res.series && res.series[0] && res.series[0].data) || [];
                var xAxisData = chartData.map(function(item) {
                    return item.name;
                });
                var seriesData = chartData.map(function(item) {
                    return item.value;
                });
                var baroptions = {
                    dom: 'pieEct',
                    color: 'rgba(255,255,255,.75)',
                    title: '',
                    legendData: [],
                    xAxisData: xAxisData,
                    yAxisName: '',
                    gridLeft: 10,
                    gridBom: 10,
                    gridTop: 20,
                    gridRight: 10,
                    yaxisTick: false,
                    yaxisLineShow: false,
                    yaxisLabelShow: true,
                    axisLabelFontSize: 12,
                    XaxisLabelFontSize: 12,
                    ysplitLineShow: true,
                    series: [{
                        name: res.title || '数量',
                        type: 'bar',
                        data: seriesData,
                        barWidth: this.width > 3800 ? 24 : 14,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                { offset: 1, color: '#2673E8' },
                                { offset: 0.5, color: '#11BFFF' },
                                { offset: 0, color: '#2BFBB4' }
                            ])
                        }
                    }],
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 12
                    },
                    xaxisTickShow: false,
                    interval: 0,
                    rotate: chartData.length > 6 ? 20 : 0
                };

                this.EchartsLarge.barChart(baroptions);

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
                polygon: '',
                fileId:this.fileId
            }, keys)

            http.get(SERVICE_URL_v2 + '/event/getHotChart?', { params: param }).then((data) => {
                var res = data.data.data,
                    features = [],
                    mag = 1.0,
                    count = res.length;
                if (count > 0) {
                    mag = 100 * (1.0 / count);
                }
                res.forEach(item => {
                    var obj = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": item.point
                        },
                        "properties": {
                            "mag": mag
                        }
                    }
                    features.push(obj)
                })
                const opt = {
                    id: 'heatmapLayer',
                    features: features,
                    maps: this.eventMap,
                    layer: 'cross-point',
                };
                this.mapUtils.addHeatmapLayer(opt)
            })
        },
    }

} })());
</script>
<style lang="scss" scoped>
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
.selected-return {
    position: absolute;
    top: 10px;
    margin-left: 50%;
    padding: 15px;
    display: flex;
    background: rgba(12, 44, 103, 0.4);
    z-index: 99;
    cursor: pointer;
    border: 1px solid #2E94E1;
    border-radius: 3px;
}
</style>
