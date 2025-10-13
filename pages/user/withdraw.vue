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
  if (siteStore.siteData.smsVerify === 3) {
    if (!playerStore.playerInfo.smsVerify) {
      navigateTo('/user/smsVerify')
    }
  }
  if (!playerStore.playerInfo?.bankInfo) {
    navigateTo('/user/bank')
  }

  if (playerStore.playerInfo.bankInfo.status !== 1) {
    navigateTo('/user/bank')
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
    <div class="sec-title span-lang">
      <span class="zh_TW">{{ $lang('總資產') }}</span>
      <i class="fas fa-wallet"></i>
    </div>
    <div class="form-bg link-btn-row">
      <!-- <router-link to="/user/deposit" class="btn-form-link span-lang">
        {{ $lang('儲值') }}
      </router-link> -->
      <!-- <router-link to="/user/withdraw" class="btn-form-link span-lang active">
        {{ $lang('提領') }}
      </router-link> -->
      <button class="buttonWhite" @click="selectType = 'withdraw'">
        <div
          class="btn-form-link span-lang"
          :class="selectType === 'withdraw' ? 'active' : ''"
        >
          {{ $lang('提領') }}
        </div>
      </button>
      <button
        v-if="playerStore.playerInfo.wallet.length > 1"
        class="buttonWhite"
        @click="selectType = 'transfer'"
      >
        <div
          class="btn-form-link span-lang"
          :class="selectType === 'transfer' ? 'active' : ''"
        >
          {{ $lang('劃轉') }}
        </div>
      </button>
      <!-- <router-link to="/user/transfer" class="btn-form-link span-lang">
        {{ $lang("轉點") }}
      </router-link> -->
    </div>
    <div v-if="playerStore.playerInfo.bankInfo" class="withdraw_form">
      <div v-if="selectType === 'withdraw'" class="form-bg">
        <div class="input-classic">
          <span class="input-title">{{ $lang('銀行名稱') }}</span>
          <div class="input-text">
            {{ playerStore.playerInfo.bankInfo.bankName }}
          </div>
        </div>
        <div class="input-classic">
          <span class="input-title">{{ $lang('銀行帳戶') }}</span>
          <div class="input-text">
            {{ hiddenAccountNo(playerStore.playerInfo.bankInfo.accountNo) }}
          </div>
        </div>
        <div class="input-classic">
          <span class="input-title"
            >{{ $lang('我的資產') }}({{ $lang('主錢包') }})</span
          >
          <div class="input-text">
            {{ new Intl.NumberFormat('zh-TW').format(mainBalance) }}
          </div>
        </div>
        <div class="input-classic">
          <span class="input-title">{{ $lang('金額') }}</span>
          <input v-model="withdrawAmount" v-trim-input type="number" />
          <span class="input-title text-right w-100"
            >{{ $lang('限制金額') }}：{{
              new Intl.NumberFormat('zh-TW').format(
                siteStore.siteData.minWithdrawAmount
              )
            }}
            ~
            {{
              new Intl.NumberFormat('zh-TW').format(
                siteStore.siteData.maxWithdrawAmount
              )
            }}</span
          >
          <span class="input-title text-right w-100" style="margin: 0 0 0 10px"
            >{{ $lang('手續費') }}：{{
              withdrawAmount > 0 ? withdrawFeeCount() : 0
            }}</span
          >
        </div>
        <div
          v-if="siteStore.siteData.transactionPasswordRequired"
          class="input-classic"
        >
          <span class="input-title">{{ $lang('交易密碼') }}</span>
          <input v-model="tPwd" v-trim-input type="password" />
        </div>
        <div class="button-row">
          <button type="button" class="submit btn-submit" @click="goWithdraw">
            {{ $lang('送出') }}
          </button>
        </div>
      </div>
      <div v-if="selectType === 'transfer'" class="form-bg">
        <div class="input-classic">
          <span class="input-title">{{ $lang('轉出錢包') }}</span>
          <select v-model="transferWalletData.from" class="selectStyle">
            <option
              v-for="item in playerStore.playerInfo.wallet"
              :key="item.id"
              :value="item.id"
              @click="transferWalletData.from = item.id"
            >
              {{ walletTypeName(item) }} ($
              {{ new Intl.NumberFormat('zh-tw').format(item.balance) }})
            </option>
          </select>
        </div>
        <div class="input-classic">
          <span class="input-title">{{ $lang('轉入錢包') }}</span>
          <select v-model="transferWalletData.to" class="selectStyle">
            <option
              v-for="item in playerStore.playerInfo.wallet"
              :key="item.id"
              :value="item.id"
              @click="transferWalletData.from = item.id"
            >
              {{ walletTypeName(item) }} ($
              {{ new Intl.NumberFormat('zh-tw').format(item.balance) }})
            </option>
          </select>
        </div>
        <div class="input-classic">
          <span class="input-title">{{ $lang('數量') }}</span>
          <input
            v-model="transferWalletData.amount"
            v-trim-input
            type="number"
          />
        </div>
        <div class="button-row">
          <button type="button" class="submit btn-submit" @click="goTransfer">
            {{ $lang('送出') }}
          </button>
        </div>
      </div>
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
</template>
<style scoped lang="sass">
@import '@/assets/sass/user/model2/coin2.scss'
.withdraw_form
  padding: 0 10px

.buttonWhite
  margin-left: 30px
  width: 100px
  height: 40px
  background-color: #fff
  border-radius: 5px
  text-align: center
  line-height: 40px
  cursor: pointer
  font-size: 16px
  color: #000
  @media screen and (max-width: 768px)
    width: 135px
.active
  background-color: #5a8f00 !important
</style>
<style scoped lang="sass">
.selectStyle
  height: 32px
  padding: 2px 15px
  font-size: 19px
  line-height: 32px
  font-weight: 400
  background-color: #fff
  border: 1px solid #000
  border-radius: 4px
</style>
