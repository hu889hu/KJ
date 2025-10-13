<template>
  <div style="text-align: center; margin-top: 16px">
    <NuxtLink :to="to" class="van-link">{{ text }}</NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
})
</script>