/*
 * @Author: liushan
 * @Date: 2020-04-07
 * @Description: 带播放功能的时间轴
 */
<template>
  <div class="timeline_main">
    <div class="timeline_control">
      <div class="menu_play">
        <i class="menu_icon el-icon-d-arrow-left" :class="{'menu_icon_disabled':playing}" @click="backward"></i>
        <i
          class="menu_icon"
          :class="{'el-icon-video-play':!playing, 'el-icon-video-pause':playing}"
          @click="togglePlay"
          @mouseleave="hoverIndex = -1"
        ></i>
        <i class="menu_icon el-icon-d-arrow-right" :class="{'menu_icon_disabled':playing}" @click="forward"></i>
      </div>
      <div class="menu_setting">
        <i class="menu_icon el-icon-caret-top" :class="{'menu_icon_disabled':playing}" @click="speedSlow"></i>
        <i class="speed">{{ options.speed +' s'}}</i>
        <i class="menu_icon el-icon-caret-bottom" :class="{'menu_icon_disabled':playing}" @click="speedQuick"></i>
      </div>
    </div>
    <div class="timeline_axis">
      <div class="axis_item" v-for="(time, index) in dateTimes" :key="index">
        <div
          class="axis_item_tick"
          :class="{ 'axis_item_tick_active':index === highlightIndex }"
          @mouseenter="hoverIndex = index"
          @mouseleave="hoverIndex = -1"
          @click="tickClick(time, index)"
        ></div>
        <div class="axis_item_label axis_item_label_left" v-if="index==0 ">{{ time }}</div>
        <div class="axis_item_label axis_item_label_right" v-if="index==dateTimes.length-1 ">{{ time }}</div>
        <div class="axis_item_tip" :class="index<dateTimes.length/2?'axis_item_tip_left':'axis_item_tip_right'" v-if="index === highlightIndex || index === hoverIndex">{{ time}}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">


defineOptions((() => ({
  name: 'lk-timeline',
  data() {
    return {
      intervalTimer: null, // 定时器
      dateTimeIndexes: [], // 日期列表
      playing: false, // 播放
      activeIndex: 0, // 当前的时间位置
      hoverIndex: -1, // 鼠标移入的时间位置
      resizeHandler: null
    }
  },
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    dateTimes: {
      type: Array,
      default() {
        return []
      }
    },
    
    interval: {
      type: Number,
      default() {
        return 100
      }
    },
    defaultactiveIndex: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  computed: {
    highlightIndex() {
      return (
        (this.activeIndex === -1 && this.dateTimes.length - 1) ||
        this.activeIndex
      )
    }
  },
  watch: {
    options: {
      handler() {
        this.renderTimeline()
      },
      deep: true
    },
    playing() {
      if (this.playing) {
        this.intervalTimer = setInterval(() => {
          this.activeIndex = (this.activeIndex + 1) % this.dateTimes.length
        }, this.options.speed * 1000)
      } else {
        if (this.intervalTimer) {
          clearInterval(this.intervalTimer)
          this.intervalTimer = null
        }
      }
    },
    defaultactiveIndex(){
      this.activeIndex = this.defaultactiveIndex
    },
    activeIndex() {
      const time = this.dateTimes[this.activeIndex]
      // console.log(time)
      this.$emit('getDateFun', time,this.activeIndex)
    }
  },
  created() {
    
  },
  mounted() {
   
    this.activeIndex = this.defaultactiveIndex
    this.renderTimeline()
    this.resizeHandler = () => {
      this.renderTimeline()
    }
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeUnmount() {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
      this.resizeHandler = null
    }
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer)
      this.intervalTimer = null
    }
  },
  filters: {
    formatDatetime(dateTime) {
      dateTime = dateFormat(dateTime, 'MM.dd')
      return dateTime
    }
  },
  methods: {
    // 获取时间
    getDateFun(time) {
      // console.log(time)
    },
    // 初始化时间轴
    renderTimeline() {
      // 时间轴的宽度
      const timelineWidth = this.$el.offsetWidth - 40
      // 日期个数
      const dateTimesSize = this.dateTimes.length
      // 如果时间全部显示，时间轴的理想宽度
      const dateTimesWidth = dateTimesSize * this.interval
      // 如果时间轴的宽度小于理想宽度
      if (timelineWidth >= dateTimesWidth) {
        this.dateTimeIndexes = this.dateTimes.map((dateTime, index) => {
          return index
        })
        return
      }
      // 当前时间轴的宽度最大能容纳多少日期刻度
      const maxTicks = Math.floor(timelineWidth / this.interval)
      // 间隔刻度数
      const gapTicks = Math.floor(dateTimesSize / maxTicks)
      // 记录需要显示的日期索引
      this.dateTimeIndexes = []
      for (let t = 0; t <= maxTicks; t++) {
        this.dateTimeIndexes.push(t * gapTicks)
      }
      const len = this.dateTimeIndexes.length
      // 最后一项需要特殊处理
      if (len > 0) {
        const lastIndex = this.dateTimeIndexes[len - 1]
        if (lastIndex + gapTicks > dateTimesSize - 1) {
          this.dateTimeIndexes[len - 1] = dateTimesSize - 1
        } else {
          this.dateTimeIndexes.push(dateTimesSize - 1)
        }
      }
    },
    // 点击刻度
    tickClick(time, index) {
      if (this.playing) {
        return
      }
      this.activeIndex = index
    },
    // 播放和暂停
    togglePlay() {
      this.playing = !this.playing
    },
    // 时间退后一日
    backward() {
      if (this.playing) {
        return
      }
      this.activeIndex = this.activeIndex - 1
      if (this.activeIndex === -1) {
        this.activeIndex = this.dateTimes.length - 1
      }
    },
    // 时间前进一日
    forward() {
      if (this.playing) {
        return
      }
      this.activeIndex = (this.activeIndex + 1) % this.dateTimes.length
    },
    // 减慢速度
    speedSlow() {
      if (this.playing || this.options.speed >= this.options.speedMax) {
        return
      }
      this.options.speed = (this.options.speed*10 + this.options.step*10)/10
    },
    // 加快速度
    speedQuick() {
      if (this.playing || this.options.speed <= this.options.speedMin) {
        return
      }
      this.options.speed = (this.options.speed*10 - this.options.step*10)/10
    }
  }
}))())
</script>
<style scoped>



