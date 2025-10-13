<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
const { t } = useI18n()
const router = useRouter()
const scrollTop = ref(0)
const section1 = ref<HTMLElement | null>(null)
const section2 = ref<HTMLElement | null>(null)
const section3 = ref<HTMLElement | null>(null)
const section4 = ref<HTMLElement | null>(null)
const windowHeight = ref(0)
onMounted(() => {
  document.documentElement.scrollTop = 0
  if (window) {
    console.log('window', window.innerWidth)
    window.addEventListener('scroll', handleScroll)
  }
  windowHeight.value = window.innerHeight
  window.addEventListener('resize', () => {
    windowHeight.value = window.innerHeight
  })
})
const handleScroll = () => {
  scrollTop.value = window.scrollY
  let scrollTrue = scrollTop.value + windowHeight.value
  console.log('offsetTop', section1.value?.offsetTop)
  console.log('scrollTop', window.scrollY)
  console.log('scrollTrue', scrollTrue)

  if (scrollTrue >= section1.value?.offsetTop + 400) {
    section1.value?.classList.add('section-scale')
  } else {
    section1.value?.classList.remove('section-scale')
  }
  console.log(section1.value?.offsetTop, 'section2.value?.offsetTop')

  if (scrollTrue >= section2.value?.offsetTop) {
    section2.value?.classList.add('section-tran-x')
  } else {
    section2.value?.classList.remove('section-tran-x')
  }
  if (scrollTrue >= section3.value?.offsetTop) {
    section3.value?.classList.add('section-tran-opacity')
  } else {
    section3.value?.classList.remove('section-tran-opacity')
  }
}
onUnmounted(() => {
  if (window) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>
<template>
  <div class="cont">
    <headerTop :opaque="scrollTop > 10"></headerTop>
    <div class="index-bg">
      <div class="index-bg-content">
        <div class="content">
          <h3>
            紅杉資本是專注於投資科技、醫療健康、消費三大領域的私募股權投資機構。
          </h3>
        </div>
      </div>
    </div>
    <section class="section1 feature1" ref="section1">
      <div class="section1-content">
        <div class="section1-content-items">
          <div class="item-img">
            <img src="@/assets/images/about2-1.jpg" alt="" />
          </div>
          <div class="item">
            自2005年成立以來，紅杉中國致力於發掘和培育創新和創業力量，在海內外投資了逾1500家企業，其中湧現出許多具有鮮明技術特徵、創新商業模式、具備高成長性和高發展潛力的公司。
          </div>
        </div>
      </div>
    </section>
    <section class="section1 feature2" ref="section2">
      <div class="section1-content">
        <div class="section1-content-items">
          <div class="item">
            迄今為止，紅杉資本有超過160家成員企業成功上市，超過140家非上市公司已發展成為獨角獸。
          </div>
          <div class="item-img">
            <img src="@/assets/images/about-2.jpg" alt="" />
          </div>
          <div class="item item2">
            迄今為止，紅杉資本有超過160家成員企業成功上市，超過140家非上市公司已發展成為獨角獸。
          </div>
        </div>
      </div>
    </section>
    <section class="section1 feature3" ref="section3">
      <div class="section1-content">
        <div class="section1-content-items">
          <div class="item-img">
            <img src="@/assets/images/about2-2.jpg" alt="" />
          </div>
          <div class="item">
            20年來，紅杉資本由早期的創投擴展到種子期投資、成長期投資、併購投資、新基建投資、公開市場投資等領域，成為具有全鏈條、全階段及全週期投資能力的投資機構。
          </div>
        </div>
      </div>
    </section>
    <footerBottom />
  </div>
</template>

<style scoped lang="sass">
.cont
  background: #fff !important

.button
  padding: 12px 30px
  margin-inline-end: 15px
  font-size: 14px
  font-weight: 500
  line-height: 1
  border-radius: 30px
  color: #fff
  background: #7354ff
  transition: all .3s ease-in-out
  &:hover
    filter: brightness(1.2)
    box-shadow: 0 0 10px rgba(0,0,0,.2)
.feature1 .section1-content-items
  display: block !important
  .item
    font-weight: 600
    text-align: center
    opacity: 0
    transform: translateZ(0) scale(.4)
    transition: all .6s ease-in-out

.feature2 .section1-content-items
    .item2
      display: none
    @media (max-width: 1200px)
      flex-direction: row-reverse !important
      flex-wrap: wrap !important
      .item
        display: none
      .item2
        display: block
        flex:0 0 100% !important
      .item-img
        flex:0 0 100% !important
    .item
      flex:0 0 50%
      opacity: 0
      transform: translateZ(0) scale(.4)
      transition: all .6s ease-in-out
    .item-img
      flex:0 0 50%
      img
        transition: all .6s ease-in-out
        transform: translateX(80%)
.feature3
  margin-bottom: 120px
  .section1-content-items
    @media (max-width: 1200px)
      flex-direction: column
  .item
    padding: 24px 0 24px 24px !important
    opacity: 0 !important
    transform: scale(.4) !important
    transition: all .6s ease-in-out
  .item-img
    background: #fff !important
    img
      transition: all .6s ease-in-out
      opacity: 0
      transform: scale(1.4)
.index-bg
  background: url('@/assets/images/about-hbg.jpg') no-repeat center center  / cover
  // background: #000
  // background: linear-gradient(60deg, rgb(255,255,255), rgb(255,241,213))
  width: 100%
  display: flex
  align-items: center
  padding-top: 74px
  &::before
    content: ''
    position: absolute
    top: 0
    left: 0
    bottom: 0
    width: 100%
    height: 100%
    background: linear-gradient(to top, rgb(255,255,255) 0%,rgb(255,255,255,.8) 7%, rgb(255,255,255,0) 100%)
  .index-bg-content
    display: flex
    align-items: center
    justify-content: center
    width: 1200px
    margin: 0 auto
    padding:120px 100px 240px
    @media (max-width: 1200px)
      width: 100%
      padding: 100px 20px 170px
    .content
      color: #fff
      text-shadow: 0 0 10px rgba(0,0,0,.4)
      font-weight: 600
      font-family: sans-serif fantasy
      text-align: center
      h3
        font-size: 36px
        line-height: 2
        transition: all .3s ease-in-out
.index-main
  width: 1200px
  margin: 0 auto
  @media (max-width: 1200px)
    width: 100%

section
  position: relative
  width: 100%
.section-attain
  opacity: 1 !important
  transform: translateY(-38%)
  will-change: transform, opacity
  @media (max-width: 1200px)
    transform: translateY(-20%)
  @media (max-width: 768px)
    transform: translateY(-10%)
.section-scale
  .item
    opacity: 1 !important
    transform: translateZ(0) scale(1) !important
    will-change: transform, opacity

.section-tran-x
  .section1-content-items
    .item
      opacity: 1 !important
      transform: translateZ(0) scale(1) !important
      will-change: transform, opacity
    .item-img img
      transform: translateX(0) !important
.section-tran-opacity
  .section1-content-items
    .item
      opacity: 1 !important
      transform: scale(1) !important
    .item-img img
      opacity: 1 !important
      transform: scale(1) !important
.section1
  transition: all .6s ease-in-out
  .section1-content
    width: 1200px
    margin: 100px auto 0
    @media (max-width: 1200px)
      width: 100%
      margin: 60px auto 0
    .section1-content-title
      margin-bottom: 40px
      text-align: center
      @media (max-width: 1200px)
        padding: 0 20px
      h2
        font-size: 38px
        font-weight: 600
        line-height: 40px
        margin-bottom: 20px
      p
        font-size: 14px
        line-height: 1.5
    .section1-content-items
      display: flex
      // align-items: center
      @media (max-width: 1200px)
        padding: 0 20px
        .item
          padding-inline-end: 0 !important
          margin-bottom: 20px
      .item
        padding: 24px 20px 24px 0
        box-sizing: border-box
        font-size: 26px
        flex:0 0 33.333333%
      .item-img
        background: #0f1217
        flex: 0 0 66.666666%
        height: 400px
        max-height: 400px
        min-width: 50%
        overflow: hidden
        border-radius: 20px
        img
          width: 100%
          height: 100%
          border-radius: 20px
          object-fit: cover
</style>
