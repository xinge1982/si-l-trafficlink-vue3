<template>
  <img
      :class="classname"
      :src="src"
      alt=""
  >
</template>

<script setup lang="ts">

defineProps<{
  classname?: string
  src?: string
}>()

</script>

<style scoped>

</style>
