<script lang="ts" setup>
const props = defineProps(['error'])
</script>


<template>
  <div>
     <UError
    :error="props.error"
  />
  </div>
</template>
