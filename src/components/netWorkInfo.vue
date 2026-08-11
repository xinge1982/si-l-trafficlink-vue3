<template>
    <div>
        <div class="main" style="z-index: 99">
            <div style="flex: 1; padding: 30px 40px; display: flex; flex-direction: column">
                <div class="event-title">
                    <span>路网监测</span>
                    <div class="date-btn-box">
                        <span class="date-title">分析日期</span>
                        <div class="date-box">
                            <el-date-picker v-model="analysisTime" type="date" clearable value-format="YYYY-MM-DD" placeholder="选择日期" :disabled-date="disabledDate" @change="dateChange()">
                            </el-date-picker>
                        </div>
                    </div>
                    <el-icon class="close-icon" @click="close"><Close /></el-icon>
                </div>
                <div class="title-2">
                    <span>路网统计</span>
                    <img :src="networkLine" alt="" />
                </div>
                <div class="nav-box" v-if="netWorkStatistics">
                    <li v-for="item in netWorkStatistics" :class="netWorkNav === item.id ? 'active' : ''" @click="netWorkNav = item.id" :key="item.id">
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
                            <el-button size="small" type="primary" @click="exportEct()">
                                <el-icon><Upload /></el-icon>
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
<script setup lang="ts">
import { getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Close, Upload } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import * as XLSX from 'xlsx/xlsx.mjs'
import http from '@/api/http'
import EchartsLarge from '@/tool/echartsLarge'
import exportFile from '@/plugin/xlsxFile'
import networkLine from '@/assets/image/screen/network/line.png'

interface NetworkStatistic {
    id: string | number
    icon: string
    value: string | number
    unit: string
    name: string
}

interface CrossStatistic {
    crossId: string | number
    name: string
    value: string | number
}

interface ChartSeries {
    name: string
    type?: string
    smooth?: boolean
    data: Array<string | number | null | undefined>
    areaStyle?: unknown
}

interface ChartResponse {
    yaxisName?: string
    times?: string[]
    series?: ChartSeries[]
}

interface NetworkChart {
    yaxisName: string
    times: string[]
    series: ChartSeries[]
}

interface TableRow {
    label: string
    [key: string]: string | number | null | undefined
}

interface TableColumn {
    time: string
    key: string
}

interface TableInstance {
    doLayout?: () => void
}

interface ChartInstance {
    setOption: (option: unknown) => void
    dispose?: () => void
}

interface ParentState {
    isNetWorkInfo: boolean
}

const instance = getCurrentInstance()
const parent = instance?.proxy?.$parent as ParentState | undefined
const imageModules = import.meta.glob(
    '../assets/image/screen/network/*.png',
    { eager: true, import: 'default' },
) as Record<string, string>

const analysisTime = ref('')
const netWorkStatistics = ref<NetworkStatistic[]>([])
const netWorkNav = ref<string | number>('')
const netWorkNavEct = ref<NetworkChart | null>(null)
const netWorkEct = ref<ChartInstance | null>(null)
const corssList = ref<CrossStatistic[]>([])
const crossOrder = ref(1)
const timesNumDatas = ref<TableRow[]>([])
const timesDatas = ref<TableColumn[]>([])
const tableRenderKey = ref(0)
const historyTable = ref<TableInstance | null>(null)
const width = window.innerWidth

function close(): void {
    if (parent) parent.isNetWorkInfo = false
}

function disabledDate(time: Date): boolean {
    return time.getTime() > Date.now()
}

function dateChange(): void {
    void getNetWorkStatistics()
    void getCorssList()
    void getIdxChart()
}

function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const day = `${date.getDate()}`.padStart(2, '0')
    return `${year}-${month}-${day}`
}

function getCompareDates(): { currentDate: string; previousDate: string } {
    const baseDate = analysisTime.value
        ? new Date(`${analysisTime.value}T00:00:00`)
        : new Date()
    const previousDate = new Date(baseDate)
    previousDate.setDate(previousDate.getDate() - 1)
    return {
        currentDate: formatDate(baseDate),
        previousDate: formatDate(previousDate),
    }
}

function getCurrentParams(): Record<string, string | number> {
    return analysisTime.value
        ? {
            startTime: `${analysisTime.value} 00:00:00`,
            endTime: `${analysisTime.value} 23:59:59`,
        }
        : { type: 2 }
}

function getCompareParams(dateText: string): Record<string, string | number> {
    return {
        startTime: `${dateText} 00:00:00`,
        endTime: `${dateText} 23:59:59`,
        id: netWorkNav.value,
    }
}

function normalizeSeriesData(
    series: ChartSeries | undefined,
    times: string[] = [],
): Record<string, string | number | null | undefined> {
    return times.reduce<Record<string, string | number | null | undefined>>(
        (result, time, index) => {
            result[time] = series?.data[index]
            return result
        },
        {},
    )
}

function mergeTimes(primary: string[] = [], secondary: string[] = []): string[] {
    return [...new Set([...primary, ...secondary])]
}

function getImageSrc(icon: string): string {
    return imageModules[`../assets/image/screen/network/${icon}.png`]
        ?? imageModules['../assets/image/screen/network/llll.png']
        ?? ''
}

