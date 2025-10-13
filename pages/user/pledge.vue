<script lang="ts" setup>
import { on } from 'events'
const siteStore = useSiteStore()

const { t } = useI18n()

const playerStore = usePlayerStore()

const switchInt = ref(true)

const pledgeSocketStore = usePledgeSocketStore()

const pledgeStore = usePledgeStore()
const { buy } = pledgeStore
const availableClick = ref(true)
const buyForm = reactive({
  playerId: playerStore.playerInfo.id,
  productId: '',
  amount: ''
})
const goBuy = async () => {
  if (!buyForm.amount) {
    ElNotification({
      title: `${t('請輸入質押數量')}`,
      type: 'error',
      duration: 1000,
      showClose: false
    })
    return
  }
  if (!buyForm.productId) {
    ElNotification({
      title: `${t('請選擇質押產品')}`,
      type: 'error',
      duration: 1000,
      showClose: false
    })
    return
  }
  availableClick.value = false
  buyForm.amount = buyForm.amount.toString()
  const res = await buy({
    ...buyForm
  })
  if (res.success) {
    ElNotification({
      title: `${t('已購買質押產品')}`,
      type: 'success',
      duration: 1000
    })
    buyForm.productId = ''
    buyForm.amount = ''
    dialogVisible.value = false
    availableClick.value = true
  } else {
    availableClick.value = true
  }
}
const interval = ref()

