<template>
    <div class="component-box">
        <div class="main">
            <div style="flex:1;padding: 30px;display: flex;">
                <div class="cross-map">
                    <div style="width: 240px;">
                        <cross-select @change="crossIdChange"></cross-select>
                    </div>
                    <div v-show="leftContent">
                        <!-- <signal-state></signal-state> -->
                        <div>
                            <span>方案类型：</span>
                            <template>
                                <el-radio style="color:#fff;" v-model="radio" :label=0>日方案</el-radio>
                                <el-radio style="color:#fff;" v-model="radio" :label=1>工作日/休息日</el-radio>
                            </template>
                        </div>
                        <div style="margin:20px 0;display: flex;" v-if="weeks.length>0">
                            <span style="width: 90px;">时间选择：</span>
                            <div style="width: 150px;margin-right: 20px;">
                                <el-select v-model="week" filterable @change="weekChange()">
                                    <el-option v-for="item in weeks[radio].list" :key="item.code" :label="item.name" :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <span>方案信息：</span>
                            <div class="plan-list-box">
                                <ul>
                                    <li>编号</li>
                                    <li>名称</li>
                                    <li>开始时间</li>
                                    <li>周期（秒）</li>
                                </ul>
                                <div style="height: 240px;position: relative;" v-anyNameYouLike>
                                    <ul v-for="item in planList[week]" :class="planItem.id==item.id?'plan-br-active':''" @click="planItem=item" style="cursor: pointer;">
                                        <li>{{item.id}}</li>
                                        <li>{{item.name}}</li>
                                        <li>{{item.start}}</li>
                                        <li>{{item.cycle}}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div v-if="planItem">
                            <div>
                                <span>相位信息：</span>
                                <span style="margin:0 10px;">{{planItem.name}}</span>
                                <span>{{planItem.cycle+'秒'}}</span>
                            </div>
                            <div :style="'background:url('+WEBSOCKET_URL + 'signal/api/planGraph?crossId='+crossData.crossId+'&timePlanId='+planItem.timePlanId+');width:380px;height:180px;background-size: 100% 100%;margin-top:10px;'"></div>
                        </div>
                    </div>
                    <div v-show="!leftContent">
                        <h3 style="padding:0 20px 30px 20px;">{{$t("home.phaseDivision")}}</h3>
                        <div class="phase-image-box">
                            <phase v-for="(item,index) in phaseList" :item="item" :key="index" style="margin-bottom: 30px;"></phase>
                        </div>
                    </div>
                    <div style="position: absolute;bottom: 5px;right: 30px;">
                        <el-button type="text" v-text="leftContent?$t('home.configurationInformation'):$t('home.return')" @click="leftContent=!leftContent"></el-button style="padding:0;">
                    </div>
                </div>
                <div class="cross-info-box">
                    <div class="cross-info-box-top">
                        <div class="evaluate--box">
                            <i class="evaluate-icon" :style="'background:'+(gloBal.gradeColor[summary.level])" v-popover:popover>
                                <span style="font-size: 20px;">{{summary.level}}</span>
                                <!-- <span style="font-size: 16px;color: #d2cccc;">?</span> -->
                            </i>
                            <span class="evaluate-font">{{summary.result}}</span>
                            <el-popover placement="top-start" :title="$t('home.intersectionLevel')" width="200" trigger="hover" :content="$t('home.accordingRadarChart')+'Aϵ[90,100)，Bϵ[65,90)，Cϵ[35,65),Dϵ[10,35),Eϵ[0,10)'+$t('home.theHigherCondition')" ref="popover">
                            </el-popover>
                        </div>
                        <div class="evaluate-date--box">
                            <el-dropdown style="margin-top:15px;margin-left: 15px;" @command="exportCsv">
                                <el-button type="primary" size="mini">
                                    {{$t("home.export")}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item :command="item.id" :key="item.id" v-for="item in commandList">{{item.name}}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <div class="evaluate-date-type">
                                <el-radio-group v-model="dateType">
                                    <el-radio v-for="item in dateTypeList" :label="item.value" :key="item.value">{{item.name}}</el-radio>
                                </el-radio-group>
                            </div>
                            <div class="evaluate--date">
                                <el-date-picker v-show="dateType==1" @change="dateChange" type="date" v-model="datevalue" value-format="yyyy-MM-dd" :picker-options="pickerOptions" :placeholder="$t('home.pleaseChoose')">
                                </el-date-picker>
                                <el-date-picker @change="dateChange" v-show="dateType==2" v-model="datevalue" type="week" :picker-options="pickerOptions1" :placeholder="$t('home.pleaseChoose')">
                                </el-date-picker>
                                <el-date-picker v-show="dateType==3" @change="dateChange" type="month" v-model="datevalue" :picker-options="pickerOptions" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :placeholder="$t('home.pleaseChoose')">
                                </el-date-picker>
                            </div>
                            <div class="week-date-input">
                                <el-input class="week-picker" v-model="date" prefix-icon="el-icon-date" :placeholder="$t('home.pleaseChoose')"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="cross-info-box-center">
                        <div class="radar-box">
                            <div id="radarEct" style="width: 100%;height: 100%;"></div>
                            <div class="health" v-if="summary">
                                <b style="font-size: 24px;color:#fb6363;">{{summary.health.name}}</b>
                            </div>
                        </div>
                        <div class="charts-box">
                            <div class="charts-box-top">
                                <div v-for="(item,i) in infoData" :key="item.name" style="flex:1;margin:0 15px;" :style="'color:'+(i==0?'#e06666':i==1?'#409eff':'#93c47d')">
                                    <p :style="'background:'+(i==0?'#e06666':i==1?'#409eff':'#93c47d')">{{item.name}}</p>
                                    <div style="display: flex;">
                                        <ul v-for="t in item.value1">
                                            <li>
                                                <span>{{t.name.slice(0,4)}}</span>
                                                <span>{{t.name.slice(4,t.name.length)}}</span>
                                                <span>{{t.value}}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div style="display: flex;">
                                        <b v-for="item in item.value2">{{item.name}}</b>
                                    </div>
                                </div>
                            </div>
                            <div class="charts-box-bom">
                                <p style="text-align: center;font-size: 12px;">
                                    <span>{{$t("home.phaseEmptyAnalysis")}}</span>
                                </p>
                                <div style="position: absolute;top: 20px;bottom: 0;left: 20px;right: 0; ">
                                    <div id="lineEct" style="width: 95%;height: 100%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cross-info-box-bom">
                        <!-- <p style="padding:10px 15px; ">转向指标</p> -->
                        <div v-if="Index" class="index-bar">
                            <div style="float: left;display: flex;justify-content:flex-start;">
                                <p>{{$t("home.index")+'：'}}</p>
                                <li v-for="item in Index.phaseIndex" :key="item.value" @click="phaseIndex=item,getIndexChar()">
                                    <span :class="phaseIndex.value==item.value?'on':''">{{item.name}}</span>
                                    <b></b>
                                </li>
                            </div>
                            <div style="float: right;display: flex;justify-content:flex-start;">
                                <p>{{$t("home.status")+'：'}}</p>
                                <li v-for="item in Index.stateIndex" :key="item.value" @click="stateIndex=item,getIndexChar();">
                                    <span :class="stateIndex.value==item.value?'on':''">{{item.name}}</span>
                                    <b></b>
                                </li>
                            </div>
                        </div>
                        <div style="flex:1;margin-top: 5px;">
                            <div id="dirlineEct" style="width: 100%;height: 100%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import http from '@/api/http';
import signalState from './signalState.vue';
import phase from './phase/phase.vue';

defineOptions((() => {
const { SERVICE_URL, WEBSOCKET_URL } = window.APP_CONFIG;

return {
    components: {
        signalState,
        phase
    },
    data() {
        return {

            leftContent: true, //true实时方案对比，false相位配置
            // cs: cs,
            dateTypeList: [{
                name: this.$t("home.day"),
                value: 1
            }, {
                name: this.$t("home.week"),
                value: 2
            }, {
                name: this.$t("home.month"),
                value: 3
            }],
            dateType: 1,
            date: '',
            datevalue: '',
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                firstDayOfWeek: 1
            },
            Index: '',
            phaseIndex: null,
            stateIndex: null,
            crossTurnIndex: null,
            turnIndex: [],
            statisticsList: [{
                name: '按方向',
                value: 1
            }, {
                name: '按时间',
                value: 2
            }],
            statistics: 1,
            summary: '',
            infoData: '',




            dataTypeList: [{
                name: '车道路况',
                value: 1
            }, {
                name: '流量统计',
                value: 2
            }, {
                name: '平均速度',
                value: 3
            }],
            dataType: 1,

            crossNavList: [{
                name: '路口',
                value: 1
            }, {
                name: '进口',
                value: 2
            }, {
                name: '出口',
                value: 3
            }],
            crossNav: 1,
            crossInfoNavMenu: [{
                name: '路口评价',
                value: 1
            }, {
                name: '轨迹监测',
                value: 2
            }, {
                name: '信号评价',
                value: 3
            }, {
                name: '组织评价',
                value: 4
            }],
            crossInfoNav: 1,
            startTime: '',
            changeTime: '',
            endTime: '',
            timeGranularity: '1',
            crossMap: null,
            roadLayerchecked: false,
            bzgchecked: false,
            tb: null,
            laneList: [],
            laneData: '',
            laneActive: -1,
            isLayer: null,
            source: null, //存放取消的请求方法
            legendData: [],
            crossData: {},
            invt: null,

            layerLegendData: [{
                    label: '畅通',
                    color: 'rgba(19, 134, 22, 1)'
                }, {
                    label: '缓行',
                    color: 'rgba(222, 161, 29, 1)'
                }, {
                    label: '拥堵',
                    color: 'rgba(222, 29, 29, 1)'
                }, {
                    label: '极度拥堵',
                    color: 'rgba(98, 3, 3, 1)'
                }, {
                    label: '禁行',
                    color: 'rgba(124, 124, 122, 1)'
                },

            ],
            ect1: null,
            ect2: null,
            ect3: null,
            timeRange: '',
            phaseList: [],
            signalData: '',
            commandList: [],
            radio: 0,
            weeks: [],
            week: null,

            planList: [],

            planItem: '',
            WEBSOCKET_URL: WEBSOCKET_URL,
            resizeHandler: null
        }
    },
    watch: {
        dateType(val) {

            this.datevalue = ''
            if (val == 1) {
                this.datevalue = this.date = this.mapUtils.getDateYMD('ymd', -60 * 24)
            }
            if (val == 2) {
                var now = new Date();
                var day = now.getDay();
                var date = new Date() - ((7 + day - 2) * 24 * 60 * 60 * 1000)
                var week = this.datevalue = new Date(date)
                this.date = this.weekFormat(week)
            }
            if (val == 3) {
                this.datevalue = this.mapUtils.getDateYMD('ymd')
                this.date = this.mapUtils.getDateYMD('ym')
            }
            this.getRadarInfo();
            this.getPhaseScatter();
            this.getIndexChar()
        },

        phaseIndex() {


        },
        stateIndex() {


        },
        radio(val) {

            this.week = this.weeks[val].list[0].code;

            if (this.planList[this.week]) {
                this.planItem = this.planList[this.week][0];
            } else {
                this.planItem = ''
            }



        },


    },
    created() {

        this.crossData = JSON.parse(sessionStorage.getItem('crossData'))
        if (!this.crossData) {
            this.crossData = {}
            this.crossData['crossId'] = this.$route.query.crossId;
            this.crossData['crossName'] = this.$route.query.crossName;
            this.crossData['centerX'] = this.$route.query.centerX;
            this.crossData['centerY'] = this.$route.query.centerY;
        }
        this.datevalue = this.date = this.mapUtils.getDateYMD('ymd', -60 * 24)
        this.resizeHandler = () => {
            if (this.ect1 && this.ect1.resize) {
                this.ect1.resize();
            }
            if (this.ect2 && this.ect2.resize) {
                this.ect2.resize();
            }
            if (this.ect3 && this.ect3.resize) {
                this.ect3.resize();
            }
        };
        window.addEventListener('resize', this.resizeHandler);
    },
    mounted() {
        this.getType();
        this.getRadarInfo();
        this.getCrossPhaseInfo();
        this.getSightInfo()

        this.getInterval()
        this.planType()
    },
    unmounted() {
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            this.resizeHandler = null;
        }
    },
    methods: {
        crossIdChange(item) {
            this.crossData = item;
            this.getType();
            this.getRadarInfo();
            this.getCrossPhaseInfo();
            this.getSightInfo()

            this.getInterval()
            this.planType()
        },
        planType() {

            var _this = this;
            var param = {

            };

            http.get(WEBSOCKET_URL + 'signal/api/planType?', { params: param })
                .then((data) => {

                    this.weeks = data.data;
                    this.week = data.data[this.radio].list[0].code

                    this.plan()
                }).catch(() => {
                    this.weeks = [];
                    this.week = null;
                })
        },
        weekChange() {

            this.planItem = this.planList[this.week][0];
        },
        plan() {

            var _this = this;
            var param = {
                crossId: this.crossData.crossId
            };

            http.get(WEBSOCKET_URL + 'signal/api/plan?', { params: param })
                .then((data) => {
                    this.planList = data.data;
                    this.planItem = data.data[this.week][0];

                }).catch(() => {
                    this.planList = [];
                    this.planItem = '';
                })
        },
        exportCsv(command) {

            var time = this.dateType == 2 ? this.date.slice(0, 10) + ',' + this.date.slice(11, 21) : this.date;
            var url = SERVICE_URL + 'signal/exportInfo?crossId=' + this.crossData.crossId + '&dateType=' + this.dateType + '&time=' + time + '&interval=' + command + '&token=' + sessionStorage.getItem('token');
            document.location.href = url;
        },
        getInterval() {

            var _this = this;
            var param = {

            };
            this.commandList = [];
            http.get(SERVICE_URL + 'signal/getInterval?', {
                params: param
            }).then((data) => {

                this.commandList = data.data.data;
            })
        },
        arrDelFunc(id) {
            if (this.turnIndex.length <= 1) {
                return
            };
            var i = this.turnIndex.indexOf(id);
            if (i != -1) {
                this.turnIndex.splice(this.turnIndex.findIndex(item => item === id), 1)
            } else {
                this.turnIndex.push(id)
            }

        },
        dateChange(val) {

            if (!val) {
                this.date = '';
                return
            }
            if (this.dateType == 2) {
                this.date = this.weekFormat(val)
            } else if (this.dateType == 1) {
                this.date = val;
            } else {
                this.date = val.substring(0, val.length - 3);
            }
            this.getRadarInfo();
            this.getPhaseScatter();
            this.getIndexChar();
        },
        weekFormat(val) {
            let firstDay = new Date(val.getFullYear(), 0, 1)
            let dayOfWeek = firstDay.getDay()

            let spendDay = 1
            if (dayOfWeek != 0) {
                spendDay = 7 - dayOfWeek + 1
            }
            firstDay = new Date(val.getFullYear(), 0, 1 + spendDay)
            let d = Math.ceil((val.valueOf() - firstDay.valueOf()) / 86400000)
            let result = Math.ceil(d / 7)
            let year = val.getFullYear()
            let week = result + 1

            let startTime = this.dateFormat(val.valueOf() - 86400000)
            let endTime = this.dateFormat(val.valueOf() + 5 * 86400000)
            return startTime + '~' + endTime + '  第' + week + '周'
        },
        dateFormat(val) {
            var myDate = new Date(val); //根据时间戳生成的时间对象
            var m = myDate.getMonth() < 9 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
            var d = myDate.getDate() <= 9 ? '0' + (myDate.getDate()) : myDate.getDate();

            var date = myDate.getFullYear() + '-' + m + '-' + d

            return date
        },
        openInterval() {
            this.invt = setInterval(() => {
                this.getLaneInfo()


            }, 1000 * 60)
        },
        clearInterval() {
            clearInterval(this.invt);
            this.invt = null;
        },
        // 相位运行
        getCrossPhaseInfo() {

            var _this = this;
            var param = {
                crossId: this.crossData.crossId


            };

            http.get(SERVICE_URL + 'signal/getCrossPhaseInfo?', {
                params: param
            }).then((data) => {


                this.phaseList = data.data.data;

            })
        },
        // 信控信息
        getSightInfo() {

            var _this = this;
            var param = {
                crossId: this.crossData.crossId,
                startTime: this.dateType == 2 ? this.date.slice(0, 10) + ',' + this.date.slice(11, 21) : this.date
            };
            this.signalData = '';
            http.get(SERVICE_URL + 'signal/getSightInfo?', {
                params: param
            }).then((data) => {


                this.signalData = data.data.data;

            })
        },
        // 指标
        getType() {

            const _this = this;

            var param = {


            }

            http.get(SERVICE_URL + 'signal/getType?', {
                params: param
            }).then((data) => {
                this.Index = data.data.data;
                this.phaseIndex = data.data.data.phaseIndex[0];
                this.stateIndex = data.data.data.stateIndex[0];
                this.getIndexChar();
                this.getPhaseScatter();
            }).catch((err) => {

                console.log(err);

            })
        },
        // 雷达数据
        getRadarInfo() {

            const _this = this;

            var param = {
                crossId: this.crossData.crossId,
                dateType: this.dateType,
                time: this.dateType == 2 ? this.date.slice(0, 10) + ',' + this.date.slice(11, 21) : this.date


            }

            http.get(SERVICE_URL + 'signal/getRadarInfo?', {
                params: param
            }).then((data) => {
                var radarData = data.data.data.radarData,
                    legendData = [];
                this.summary = data.data.data.summary;
                this.infoData = data.data.data.infoData;
                var colors = ['#9fc5f8', '#9fc5f8', '#b6d7a8', '#b6d7a8', '#ea9999', '#ea9999']
                radarData.indicator.forEach((item, i) => {
                    item.color = colors[i]
                })
                radarData.series.forEach(item => {
                    item.data.forEach(d => {
                        legendData.push(d.name)
                    })
                })
                var opt = {
                    dom: 'radarEct',
                    indicator: radarData.indicator,
                    series: radarData.series,
                    legendData: legendData
                }

                _this.ect1 = this.EchartsLarge.radarChart(opt)

            }).catch((err) => {

                console.log(err);

            })
        },

        // 相位转向峰值散点图
        getPhaseScatter() {

            const _this = this;

            var param = {
                crossId: this.crossData.crossId,
                dateType: this.dateType,
                time: this.dateType == 2 ? this.date.slice(0, 10) + ',' + this.date.slice(11, 21) : this.date,



            }

            http.get(SERVICE_URL + 'signal/getPhaseScatter?', {
                params: param
            }).then((data) => {

                var hours = data.data.data.hours;
                var days = data.data.data.days;
                var data = data.data.data.data;
                data = data.map(function(item) {
                    return [item[1], item[0], item[2] || '-'];
                });
                var option = {
                    dom: 'lineEct',
                    gridTop:0,
                    days: days,
                    gridRight:60,
                    hours: hours,
                    data: data,
                    gridHight:'90%'
                   


                }
                _this.ect2 = this.EchartsLarge.heatmapChart(option)
            }).catch((err) => {

                console.log(err);

            })
        },

        // 转向折线图
        getIndexChar() {

            const _this = this;

            var param = {
                crossId: this.crossData.crossId,
                dateType: this.dateType,
                time: this.dateType == 2 ? this.date.slice(0, 10) + ',' + this.date.slice(11, 21) : this.date,
                idxType: this.phaseIndex.value,
                countType: this.stateIndex.value


            }

            http.get(SERVICE_URL + 'signal/getIndexChar?', {
                params: param
            }).then((data) => {
                var legendData = []
                data.data.data.series.forEach(item => {

                    item.symbol = 'none';
                    item.sampling = 'average';
                    item.smooth = true
                    legendData.push(item.name)
                })
                var options = {
                    dom: 'dirlineEct',
                    colors: ['#37a2da', '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
                    xAxisData: data.data.data.times,
                    legendData: {
                        itemHeight: 7,
                        itemWidth: 7,
                        icon: 'circle',
                        data: legendData,
                        textStyle: {
                            color: '#fff'
                        },
                        top: 0
                    },
                    gridLeft: 45,
                    gridBom: 10,
                    gridTop: 30,
                    gridRight: 35,
                    legendBom: 10,
                    // yAxisName: this.phaseIndex.name,
                    // yaxisLabelFmt: '{value} ' + this.phaseIndex.unit,
                    yAxisName1: this.stateIndex.name,
                    // yaxisLabelFmt1: '{value} ' + this.stateIndex.unit,
                    yAxisShow: true,
                    series: data.data.data.series
                }

                this.$nextTick(function() {
                    _this.ect3 = this.EchartsLarge.lineChart2(options)
                });


            }).catch((err) => {

                console.log(err);

            })
        },






        getModeldata() {

            fetch(SERVICE_URL2 + 'mapdemo/shenzhen/bzg_shenzhen.json')
                .then(res => res.json())
                .then(json => {
                    const res = json.RECORDS;
                    this.addModel(res)
                })
        },
        addModel(data) {

            const _this = this;

            this.crossMap.addLayer({
                id: 'custom_layer',
                type: 'custom',
                onAdd: function(m, mbxContext) {
                    _this.tb = new Threebox(
                        m,
                        mbxContext, { defaultLights: true }

                    );

                    const loader = new THREE.GLTFLoader();

                    data.forEach((item, index) => {

                        loader.load(SERVICE_URL2 + `mapdemo/shenzhen/gltf_shenzhen/` + item.type + `.gltf`, (gltf) => {

                            var mesh = _this.tb.Object3D({ obj: gltf.scene, units: 'meters' ,anchor: 'none'}).setCoords([item.x, item.y]);
                            mesh.scale.set(0.035, 0.035, 0.035);
                            mesh.position.z = 0;
                            mesh.setRotation({ x: 90, y: (item.angle * 180 / Math.PI) + 180, z: 0 });

                            _this.tb.add(mesh);

                        });
                    });
                },

                render: function(gl, matrix) {

                    _this.tb.update();

                }
            })
            this.crossMap.flyTo({ pitch: 65 })
        },
        cancelQuest() {
            if (typeof this.source === 'function') {

                this.source('终止请求'); //取消请求
            }
        },
        // 车道路况
        getLaneInfo() {
            this.cancelQuest(); //在请求发出前取消上一次未完成的请求；
            const _this = this;
            this.inoutsetLayoutProperty();
            this.mapUtils.removeLayers('', this.crossMap)
            this.mapUtils.removeMarkers()
            this.crossMap.removeLayerAndSource('path-layer');
            var param = {
                crossId: this.crossData.crossId,
                type: 1

            }

            http.get(SERVICE_URL + 'cross/evaluate/getLaneStateInfo?', {
                params: param,
                cancelToken: new http.CancelToken(function executor(c) {
                    _this.source = c;
                })
            }).then((data) => {
                var res = this.laneList = data.data.data;

                res.forEach((item, index) => {


                    item.lanesWkt.forEach((w, i) => {

                        var lines = [];
                        var line = w.replace('LINESTRING(', '').replace(')', '').split(',')

                        line.forEach(l => {
                            var xy = l.split(' ').map(Number)
                            lines.push(xy)
                        })

                        var state = item.states[i];

                        var color = state == 0 ? 'rgba(124, 124, 122, 1)' : state == 1 ? 'rgba(19, 134, 22, 1)' : state == 2 ? 'rgba(222, 161, 29, 1)' : state == 3 ? 'rgba(222, 29, 29, 1)' : 'rgba(98, 3, 3, 1)';
                        var state1 = i < item.states.length - 1 ? item.states[i + 1] : item.states[0];
                        var color1 = state1 == 0 ? 'rgba(124, 124, 122, 1)' : state1 == 1 ? 'rgba(19, 134, 22, 1)' : state1 == 2 ? 'rgba(222, 161, 29, 1)' : state1 == 3 ? 'rgba(222, 29, 29, 1)' : 'rgba(98, 3, 3, 1)';
                        this.mapUtils.addmapLine({
                            maps: this.crossMap,
                            id: item.laneId + i,
                            lines: lines,
                            arrow: false,
                            type: '',
                            color: color,
                            minzoom: 17,
                            strokeWeight: 8,
                            lineGradient: [
                                'interpolate',
                                ['linear'],
                                ['line-progress'],
                                0, color,
                                0.1, color1
                            ]
                        })
                    })


                })
            }).catch((err) => {
                if (http.isCancel(err)) {
                    console.log('Rquest canceled', err.message); //请求如果被取消，这里是返回取消的message
                } else {
                    //handle error
                    console.log(err);
                }
            })
        },
        laneClick(item) {
            this.laneData = item;

            this.inoutsetLayoutProperty();
            this.laneActive = item.laneId;
            var visibility = true,
                _this = this;
            this.isLayer = setInterval(() => {
                visibility = !visibility;

                if (visibility) {
                    item.states.forEach((t, i) => {
                        _this.crossMap.setLayoutProperty(item.laneId + i, 'visibility', 'visible')
                    })
                    // _this.crossMap.setLayoutProperty(item.laneId+0, 'visibility','visible')
                } else {
                    item.states.forEach((t, i) => {
                        _this.crossMap.setLayoutProperty(item.laneId + i, 'visibility', 'none')
                    })

                }

            }, 500)

        },
        inoutsetLayoutProperty() {

            clearInterval(this.isLayer);
            this.isLayer = null;
            if (this.laneActive == -1) {
                return
            }
            if (this.laneActive && this.crossMap) {

                this.laneData.states.forEach((t, i) => {
                    this.crossMap.setLayoutProperty(this.laneActive + i, 'visibility', 'visible')
                })
            };
            this.laneActive = -1;

        },

        getFlowInfo() {
            this.cancelQuest(); //在请求发出前取消上一次未完成的请求；
            const _this = this;

            this.inoutsetLayoutProperty();
            this.mapUtils.removeLayers('', this.crossMap)
            this.mapUtils.removeMarkers()
            this.crossMap.removeLayerAndSource('path-layer');
            var param = {
                crossId: this.crossData.crossId,
                interval: this.timeGranularity,
                time: this.changeTime
            }

            http.get(SERVICE_URL + 'cross/evaluate/getFlowInfo?', {
                params: param,
                cancelToken: new http.CancelToken(function executor(c) {
                    _this.source = c;
                })
            }).then((data) => {
                const res = data.data.data;
                res.forEach((item, i) => {
                    if (item.flow == null) {
                        return
                    }
                    var lines = [];
                    var arr = item.turnWkt.split(';')

                    arr.forEach(l => {
                        var xy = l.split(',').map(Number)
                        lines.push(xy)
                    })
                    var color = item.state == 1 ? 'rgba(51, 177, 0, 1)' : item.state == 2 ? 'rgba(255, 204, 0, 1)' : item.state == 3 ? 'rgba(222, 0, 0, 1)' : item.state == 4 ? 'rgba(140, 14, 14, 1)' : 'rgba(140, 14, 14, 1)'
                    var width = item.state == 1 ? 8 : item.state == 2 ? 10 : item.state == 3 ? 12 : item.state == 4 ? 14 : 16;
                    var paddingtop = item.state == 1 ? 2 : item.state == 2 ? 4 : item.state == 3 ? 6 : item.state == 4 ? 8 : 10;
                    var paddingleft = item.state == 1 ? 2 : item.state == 2 ? 4 : item.state == 3 ? 6 : item.state == 4 ? 8 : 10;

                    this.mapUtils.addmapLabel({ maps: this.crossMap, lng: lines[lines.length - 1][0], lat: lines[lines.length - 1][1], name: item.flow, bgcolor: color, fontsize: width + 8, paddingtop: paddingtop, paddingleft: paddingleft })

                    this.mapUtils.addmapLine({ maps: this.crossMap, id: item.crossId + '' + i, lines: lines, color: color, strokeWeight: width, opacity: 1, arrow: true })
                })
            }).catch((err) => {
                if (http.isCancel(err)) {
                    console.log('Rquest canceled', err.message); //请求如果被取消，这里是返回取消的message
                } else {
                    //handle error
                    console.log(err);
                }
            })
        },
        getSpeedInfo() {
            this.cancelQuest(); //在请求发出前取消上一次未完成的请求；
            const _this = this;

            this.inoutsetLayoutProperty();
            this.mapUtils.removeLayers('', this.crossMap)
            this.mapUtils.removeMarkers()
            this.crossMap.removeLayerAndSource('path-layer');
            var param = {
                crossId: this.crossData.crossId,
                interval: this.timeGranularity,
                time: this.changeTime


            }

            http.get(SERVICE_URL + 'cross/evaluate/getSpeedInfo?', {
                params: param,
                cancelToken: new http.CancelToken(function executor(c) {
                    _this.source = c;
                })
            }).then((data) => {
                // const res = data.data.data;
                // const layer = new MapabcLayer({
                //     id: 'path-layer',
                //     type: PathLayer,
                //     data: res,
                //     pickable: true,
                //     widthScale: 1,
                //     widthMinPixels: 1,
                //     getPath: d => d.segments,
                //     getColor: d => _this._getColor(d),
                //     getWidth: d => 1,
                //     opacity: 0.2,
                //     onHover: ({ object, x, y }) => {


                //     }
                // });
                // this.crossMap.addLayer(layer);

            }).catch((err) => {
                if (http.isCancel(err)) {
                    console.log('Rquest canceled', err.message); //请求如果被取消，这里是返回取消的message
                } else {
                    //handle error
                    console.log(err);
                }
            })
        },
        _getColor(item) {
            // console.log(item)
            var color = item.state == 1 ? [51, 177, 0] : item.state == 2 ? [255, 204, 0] : item.state == 3 ? [222, 0, 0] : item.state == 4 ? [140, 14, 14] : [140, 14, 14];

            return color;
        },
        _getOpacity(item) {

            var opacity = item.state == 1 ? 0.2 : item.state == 2 ? 0.3 : item.state == 3 ? 0.4 : item.state == 4 ? 0.5 : 0.6;

            return opacity;
        },

        dataTypeClick(item) {
            this.dataType = item.value;

        },
        crossInfoNavClick(item) {
            this.crossInfoNav = item.value;
        },

    }

} })());
</script>
<style scoped lang="scss">
.cross-map {
    width: 400px;
    height: 100%;
    font-size: 12px;
    position: relative;

    .el-button {
        font-size: 12px;
    }
}



