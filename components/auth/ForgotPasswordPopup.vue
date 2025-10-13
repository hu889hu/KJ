<template>
  <van-popup v-model:show="show" style="padding: 20px; border-radius: 8px; width: 80%; max-width: 300px;">
    <div style="text-align: center">
      <p>為了確保您的帳戶安全，請聯絡客服人員</p>
      <van-button type="primary" round block @click="$emit('update:show', false)">
        確認
      </van-button>
    </div>
  </van-popup>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

defineEmits(['update:show'])
</script>