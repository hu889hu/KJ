<script lang="ts" setup>
const { t } = useI18n()
const router = useRouter()
const playerStore = usePlayerStore()
const siteStore = useSiteStore()
const { withdraw, transfer } = useWalletStore()
const withdrawAmount = ref(0)
const tPwd = ref('')
const withdrawFee = computed(() => withdrawFeeCount())
const selectType = ref('withdraw')
const showSectionType = ref(true)
// await useAsyncData(async () => {
//   console.log(playerStore.playerInfo);

//   if (siteStore.siteData.smsVerify === 3) {
//     if (!playerStore.playerInfo.smsVerify) {
//       navigateTo('/smsVerify')
//     }
//   }
//   if (!playerStore.playerInfo?.bankInfo) {
//     navigateTo('/bank')
//   }

//   if (playerStore.playerInfo.bankInfo.status !== 1) {
//     navigateTo('/bank')
//   }
// })
// methods
const goWithdraw = async () => {
  if (
    withdrawAmount.value < siteStore.siteData.minWithdrawAmount ||
    withdrawAmount.value > siteStore.siteData.maxWithdrawAmount
  ) {
    ElNotification({
      title: `${t('提款金額不符合規定')}`,
      type: 'error',
      duration: 1000,
      showClose: false
    })
    return
  }
  if (siteStore.siteData.transactionPasswordRequired) {
    if (!tPwd.value) {
      ElNotification({
        title: `${t('請輸入交易密碼')}`,
        type: 'error',
        duration: 1000,
        showClose: false
      })
      return
    }
  }
  console.log('withdrawAmount.value', withdrawAmount.value)
  console.log('Number(mainBalance.value)', Number(mainBalance.value))
  if (withdrawAmount.value > Number(mainBalance.value)) {
    ElNotification({
      title: `${t('可提領餘額不足')}`,
      type: 'error',
      duration: 1000,
      showClose: false
    })
    return
  }
  const withdrawRes = await withdraw(
    siteStore.siteData.transactionPasswordRequired
      ? {
        amount: JSON.stringify(withdrawAmount.value),
        password: tPwd.value,
        walletType: siteStore.siteData?.mainWalletType
      }
      : {
        amount: JSON.stringify(withdrawAmount.value),
        walletType: siteStore.siteData?.mainWalletType
      }
  )
  if (withdrawRes.success) {
    ElNotification({
      title: `${t('提款成功')}`,
      type: 'success',
      duration: 1000
    })
    withdrawAmount.value = 0
    tPwd.value = ''
    await playerStore.fetchInfo()
  }
}
const withdrawFeeCount = () => {
  const fee =
    withdrawAmount.value * siteStore.siteData.withdrawFeeRatio +
    siteStore.siteData.withdrawFeeFixed
  return fee < 1 ? 0 : new Intl.NumberFormat().format(fee)
}
const hiddenAccountNo = (value) => {
  if (value) {
    return value.replace(/^.{4}/, '****')
  } else {
    return ''
  }
}
onMounted(() => {
  if (playerStore.playerInfo.bankInfo !== null) {
    const bank = siteStore.siteData.depositOptions.bank.find((item) => {
      return item === playerStore.playerInfo.bankInfo.bankName
    })
    if (!bank) {
      showSectionType.value = false
    } else {
      showSectionType.value = true
    }
  }
})

const walletTypeName = (item: any) => {
  const type = item.type
  switch (type) {
    case 1:
      return siteStore.siteData.mainWalletType === type
        ? t('主錢包')
        : t('交易錢包')
    case 2:
      return siteStore.siteData.mainWalletType === type
        ? t('主錢包')
        : t('電力錢包')
    case 3:
      return siteStore.siteData.mainWalletType === type
        ? t('主錢包')
        : t('商城錢包')
    case 4:
      return siteStore.siteData.mainWalletType === type
        ? t('主錢包')
        : t('質押錢包')
    default:
      return t('其他資產')
  }
}

const transferWalletData = ref({
  from: '',
  to: '',
  amount: ''
})

const transferBtn = ref(false)

