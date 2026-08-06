<template>
  <div id="flv-js-player">
    <el-main style="height: 100%">
      <el-row style="height: 100%">
        <el-col
            ref="videoContainer"
            :lg="{span:12, offset:6}"
            :md="{span:16, offset:4}"
        >
          <el-form>
            <el-form-item style="text-align: center">
              <div class="flv-text">
                带宽速率：
                <span>{{ speed }}kb/s</span>
                缓存差值：
                <span>{{ buffer }}s</span>
              </div>
            </el-form-item>
          </el-form>
          <video
              ref="video"
              :controls="props.playback"
              loop
              autoplay
              muted
              preload="none"
              :style="`height:${props.height}px`"
          />
          <button
              v-if="!props.playback"
              class="fullscreen-btn"
              @click="toggleFullscreen"
          >
            {{ isFullscreen ? '还原' : '全屏' }}
          </button>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount
} from 'vue'

import { ElMessage } from 'element-plus'

import mpegts from 'mpegts.js'


interface Props {
  address?: string
  height?: number
  playback?: boolean
}


const props = withDefaults(
    defineProps<Props>(),
    {
      height:400,
      playback:false
    }
)


const video = ref<HTMLVideoElement | null>(null)
const videoContainer = ref<any>(null)
const player = ref<any>(null)

const speed = ref(0)
const buffer = ref(0)
const isFullscreen = ref(false)

const currentUrl = ref('')
let reconnectTimer:any = null

function play(url:string){
  currentUrl.value=url
  load()
}

function load(){
  destroy()

  if(!currentUrl.value){
    console.log(
        'empty flv url'
    )
    return
  }

  if(!mpegts.isSupported()){
    ElMessage.error(
        'browser does not support mpegts'
    )
    return
  }

  player.value =
      mpegts.createPlayer(
          {
            type:'flv',
            url:currentUrl.value,
            isLive:true,
            hasAudio:false,
            hasVideo:true
          },

          {
            enableStashBuffer:false,
            autoCleanupSourceBuffer:true,
            stashInitialSize:128,
            liveBufferLatencyChasing:true,
            liveBufferLatencyMaxLatency:1.5
          }
      )

  player.value.attachMediaElement(
      video.value
  )

  /*
    replace flv-extend onError
  */
  player.value.on(
      mpegts.Events.ERROR,
      (
          type:any,
          detail:any
      )=>{

        console.log(
            'mpegts error',
            type,
            detail
        )
        reconnect()
      }
  )

  /*
    replace player.onstats
  */
  player.value.on(
      mpegts.Events.STATISTICS_INFO,
      (stats:any)=>{

        speed.value =
            Math.trunc(
                stats.speed
            )

        if(video.value){
          const buffered =
              video.value.buffered

          if(
              buffered.length
          ){
            const diff =
                buffered.end(0)
                -
                video.value.currentTime

            buffer.value =
                Math.round(
                    diff * 100
                ) / 100
          }
        }
      }
  )

  player.value.load()
  player.value.play()

  if(video.value){
    ;(video.value as any)
        .disablePictureInPicture=true
  }
}

function reconnect(){
  if(reconnectTimer){
    return
  }

  console.log(
      'mpegts reconnect'
  )

  reconnectTimer =
      setTimeout(()=>{
        reconnectTimer=null
        load()
      },500)
}

function pause(){
  player.value?.pause()
}

function destroy(){
  if(reconnectTimer){
    clearTimeout(
        reconnectTimer
    )
    reconnectTimer=null
  }

  if(player.value){

    try{
      player.value.pause()
      player.value.unload()
      player.value.detachMediaElement()
      player.value.destroy()
    }catch(e){
      console.log(e)
    }

    player.value=null
  }
  speed.value=0
  buffer.value=0
}

function toggleFullscreen(){
  const container =
      videoContainer.value?.$el ??
      videoContainer.value
  if(!container){
    return
  }

  if(!isFullscreen.value){
    container.requestFullscreen?.()
  }else{
    document.exitFullscreen?.()
  }
}

function onFullscreenChange(){
  const container =
      videoContainer.value?.$el ??
      videoContainer.value

  isFullscreen.value =
      document.fullscreenElement === container
}

onMounted(()=>{

  if(props.address){
    currentUrl.value =
        props.address
    load()
  }

  document.addEventListener(
      'fullscreenchange',
      onFullscreenChange
  )

})

onBeforeUnmount(()=>{

  document.removeEventListener(
      'fullscreenchange',
      onFullscreenChange
  )

  destroy()

})

defineExpose({
  play,
  pause,
  destroy
})
</script>
<style lang="scss">
#flv-js-player {
  width: 100%;
}
.flv-text {
  color: #cbcccb;
  white-space: nowrap;
  overflow: hidden;
}
.flv-text span {
  color: #fff;
  margin: 0 5px;
}
video {
  width: 100%;
}
.el-main {
  padding: 0;
  padding-top: 10px;
}
.el-form-item {
  margin-bottom: 0;
}
.fullscreen-btn {
  position: absolute;
  right: 15px;
  bottom: 15px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