onMounted(async () => {
  // product 列表
  console.log('order', pledgeSocketStore.ordersData)
  // product 列表
  console.log('product', pledgeSocketStore.productData)
  // 下單紀錄 列表 filter type:5 & type:7
  console.log('walletLog', pledgeSocketStore.walletLogData)
  // 錢包餘額 拿balance
  console.log('wallet', pledgeSocketStore.walletData)
  interval.value = setInterval(() => {
    pledgeSocketStore.ordersData.forEach((item) => {
      item.endTime =
        new Date(item.createdAt).getTime() +
        item.productSnapshot.duration * 60 * 60 * 1000
      let timeDiff = new Date(item.endTime).getTime() - Date.now()
      if (new Date(item.endTime).getTime() < Date.now()) {
        timeDiff = 0
      }
      item.backCount = backCountTime(timeDiff)
    })
  }, 1000)
})
const backCountTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000)
  const days = String(Math.floor(totalSeconds / (24 * 3600))).padStart(2, '0')
  const hours = String(
    Math.floor((totalSeconds % (24 * 3600)) / 3600)
  ).padStart(2, '0')
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    '0'
  )
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${days}:${hours}:${minutes}:${seconds}`
}
onBeforeUnmount(() => {
  if (interval.value) {
    clearInterval(interval.value)
    interval.value = null
  }
})
const dialogVisible = ref(false)
const hideDialog = () => {
  dialogVisible.value = false
  buyForm.productId = ''
  buyForm.amount = ''
}
const currentData = ref()
const openPledge = (item) => {
  dialogVisible.value = true
  currentData.value = item
  buyForm.productId = item._id
}
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
onBeforeMount(() => {
  const gameTypeCheck = siteStore.siteData?.gameType?.find(
    (item: any) => item === 5
  )
  if (!gameTypeCheck) {
    navigateTo('/user')
  }
})
</script>
<template>
  <div class="pages-user-pledge">
    <div class="switch-btn" @click="switchInt = !switchInt">
      {{ switchInt ? t('質押紀錄') : t('質押下單') }}
    </div>
    <div v-if="switchInt" class="pledge-list">
      <div v-for="item in pledgeSocketStore.productData" :key="item.siteId">
        <!--  v-if="
            playerStore.playerInfo.additionalInfo.level.toString() ===
            item.additionalInfo.level
          " -->
        <div class="pledge-item">
          <div class="price">
            <div class="left">{{ item.name }}</div>
            <div class="right">{{ (item.duration / 24).toFixed(1) }}D</div>
          </div>
          <img :src="item.icon" alt="" />
          <div class="num">
            <div>
              {{ $lang('數量') }}：{{ item.minStack }}-{{ item.maxStack }}
            </div>
            <div class="btn" @click="openPledge(item)">
              {{ $lang('質押') }}
            </div>
          </div>
          <div class="interest">
            {{ $lang('利息') }}<span>{{ parseInt(item.bonusRatio * 100) }}</span
            >%
          </div>
        </div>
      </div>
    </div>
    <div v-if="!switchInt" class="pledge-record">
      <div
        v-for="item in pledgeSocketStore.ordersData"
        :key="item.id"
        class="record-item"
      >
        <img :src="item.productSnapshot.icon" alt="" />
        <div class="content">
          <div class="content-left">
            <div>{{ $lang('質押編號') }}：{{ item.orderId }}</div>
            <div>
              {{ $lang('天數') }}：{{
                (item.productSnapshot.duration / 24).toFixed(1)
              }}
            </div>
            <div>
              {{ $lang('利息') }}：{{
                parseInt(item.productSnapshot.bonusRatio * 100)
              }}
              %
            </div>
            <div>{{ $lang('數量') }}：{{ item.amount }}</div>
            <div>
              {{ $lang('預估收益') }}：{{
                item.amount * item.productSnapshot.bonusRatio
              }}
            </div>
          </div>
          <div class="content-right">
            <div class="reciprocal">
              {{ $lang('倒數') }}:{{ item.backCount }}
            </div>
            <div
              v-if="item.status === 1 && item.profit > 1"
              class="content-btn"
              :class="item.status !== 0 ? 'red' : ''"
            >
              {{ $lang('結算') }}
            </div>
            <div
              v-if="item.status === 0"
              class="content-btn"
              :class="item.status !== 0 ? 'red' : ''"
            >
              {{ $lang('進行中') }}
            </div>
          </div>
        </div>
        <div class="time">
          <div>{{ $lang('開始') }} {{ formatDate(item.createdAt) }}</div>
          <div>{{ $lang('結束') }} {{ formatDate(item.endTime) }}</div>
        </div>
      </div>
    </div>
    <div v-if="dialogVisible" class="mask" @click="hideDialog"></div>
    <div v-if="dialogVisible" class="dialog-box">
      <div class="title">{{ currentData.name }}</div>
      <div class="text">{{ $lang('質押數額') }}</div>
      <div class="inputbox">
        <input
          v-model="buyForm.amount"
          v-positive-integer
          :placeholder="`${currentData.minStack}-${currentData.maxStack}`"
        />
        <div @click="buyForm.amount = currentData.maxStack">
          {{ $lang('最大') }}
        </div>
      </div>
      <div class="text">
        {{ $lang('資金帳戶') }}（{{ pledgeSocketStore.walletData.balance }}）
      </div>
      <div
        class="dybtn"
        :class="buyForm.amount && availableClick ? 'opensubmit' : ''"
        @click="buyForm.amount && availableClick ? goBuy() : ''"
      >
        {{ $lang('立即質押') }}
      </div>
    </div>
  </div>
</template>
<style scoped lang="sass">
.pages-user-pledge
    padding: 77px 30px 90px
    position: relative
    .switch-btn
      position: absolute
      right: 30px
      top: 30px
      width: 140px
      padding: 8px
      text-align: center
      font-size: 18px
      color: white
      background: linear-gradient(to right, #34bdb0, #488fcb)
      font-weight: bold
      border-radius: 50px
      cursor: pointer
      z-index: 5
    .pledge-list
        display: flex
        flex-wrap: wrap
        .pledge-item
          width: 350px
          background-color: white
          padding: 10px 20px
          margin-right: 50px
          margin-bottom: 30px
          border-radius: 10px
          position: relative
          .price
              display: flex
              align-items: center
              justify-content: space-between
              .left
                  font-weight: bold
                  font-size: 28px
                  background: linear-gradient(to bottom, black, white)
                  -webkit-background-clip: text
                  color: transparent
              .right
                  font-size: 34px
                  font-weight: bold
                  color: #34bdb0
          img
              margin: 0 auto
              width: 230px
              height: 230px
              object-fit: cover
          .num
              display: flex
              align-items: center
              justify-content: space-between
              margin-top: 20px
              font-size: 20px
              .btn
                  width: 140px
                  padding: 10px
                  text-align: center
                  font-size: 22px
                  color: white
                  background: linear-gradient(to right, #34bdb0, #488fcb)
                  font-weight: bold
                  border-radius: 50px
                  cursor: pointer
          .interest
            position: absolute
            bottom: 80px
            left: 32px
            font-size: 20px
            font-weight: bold
            color: #ef812c
            span
              font-size: 46px
    .pledge-record
      .record-item
        width: 500px
        background-color: white
        padding: 10px 20px
        margin-top: 40px
        border-radius: 10px
        position: relative
        img
          width: 120px
          height: 120px
          position: absolute
          top: 10px
          left: 10px
          object-fit: contain
        .content
          display: flex
          justify-content: space-between
          margin-left: 120px
          .content-left
            font-weight: bold
            div
              line-height: 25px
          .content-right
            .reciprocal
              color: #a6a6a6
              font-size: 14px
            .content-btn
              width: 100px
              padding: 5px
              text-align: center
              font-size: 18px
              color: white
              font-weight: bold
              border-radius: 50px
              background: linear-gradient(to right, #a3d381, #84c558)
              margin-top: 20px
            .red
              background: linear-gradient(to right, #ee4560, #ee7e3e)

        .time
          display: flex
          margin-top: 20px
          div
            width: 100%
            font-size: 14px
            &:last-child
              text-align: right
              border-left: 1px solid black
              font-size: 14px

@media (max-width: 800px)
  .pledge-list
    padding-top: 50px !important
  .pledge-item
    width: 100% !important
    margin-right: 0 !important
  .num
    font-size: 16px !important
    .btn
      width: 120px !important
  .record-item
      width: 100% !important
  .content
    margin-left: 0px !important
    margin-top: 100px
</style>
<style scoped lang="sass">
.mask
  position: fixed
  width: 100vw
  height: 100vh
  background-color: black
  opacity: 0.6
  z-index: 9999
  top: 0
  left: 0
.dialog-box
  width: 450px
  background-color: white
  position: fixed
  top: 50%
  left: 50%
  transform: translate(-50%,-50%)
  z-index: 10000
  border-radius: 15px
  padding: 20px 30px
  .title
    font-weight: bold
    font-size: 20px
    margin-bottom: 30px
  .text
    font-size: 15px
    color: #727375
    margin: 10px 0
  .inputbox
    display: flex
    align-items: center
    justify-content: space-between
    background-color: #f4f5f7
    border-radius: 5px
    padding: 10px
    div
      color: #34bdb0
      font-weight:bold
      cursor: pointer

    input
      border: 0
      background-color: #f4f5f7
      height: 30px
      width: 90%
  .dybtn
    text-align: center
    color: white
    background: linear-gradient(to right, #34bdb0, #488fcb)
    font-weight: bold
    border-radius: 50px
    padding: 10px
    margin-top: 30px
    opacity: 0.3
    cursor: not-allowed
  .opensubmit
    cursor: pointer
    opacity: 1
</style>
