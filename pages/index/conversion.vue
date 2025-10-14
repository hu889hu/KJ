<script lang="ts" setup>
const { transfer } = useWalletStore()
const siteStore = useSiteStore()
const PlayerStore = usePlayerStore()
const { isLogin } = useAuthStore()
const { t } = useI18n()
const playerWalletBalance = computed(() => {
  if (!isLogin()) {
    return 0
  }
  const findWallet = PlayerStore.playerInfo?.wallet.find(
    (wallet: any) => wallet.type === 2
  )
  if (findWallet) {
    return Number(findWallet.balance)
  } else {
    return 0
  }
})

const playerWalletBalances = computed(() => {
  if (!isLogin()) {
    return 0
  }
  const findWallet = PlayerStore.playerInfo?.wallet.find(
    (wallet: any) => wallet.type === 2
  )
  if (findWallet) {
    return Number(findWallet.balance)
  } else {
    return 0
  }
})

onMounted(async () => {
  rate.value = siteStore.siteData.walletConfig.exchangeRates.find((item) =>
    item.toWalletType == '13'
  ).rate
})
const amount = ref()
const toAmount = ref()
const goTransfer = async () => {
  const transferRes = await transfer({
    fromWalletId: PlayerStore.playerInfo.wallet[0].id,
    toWalletId: PlayerStore.playerInfo.wallet[1].id,
    amount: JSON.stringify(amount.value),
    memo: `用戶操作 USDT 劃轉至 TWD ,數量: ${amount.value}`
  })
  console.log(transferRes, 'transferRes');

  if (transferRes.success) {
    ElNotification({
      title: transferRes.message,
      type: 'success',
      duration: 1000
    })
    await PlayerStore.fetchInfo()
    amount.value = ''
    toAmount.value = ''
  }
}
const rate = ref(1)
const conversionCalculation = () => {
  toAmount.value = rate.value * amount.value
}
</script>

<template>
  <div class="page">
    <div class="section1">
      <div class="wallet-list">
        <div class="item">
          <h2>外幣轉換區</h2>
          <p v-if="isLogin()">
            Hello : {{ PlayerStore?.playerInfo?.username }}<br>
            可換數量 (USDT餘額) : {{ new Intl.NumberFormat('zh-TW').format(playerWalletBalance) }}<br>
            <!-- 可換數量 (TWD餘額) : {{ new Intl.NumberFormat('zh-TW').format(playerWalletBalances) }}<br> -->
            系統匯率 : {{ rate }} </p>
          <p class="sm-p">可將您持有的USDT轉換為TWD<br></p>
        </div>
        <div class="forms-gds">
          <div class="form-input1">
            <input type="number" v-model="amount" placeholder="請輸入USDT數量">
          </div>
          <div class="form-input1" @click="conversionCalculation">
            <a class="cha">轉換試算</a>
          </div>
          <div class="form-input1">
            <input type="text" v-model="toAmount" placeholder="TWD" readonly aria-readonly="true" class="display-only">
          </div>
        </div>
        <div class="form-input2">
          <button type="submit" class="btn" id="confirmBtn" @click="goTransfer">確認轉換</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="sass">
@keyframes bounce 
  0%, 100% 
    transform: translateY(0)
  50% 
    transform: translateY(-10px)

.page
  position: relative
  height: 100vh
  overflow-y: auto
  background: url(@/assets/images/login2.jpg) no-repeat left center / cover
  &::before
    content: ''
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: linear-gradient(180deg,rgba(41, 61, 184, 0.19) 0%, rgba(5, 176, 206, 0.77) 100%)
  .section1
    padding: 120px 20px 20px
    width: 100%
    max-width: 750px
    margin: 0 auto
    .wallet-list
      padding: 10px 0
      .item
        h2
          text-align: center
          font-size: 55px
          line-height: 60px
          color: #f6bf00
          font-weight: 600
          text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3)
          animation: bounce 1s infinite
        p
          text-align: center
          padding: 5px
          margin: 40px 0
          background-color: #000
          color: #fff
          font-size: 20px
          line-height: 30px
          font-weight: 600
          border-radius: 20px
        .sm-p
          background-color: transparent
          text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3)
    .forms-gds
      display: flex
      justify-content: center
      align-items: center
      .form-input1
        text-align: center
        display: flex
        justify-content: center
        align-items: center
        flex:1
        input
          outline: none
          width: 80%
          background-color: #f6f6f6
          border: 1px solid #eee
          border-radius: 3px
          color: #304659
          font-size: 18px
          height: 45px
          padding: 0px 15px
        .cha
          display: block
          width: 80%
          padding: 10px 0
          font-size: 19px
          font-weight: bold
          text-align: center
          text-decoration: none
          background: linear-gradient(45deg, #FF6347, #FFD700)
          color: #913c08
          border: none
          border-radius: 30px
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
          transition: all 0.3s ease
          &:hover
            background: linear-gradient(45deg, #FFD700, #FF6347)
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2)
            transform: translateY(-3px)
            opacity: 0.8
    .form-input2
      text-align: center
      margin-top: 50px
      .btn
        background: #c40303
        color: #fff
        text-decoration: none
        padding: 0px 30px
        text-align: center
        font-size: 22px
        display: inline-block
        font-weight: bold
        width: 100%
        border: solid 2px #ffffff
        cursor: pointer
        height: 45px
        border-radius: 20px
        margin-bottom: 15px
        -webkit-appearance: none
        &:hover
          opacity: 0.8
          background-color: #b70b6f
</style>
