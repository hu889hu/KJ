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
await useAsyncData(async () => {
  console.log(playerStore.playerInfo);

  if (siteStore.siteData.smsVerify === 3) {
    if (!playerStore.playerInfo.smsVerify) {
      navigateTo('/smsVerify')
    }
  }
  if (!playerStore.playerInfo?.bankInfo) {
    navigateTo('/bank')
  }

  if (playerStore.playerInfo.bankInfo.status !== 1) {
    navigateTo('/bank')
  }
})
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
        walletType: 13
      }
      : {
        amount: JSON.stringify(withdrawAmount.value),
        walletType: 13
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
    (item: any) => item.type === 13
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
      <h2>{{ $lang('財務申請') }}</h2>
      <p>{{ $lang('請新增一筆申請資訊') }}</p>
    </div>
    <div class="bank_form">

      <div v-if="playerStore.playerInfo.bankInfo" class="withdraw_form">
        <div v-if="selectType === 'withdraw'" class="form-bg">
          <div class="input-classic">
            <span class="input-title">{{ $lang('銀行名稱') }}</span>
            <div class="input-field">
              <div class="inp-icon">
                <img src="@/assets/images/elele.svg" alt="">
              </div>
              <div class="input-text">
                <input type="text" :value="playerStore.playerInfo.bankInfo.bankName" readonly>
              </div>
            </div>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('分行名稱') }}</span>
            <div class="input-field">
              <div class="inp-icon">
                <img src="@/assets/images/elele.svg" alt="">
              </div>
              <div class="input-text">
                <input type="text" :value="playerStore.playerInfo.bankInfo.branch" readonly>
              </div>
            </div>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('帳戶號碼') }}</span>
            <div class="input-field">
              <div class="inp-icon">
                <img src="@/assets/images/elele.svg" alt="">
              </div>
              <div class="input-text">
                <input type="text" :value="hiddenAccountNo(playerStore.playerInfo.bankInfo.accountNo)" readonly>
              </div>
            </div>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('帳戶戶名') }}</span>
            <div class="input-field">
              <div class="inp-icon">
                <img src="@/assets/images/elele.svg" alt="">
              </div>
              <div class="input-text">
                <input type="text" :value="hiddenAccountNo(playerStore.playerInfo.bankInfo.account)" readonly>
              </div>
            </div>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('我的資產') }}({{ $lang('主錢包') }})</span>
            <div class="input-text" style="color: #fff;font-weight: 700;font-size: 18px;">
              {{ new Intl.NumberFormat('zh-TW').format(mainBalance) }}
            </div>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('申请金額') }}</span>
            <div class="input-field">
              <div class="inp-icon">
                <img src="@/assets/images/button.svg" alt="" style="height: 20px;">
              </div>
              <div class="input-text" style="margin-bottom: 10px;">
                <input v-model="withdrawAmount" v-trim-input type="number" min="0" />
              </div>
            </div>
            <span class="input-title text-right w-100">{{ $lang('限制金額') }}：{{
              new Intl.NumberFormat('zh-TW').format(
                siteStore.siteData.minWithdrawAmount
              )
            }}
              ~
              {{
                new Intl.NumberFormat('zh-TW').format(
                  siteStore.siteData.maxWithdrawAmount
                )
              }}</span>
            <!-- <span class="input-title text-right w-100" style="margin: 0 0 0 10px">{{ $lang('手續費') }}：{{
              withdrawAmount > 0 ? withdrawFeeCount() : 0
            }}</span> -->
          </div>
          <div v-if="siteStore.siteData.transactionPasswordRequired" class="input-classic">
            <span class="input-title">{{ $lang('交易密碼') }}</span>
            <input v-model="tPwd" v-trim-input type="password" />
          </div>
          <div class="button-row">
            <button type="button" class="submit btn-submit" @click="goWithdraw">
              {{ $lang('確認送出') }}
            </button>
          </div>
        </div>
        <!-- <div v-if="selectType === 'transfer'" class="form-bg">
          <div class="input-classic">
            <span class="input-title">{{ $lang('轉出錢包') }}</span>
            <select v-model="transferWalletData.from" class="selectStyle">
              <option v-for="item in playerStore.playerInfo.wallet" :key="item.id" :value="item.id"
                @click="transferWalletData.from = item.id">
                {{ walletTypeName(item) }} ($
                {{ new Intl.NumberFormat('zh-tw').format(item.balance) }})
              </option>
            </select>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('轉入錢包') }}</span>
            <select v-model="transferWalletData.to" class="selectStyle">
              <option v-for="item in playerStore.playerInfo.wallet" :key="item.id" :value="item.id"
                @click="transferWalletData.from = item.id">
                {{ walletTypeName(item) }} ($
                {{ new Intl.NumberFormat('zh-tw').format(item.balance) }})
              </option>
            </select>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('數量') }}</span>
            <input v-model="transferWalletData.amount" v-trim-input type="number" />
          </div>
          <div class="button-row">
            <button type="button" class="submit btn-submit" @click="goTransfer">
              {{ $lang('確認送出') }}
            </button>
          </div>
        </div> -->
        <!-- <div class="form-bg" v-else>
        <div class="input-classic">
          <span class="input-title">{{ $lang('銀行') }}</span>
          <div class="input-text">
            {{ playerStore.playerInfo.bankInfo.bankName }}
            {{ playerStore.playerInfo.bankInfo.branch }}
          </div>
        </div>
        <div class="input-classic">
          <span class="input-title">{{ $lang('銀行帳號') }}</span>
          <div class="input-text">{{ playerStore.playerInfo.bankInfo.accountNo }}</div>
        </div>
        <div class="input-classic">
          <span class="input-title">{{ $lang('戶名') }}</span>
          <div class="input-text">{{ playerStore.playerInfo.bankInfo.account }}</div>
        </div>
        <div class="input-classic">
          <span class="input-title">{{ $lang('金額') }}</span>
          <input
            name="balance"
            v-model="withdrawAmount"
            maxlength="7"
            type="number"
          />
          <span class="input-title text-right w-100"
            >{{ $lang('限制金額') }}：{{ siteStore.siteData.minWithdrawAmount }} ~
            {{ siteStore.siteData.maxWithdrawAmount }}</span
          >
          <span class="input-title text-right w-100"
            >{{ $lang('手續費') }}：{{
              withdrawAmount > 0 ? withdrawFee(withdrawAmount) : 0
            }}</span
          >
        </div>
        <div class="input-classic">
          <span class="input-title">{{ $lang('交易密碼') }}</span>
          <input name="tPwd" type="password" required v-model="tPwd" />
        </div>
        <div class="button-row">
          <button
            type="button"
            class="submit btn-submit"
            @click="goFetchWithdraw"
          >
            {{ $lang('送出') }}
          </button>
        </div>
      </div> -->
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
    &::before
      content: ''
      display: block
      background-image: url(@/assets/images/geometry-3.png)
      position: absolute
      top: 0
      right: -43px
      width: 670px
      height: 678px
      z-index: -1
    &::after 
      content: ''
      display: block
      background-image: url(@/assets/images/geometry-3.png)
      position: absolute
      bottom: 0
      left: 0
      width: 670px
      height: 678px
      z-index: -1
      transform: rotate(180deg)
    .link-btn-row
      position: absolute
      top: 0
      left: 50%
      width: 100%
      max-width: 1200px
      transform: translate(-50%,-100%)
      z-index: 1
      @media (max-width: 992px)
        padding-inline: 20px
        .buttonWhite
          width: 50%
      .buttonWhite
        padding: 16px 70px
        background-color: #7497b5
        color: #fff
        &:nth-child(1)
          border-inline-end: 1px solid #fff
    .form-bg
      max-width: 1200px
      margin: 80px auto
      background-color: #2a4560
      padding: 60px 70px
      @media (max-width: 992px)
        padding: 30px 35px
        margin: 80px 20px

      .title
        margin-bottom: 0
        h2
          font-size: 16px
        h4,h2
          color: #fff !important
     
      .input-classic
        width: 100%
        margin-bottom: 20px
        .input-field
          position: relative
          
        .input-title
          color: #fff
        .inp-icon
          position: absolute
          left: 0
          top: 50%
          transform: translateY(-50%)
          display: inline-block
          img
            width: 20px
            height: 10px
            object-fit: cover
        select option
          color: #000

        input,select
          background: none
          border: none
          color: #fff
          font-size: 16px
          border-bottom: 1px solid #fff
          padding: 0 0 0 40px
          margin: 0
          width: 100%
          display: block
          outline: none
          height: 46px
    .sampleimg
      width: 200px
    .btn-submit
      background: #7497b5
      color: #fff
      padding: 16px 35px
      transition: background-color 0.5s ease
      &:hover
        background: #6685a1
</style>