async function getNetWorkStatistics(): Promise<void> {
    try {
        const response = await http.get<{ data?: NetworkStatistic[] }>(
            `${window.APP_CONFIG.SERVICE_URL_v2}/getTotalIndexInfo`,
            { params: getCurrentParams() },
        )
        netWorkStatistics.value = response.data?.data ?? []
        if (!netWorkNav.value && netWorkStatistics.value.length) {
            netWorkNav.value = netWorkStatistics.value[0].id
        }
    } catch (error) {
        console.error('Load network statistics failed:', error)
        netWorkStatistics.value = []
    }
}

async function getCorssList(): Promise<void> {
    if (!netWorkNav.value) return
    const params: Record<string, string | number> = {
        ...getCurrentParams(),
        id: netWorkNav.value,
        order: crossOrder.value,
    }
    try {
        const response = await http.get<{ data?: CrossStatistic[] }>(
            `${window.APP_CONFIG.SERVICE_URL_v2}/getIdxOfCross`,
            { params },
        )
        corssList.value = response.data?.data ?? []
    } catch (error) {
        console.error('Load crossing statistics failed:', error)
        corssList.value = []
    }
}

async function getIdxChart(): Promise<void> {
    if (!netWorkNav.value) return
    const compareDates = getCompareDates()
    const currentLabel = analysisTime.value ? compareDates.currentDate : '今日'
    const previousLabel = analysisTime.value ? compareDates.previousDate : '昨日'

    try {
        const [currentData, previousData] = await Promise.all([
            http.get<{ data?: ChartResponse }>(
                `${window.APP_CONFIG.SERVICE_URL_v2}/getIdxChart`,
                { params: getCompareParams(compareDates.currentDate) },
            ),
            http.get<{ data?: ChartResponse }>(
                `${window.APP_CONFIG.SERVICE_URL_v2}/getIdxChart`,
                { params: getCompareParams(compareDates.previousDate) },
            ),
        ])
        const currentRes = currentData.data?.data ?? {}
        const previousRes = previousData.data?.data ?? {}
        const currentSeries = currentRes.series?.[0]
        const previousSeries = previousRes.series?.[0]
        const times = mergeTimes(currentRes.times, previousRes.times)
        const currentMap = normalizeSeriesData(currentSeries, currentRes.times)
        const previousMap = normalizeSeriesData(previousSeries, previousRes.times)
        const series: ChartSeries[] = [
            {
                name: previousLabel,
                type: 'line',
                smooth: false,
                data: times.map((time) => previousMap[time]),
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(25, 188, 241,1)' },
                        { offset: 1, color: 'rgba(25, 188, 241,0.1)' },
                    ]),
                },
            },
            {
                name: currentLabel,
                type: 'line',
                smooth: false,
                data: times.map((time) => currentMap[time]),
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(55, 237, 246,1)' },
                        { offset: 1, color: 'rgba(55, 237, 246,0.1)' },
                    ]),
                },
            },
        ]
        const result: NetworkChart = {
            yaxisName: currentRes.yaxisName ?? previousRes.yaxisName ?? '',
            times,
            series,
        }
        netWorkNavEct.value = result
        setEctTable(result)

        await nextTick()
        netWorkEct.value?.dispose?.()
        netWorkEct.value = EchartsLarge.lineChart2({
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
            gridTop: width > 3800 ? 30 : 15,
            gridRight: 0,
            yaxisTick: false,
            yaxisLine: false,
            axisLabelFontSize: width > 3800 ? 24 : 12,
            ysplitLine: true,
            series,
            boundaryGap: true,
            nameTextStyle: { color: '#fff', fontSize: 16 },
            nameGap: 25,
        }) as ChartInstance
    } catch (error) {
        console.error('Load network trend failed:', error)
        netWorkNavEct.value = null
        timesNumDatas.value = []
        timesDatas.value = []
    }
}

function tableHeaderStyle({ rowIndex }: { rowIndex: number }): string | undefined {
    if (rowIndex === 0) {
        return 'background-color: #ccc; color: #000; padding: 12px 0'
    }
}

function tableCellStyle({ rowIndex }: { rowIndex: number }): string | undefined {
    if (rowIndex === 0) return 'background-color: #333; color: #fff'
}

function refreshHistoryTable(): void {
    tableRenderKey.value += 1
    void nextTick(() => historyTable.value?.doLayout?.())
}

function setEctTable(result: NetworkChart): void {
    const columns: TableColumn[] = []
    timesNumDatas.value = result.series.map((seriesItem) => {
        const row: TableRow = { label: seriesItem.name }
        seriesItem.data.forEach((value, index) => {
            row[`data${index}`] = value
            columns[index] ??= {
                time: result.times[index],
                key: `data${index}`,
            }
        })
        return row
    })
    timesDatas.value = columns
    refreshHistoryTable()
}

function exportEct(): void {
    const chart = netWorkNavEct.value
    if (!chart) return
    const header = ['时间', ...chart.series.map((item) => item.name)]
    const rows = chart.times.map((time, index) => [
        time,
        ...chart.series.map((item) => item.data[index] ?? null),
    ])
    exportFile.xlsxFile(XLSX, chart.yaxisName || '路网监测', {
        [chart.yaxisName || '路网监测']: [header, ...rows],
    })
}

watch(netWorkNav, () => {
    void getCorssList()
    void getIdxChart()
})

onMounted(() => {
    void getNetWorkStatistics()
})

onBeforeUnmount(() => {
    netWorkEct.value?.dispose?.()
})
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
