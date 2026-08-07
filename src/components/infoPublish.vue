<template>
  <div class="component-box">
    <div class="main">
      <div class="alarm-table">
        <div class="header">
          <h3>建议发布信息</h3>
          <i @click="close">x</i>
        </div>
        <p>{{ info.location }}</p>
        <div class="publish-info">
          <li>
            <span style="line-height: 140px">信息屏发布信息：</span>
            <b
              style="
                width: 250px;
                font-size: 50px;
                color: #ce2a33;
                background: #000;
              "
            >
              隧道火灾<br />禁止驶入
            </b>
          </li>
          <li>
            <span>车道灯：</span>
            <b>
              <img :src="laneStopIcon" alt="" />
            </b>
            <em>关闭</em>
          </li>
          <li>
            <span>信号灯：</span>
            <b>
              <img :src="signalStopIcon" alt="" />
            </b>
            <em>红灯</em>
          </li>
        </div>
        <div class="button" @click="close">确认</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import laneStopIcon from '@/assets/image/screen/1920/stop1.png'
import signalStopIcon from '@/assets/image/screen/1920/stop.png'

interface PublishInfo {
  location?: string
  [key: string]: unknown
}

interface PublishInfoParent {
  publishInfo: PublishInfo | null | ''
}

defineProps<{
  info: PublishInfo
}>()

const instance = getCurrentInstance()
const parent = instance?.proxy?.$parent as PublishInfoParent | undefined

function close(): void {
  if (parent) {
    parent.publishInfo = null
  }
}
</script>

<style lang="scss">
.alarm-table {
  flex: 1;
  padding: 30px;

  .header {
    display: flex;
    width: 100%;
    height: 30px;
    line-height: 30px;

    h3 {
      flex: 1;
      text-align: center;
    }

    i {
      float: right;
      font-size: 18px;
      cursor: pointer;
    }
  }

  p {
    margin: 40px 0;
    font-size: 40px;
    text-align: center;
  }

  .publish-info {
    li {
      margin-bottom: 40px;
      overflow: hidden;
      line-height: 60px;

      span {
        float: left;
        width: 50%;
        font-size: 26px;
        text-align: right;
      }

      b {
        float: left;
        text-align: center;
      }

      em {
        float: left;
        margin-left: 20px;
        font-size: 22px;
      }
    }
  }

  .button {
    width: 75px;
    height: 25px;
    margin: 0 auto;
    line-height: 25px;
    color: #000;
    text-align: center;
    cursor: pointer;
    background: #fff;
    border: 1px solid #000;
    border-radius: 3px;
  }
}
</style>
