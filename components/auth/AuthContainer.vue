<template>
  <div class="auth-container">
    <h1 class="auth-title">{{ title }}</h1>
    <div class="auth-form">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>