.timeline_main {
  padding:  0;
  box-sizing: border-box;
}

.timeline_main .timeline_control {
  border-bottom: 1px solid #333;
  margin-bottom: 6px;
  overflow: hidden;
  margin-bottom: 25px;
  padding-bottom: 5px;
}

.timeline_main .timeline_control i {
  cursor: pointer;
  display: inline-block;
  font-style: normal;
}

.timeline_main .timeline_control .menu_icon {
  font-size: 14px;
  width: 14px;
  height: 14px;
  background-size: cover;
  background-repeat: no-repeat;
  color: #fff;
}

.timeline_main .timeline_control .menu_play {
  color: #00fffa;
  float: left;
}

.timeline_main .timeline_control .menu_icon_disabled {
  cursor: no-drop;
  opacity: 0.5;
}

.timeline_main .timeline_control .menu_setting {
  overflow: hidden;
  float: left;
  margin-left: 20px;
}

.timeline_main .timeline_control .menu_setting i {
  float: left;
}

.timeline_main .timeline_control .menu_setting i.speed {
  padding: 0 5px;
}

.timeline_main .timeline_control .menu_setting span {
  color: #cee7ff;
}


.timeline_main .timeline_axis {
  position: relative;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  margin-top: 20px;
}

.timeline_main .timeline_axis::before {
  content: "";
  width: 100%;
  height: 1px;
  position: absolute;
  left: 0;
  bottom: 8px;
  display: inline-block;
  background: #fff;

}

.timeline_main .axis_item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline_main .axis_item .axis_item_tick {
   display: inline-block;
    width: 6px;
    height: 6px;
    background: #fff;
    transition: background .3s;
    cursor: pointer;
    border-radius: 50%;
    border:1px solid #fff;
   position: absolute;
   top: -4px;
}

.timeline_main .axis_item .axis_item_tick:hover {
  background: #00fffa;
   width: 10px;
  height: 10px;
   top: -6px;
}

.timeline_main .axis_item .axis_item_tick_active {
  background: #00fffa;
  width: 10px;
  height: 10px;
  top: -6px;
}

.timeline_main .axis_item .axis_item_label {
  position: absolute;
  
  white-space: nowrap;
  font-size: 12px;
  top:-25px;
}
.axis_item_label_left{
  left:0;
}
.axis_item_label_right{
  right:0;
}
.timeline_main .axis_item .axis_item_tip {
  position: absolute;
  
  padding: 2px 6px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  color: #fff;
  top: 15px;
  background: #569fd3;
  font-size: 12px;
}
.axis_item_tip_left{
  left: 0;
}
.axis_item_tip_right{
  right: 0;
}
</style>
