<template>

  <img
      v-for="manPhase in model"
      :key="manPhase.angleDir"
      :class="
      'phaseManDir-' +
      reserveInoutType(manPhase.inoutType) +
      '-' +
      phaseDirMap[manPhase.angleDir]
    "
      :src="getManImage(manPhase)"
      alt=""
  >

</template>


<script setup lang="ts">


interface ManPhase {

  inoutType:number|string

  angleDir:number|string

}


defineProps<{

  model:ManPhase[]

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



function reserveInoutType(type:number|string){

  const typeMap:Record<string,string> = {

    "1":"2",
    "2":"1",
    "3":"3"

  }

  return typeMap[String(type)]

}



function getManImage(item:ManPhase){

  return new URL(
      `../../assets/image/phase/phase-man${item.inoutType == 3 ? '-3' : ''}.png`,
      import.meta.url
  ).href

}


</script>


<style scoped>

</style>
