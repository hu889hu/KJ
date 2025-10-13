<script lang="ts" setup>
import anime from '@/components/gameWidget/js/anime.es.js'
const list = ref([
  {
    title: '綠電容量',
    subTitle: '已簽約再生能源容量',
    count: '1',
    countText: 'KW'
  },
  {
    title: '綠電場數',
    subTitle: '已簽約再生能源場次',
    count: '2',
    countText: '場'
  },
  {
    title: '待媒合供給',
    subTitle: '已報價電廠容量',
    count: '3',
    countText: 'KW'
  },
  {
    title: '待媒合需求',
    subTitle: '已報價客戶需求',
    count: '4',
    countText: 'KW'
  },
  {
    title: '累積綠電轉供',
    subTitle: '實際綠電轉供量',
    count: '5',
    countText: '度'
  },
  {
    title: '已轉供之用電電號數',
    subTitle: '已轉供綠電據點',
    count: '6',
    countText: '站'
  },
  {
    title: '累積轉讓與 T-REC',
    subTitle: '已產出憑證張數',
    count: '0',
    countText: '張'
  }
])

const dataNumber = ref({
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  0: 0
})

const handleDataInView = () => {
  anime({
    easing: 'easeInOutSine',
    targets: dataNumber.value,
    1: 90000 * getRandomInRange(),
    2: 150 * getRandomInRange(),
    3: 1000 * getRandomInRange(),
    4: 60000 * getRandomInRange(),
    5: 1000000 * getRandomInRange(),
    6: 500 * getRandomInRange(),
    0: 5000 * getRandomInRange(),
    round: 1,
    duration: 2000
  })
}

function getRandomInRange() {
  return Math.random() * 0.2 + 0.5
}
const triggerDataRandom = () => {
  anime({
    easing: 'easeInOutSine',
    targets: dataNumber.value,
    1: 90000 * getRandomInRange(),
    2: 150 * getRandomInRange(),
    3: 1000 * getRandomInRange(),
    4: 60000 * getRandomInRange(),
    5: 1000000 * getRandomInRange(),
    6: 500 * getRandomInRange(),
    0: 5000 * getRandomInRange(),
    round: 1,
    duration: 2000
  })
}

const randomTimer = ref(null)

onMounted(async () => {
  handleDataInView()
  randomTimer.value = setInterval(() => {
    triggerDataRandom()
  }, 5000)
})

onBeforeUnmount(() => {
  if (randomTimer.value) {
    clearInterval(randomTimer.value)
  }
})

// const animateCounter = (items: string, start, end, duration) => {
//   let endNumber = parseFloat((Math.random() * (start - end) + end).toFixed(0))
//   // let startNumber = parseFloat((endNumber * 0.99).toFixed(0))
//   let startNumber = start
//   const range = endNumber - startNumber
//   let current = startNumber
//   // const increment = endNumber > startNumber ? 1 : -1
//   const increment = parseFloat((range / duration).toFixed(0))
//   const stepTime = Math.abs(Math.floor(duration / range))

//   const timer = setInterval(() => {
//     current += increment
//     total.value[items] = current
//     if (current == endNumber) {
//       clearInterval(timer)
//     }
//     return current
//   }, stepTime)
// }
// const updateCountingNumber = (value, min, max, fixed) => {
//   total.value[value] = parseFloat(
//     (Math.random() * (max - min) + min).toFixed(fixed)
//   )
// }
// const timer1 = ref()
// const timer2 = ref()
// const timer3 = ref()
// const timer4 = ref()
// const timer5 = ref()
// const timer6 = ref()
// const timer7 = ref()
// onMounted(async () => {
//   timer1.value = setInterval(() => {
//     animateCounter('1', 90000, 108000, 3000)
//   }, 7000)
//   timer2.value = setInterval(() => {
//     animateCounter('2', 50, 60, 3000)
//   }, 7000)
//   timer3.value = setInterval(() => {
//     animateCounter('3', 1000, 1200, 3000)
//   }, 7000)
//   timer4.value = setInterval(() => {
//     animateCounter('4', 60000, 72000, 3000)
//   }, 7000)
//   timer5.value = setInterval(() => {
//     animateCounter('5', 1000000, 1200000, 3000)
//   }, 7000)
//   timer6.value = setInterval(() => {
//     animateCounter('6', 500, 600, 3000)
//   }, 7000)
//   timer7.value = setInterval(() => {
//     animateCounter('7', 5000, 6000, 3000)
//   }, 7000)
// })
// onBeforeUnmount(() => {
//   clearInterval(timer1.value)
//   clearInterval(timer2.value)
//   clearInterval(timer3.value)
//   clearInterval(timer4.value)
//   clearInterval(timer5.value)
//   clearInterval(timer6.value)
//   clearInterval(timer7.value)
// })
</script>
<template>
  <div class="listSection">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="info">
        <div class="icon">
          <img src="@/components/gameWidget/image/icon_trading.svg" />
        </div>
        <div class="text">
          <div class="title">{{ item.title }}</div>
          <div class="subTitle">{{ item.subTitle }}</div>
        </div>
      </div>
      <div class="count">
        <div class="center">
          {{ dataNumber[item.count]
          }}<span class="countText">{{ item.countText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="sass">
.listSection
  display: flex
  justify-content: center
  align-items: flex-start
  width: 100%
  flex-wrap: wrap
  margin: 40px 0 0 0
  @media screen and (max-width: 768px)
    justify-content: space-between
    margin: 10px 0 0 0
    padding: 0 20px 0 20px
  .item
    width: 25%
    margin: 0 0 20px 0
    @media screen and (max-width: 768px)
      width: 48%
      border-bottom: 1px solid #ffffff73
      padding: 0 5px 0 0
    .info
      display: flex
      justify-content: center
      align-items: center
      @media screen and (max-width: 768px)
        justify-content: flex-start
      .icon
        @media screen and (max-width: 768px)
          display: none
        img
          width: 40px
          height: 40px
          margin: 0 15px 0 0
      .text
        .title
          font-size: 1rem
        .subTitle
          font-size: 0.9rem
          letter-spacing: 0.1em
          color: #ffca00
          font-weight: 300
    .count
      display: flex
      justify-content: center
      align-items: flex-end
      @media screen and (max-width: 768px)
        justify-content: flex-start
      .center
        font-size: 2.7rem
        @media screen and (max-width: 768px)
          font-size: 1.8rem
      .countText
        font-size: 1rem
        margin: 0  0 0 5px
  .item::after
    position: absolute
    content: ""
    display: block
    top: 0
    bottom: 0
    right: 0
    margin: auto
    height: 3rem
    width: 1px
    background: #B5B5B5
    @media screen and (max-width: 768px)
      display: none
  .item:nth-child(4n)::after
    display: none
  .item:nth-child(7n)::after
    display: none
</style>
