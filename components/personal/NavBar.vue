<template>
  <div class="nav-bar">
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      :border="true"
      @click-left="$emit('click-left')"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()

defineEmits<{
  (e: 'click-left'): void
}>()
</script>

<style scoped>
.nav-bar {
  height: 54px;
}
</style>
