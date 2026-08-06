<template>

  <div class="phase-box">
    <i class="abc">
      {{ item.phaseNo }}
    </i>

    <!-- vehicle phase -->
    <pahsecarimg
        v-for="(car,index) in item.carDirs"
        :key="'car-'+index"
        v-if=" car.turnType == '01' || car.turnType == '02' || car.turnType == '04' || car.turnType == '08'"
        :src="carimg(car)"
        :classname="getcarclass(car)"
    />

    <!-- pedestrian phase -->
    <pahsecarimg
        v-for="(car,index) in item.passerDirs"
        :key="'man-'+index"
        :src="getmanimg(car)"
        :classname="getmanclass(car)"
    />
  </div>
</template>

<script setup lang="ts">
import pahsecarimg from './pahsecarimg.vue'

interface CarImg {
  turnType: string
}

interface PhaseItem {
  phaseNo:number|string
  carDirs:any[]
  passerDirs:any[]
}

const props = defineProps<{
  item:PhaseItem
  activeitem?:any
}>()

const phaseDirMap:Record<string,string> = {
  "1":"12",
  "2":"12",
  "3":"34",
  "4":"34",
  "5":"56",
  "6":"56",
  "7":"78",
  "8":"78"
}

function carimg(item:any){
  return new URL(
      `../../assets/image/phase/phase-car-${item.turnType}.png`,
      import.meta.url
  ).href
}

function getcarclass(item:any){
  return (
      'phaseDir-' +
      item.turnType +
      '-' +
      phaseDirMap[item.angleDir]
  )
}

function reserveInoutType(type:any){
  const typeMap:Record<string,string> = {
    "1":"2",
    "2":"1",
    "3":"3"
  }
  return typeMap[String(type)]

}

function getmanimg(item:any){
  return new URL(
      `../../assets/image/phase/phase-man${item.inoutType == 3 ? '-3' : ''}.png`,
      import.meta.url
  ).href
}

function getmanclass(item:any){
  return (
      'phaseManDir-' +
      reserveInoutType(item.inoutType) +
      '-' +
      phaseDirMap[item.angleDir]
  )
}

</script>

<style scoped>
.phase-box{
  margin-left:50px;
  position:relative;
  min-width:115px;
  max-width:115px;
  height:115px;
  border:2px solid #fff;
}

.phase-box .abc{
  position:absolute;
  left:-35px;
  top:48px;
  font-size:26px;
}

</style>
