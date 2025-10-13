<script lang="ts" setup>
const { queryTransaction } = useTransactionStore()
const { queryWithdrawRecord, queryDepositRecords, queryWalletLog } =
  useWalletStore()
const router = useRouter()
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

onMounted(async () => {
  // 下單紀錄 列表 filter type:5 & type:7
  console.log('walletLog', pledgeSocketStore.walletLogData)
  const firstWallet = playerStore.playerInfo.wallet.find(
    (item: any) => item.type === siteStore.siteData.mainWalletType
  )
  selectWalletId.value = firstWallet.id
  selectWallet.value = firstWallet
  const queryWalletLogRes = await queryWalletLog({
    walletId: selectWallet.value.id,
    page: 1,
    limit: 1000,
    size: 1000
  })
  recordList.value = queryWalletLogRes.data.result.filter((item: any) => {
    return item.type !== 3
  })
})

await useAsyncData(async () => {
  // const queryTransactionRes = await queryTransaction({})
  // recordList.value = queryTransactionRes.data
  const queryWithdrawRecordRes = await queryWithdrawRecord({})
  console.log(queryWithdrawRecordRes.data)
  withdrawRecordList.value = queryWithdrawRecordRes.data.result
})

watch(
  () => selectWalletId.value,
  async (newValue) => {
    const walletData = playerStore.playerInfo.wallet.find(
      (item: any) => item.id === newValue
    )
    selectWallet.value = walletData
    console.log(' selectWalletId', selectWallet.value)
    const queryWalletLogRes = await queryWalletLog({
      walletId: selectWallet.value.id,
      page: 1,
      limit: 1000,
      size: 1000
    })
    recordList.value = queryWalletLogRes.data.result.filter((item: any) => {
      return item.type !== 3
    })
  },
  { deep: true }
)

const selectWalletData = (data: any) => {
  selectWallet.value = data
  console.log('selectWallet.value', selectWallet.value)
}

const changeRecordType = async (type: string) => {
  recordType.value = type
  switch (type) {
    case 'transaction':
      const firstWallet = playerStore.playerInfo.wallet.find(
        (item: any) => item.type === siteStore.siteData.mainWalletType
      )
      selectWalletId.value = firstWallet.id
      selectWallet.value = firstWallet
      const queryWalletLogRes = await queryWalletLog({
        walletId: selectWallet.value.id
      })
      recordList.value = queryWalletLogRes.data.result.filter((item: any) => {
        return item.type !== 3
      })
      return
    case 'deposit':
      const queryDepositRecordsRes = await queryDepositRecords()
      recordList.value = queryDepositRecordsRes.data.result.filter(
        (item: any) => {
          return item.type !== 3
        }
      )
      return
    case 'withdraw':
      const queryWithdrawRecordRes = await queryWithdrawRecord({})
      console.log(queryWithdrawRecordRes.data)
      withdrawRecordList.value = queryWithdrawRecordRes.data.result
  }
}

