<template>
  <div class="uk-scope uk-position-relative uk-visible-toggle uk-light" tabindex="-1"
    :uk-slideshow="'animation: push;ratio:' + ratio">
    <ul class="uk-slideshow-items">
      <li v-for="(item, index) in slides" :key="index" class="li-slide">
        <img :src="item.img" alt="" uk-cover />
        <div class="slide-cont">
          <div class="cont-box">
            <h5>
              <span v-html="item.toptitle"></span>
            </h5>
            <h1>
              <span v-html="item.title"></span>
            </h1>
            <h5>
              <span v-html="item.subtitle"></span>
            </h5>
            <div class="go-game hover-target" @click="navigateTo(item.link)">
              系統
            </div>
          </div>
        </div>
      </li>
    </ul>
    <a v-if="slidenav" class="uk-position-center-left uk-position-small uk-hidden-hover" uk-slidenav-previous
      uk-slideshow-item="previous"></a>
    <a v-if="slidenav" class="uk-position-center-right uk-position-small uk-hidden-hover" uk-slidenav-next
      uk-slideshow-item="next"></a>
    <ul class="uk-slideshow-nav uk-dotnav uk-flex-center uk-margin"></ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  options: {
    type: Object,
    default: {}
  },
  ratio: {
    type: String,
    default: '16:9' // 預設比例16:9
  },
  slidenav: {
    type: Boolean,
    default: false
  },
  slides: {
    type: Array,
    default: () => []
  }
})

const slideshowRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (process.client) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'uikit/uikit.min.css'
    document.head.appendChild(link)
  }
  await nextTick()
  initSlideshow()
})

const initSlideshow = () => {
  if (!process.client) return

  const UIkit = window.UIkit
  if (!UIkit || !slideshowRef.value) {
    console.error('UIkit not loaded:', !UIkit)
    console.error('DOM not ready:', !slideshowRef.value)
    return
  }

  // 初始化
  UIkit.slideshow(slideshowRef.value, {
    pauseOnHover: false,
    ...props.options
  })
}
// 監聽 ratio 變化
watch(() => props.ratio, initSlideshow)
</script>
<style scoped lang="sass">

.uk-slideshow
  width: 100%
.uk-slideshow-nav
  position: absolute
  bottom: 5%
  right: 5%
:deep(.uk-dotnav>*>*)
  border: none
  margin: 0 5px
  width: 15px
  height: 15px
  background-color: rgba(255,255,255,.5) !important
  border-radius: 0
:deep(.uk-dotnav>.uk-active>*)
  background-color: #7497b5 !important
  border: none

:deep(.uk-slideshow-items)
  .uk-active.uk-transition-active
    .slide-cont
      .cont-box
        &>*
          transform: translateX(0)
          opacity: 1
.uk-slideshow-items
  position: relative
  height: 100vh
  li.li-slide
    height: 100vh
    &>img
      height: 100%
      object-fit: cover
    &::before
      content: ''
      position: absolute
      top: 0
      left: 0
      z-index: 1
      width: 100%
      height: 100%
      background-color: rgba(0, 0, 0, 0.5)
  .slide-cont
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%,-50%)
    z-index: 2
    width: 100%
    .cont-box
      max-width: 1200px
      width: 100%
      padding: 20px
      margin: 0 auto
      &>*
        transition: all 0.8s ease
        opacity: 0
        transform: translateX(-20px)
        &:nth-child(1)
          transition-delay: .1s
        &:nth-child(2)
          transition-delay: .2s
        &:nth-child(3)
          transition-delay: .3s
        &:nth-child(4)
          transition-delay: .4s
    h1
      font-size: 70px
      color: #fff
    h5
      font-size: 16px
      color: #D1cbcb
      font-weight: 500
      padding: 20px 0
      max-width: 400px
    .go-game
      background-color: #7497b5
      display: inline-block
      padding: 12px 35px
      transition: all 0.3s ease
      &:hover
        background-color: #6685a1
  
</style>
