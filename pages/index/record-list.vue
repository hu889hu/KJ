<script lang="ts" setup>
const { queryTransaction } = useTransactionStore()
const { queryWithdrawRecord, queryTransferRecord, queryWalletLog } = useWalletStore()
const router = useRouter()
const route = useRoute()
const recordList: any = ref([])
const withdrawRecordList: any = ref([])
const recordType = ref('transaction')
const siteStore = useSiteStore()
const playerStore = usePlayerStore()
const { t } = useI18n()
const pledgeSocketStore = usePledgeSocketStore()
const selectWalletId: any = ref('')
const selectWallet: any = ref({})

const walletTypeName = (type: any) => {
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
const type = route.query.type
const transferList = ref([])
const rate = ref(1)
onMounted(async () => {
  if (route.query.type === 'funds') {
    const queryWithdrawRecordRes = await queryWithdrawRecord({})
    withdrawRecordList.value = queryWithdrawRecordRes.data.result
  } else if (route.query.type === 'exchange') {
    const queryTransferRecordRes = await queryTransferRecord({})
    transferList.value = queryTransferRecordRes.data.result
  } else {
    const selectWalletIds = route.query.type === 'nt' ? 2 : 13
    const firstWallet = playerStore.playerInfo.wallet.find(
      (item: any) => item.type === selectWalletIds
    )
    const queryWalletLogRes = await queryWalletLog({
      walletId: firstWallet.id,
      page: 1,
      limit: 1000,
      size: 1000
    })
    recordList.value = queryWalletLogRes.data.result.filter((item: any) => {
      return item.type === 0 || item.type === 3 || item.type === 4
    })

    rate.value = siteStore.siteData.walletConfig.exchangeRates.find((item) =>
      item.toWalletType == '2'
    ).rate
  }

})

const transactionRecordType = (type: any) => {
  const transactionTypeList = [
    {
      value: 0,
      label: t('儲值')
    },
    {
      value: 1,
      label: t('提領')
    },
    {
      value: 2,
      label: t('轉帳')
    },
    {
      value: 3,
      label: t('贈送')
    },
    {
      value: 4,
      label: t('活動')
    },
    {
      value: 5,
      label: t('結算')
    },
    {
      value: 6,
      label: t('系統')
    },
    {
      value: 7,
      label: t('下注')
    }
  ]
  const data = siteStore.siteData.walletLogType.find(
    (item) => item.type === type
  )

  if (selectWallet.value.type !== 1 && type === 7) {
    return t('質押')
  } else {
    return data ? t(data.label) : t('未知')
  }
}
const applyStatus = (status: any) => {
  const statusList = [
    {
      value: 0,
      label: t('未審核')
    },
    {
      value: 1,
      label: t('通過')
    },
    {
      value: 2,
      label: t('駁回')
    }
  ]
  const data = statusList.find((item) => item.value === status)
  return data ? t(data.label) : t('未知')
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
const hiddenAccountNo = (value) => {
  if (value) {
    return value.replace(/^.{4}/, '****')
  } else {
    return ''
  }
}
const formatMemo = (value: any) => {
  const str = value
  // .replace('會員投注', '會員購買')
  // .replace('投注-', '購買-')
  // .replace('下注', '購買')
  // .replace('輸贏', '盈虧')
  // .replace('投注本金', '購買本金')
  return str
}
const statusList = [
  {
    label: '申請中',
    value: 0,
  },
  {
    label: '通過',
    value: 1,
  },
  {
    label: '駁回',
    value: 2,
  }
]
</script>

<template>
  <div class="page">
    <div class="sec-title" v-if="type === 'funds'">
      <h2>{{ $lang('財務紀錄') }}</h2>
      <h4>此頁面僅展示您的「資金紀錄」資料</h4>
    </div>
    <div class="sec-title" v-if="type === 'nt'">
      <h2>{{ $lang('財務紀錄') }}</h2>
      <h2>{{ $lang('（台幣入金表)') }}</h2>
      <h4>此頁面僅展示您的「台幣入金表」資料</h4>
    </div>
    <div class="sec-title" v-if="type === 'usdt'">
      <h2>{{ $lang('財務紀錄') }}</h2>
      <h2>{{ $lang('（USDT入出金表）') }}</h2>
      <h4>此頁面僅展示您的「USDT 入出金明細」資料</h4>
    </div>
    <div class="sec-title" v-if="type === 'exchange'">
      <h2>{{ $lang('財務紀錄') }}</h2>
      <h2>{{ $lang('（外幣交換表）') }}</h2>
      <h4>此頁面僅展示您的「外幣交換表」資料</h4>
    </div>
    <div class="formSection">
      <div class="formContent">
        <div class="recordBox">
          <table>
            <thead>
              <tr class="recordBox-title">
                <th>{{ $lang('時間') }}</th>
                <th>{{ $lang('內容') }}</th>
                <th>{{ $lang('金額') }}</th>
                <th>{{ $lang('總結') }}</th>
              </tr>
            </thead>
            <tbody v-if="type === 'funds'">
              <tr v-for="(item, index) in withdrawRecordList" :key="index" class="recordBox-toggle">
                <th>{{ formatDate(item.createdAt) }}</th>
                <th class="content">
                  <div>{{ $lang('銀行') }}:{{ item.bankData.bankName }}</div>
                  <div>{{ $lang('分行') }}:{{ item.bankData.branch }}</div>
                  <div>{{ $lang('戶名') }}:{{ item.bankData.account }}</div>
                  <div>
                    {{ $lang('帳號') }}:{{
                      hiddenAccountNo(item.bankData.accountNo)
                    }}
                  </div>
                  <div>{{ $lang('狀態') }}:{{ applyStatus(item.status) }}</div>
                </th>
                <th>
                  ${{ new Intl.NumberFormat('zh-TW').format(item.amount) }}
                </th>
                <th>
                  {{ applyStatus(item.status) }}
                </th>
              </tr>
            </tbody>
            <tbody v-if="type === 'nt' || type === 'usdt'">
              <tr v-for="(item, index) in recordList" :key="index" class="recordBox-toggle">
                <th>{{ formatDate(item.createdAt) }}</th>
                <th class="content">
                  {{ $lang('類型') }}:{{ transactionRecordType(item.type) }}
                </th>
                <th>
                  ${{ new Intl.NumberFormat('zh-TW').format(item.amount) }}
                </th>
                <th>
                  {{ formatMemo(item.memo) }}
                </th>
              </tr>
            </tbody>
            <tbody v-if="type === 'exchange'">
              <tr v-for="(item, index) in transferList" :key="index" class="recordBox-toggle">
                <th>{{ formatDate(item.createdAt) }}</th>
                <th class="content">
                  <div v-if="item.balanceChange">{{ $lang('交易前') }}:{{ new
                    Intl.NumberFormat('zh-TW').format(item.balanceChange.fromBefore) }}</div>
                  <div v-if="item.balanceChange">{{ $lang('交易後') }}:{{ new
                    Intl.NumberFormat('zh-TW').format(item.balanceChange.fromAfter) }}</div>
                </th>
                <th>
                  <div>申請數量:</div>
                  {{ new Intl.NumberFormat('zh-TW').format(item.fromAmount) }}
                </th>
                <th>
                  <div>{{ statusList[item.status].label }}</div>
                  {{ new Intl.NumberFormat('zh-TW').format(item.toAmount) }}
                </th>
              </tr>
            </tbody>
          </table>
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
      font-weight: bold
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

<style scoped lang="sass">
.router
  width: 100%
  height: 35px
  position: relative
  border-radius: 5px
  font-size: 16px
  background-color: #afafaf
  color: #fff
  display: flex
  align-items: center
  justify-content: flex-start
  border: 1px solid #fff
  svg
    padding: 0 20px 0 10px
  .home
    cursor: pointer
</style>

<style scoped lang="sass">
.formSection
  margin: 20px 0 50px 0
  width: 100%
  // height: 58vh
  position: relative
  // border-radius: 5px
  font-size: 16px
  // border: 1px solid #fff
  overflow-y: auto
  @media screen and (max-width: 768px)
    height: 48vh
  color: #fff
  .formContent
    width: 100%
    .changeType
      padding: 0 20px 30px
    .buttonWhite
      max-width: 50%
      padding: 16px 35px
      background-color: #6685a1
      font-weight: bold
      transition: background-color 0.5s ease
      &:nth-child(1)
        margin-right: 3px
      &:hover
        background-color: #2a4560
      &.active
        background-color: #2a4560

</style>
<style scoped lang="sass">
.recordBox
  width: 100%
  padding: 0 0 20px
  @media screen and (max-width: 768px)
    padding: 0 0px 10px 0px
  table
    width: calc( 100% - 10px )
    margin: 0 5px
    // border-collapse: separate
    // border-spacing: 3px
  .recordBox-title
    background-color: #b8b8b8
    color: #fff
    font-size: 16px
    width: 100%
  thead
    th
      color: #fff
      background-color: #2a4560
  th
    padding: 15px
    font-size: 15px
    font-weight: 500
    text-align: center
    border-block-end: 1px solid #3a3f3922
    color: #000
  th:nth-of-type(1)
    width: 20%
    vertical-align: middle
  th:nth-of-type(2)
    width: 40%
    vertical-align: middle
  th:nth-of-type(3)
    width: 20%
    vertical-align: middle
  th:nth-of-type(4)
    width: 20%
    vertical-align: middle
  .recordBox-toggle
    padding: 5px 0
    background-color: #fff
    &:hover
      background-color: #d7f7ff
    td
      padding: 5px
      font-size: 15px
      font-weight: bold
      transition: all ease 0.3s
      word-break: break-word
</style>

<style scoped lang="sass">
.msg-th
  padding: 2px 5px
  .date
    font-size: 14px
    color: #000
    font-weight: bold
.msg-cont
  .msg
    .info-title
      font-size: 16px
      font-weight: bold
      color: #000
      margin: 0 0 5px 0
    .info-msg
      font-size: 16px
      font-weight: bold
      color: #000
      margin: 0 0 5px 0
  .msgContent
    .content
      margin-top: 3px
      padding: 2px 5px
      background-color: rgba(0, 0, 0, 0.1)
      font-size: 14px
      font-weight: bold
      .replyTxt
        color: #fff
        border-radius: 5px
        font-size: 12px
        padding: 2px 5px
        background-color: rgba(179, 33, 28, 0.795)
.msg-cont input[type="checkbox"]
  display: none
.msg-cont .msgContent
  display: none
.msg-cont label
  width: 100%
.msg-cont input[type="checkbox"]:checked ~ .msgContent
  display: block
.replyStyle
  display: flex
  margin: 5px 0 0 0
  justify-content: flex-end
  flex-wrap: wrap
.replyStyle .input
  width: 100%
.replyStyle textarea
  width: 100%
.submitBtn
  width: 100px
  height: 30px
  background-color: #0849aabd
  border-radius: 5px
  text-align: center
  line-height: 30px
  cursor: pointer
  font-size: 12px
  color: #fff
  display: flex
  justify-content: center
  &:hover
    background-color: #40b768
  @media screen and (max-width: 768px)
    width: 60px
    height: 30px
    font-size: 12px
    line-height: 30px
    padding: 0
    margin: 0
    .fa
      font-size: 12px
      padding: 0
</style>

<style scoped lang="sass">
.pages-user-info__form-item
  display: flex
  justify-content: flex-start
  align-items: center
  margin: 10px 0
  // border-bottom: 1px solid #000
  padding: 5px 30px
  .input-title
    width: 100px
    font-size: 16px
    font-weight: bold
    color: #000
    margin: 0 10px 0 0
  .selectStyle
    width: 100%
    height: 40px
    border-radius: 5px
    color: #000

    font-size: 16px
    padding: 0 10px
    border: 1px solid #000
    outline: none
    cursor: pointer
    @media screen and (max-width: 768px)
      font-size: 14px
</style>
