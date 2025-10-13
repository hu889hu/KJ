<template>
  <van-form @submit="$emit('submit', formData)">
    <van-cell-group>
      <slot></slot>
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit">
        {{ submitText }}
      </van-button>
    </div>
  </van-form>
</template>

<script setup>
const props = defineProps({
  submitText: {
    type: String,
    required: true
  },
  formData: {
    type: Object,
    required: true
  }
})

defineEmits(['submit'])
</script>