.cross-info-box {
    flex: 1;
    margin-left: 30px;
    /*display: flex;
        flex-direction: column;*/

}

.cross-info-box-top {
    /*height: 60px;*/
    display: flex;
    border-bottom: 1px dashed #878787;
}

.cross-info-box-center {
    height: 420px;
    display: flex;
    padding: 25px 0;



}

.cross-info-box-bom {
    height: 235px;
    /*padding: 20px 0;*/
    display: flex;
    flex-direction: column;
}

.evaluate--box {
    flex: 2;
    overflow: hidden;
    display: table;

}

.evaluate-icon {
    display: inline-block;
    width: 35px;
    height: 35px;
    cursor: pointer;
    border-radius: 50%;
    margin: 12.5px 15px;
    text-align: center;
    line-height: 35px;
}

.evaluate-font {
    vertical-align: middle;
    display: table-cell;


}

.evaluate-date--box {
    flex: 3;
    overflow: hidden;
    display: flex;
    position: relative;
}

.evaluate-date-type {

    line-height: 60px;
    position: absolute;
    right: 243px;

    .el-radio__label {
        font-size: 16px;
    }
}

.evaluate-date-type .el-radio {
    color: #fff;
}

.evaluate--date {
    width: 200px;
    top: 16px;
    height: 30px;
    position: absolute;
    right: 0;
    /*top: 16px;*/

    z-index: 99;
    opacity: 0;
}

