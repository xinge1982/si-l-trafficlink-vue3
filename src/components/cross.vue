<template>
  <div class="nav-bar">
    <li class="nav nav-out" @click="goHome">
      <i><img :src="backIcon" alt="" /></i>
      <span>返回</span>
    </li>

    <div class="nav-box">
      <li
        v-for="(item, index) in crossInfoNavMenu"
        :key="`${item.component}-${index}`"
        class="nav"
        :class="{ 'data-type-active': crossInfoNav === index }"
        @click="crossInfoNavClick(item, index)"
      >
        <span>{{ item.name }}</span>
      </li>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/http'
import backIcon from '@/assets/image/screen/1920/back.png'

interface CrossData {
  crossId?: string | number
  type?: string
}

interface MenuItem {
  name: string
  component: string
  params?: string
  children?: MenuItem[]
}

interface CrossItem {
  crossId: string | number
  [key: string]: unknown
}

interface CrossListResponse {
  data?: {
    resultList?: CrossItem[]
  }
}

const router = useRouter()
const instance = getCurrentInstance()
const parent = instance?.proxy?.$parent as any

const isRouterShow = ref(true)
const crossInfoNavMenu = ref<MenuItem[]>([])
const crossInfoNav = ref<number | null>(null)
const crossName = ref('')
const crossList = ref<CrossItem[]>([])
const crossListObj = ref<Record<string, CrossItem>>({})
const homeCrossingRemoved = ref(false)

const storedCrossData = sessionStorage.getItem('crossData')
const crossData = ref<CrossData>(storedCrossData ? JSON.parse(storedCrossData) : {})
const crossId = ref<string | number>(crossData.value.crossId ?? '')

function getLogoService(): string {
  return window.APP_CONFIG.LOGO_SERVICE
}

function getServiceUrl(): string {
  return window.APP_CONFIG.SERVICE_URL
}

function getModuleName(): string {
  return window.APP_CONFIG.moduleName
}

async function goHome(): Promise<void> {
  if (router.currentRoute.value.name === 'home') {
    parent.crossData = null
    parent.eventId = null
    parent.trackPlay = true
    parent.openInterval()
    parent.getRoadNetworkOverview()
    parent.getCongestionAnalysis()
    parent.getDelayAnalysis()
    parent.getTrackAnalysis()
    parent.getStatsList()
    parent.clearcrossId()
    parent.openIntervalAll()
    parent.getCrossTop10()
    parent.setMapZoom()
    return
  }

  await router.push({ path: '/home' })
  crossInfoNav.value = null
  parent.trackPlay = true
  parent.autoPolling = true

  const playBack = parent.$refs?.playBack
  if (homeCrossingRemoved.value && playBack) {
    playBack.homeMap?.addLayer(playBack.createCustomLayer('crossing'))
  }
}

async function reload(): Promise<void> {
  isRouterShow.value = false
  await nextTick()
  isRouterShow.value = true
}

async function crossInfoNavClick(item: MenuItem, index: number): Promise<void> {
  parent.trackPlay = false
  parent.autoPolling = false
  crossInfoNav.value = index
  parent.clearInterval()
  parent.clearIntervalAll()
  parent.crossStatusList = []

  await router.push({ path: `/${item.component}` })

  const playBack = parent.$refs?.playBack
  if (!playBack) {
    return
  }

  const homeMap = playBack.homeMap
  if (homeMap?.getLayer?.('crossing')) {
    homeMap.removeLayer('crossing')
  }

  playBack.crossing?.clear?.()
  homeCrossingRemoved.value = true
}

async function closecrossInfo(): Promise<void> {
  await router.push('/home')
}

async function getModule(): Promise<void> {
  try {
    const response = await http.get<MenuItem[]>(
      `${getLogoService()}mapabc-admin-system/api/v1/menus/build/module`,
      { params: { moduleName: getModuleName() } },
    )

    let menus = response.data?.[0]?.children ?? []
    if (crossData.value.type) {
      menus = menus.filter((item) => item.params === crossData.value.type)
    }

    const hasChinese = /[\u4e00-\u9fa5]/
    const isChinese = navigator.language.includes('zh')
    crossInfoNavMenu.value = menus.filter((item) =>
      isChinese ? hasChinese.test(item.name) : !hasChinese.test(item.name),
    )

    window.APP_CONFIG.nextRoute = [
      'home',
      'homeScreen',
      ...crossInfoNavMenu.value.map((item) => item.component),
    ]
  } catch (error) {
    console.error('Load cross module menu failed:', error)
    crossInfoNavMenu.value = []
  }
}

async function getCrossTopByType(): Promise<void> {
  try {
    const response = await http.get<CrossListResponse>(
      `${getServiceUrl()}cityV2/getCrossTopByType`,
      {
        params: {
          currentPage: 1,
          pageSize: 100,
          search: crossName.value,
          type: '',
        },
      },
    )

    crossList.value = response.data?.data?.resultList ?? []
    crossListObj.value = Object.fromEntries(
      crossList.value.map((item) => [String(item.crossId), item]),
    )
  } catch (error) {
    console.error('Load crossing list failed:', error)
    crossList.value = []
    crossListObj.value = {}
  }
}

onMounted(() => {
  void Promise.all([getModule(), getCrossTopByType()])
})

defineExpose({
  closecrossInfo,
  crossId,
  crossList,
  crossListObj,
  isRouterShow,
  reload,
})
</script>

<style lang="scss">
@media screen and (max-width: 3800px) {
  .nav-bar {
    .nav-box {
      position: fixed;
      top: 96px;
      left: 50%;
      z-index: 9999;
      display: flex;
      height: 29px;
      padding: 1px;
      margin: 0 auto;
      background: rgb(26 39 95 / 45%);
      border: 1px solid #2e94e1;
      border-radius: 3px;
      transform: translateX(-50%);

      .data-type-active {
        background: #166dc7;
      }
    }

    .nav {
      width: 110px;
      text-align: center;
      cursor: pointer;

      span {
        font-family: 'PingFang SC', sans-serif;
        font-size: 16px;
        font-weight: bold;
        line-height: 29px;
        color: #fff;
        opacity: 0.8;
      }
    }

    .nav-out {
      position: fixed;
      top: 96px;
      left: 605px;
      z-index: 9999;
      width: 94px;
      margin-right: 0;
      background: rgb(26 39 95 / 45%);
      border: 1px solid #2e94e1;
      border-radius: 3px;
    }
  }
}

@media screen and (min-width: 3800px) {
  .nav-bar {
    .nav-box {
      position: fixed;
      top: 192px;
      left: 50%;
      z-index: 9999;
      display: flex;
      height: 56px;
      padding: 2px;
      margin: 0 auto;
      background: rgb(26 39 95 / 45%);
      border: 2px solid #2e94e1;
      border-radius: 6px;
      transform: translateX(-50%);
    }

    .nav {
      width: 220px;
      text-align: center;
      cursor: pointer;

      span {
        font-family: 'PingFang SC', sans-serif;
        font-size: 32px;
        font-weight: bold;
        line-height: 56px;
        color: #fff;
        opacity: 0.8;
      }
    }

    .data-type-active {
      background: #166dc7;
    }

    .nav-out {
      position: fixed;
      top: 192px;
      left: 1210px;
      z-index: 9999;
      width: 188px;
      margin-right: 0;
      background: rgb(26 39 95 / 45%);
      border: 2px solid #2e94e1;
      border-radius: 6px;
    }
  }
}
</style>
