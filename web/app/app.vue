<script lang="ts" setup>

const layout = computed(() => {
  return useDevice().isMobile ? 'mobile' : 'desktop'
})

</script>

<template>
  <div>
    <NuxtLayout :layout="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
