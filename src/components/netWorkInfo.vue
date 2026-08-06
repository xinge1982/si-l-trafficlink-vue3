<template>
    <div>
        <div class="main" style="z-index: 99">
            <div style="flex: 1; padding: 30px 40px; display: flex; flex-direction: column">
                <div class="event-title">
                    <span>路网监测</span>
                    <div class="date-btn-box">
                        <span class="date-title">分析日期</span>
                        <div class="date-box">
                            <el-date-picker v-model="analysisTime" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions" @change="dateChange()">
                            </el-date-picker>
                        </div>
                    </div>
                    <i class="el-icon-close" @click="$parent.isNetWorkInfo = false"></i>
                </div>
                <div class="title-2">
                    <span>路网统计</span>
                    <img :src="require('../assets/image/screen/network/line.png')" alt="" />
                </div>
                <div class="nav-box" v-if="netWorkStatistics">
                    <li v-for="item in netWorkStatistics" :class="netWorkNav == item.id ? 'active' : ''" @click="netWorkNav = item.id" :key="item.id">
                        <i>
                            <img :src="getImageSrc(item.icon)" alt="" />
                        </i>
                        <p>
                            <b>{{ item.value }}</b>
                            <em>{{ item.unit }}</em>
                            <span>{{ item.name }}</span>
                        </p>
                    </li>
                </div>
                <div class="network-info">
                    <div class="event-mon-box">
                        <h3>单路口统计:</h3>
                        <div class="screen-event-list">
                            <ul class="list-th">
                                <li style="flex: 4">路口名称</li>
                                <li style="flex: 3">数量</li>
                                <!-- <li style="flex:1.5;">处理状态</li> -->
                            </ul>
                            <div class="list-tr-box" v-anyNameYouLike>
                                <ul class="list-tr" v-for="item in corssList" :key="item.crossId">
                                    <li style="flex: 4" :title="item.name">{{ item.name }}</li>
                                    <li style="flex: 3">{{ item.value }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="network-from">
                        <h3>历史趋势:</h3>
                        <div style="flex: 1" id="netWorkEct"></div>
                    </div>
                    <div class="network-data">
                        <div class="export-ect">
                            <h3>历史数据:</h3>
                            <el-button size="mini" type="primary" @click="exportEct()">
                                <i class="el-icon-upload2"></i>
                                导出
                            </el-button>
                        </div>
                        <el-table ref="historyTable" :key="tableRenderKey" :data="timesNumDatas" class="ect-table" style="width: 100%" :header-cell-style="tableHeaderStyle" :cell-style="tableCellStyle">
                            <el-table-column prop="label" label="日期"></el-table-column>
                            <el-table-column v-for="(item, index) in timesDatas" :prop="item.key" :key="index" :label="item.time"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as XLSX from 'xlsx/xlsx.mjs'
import exportFile from '../plugin/xlsxFile'
export default {
    data() {
        return {
            analysisTime: '',
            netWorkStatistics: '',
            netWorkNav: '',
            netWorkNavEct: null,
            netWorkEct: null,
            corssList: [],
            crossOrder: 1,
            timesNumDatas: [],
            timesDatas: [],
            tableRenderKey: 0,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
        }
    },

    created() {},
    mounted() {
        this.getNetWorkStatistics()
    },
    destroyed() {},
    watch: {
        netWorkNav() {
            this.getCorssList()
            this.getIdxChart()
        },
    },
    methods: {
        dateChange() {
            this.getNetWorkStatistics()
            this.getCorssList()
            this.getIdxChart()
        },
        formatDate(date) {
            const year = date.getFullYear()
            const month = `${date.getMonth() + 1}`.padStart(2, '0')
            const day = `${date.getDate()}`.padStart(2, '0')
            return `${year}-${month}-${day}`
        },
        getCompareDates() {
            const baseDate = this.analysisTime ? new Date(`${this.analysisTime}T00:00:00`) : new Date()
            const currentDate = new Date(baseDate)
            const previousDate = new Date(baseDate)
            previousDate.setDate(previousDate.getDate() - 1)
            return {
                currentDate: this.formatDate(currentDate),
                previousDate: this.formatDate(previousDate),
            }
        },
        getCurrentParams() {
            if (this.analysisTime) {
                return {
                    startTime: this.analysisTime + ' 00:00:00',
                    endTime: this.analysisTime + ' 23:59:59',
                }
            }
            return {
                type: 2,
            }
        },
        getCompareParams(dateText) {
            return {
                startTime: dateText + ' 00:00:00',
                endTime: dateText + ' 23:59:59',
                id: this.netWorkNav,
            }
        },
        normalizeSeriesData(series, times) {
            const timeValueMap = {}
            const data = (series && series.data) || []
            ;(times || []).forEach((time, index) => {
                timeValueMap[time] = data[index]
            })
            return timeValueMap
        },
        mergeTimes(primaryTimes, secondaryTimes) {
            const merged = []
            ;(primaryTimes || []).concat(secondaryTimes || []).forEach((time) => {
                if (merged.indexOf(time) === -1) {
                    merged.push(time)
                }
            })
            return merged
        },
        getImageSrc(icon) {
            try {
                return require(`../assets/image/screen/network/${icon}.png`);
            } catch (error) {
                return require('../assets/image/screen/network/llll.png'); // 默认图片路径
            }
        },
        getNetWorkStatistics() {
            var param = this.getCurrentParams()
            this.axios.get(SERVICE_URL_v2 + '/getTotalIndexInfo?', { params: param }).then((data) => {
                this.netWorkStatistics = data.data.data
                if (this.netWorkNav) return
                this.netWorkNav = this.netWorkStatistics[0].id
            })
        },
        getCorssList() {
            var param = {
                id: this.netWorkNav,
                order: this.crossOrder,
            }
            if (this.analysisTime) {
                param = Object.assign({}, this.getCurrentParams(), param)
            } else {
                param.type = 2
            }
            this.axios.get(SERVICE_URL_v2 + '/getIdxOfCross?', { params: param }).then((data) => {
                this.corssList = data.data.data
            })
        },
        getIdxChart() {
            const compareDates = this.getCompareDates()
            const currentLabel = this.analysisTime ? compareDates.currentDate : '今日'
            const previousLabel = this.analysisTime ? compareDates.previousDate : '昨日'
            const currentParams = this.getCompareParams(compareDates.currentDate)
            const previousParams = this.getCompareParams(compareDates.previousDate)

            Promise.all([
                this.axios.get(SERVICE_URL_v2 + '/getIdxChart?', { params: currentParams }),
                this.axios.get(SERVICE_URL_v2 + '/getIdxChart?', { params: previousParams }),
            ]).then(([currentData, previousData]) => {
                const currentRes = currentData.data.data || {}
                const previousRes = previousData.data.data || {}
                const currentSeries = (currentRes.series && currentRes.series[0]) || { data: [] }
                const previousSeries = (previousRes.series && previousRes.series[0]) || { data: [] }
                const times = this.mergeTimes(currentRes.times || [], previousRes.times || [])
                const currentMap = this.normalizeSeriesData(currentSeries, currentRes.times)
                const previousMap = this.normalizeSeriesData(previousSeries, previousRes.times)
                const series = [
                    {
                        name: previousLabel,
                        type: 'line',
                        smooth: false,
                        data: times.map((time) => previousMap[time]),
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(25, 188, 241,1)',
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(25, 188, 241,0.1)',
                                },
                            ]),
                        },
                    },
                    {
                        name: currentLabel,
                        type: 'line',
                        smooth: false,
                        data: times.map((time) => currentMap[time]),
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(55, 237, 246,1)',
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(55, 237, 246,0.1)',
                                },
                            ]),
                        },
                    }
                ]
                const res = this.netWorkNavEct = {
                    yaxisName: currentRes.yaxisName || previousRes.yaxisName || '',
                    times: times,
                    series: series,
                }

                this.setEctTable(res)
                if (this.netWorkEct) {
                    this.netWorkEct.setOption({
                        legend: {
                            data: [previousLabel, currentLabel],
                        },
                        xAxis: {
                            data: times,
                        },
                        series: series,
                    })
                }
                var options = {
                    dom: 'netWorkEct',
                    color: 'rgba(255,255,255,.75)',
                    colors: ['#19BCF1', '#37EDF6'],
                    legendData: {
                        data: [previousLabel, currentLabel],
                        textStyle: {
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: 16,
                            fontFamily: 'Microsoft YaHei',
                        },
                        right: 25,
                        top: 0,
                    },
                    xAxisData: times,
                    yAxisName: '',
                    gridLeft: 10,
                    gridBom: 0,
                    gridTop: this.width > 3800 ? 30 : 15,
                    gridRight: 0,
                    yaxisTick: false,
                    yaxisLine: false,
                    axisLabelFontSize: this.width > 3800 ? 24 : 12,
                    ysplitLine: true,
                    series: series,
                    boundaryGap: true,
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 16,
                    },
                    nameGap: 25,
                }
                this.$nextTick(function() {
                    this.netWorkEct = this.EchartsLarge.lineChart2(options)
                })
            })
        },
        tableHeaderStyle({ row, rowIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #ccc; color: #000 ;padding:12px 0'
            }
        },
        tableCellStyle({ row, rowIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #333; color: #fff ;'
            }
        },
        refreshHistoryTable() {
            this.tableRenderKey += 1
            this.$nextTick(() => {
                if (this.$refs.historyTable && typeof this.$refs.historyTable.doLayout === 'function') {
                    this.$refs.historyTable.doLayout()
                }
            })
        },
        setEctTable(res) {
            if (!this.netWorkNavEct) return
            var rows = []
            var columns = []
            ;(res.series || []).forEach((seriesItem) => {
                var row = {
                    label: seriesItem.name,
                }
                ;(seriesItem.data || []).forEach((value, index) => {
                    row['data' + index] = value
                    if (!columns[index]) {
                        columns.push({ time: res.times[index], key: 'data' + index })
                    }
                })
                rows.push(row)
            })
            this.timesNumDatas = rows
            this.timesDatas = columns
            this.refreshHistoryTable()
        },
        exportEct() {
            if (!this.netWorkNavEct) return
            let ect = this.netWorkNavEct
            let th = ['时间'].concat((ect.series || []).map((item) => item.name))
            let row = []
            for (let i = 0; i < ect.times.length; i++) {
                let currentRow = [ect.times[i]]
                ;(ect.series || []).forEach((seriesItem) => {
                    currentRow.push(seriesItem.data && seriesItem.data[i] !== undefined ? seriesItem.data[i] : null)
                })
                row.push(currentRow)
            }
            exportFile.xlsxFile(XLSX, ect.yaxisName, {
                [ect.yaxisName]: [th, ...row],
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.event-title {
    text-align: center;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;

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

    .date-btn-box {
        position: absolute;
        top: 33px;
        right: 90px;
        display: flex;
        align-items: center;
        z-index: 888;
    }
}

.title-2 {
    img {
        width: 90%;
    }
}

.nav-box {
    display: flex;
    justify-content: space-around;
    left: 45px;
    position: relative;
    // flex-wrap: wrap;

    li {
        // min-width: 155px;
        cursor: pointer;
        margin-right: 80px;
        overflow: hidden;
        margin-bottom: 10px;

        i {
            float: left;
            width: 33px;
            height: 33px;
        }

        img {
            width: 100%;
            height: 100%;
        }

        p {
            float: left;
            margin-left: 7px;
        }

        span {
            display: block;
            font-size: 12px;
            // transform: scale(0.9);
            font-family: PingFang SC;
            font-weight: 600;
            color: #ffffff;
            opacity: 0.8;
            // text-shadow: 0px 1px 7px #103D71;
        }

        b {
            font-size: 22px;
            font-family: DIN Condensed;
            font-weight: bold;
            color: #ffffff;
            display: inline-block;
        }

        em {
            font-size: 12px;
            opacity: 0.8;
            font-weight: bold;
            color: #fff;
        }
    }

    .active {

        span,
        b,
        em {
            color: #22f4f1;
        }
    }
}

.network-info {
    flex: 1;
    position: relative;

    .event-mon-box {
        position: absolute;
        width: 350px;
        top: 10px;
        left: 10px;
        padding: 15px;
        bottom: 0px;
        display: flex;
        flex-direction: column;
        // border: 1px solid #2e94e1;
        // background: rgba(12, 44, 103, 0.4);
        z-index: 99;

        .screen-event-list {
            flex: 1;
            position: relative;
            margin-top: 20px;

            ul {
                padding-left: 10px;
                // height: 20px;
                display: flex;

                font-size: 12px;
                font-family: PingFang SC;
                color: #ffffff;
            }

            .list-th {
                background: #14365f;
                height: 18px;

                li {
                    font-size: 12px;
                    // transform: scale(0.8);
                    font-family: PingFang SC;
                    font-weight: 600;
                    line-height: 18px;
                    flex: 1;
                }
            }

            .list-tr-box {
                position: absolute;
                top: 20px;
                bottom: 0;
                width: 100%;
                // height: 100px;
                // background: red;

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
                }
            }
        }
    }

    .network-from {
        position: absolute;
        width: 1080px;
        max-height: 300px;
        top: 10px;
        left: 400px;
        padding: 15px;
        bottom: 0px;
        display: flex;
        flex-direction: column;
        // border: 1px solid #2e94e1;
        // background: rgba(12, 44, 103, 0.4);
        z-index: 99;
    }

    .network-data {
        position: absolute;
        width: 1080px;
        top: 350px;
        left: 400px;
        padding: 15px;
        bottom: 0px;
        display: flex;
        flex-direction: column;
        // border: 1px solid #2e94e1;
        // background: rgba(12, 44, 103, 0.4);
        z-index: 99;

        .export-ect {
            display: flex;
            align-items: center;

            .el-button {
                margin-left: 15px;
            }
        }

        .ect-table {
            margin-top: 10px;
        }
    }
}

.date-box {
  width: 180px;
  margin-right: 10px;
}
.date-title {
  font-size: 16px;
  margin-top: 3px;
  margin-right: 5px;
}
</style>
