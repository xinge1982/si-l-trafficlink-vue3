<template>
  <div class="cross-valuate-box" style="background: rgba(0, 0, 0, 0.5)">
    <div class="infoserve-map">
      <home-map />
      <div class="hw-list-box">
        <div class="hw-list-btn">
          <li
            v-for="item in eventMenu"
            :key="item.value"
            :class="{ active: active === item.value }"
            @click="active = item.value"
          >
            {{ item.name }}
          </li>
        </div>
        <div class="hw-list">
          <ul>
            <li style="flex: 0.8">序号</li>
            <li style="flex: 1.2">类型</li>
            <li style="flex: 5">位置</li>
            <li style="flex: 2">开始时间</li>
            <li style="flex: 1.5">预案</li>
          </ul>
          <div class="hw-list-c">
            <ul
              v-for="(item, index) in eventList"
              :key="item.id"
              :class="{ evtActive: item.id === evtActive }"
              @click="evtActive = item.id"
            >
              <li style="flex: 0.8">{{ index + 1 }}</li>
              <li style="flex: 1.2">{{ item.typeName }}</li>
              <li style="flex: 5">{{ item.location }}</li>
              <li style="flex: 2">{{ item.startTime }}</li>
              <li style="flex: 1.5">{{ item.plan }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div
        class="hw-publish-info"
        :class="{
          'hw-publish-info1': active === 1 && evtActive !== null,
          'hw-publish-info3': active === 3 && evtActive !== null,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import http from '@/api/http'

interface EventMenuItem {
  name: string
  value: number
}

interface EventItem {
  id: string | number
  typeName?: string
  location?: string
  startTime?: string
  plan?: string
}

interface EventMenuResponse {
  data?: EventMenuItem[]
}

interface EventListResponse {
  data?: {
    resultList?: EventItem[]
  }
}

interface MapLike {
  on(eventName: string, handler: () => void): void
  off?(eventName: string, handler: () => void): void
}

const eventMenu = ref<EventMenuItem[]>([])
const active = ref(1)
const eventList = ref<EventItem[]>([])
const evtActive = ref<string | number | null>(null)

let mapInstance: MapLike | undefined

function clearEventSelection(): void {
  evtActive.value = null
}

function getGlobalMap(): MapLike | undefined {
  return (globalThis as typeof globalThis & { map?: MapLike }).map
}

function bindMapClick(): void {
  const currentMap = getGlobalMap()
  if (!currentMap || currentMap === mapInstance) {
    return
  }

  mapInstance?.off?.('click', clearEventSelection)
  mapInstance = currentMap
  mapInstance.on('click', clearEventSelection)
}

async function getEventMenus(): Promise<void> {
  try {
    const response = await http.get<EventMenuResponse>(
      `${window.APP_CONFIG.SERVICE_URL}expressway/event/getEventMenus`,
    )
    eventMenu.value = response.data?.data ?? []
    await getEventList()
  } catch (error) {
    console.error('Load event menus failed:', error)
    eventMenu.value = []
    eventList.value = []
  }
}

async function getEventList(): Promise<void> {
  try {
    const response = await http.get<EventListResponse>(
      `${window.APP_CONFIG.SERVICE_URL}expressway/event/getEventList`,
      {
        params: {
          type: active.value,
          pageSize: 7,
        },
      },
    )
    eventList.value = response.data?.data?.resultList ?? []
    bindMapClick()
  } catch (error) {
    console.error('Load event list failed:', error)
    eventList.value = []
  }
}

watch(active, () => {
  evtActive.value = null
  void getEventList()
})

onMounted(() => {
  void getEventMenus()
})

onBeforeUnmount(() => {
  mapInstance?.off?.('click', clearEventSelection)
  mapInstance = undefined
})
</script>

<style lang="scss">
@media screen and (max-width: 2400px) {
  .infoserve-map {
    position: absolute;
    right: 0;
    left: 0;
    height: 100%;
  }

  .hw-list-box {
    position: absolute;
    top: 200px;
    left: 40px;
    width: 775px;
    height: 500px;

    .hw-list-btn {
      display: flex;
      width: 100%;

      li {
        width: 108px;
        height: 27px;
        margin: 0 0 20px 20px;
        font-family: 'Adobe Heiti Std', sans-serif;
        font-size: 17px;
        font-weight: normal;
        line-height: 27px;
        text-align: center;
        cursor: pointer;
        border: 1px solid #00b4ff;
        border-radius: 3px;
      }

      .active {
        background: linear-gradient(
          0deg,
          rgb(0 180 255 / 40%),
          rgb(0 180 255 / 5%)
        );
      }
    }

    .hw-list {
      width: 745px;
      height: 455.5px;
      padding: 30px 10px 30px 30px;
      background: url(../assets/image/screen/list-bg.png);
      background-size: 100% 100%;

      ul {
        display: flex;
        font-family: 'Adobe Heiti Std', sans-serif;
        font-size: 14px;
        font-weight: normal;
        color: #52ccff;
      }
    }

    .hw-list-c {
      ul {
        padding: 20px 0;
        color: #fff;
        cursor: pointer;
      }

      .evtActive {
        background: url(../assets/image/screen/td-bg.png);
        background-size: 100% 100%;
      }
    }
  }

  .hw-publish-info {
    position: absolute;
    top: 200px;
    right: 40px;
    display: none;
    width: 1032px;
    height: 719px;
  }

  .hw-publish-info1 {
    display: block;
    background: url(../assets/image/screen/acd.png);
    background-size: cover;
  }

  .hw-publish-info3 {
    display: block;
    background: url(../assets/image/screen/road-work.png);
    background-size: cover;
  }
}

@media screen and (min-width: 2400px) {
  .infoserve-map {
    position: absolute;
    right: 0;
    left: 0;
    height: 100%;
  }

  .hw-list-box {
    position: absolute;
    top: 400px;
    left: 80px;
    width: 1550px;
    height: 1000px;

    .hw-list-btn {
      display: flex;
      width: 100%;

      li {
        width: 216px;
        height: 54px;
        margin: 0 0 40px 40px;
        font-family: 'Adobe Heiti Std', sans-serif;
        font-size: 34px;
        font-weight: normal;
        line-height: 54px;
        text-align: center;
        cursor: pointer;
        border: 2px solid #00b4ff;
        border-radius: 6px;
      }

      .active {
        background: linear-gradient(
          0deg,
          rgb(0 180 255 / 40%),
          rgb(0 180 255 / 5%)
        );
      }
    }

    .hw-list {
      width: 1450px;
      height: 900px;
      padding: 60px 20px 60px 50px;
      background: url(../assets/image/screen/list-bg.png);
      background-size: 100% 100%;

      ul {
        display: flex;
        font-family: 'Adobe Heiti Std', sans-serif;
        font-size: 30px;
        font-weight: normal;
        color: #52ccff;
      }

      .hw-list-c {
        ul {
          padding: 40px 0;
          color: #fff;
          cursor: pointer;
        }

        .evtActive {
          background: url(../assets/image/screen/td-bg.png);
        }
      }
    }
  }

  .hw-publish-info {
    position: absolute;
    top: 400px;
    right: 80px;
    display: none;
    width: 2064px;
    height: 1438px;
  }

  .hw-publish-info1 {
    display: block;
    background: url(../assets/image/screen/acd.png);
    background-size: cover;
  }

  .hw-publish-info3 {
    display: block;
    background: url(../assets/image/screen/road-work.png);
    background-size: cover;
  }
}
</style>