const showSectionType = (type: string) => {
  const bank = siteStore.siteData.depositOptions.bank.find((item) => {
    return item === type
  })
  if (!bank) {
    return true
  } else {
    return false
  }
}

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
      label: t('已完成')
    },
    {
      value: 2,
      label: t('已駁回')
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
</script>

<template>
  <div class="pages">
    <div class="sec-title">
      <span>{{ $lang('提領紀錄') }}</span>
      <i class="fas fa-history"></i>
    </div>
    <div class="formSection">
      <div class="formContent">
        <div class="changeType">
          <button
            type="button"
            class="buttonWhite"
            :class="recordType === 'transaction' ? 'active' : ''"
            @click="changeRecordType('transaction')"
          >
            {{ $lang('數據紀錄') }}
          </button>
          <button
            type="button"
            class="buttonWhite"
            :class="recordType === 'withdraw' ? 'active' : ''"
            @click="changeRecordType('withdraw')"
          >
            {{ $lang('提領紀錄') }}
          </button>
        </div>
        <div v-if="recordType === 'transaction'" class="recordBox">
          <div style="margin: 10px 0">
            <div class="pages-user-info__form-item">
              <span class="input-title">{{ $lang('錢包') }}</span>
              <select
                v-if="playerStore.playerInfo.wallet.length > 1"
                v-model="selectWalletId"
                class="selectStyle"
              >
                <option
                  v-for="item in playerStore.playerInfo.wallet"
                  :key="item.id"
                  :value="item.id"
                  @click="(selectWalletId = item.id), (selectWallet = item)"
                >
                  {{ walletTypeName(item.type) }}
                </option>
              </select>
            </div>
          </div>
          <table>
            <thead>
              <tr class="recordBox-title">
                <th>{{ $lang('推動時段') }}</th>
                <th>{{ $lang('細目') }}</th>
                <th>{{ $lang('金額') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in recordList"
                :key="index"
                class="recordBox-toggle"
              >
                <th>{{ formatDate(item.createdAt) }}</th>
                <th class="content">
                  <div>
                    {{ $lang('類型') }}:{{ transactionRecordType(item.type) }}
                  </div>
                  <div class="memo">
                    {{ $lang('備註') }}:{{ formatMemo(item.memo) }}
                  </div>
                </th>
                <th>
                  {{ new Intl.NumberFormat('zh-TW').format(item.amount) }}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="recordType === 'withdraw'" class="recordBox">
          <table>
            <thead>
              <tr class="recordBox-title">
                <th>{{ $lang('交易時間') }}</th>
                <th>{{ $lang('細目') }}</th>
                <th>{{ $lang('金額') }}</th>
              </tr>
            </thead>
            <tbody v-if="withdrawRecordList">
              <tr
                v-for="(item, index) in withdrawRecordList"
                :key="index"
                class="recordBox-toggle"
              >
                <th>{{ formatDate(item.createdAt) }}</th>
                <th v-if="showSectionType(item.bankData.bankName)">
                  <div>{{ $lang('交易所') }}:{{ item.bankData.bankName }}</div>
                  <div>
                    {{ $lang('錢包地址') }}:{{ item.bankData.accountNo }}
                  </div>
                  <div>{{ $lang('狀態') }}:{{ applyStatus(item.status) }}</div>
                  <!-- <div>
                    {{ $lang('手續費') }}: $
                    {{ new Intl.NumberFormat('zh-TW').format(item.fee) }}
                  </div> -->
                </th>
                <th v-else>
                  <!-- <div>{{ $lang('銀行') }}:{{ item.bankData.bankName }}</div>
                  <div>{{ $lang('分行') }}:{{ item.bankData.branch }}</div>
                  <div>{{ $lang('戶名') }}:{{ item.bankData.account }}</div>
                  <div>
                    {{ $lang('帳號') }}:{{
                      hiddenAccountNo(item.bankData.accountNo)
                    }}
                  </div> -->
                  <!-- <div>{{ item.bankData.bankName }}</div> -->
                  <div>{{ item.bankData.branch }}</div>
                  <div>{{ item.bankData.account }}</div>
                  <div>
                    {{ $lang('帳號') }}:{{ item.bankData.accountNo }}
                    <!-- {{
                      hiddenAccountNo(item.bankData.accountNo)
                    }} -->
                  </div>
                  <div>{{ $lang('狀態') }}:{{ applyStatus(item.status) }}</div>
                  <!-- <div>
                    {{ $lang('手續費') }}: $
                    {{ new Intl.NumberFormat('zh-TW').format(item.fee) }}
                  </div> -->
                </th>
                <th>
                  $ {{ new Intl.NumberFormat('zh-TW').format(item.amount) }}
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
@import '@/assets/sass/user/model2/coin2.scss'
.pages
  @media screen and (max-width: 768px)
    padding: 10px
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
  margin: 20px 0 0 0
  width: 100%
  height: 58vh
  position: relative
  border-radius: 5px
  font-size: 16px
  border: 1px solid #fff
  overflow-y: auto
  @media screen and (max-width: 768px)
    height: 48vh
  .formContent
    width: 100%
</style>

<style scoped lang="sass">
.buttonWhGreen
  margin: 30px 0
  width: 240px
  height: 40px
  background-color: #0849aabd
  border-radius: 5px
  text-align: center
  line-height: 40px
  cursor: pointer
  font-size: 16px
  color: #fff
  display: flex
  justify-content: center
  position: absolute
  right: 30px
  &:hover
    background-color: #40b768
  @media screen and (max-width: 768px)
    position: relative
    width: 135px
    bottom: 10px
    margin: 30px auto
    right: 0
  svg
    padding: 0 10px 0 0
.buttonWhite
  margin: 30px 0 0 30px
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
  background-color: #0849aabd
  color: #fff
</style>

<style scoped lang="sass">
.form_input
  width: 100%
  border-radius: 5px
  margin: 20px auto
  font-size: 16px
  overflow: hidden
  position: relative
  display: block
  display: flex
  justify-content: center
  align-items: flex-start
  flex-wrap: wrap
  .inputTitle
    background-color: #fff
    border-radius: 5px
    width: 30%
    display: block
    text-align: center
    margin: 0 10px 0 0
    font-size: 16px
    padding: 5px 0
    @media screen and (max-width: 768px)
      width: 90%
      font-size: 14px
      margin: 0 0 10px  0
  .empty
    background-color: #fff0
  .inputIten
    border-radius: 5px
    position: relative
    width: 60%
    background-color: #e2efff
    padding: 5px 15px
    @media screen and (max-width: 768px)
      width: 90%
    .input_text
      display: flex
      justify-content: flex-start
      align-items: center
      .textNormal
        padding: 0 10px 0
    .input_style
      border-radius: 5px
      border: none
      background-color: #e2efff
      height: 100%
      width: 100%
    input
      width: 100%
      height: 100%
      border: none
      background-color: #e2efff
      font-size: 16px
      outline: none
      &::placeholder
        color: #000
      @media screen and (max-width: 768px)
        font-size: 14px
    textarea
      height: 200px
      width: 100%
      border: none
      background-color: #e2efff
      font-size: 16px
      outline: none
      &::placeholder
        color: #000
      @media screen and (max-width: 768px)
        font-size: 14px
    select
      width: 100%
      border: none
      background-color: #e2efff
      outline: none
    .eyes
      position: absolute
      right: 5px
      top: 50%
      transform: translateY(-50%)
      z-index: 99
      cursor: pointer
    .imgUploader
      display: flex
      justify-content: center
  .noBackground
    background-color: #fff0
  .padding_Right_more
    padding: 5px 25px 5px 15px
  .flexStyle
    display: flex
    justify-content: flex-start
    align-items: center
    input
      margin: 5px 0 5px 10px
  .tipsLeft
    width: 30%
    @media screen and (max-width: 768px)
      width: 32%
  .tipsRight
    width: 60%
    display: block
    text-align: center
    font-size: 12px
    padding: 2px 0
    color: #cf0000
    text-align: right
    @media screen and (max-width: 768px)
      width: 60%
      font-size: 10px
  .fullFlex
    width: 100%
  .inputCheck
    width: 5%
    @media screen and (max-width: 768px)
     width: 10%
  .text
    width: 85%
    @media screen and (max-width: 768px)
     width: 80%
     font-size: 12px
</style>

<style scoped lang="sass">
.changeType
  display: flex
  justify-content: flex-start
  align-items: center
</style>

<style scoped lang="sass">
.recordBox
  width: 100%
  padding: 20px 30px
  @media screen and (max-width: 768px)
    padding: 20px 5px 10px 5px
  table
    width: 100%
    border-collapse: separate
    border-spacing: 3px
  .recordBox-title
    background-color: #b8b8b8
    color: #000
    font-size: 16px
  th
    padding: 5px
    font-size: 15px
    font-weight: bold
    background-color: rgba(0, 0, 0, 0.2)
  th:nth-of-type(1)
    width: 25%
    text-align: left
    vertical-align: middle
  th:nth-of-type(2)
    width: 50%
    text-align: left
    vertical-align: middle
  th:nth-of-type(3)
    width: 25%
    text-align: right
    vertical-align: middle
  .recordBox-toggle
    padding: 5px 0
    background-color: #fff
    &:hover
      background-color: #e5e5e5
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
    font-size: 16px
    padding: 0 10px
    border: 1px solid #000
    outline: none
    cursor: pointer
    @media screen and (max-width: 768px)
      font-size: 14px
</style>
