<template>
  <div class="cross-name">
    <div class="select-box">
      <el-select
        v-model="crossId"
        filterable
        :placeholder="$t('home.pleaseChoose')"
        @change="crossIdChange"
      >
        <el-option
          v-for="item in crossList"
          :key="item.crossId"
          :label="item.crossName"
          :value="item.crossId"
        />
      </el-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import http from '@/api/http'

interface CrossItem {
  crossId: string | number
  crossName: string
  type?: string
  [key: string]: unknown
}

interface CrossLocationResponse {
  data?: Record<string, CrossItem[]>
}

const emit = defineEmits<{
  change: [crossData: CrossItem]
  parentMethod: []
}>()

const crossData = ref<CrossItem | null>(getStoredCrossData())
const crossId = ref<string | number>('')
const crossList = ref<CrossItem[]>([])
const crossListObj = ref<Record<string, CrossItem>>({})

function getStoredCrossData(): CrossItem | null {
  const storedCrossData = sessionStorage.getItem('crossData')
  if (!storedCrossData) {
    return null
  }

  try {
    return JSON.parse(storedCrossData) as CrossItem
  } catch (error) {
    console.error('Parse stored crossing data failed:', error)
    return null
  }
}

function crossIdChange(): void {
  const selectedCross = crossListObj.value[String(crossId.value)]
  if (!selectedCross) {
    return
  }

  crossData.value = selectedCross
  emit('change', selectedCross)
}

async function getCrossLocation(): Promise<void> {
  try {
    const response = await http.get<CrossLocationResponse>(
      `${window.APP_CONFIG.SERVICE_URL_v2}/getCrossLocation`,
    )
    const locations = response.data?.data ?? {}
    const listType =
      crossData.value?.type ??
      (window.APP_CONFIG.WEB_TYPE === 'cross' ? 'cross' : 'road')

    crossList.value = locations[listType] ?? []
    crossListObj.value = Object.fromEntries(
      crossList.value.map((item) => [String(item.crossId), item]),
    )

    if (crossList.value.length === 0) {
      crossId.value = ''
      return
    }

    if (crossData.value?.crossId !== undefined) {
      crossId.value = crossData.value.crossId
    } else {
      const firstCross = crossList.value[0]
      crossData.value = firstCross
      crossId.value = firstCross.crossId
      sessionStorage.setItem('crossData', JSON.stringify(firstCross))
    }

    emit('parentMethod')
  } catch (error) {
    console.error('Load crossing locations failed:', error)
    crossList.value = []
    crossListObj.value = {}
    crossId.value = ''
  }
}

onMounted(() => {
  void getCrossLocation()
})

defineExpose({
  crossData,
  crossId,
  crossList,
  crossListObj,
  getCrossLocation,
})
</script>

<style lang="scss">
.cross-name {
  display: flex;
  width: 100%;
  margin-bottom: 38px;

  img {
    width: 16px;
    height: 16px;
    margin-top: 10px;
    vertical-align: center;
  }

  p {
    flex: 1;
    margin-left: 17px;
    overflow: hidden;
    font-family: 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 38px;
    color: #fff;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .select-box {
    width: 100%;

    .el-input__inner {
      height: 35px;
      font-size: 14px;
    }

    .el-select .el-input.is-focus .el-input__inner {
      border-color: #2e94e1;
    }
  }
}
</style>
