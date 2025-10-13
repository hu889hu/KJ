<script setup>
import { ref, computed, onMounted, useCssModule } from 'vue'
const props = defineProps({
  autoWidth: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  height: {
    type: Number,
    default: () => {
      return 200
    }
  },
  id: {
    type: String,
    required: true,
    default: () => {
      return 'id'
    }
  },
  paused: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  repeat: {
    type: Number,
    default: () => {
      return 10
    }
  },
  reverse: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  space: {
    type: Number,
    default: () => {
      return 200
    }
  },
  speed: {
    type: Number,
    default: () => {
      return 1500
    }
  },
  vertical: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  width: {
    type: Number,
    default: () => {
      return 100
    }
  }
})

const container = ref(null)
const style = ref(null)

const styleElement = computed(
  () =>
    `
      animation-duration: ${props.speed}ms;
      animation-direction: ${props.reverse ? 'reverse' : 'normal'};
      animation-play-state: ${props.paused ? 'paused' : 'running'};
      height: ${props.vertical ? props.height : 'auto'}
    `
)

onMounted(() => {
  style.value = useCssModule()
  setContainer()
})

function setContainer() {
  container.value = document.querySelector(
    `#${props.id} .${props.vertical ? style.value.marqueeSliderContainerVertical : style.value.marqueeSliderContainer}`
  )
}
</script>

<template>
  <div :id="id" :class="$style.marqueeSlider">
    <div
      :class="
        vertical
          ? $style.marqueeSliderContainerVertical
          : $style.marqueeSliderContainer
      "
      :style="styleElement"
    >
      <slot>
        <div>Hello</div>
        <div>From</div>
        <div>MarqueeSlider</div>
      </slot>
    </div>
  </div>
</template>

<style lang="sass" module>
.marqueeSlider
  overflow: hidden

.marqueeSliderContainer
  width: 100%
  animation-name: horizontalAnimation
  animation-timing-function: linear
  animation-iteration-count: infinite
  display: flex

.marqueeSliderContainerVertical
  height: fit-content
  animation-name: verticalAnimation
  animation-timing-function: linear
  animation-iteration-count: infinite
  display: flex
  flex-direction: column

@keyframes horizontalAnimation
  0%
    transform: translateX(0%)

  100%
    transform: translateX(-100%)

@keyframes verticalAnimation
  0%
    transform: translateY(0%)

  100%
    transform: translateY(-100%)
</style>
