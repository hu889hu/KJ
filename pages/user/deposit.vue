<script lang="ts" setup>
const router = useRouter()
const playerStore = usePlayerStore()
const siteStore = useSiteStore()
await useAsyncData(() => {
  if (siteStore.siteData.smsVerify === 2) {
    if (!playerStore.playerInfo.smsVerify) {
      return navigateTo('/user/smsVerify')
    }
  }
  if (siteStore.siteData.bankVerify === 0) {
    if (!playerStore.playerInfo.bankInfo) {
      return navigateTo('/user/bank')
    }
  }
})
onMounted(async () => {
  const queryChatboxPromise = siteStore.queryChatbox()
  queryChatboxPromise
    .then((queryChatboxRes) => {
      // 處理響應結果
      console.log('queryChatboxRes', queryChatboxRes.data)
    })
    .catch((error) => {
      console.error('Error loading queryChatboxRes data:', error)
    })
})
// methods
const openChatBox = () => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  if (urlPattern.test(siteStore.chatbox)) {
    window.open(siteStore.chatbox, '_blank')
  }
}
</script>

<template>
  <div class="page">
    <div class="sec-title span-lang">
      <span class="zh_TW">{{ $lang('總資產') }}</span>
      <i class="fas fa-wallet"></i>
    </div>
    <div class="form-bg link-btn-row">
      <router-link to="/user/deposit" class="btn-form-link span-lang active">
        {{ $lang('儲值') }}
      </router-link>
      <router-link to="/user/withdraw" class="btn-form-link span-lang">
        {{ $lang('提領') }}
      </router-link>
    </div>
    <div class="sec-form-block">
      <div class="user-title">
        <span>{{ $lang('總資產') }}</span>
        <span>
          {{
            new Intl.NumberFormat('zh-TW').format(
              playerStore.playerInfo.balance
            )
          }}</span
        >
      </div>
      <div class="user-title">
        <span>{{ $lang('USDT錢包地址') }}</span>
        <span>{{ playerStore.playerInfo.additionalInfo['錢包地址'] }}</span>
      </div>
      <div class="user-title">
        <span>{{ $lang('USDT錢包總額') }}</span>
        <span>{{ playerStore.playerInfo.additionalInfo['錢包總額'] }}</span>
      </div>
    </div>
    <div class="deposit_form">
      <instruction></instruction>
      <a class="buttonWhGreen" @click="openChatBox">
        <i class="fas fa-comments"></i>
        {{ $lang('聯絡客服') }}
      </a>
    </div>
  </div>
</template>

<style scoped lang="sass">
@import '@/assets/sass/user/model2/coin2.scss'
.pages
  padding: 20px
  @media screen and (max-width: 768px)
    padding: 10px
.sec-form-block
  max-width: 480px
  margin: 0 auto
  @media screen and (max-width: 768px)
    padding: 0 10px
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
  height: 50vh
  position: relative
  border-radius: 5px
  font-size: 16px
  background-color: #afafaf
  border: 1px solid #fff
  overflow-y: auto
  @media screen and (max-width: 768px)
    height: 48vh
  .formContent
    width: 100%
</style>

<style scoped lang="sass">
.buttonWhGreen
  margin: 20px auto 60px auto
  width: 220px
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
  align-items: center
  &:hover
    background-color: #40b768
  @media screen and (max-width: 768px)
    width: 135px
  svg
    padding: 0 10px 0 0
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
  align-items: center
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
      width: 32%
      font-size: 14px
  .empty
    background-color: #fff0
  .inputIten
    border-radius: 5px
    position: relative
    width: 60%
    background-color: #e2efff
    padding: 5px 15px
    .input_text
      min-height: 24px
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
