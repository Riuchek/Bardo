<script lang="ts" setup>

const layout = computed(() => {
  return useDevice().isMobile ? 'mobile' : 'desktop'
})

</script>

<template>
  <div>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
