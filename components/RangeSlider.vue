<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  modelValue: {
    type: Number,
    required: true
  },
  noStep: {
    type: Boolean,
    required: false
  }
})

const emit = defineEmits(['update:modelValue', 'onSyncQty'])

// 计算进度百分比
const progressPercent = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100 > 100
    ? 100
    : ((props.modelValue - props.min) / (props.max - props.min)) * 100
})

// 刻度点配置
const ticks = computed(() => {
  const tickCount = 4 // 总共4个刻度点
  const interval = (props.max - props.min) / tickCount
  return Array.from({ length: tickCount + 1 }, (_, i) => {
    const value = props.min + i * interval
    return {
      value,
      position: (value / (props.max - props.min)) * 100
    }
  })
})

// 工具提示位置
const tooltipStyle = computed(() => {
  return {
    left: `${progressPercent.value}%`,
    transform: `translateX(-${progressPercent.value}%)`
  }
})

// 更新值
const updateValue = (e) => {
  const value = parseFloat(e.target.value)
  emit('update:modelValue', value)
  emit('onSyncQty')
}

const isDragging = ref(false)

const startDrag = () => {
  isDragging.value = true
}
const endDrag = () => {
  isDragging.value = false
}
</script>

<template>
  <div class="slider-container">
    <div class="slider-track">
      <div
        class="slider-progress"
        :style="{ width: progressPercent + '%' }"
      ></div>
      <div
        v-for="(tick, index) in ticks"
        :key="index"
        class="slider-tick"
        :class="{ active: modelValue >= tick.value }"
        :style="{
          left: tick.position + '%',
          transform:
            tick.position == 0
              ? `translate(-${tick.position}%,-50%) !important`
              : ''
        }"
      ></div>
    </div>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue || 0"
      class="custom-slider"
      @input="updateValue"
      @mousedown="startDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
      @touchstart="startDrag"
      @touchend="endDrag"
      :disabled="noStep"
      :style="{ cursor: noStep && 'not-allowed' }"
    />
    <div
      v-show="isDragging && modelValue"
      class="slider-tooltip"
      :style="tooltipStyle"
    >
      {{ modelValue }}
    </div>
  </div>
</template>

<style lang="sass" scoped>
.slider-container
  position: relative
  width: 100%
  padding: 10px 0
  margin: 10px 0

.slider-track
  position: absolute
  top: 50%
  left: 0
  right: 0
  height: 4px
  background-color: #777
  border-radius: 3px
  transform: translateY(-50%)
  z-index: 1

.slider-progress
  position: absolute
  top: 0
  left: 0
  height: 100%
  background-color: #fff
  border-radius: 3px

.slider-tick
  position: absolute
  top: 50%
  width: 10px
  height: 10px
  background-color: #777
  border: 2px solid #777
  border-radius: 50%
  transform: translate(-50%, -50%)
  z-index: 2
  transition: background-color 0.1s ease
.slider-tick:nth-of-type(0)
  transform: translate(0%, -50%) !important
.slider-tick:last-of-type
  transform: translate(-100%, -50%) !important

.slider-tick.active
  background: #fff
  border: 0

.custom-slider
  position: absolute
  top: 50%
  transform: translateY(-50%)
  width: 100%
  -webkit-appearance: none
  height: 6px
  background: transparent
  outline: none
  margin: 0
  z-index: 3

.custom-slider::-webkit-slider-thumb
  -webkit-appearance: none
  width: 10px
  height: 10px
  border: 2px solid #4d95f566
  background: #4d95f5
  border-radius: 50%
  cursor: pointer
  // transition: transform 0.1s ease
  position: relative
  z-index: 4

.slider-tooltip
  position: absolute
  bottom: 100%
  left: 0
  background: #fff
  color: #000
  min-width: 36px
  padding: 2px 5px
  border-radius: 4px
  font-size: 10px
  white-space: nowrap
  pointer-events: none
  user-select: none
  z-index: 5
  margin-bottom: 3px
</style>
