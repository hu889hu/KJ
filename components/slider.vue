<template>
  <div>
    <div class="swiper-navigation">
      <div class="title">
        <p>News</p>
        <h2>最新活動 / 新聞區</h2>
      </div>
      <button class="nav-button prev-button" @click="slidePrev">
        <i class="arrow-left"></i>
      </button>
      <button class="nav-button next-button" @click="slideNext">
        <i class="arrow-right"></i>
      </button>
    </div>
    <swiper :modules="modules" class="mySwiper" effect="creative" :pagination="pagination"
      :effect-creative="creativeEffectConfig" :slides-per-view="1" :space-between="0" :loop="true" @swiper="onSwiper">
      <swiper-slide v-for="(item, index) in slides" :key="index" :class="`slide${index + 1}`">
        <div class="cardItem">
          <div class="infotitle">
            <p class="comment">
              <span style="font-size: 22px;">{{ item.title }}</span>
              <br>
            <p v-for="value in item.text">{{ value }}</p>
            </p>
          </div>
          <div class="infoItem">
            <img :src="item.img" alt="">
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import {
  Scrollbar, Autoplay,
  EffectFade,
  EffectCube,
  EffectFlip,
  EffectCoverflow,
  EffectCards,
  Pagination,
  EffectCreative
} from 'swiper/modules'


import 'swiper/css'
import 'swiper/css/effect-creative';

export default {
  props: {
    slides: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiper: null
    }
  },
  setup() {
    const creativeEffectConfig = {
      prev: {
        // 上一个slide的动画：向左滑出屏幕（X轴-120%），同时缩小并添加阴影
        shadow: true,
        translate: ["-120%", 0, -500], // [X轴, Y轴, Z轴]
        scale: 0.8 // 缩小到80%，增强层次感
      },
      next: {
        // 下一个slide的动画：向右滑出屏幕（X轴120%），同时缩小并添加阴影
        shadow: true,
        translate: ["120%", 0, -500],
        scale: 0.8
      },
      limitProgress: 1, // 影响多少个相邻slide（足够覆盖进出效果）
      perspective: true // 开启3D透视，让动画更立体
    };
    return {
      modules: [Scrollbar, Autoplay, EffectCreative]
    }
  },
  pagination: {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
  },
  methods: {
    onSwiper(swiper) {
      this.swiper = swiper
    },
    slideNext() {
      if (this.swiper) {
        this.swiper.slideNext()
      }
    },
    slidePrev() {
      if (this.swiper) {
        this.swiper.slidePrev()
      }
    }
  }
}
</script>

<style scoped lang="sass">
// 動畫
@keyframes spin_left 
  100% 
    transform: rotateZ(-360deg)
@keyframes spin_right
  100% 
    transform: rotateZ(360deg)
// 


.swiper
  width: 100%
  height: 100%

.swiper-slide 
  text-align: center
  font-size: 18px
  background: #fff
  display: flex
  justify-content: center
  align-items: center
  // &.slide1
  //   .cardItem
  //     .infotitle
  //       background: #43a4df !important
  // &.slide2
  //   .cardItem
  //     background: rgb(218, 250, 253) !important
  //     .infotitle
  //       background: #33355c !important
  //       &::after
  //         border-right-color: #33355c
  //         border-top-color: #33355c
  // &.slide3
  //   .cardItem
  //     background: rgb(255, 230, 239) !important
  //     .infotitle
  //       background: #f9608c !important
  //       &::after
  //         border-right-color: #f9608c
  //         border-top-color: #f9608c
  // &.slide4
  //   .cardItem
  //     .infotitle
  //       background: #33355c !important
  //       &::after
  //         border-right-color: #33355c
  //         border-top-color: #33355c
  .cardItem
    width: 100%
    background: beige
    display: block
    color: #121214
    border: 1px solid #f5f7fa
    transition: all .17s cubic-bezier(.52,.07,.45,2.35)
    cursor: pointer
    margin: 0 0 24px 0
    // padding: 20px
    position: relative
    .infotitle
      border-radius: 0px
      padding: 15px
      text-align: left
      .comment
        margin-bottom: 0
        color: white
        font-size: 15px
        line-height: 1.5
        margin-top: 10px
  .infoItem
    width: 100%
    @media (max-width: 768px)
      width: 100%
    img
      width: 100%      
          
.swiper-navigation
  position: relative
  width: 100%
  margin-bottom: 20px
  .title
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    text-align: center
    margin-bottom: 20px
    p
      font-size: 22px
      padding: 0 40px
      position: relative
      color: #f9608c
      &::before,&::after
        content: ''
        width: 20px
        height: 2px
        background-color: #f9608c
        display: block
        z-index: 1
        position: absolute
        top: calc( 50% - 1px )
        left: 0
      &::after
        left: auto
        right: 0
        
    h2
      font-size: 30px
      color: #33355c
.prev-button
  &::after
    animation: spin_left 5s linear infinite
    animation-play-state: paused
.next-button
  &::after
    animation: spin_right 5s linear infinite
    animation-play-state: paused
.nav-button
  position: absolute
  top: 50%
  transform: translateY(-50%)
  width: 40px
  height: 40px
  border-radius: 50%
  background: #72c0f0
  border: none
  cursor: pointer
  z-index: 10
  display: flex
  align-items: center
  justify-content: center
  &::after
    content: ''
    border: 1.5px dashed white
    position: absolute
    top: 3px
    left: 3px
    width: calc(100% - 6px)
    height: calc(100% - 6px)
    pointer-events: none
    border-radius: 50%
  &:hover
    background: #33355c
    &::after
      animation-play-state: running !important
  .arrow-left
    margin-right: -5px
  .arrow-right
    margin-left: -5px

.prev-button
  left: 10px

.next-button
  right: 10px

.arrow-left,
.arrow-right
  border: solid white
  border-width: 0 2px 2px 0
  display: inline-block
  padding: 5px

.arrow-left
  transform: rotate(135deg)
  -webkit-transform: rotate(135deg)

.arrow-right
  transform: rotate(-45deg)
  -webkit-transform: rotate(-45deg)
</style>