.week-date-input {
    width: 230px;
    top: 16px;
    height: 30px;
    position: absolute;
    right: 0;
    z-index: 9;
}

.radar-box {
    flex: 2;
    border-right: 1px solid #7a7e84;
    position: relative;
}

.charts-box {
    flex: 3;
    position: relative;
    /* display: flex;
    flex-direction: column;*/
}

.health {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.charts-box-top {
    display: flex;
}

.charts-box-bom {
    flex: 1;
    // margin-top: 15px;
    overflow: hidden;
    padding: 0 15px;
    position: absolute;
    top: 150px;
    bottom: 0;
    width: 100%;
    /*display: flex;
    flex-direction: column;*/
}

.charts-box-top p {
    width: 100%;
    height: 35px;
    text-align: center;
    line-height: 35px;
    font-size: 16px;
    color: #fff;

}

.charts-box-top ul {
    flex: 1;
    margin-top: 10px;
}

.charts-box-top li {
    display: block;
    text-align: center;
    font-size: 14px;
}

.charts-box-top li span {
    display: block;
    overflow: hidden;
    white-space: nowrap;
}

.charts-box-top b {
    margin-top: 10px;
    flex: 1;
    text-align: center;
    color: #cccfd4;
    overflow: hidden;
    white-space: nowrap;
}

.index-bar {
    overflow: hidden;
}

.index-bar li {
    margin-right: 10px;
}

.index-bar span {

    color: #cccfd4;
    display: inline-block;
    font-size: 12px;
    cursor: pointer;

}

.index-bar b {
    display: inline-block;
    width: 2px;
    height: 10px;
    background: #cccfd4;

}

.index-bar .on {
    color: #22a9ff;
}


.data-type-box {
    width: 100%;
    display: flex;
    text-align: center;
    margin-top: 10px;
}

.data-type {
    flex: 1;
    margin: 0 14px;
    background: #18232d;
    padding: 3px 0;
    cursor: pointer;
}

.data-type-active {
    background: #22a9ff;
}

.cross-data-box {
    position: absolute;
    top: 50px;
    bottom: 0;
    left: 10px;
    right: 10px;


}

.phase-image-box {
    position: relative;
    display: flex;
    flex-wrap: wrap;
}


.signal-data-box p {
    padding: 10px 20px;
    display: flex;
}

.signal-data-box span {
    flex: 1;
}

.signal-data-box span:last-child {
    flex: 2;
}


.cross-lane-box {
    position: absolute;
    top: 75px;
    bottom: 0;
    left: 0;
    right: 0;

}

.map-tool {
    width: 150px;
    height: 30px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    position: absolute;
    right: 10px;
    top: 80px;
    z-index: 1000;
    display: flex;
}

.map-tool .el-checkbox {
    padding: 0;
    margin: 0;
    color: #000;
    font-weight: 700;
    flex: 1;
    text-align: center;
    margin-top: 6px;
}

.lane-list-th {
    position: absolute;
    top: 30px;
    bottom: 0;
    width: 100%;

}

.list-menu li {
    padding: 10px 0;
}

.legend-box {
    position: absolute;
    padding: 5px 25px;

    top: 70px;
    right: 10px;

    z-index: 999;

}

.legend-box li {
    display: flex;
    width: 100%;
    margin-top: 5px;
}

.signal-state-ect-box {
    position: absolute;
    top: 120px;
    width: 100%;
    bottom: 168px;
    display: flex;
    flex-direction: column;
}

.signal-state-ect {

    width: 100%;
    height: 150px;
    display: flex;

}

.state-ect {
    flex: 1;

}

.plan-list-box {
    width: 380px;
    border: 1px solid #7a7e84;
    margin-top: 10px;
}

.plan-list-box ul {
    display: flex;
    border-bottom: 1px dashed #878787;
    font-size: 12px;
}

.plan-list-box ul:last-child {

    border-bottom: none;
}

.plan-list-box .plan-br-active {
    background: #5f5f5f;
    color: #f39800;
}

.plan-list-box li {
    flex: 1;
    padding: 5px 0;
    text-align: center;
    border-right: 1px solid #7a7e84;
}

.plan-list-box li:last-child {

    border-right: none;
}
</style>