const goTransfer = async () => {
  transferBtn.value = false
  const fromData = playerStore.playerInfo.wallet.find(
    (item: any) => item.id === transferWalletData.value.from
  )
  const toData = playerStore.playerInfo.wallet.find(
    (item: any) => item.id === transferWalletData.value.to
  )
  if (!fromData) {
    ElNotification({
      title: `${t('請選擇轉出錢包')}`,
      type: 'error',
      duration: 1000
    })
    return
  }
  if (!toData) {
    ElNotification({
      title: `${t('請選擇轉入錢包')}`,
      type: 'error',
      duration: 1000
    })
    return
  }
  const transferRes = await transfer({
    fromWalletId: transferWalletData.value.from,
    toWalletId: transferWalletData.value.to,
    amount: JSON.stringify(transferWalletData.value.amount),
    memo: `用戶操作 ${walletTypeName(fromData)} 劃轉至 ${walletTypeName(toData)} ,數量: ${transferWalletData.value.amount}`
  })
  if (transferRes.success) {
    ElNotification({
      title: `${t('轉帳成功')}`,
      type: 'success',
      duration: 1000
    })
    await playerStore.fetchInfo()
    transferWalletData.value.amount = 0
  }
}

const mainBalance = computed(() => {
  const mainWallet = playerStore.playerInfo.wallet.find(
    (item: any) => item.type === siteStore.siteData?.mainWalletType
  )
  return mainWallet ? mainWallet.balance : 0
})

watch(
  () => transferWalletData.value.from,
  (newValue) => {
    console.log('transferWalletData.value', transferWalletData.value.from)
    const toWalletList = playerStore.playerInfo.wallet.filter(
      (item: any) => item.id !== transferWalletData.value.from
    )
    transferWalletData.value.to = toWalletList[0].id
  },
  { deep: true }
)
watch(
  () => transferWalletData.value.amount,
  (newValue) => {
    if (newValue > 0) {
      transferBtn.value = true
    } else {
      transferBtn.value = false
    }
  },
  { deep: true }
)
</script>
<template>
  <div class="page">
    <div class="sec-title">
      <h2>{{ $lang('財務紀錄導覽') }}</h2>
      <p>{{ $lang('請選擇要查看的資料表頁面') }}</p>
    </div>
    <div class="bank_form">
      <div class="record-box">
        <div class="record-box-item" @click="navigateTo('/record-list?type=' + 'funds')">
          <h3>資金紀錄表</h3>
          <p>銀行／分行／戶名與帳號，金額，以及申請／通過／駁回等狀態。</p>
        </div>
        <div class="record-box-item" @click="navigateTo('/record-list?type=' + 'nt')">
          <h3>台幣入金表</h3>
          <p>台幣入金活動與金額，以及申請／通過／駁回等狀態。</p>
        </div>
        <div class="record-box-item" @click="navigateTo('/record-list?type=' + 'usdt')">
          <h3>USDT 入金進表</h3>
          <p>USDT 入金／扣減紀錄，與金額，總結顯示。</p>
        </div>
        <div class="record-box-item" @click="navigateTo('/record-list?type=' + 'exchange')">
          <h3>外幣交換表</h3>
          <p>外幣交換申請數量與審核結果（申請中/通過/駁回），並顯示交易前/交易後資訊。</p>
        </div>
      </div>

    </div>

  </div>
</template>
<style scoped lang="sass">
.page
  overflow: hidden
  .sec-title
    display: flex
    justify-content: center
    flex-direction: column
    align-items: center
    background-color: #233950
    padding: 80px 0
    color: #fff
    &::before
      content: ''
      background-image: url(@/assets/images/layer1.png)
      background-repeat: no-repeat
      background-size: 100% 100%
      position: absolute
      top: 0
      left: 0
      display: block
      width: 263px
      height: 275px
    &::after 
      content: ''
      background-image: url(@/assets/images/layer1.png)
      background-repeat: no-repeat
      background-size: 100% 100%
      position: absolute
      bottom: 0
      right: 0
      display: block
      width: 263px
      height: 275px
      transform: scale(-1)
    @media (max-width: 992px)
      padding: 40px auto
    h4
      font-size: 20px
    h2
      font-size: 50px
      margin-bottom: 16px
    p
      font-size: 16px
  .bank_form
    overflow: hidden
    position: relative
    .record-box
      margin: 0 auto
      max-width: 1200px
      padding: 20px
      display: grid
      grid-template-columns: repeat(4, 1fr)
      justify-content: space-between
      gap: 20px
      @media (max-width: 992px)
        padding: 20px 10px
        grid-template-columns: repeat(2, 1fr)
      @media (max-width: 798px)
        grid-template-columns: repeat(1, 1fr)
        .record-box-item
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15)
      .record-box-item
        border: 1px solid rgba(255, 255, 255, 0.15)
        border-radius: 12px
        padding: 16px
        text-decoration: none
        display: block
        transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease
        &:hover
          transform: translateY(-2px)
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15)
          border-color: rgba(255, 200, 80, 0.6)
        h3
          font-size: 18px
          font-weight: 600
          color: rgb(223, 189, 79)
          margin-bottom: 8px
</style>
