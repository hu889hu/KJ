<script lang="ts" setup>
const { t } = useI18n()
const router = useRouter()
const playerStore = usePlayerStore()
const siteStore = useSiteStore()
const isButtonDisabled = ref(false)
const countdown = ref(30)
const smsCode = ref('')
const { send, verify } = useOtpStore()
await useAsyncData(async () => {
  if (playerStore.playerInfo.smsVerify) {
    navigateTo('/user/info')
  }
})
// methods
const getPhoneCode = async () => {
  const res = await send({
    mobile: playerStore.playerInfo.mobile,
    countryCode: playerStore.playerInfo.countryCode
  })
  if (res.success) {
    ElNotification({
      title: `${t('簡訊已發送')}`,
      type: 'success',
      duration: 1000,
      showClose: false
    })
    isButtonDisabled.value = true
    const interval = setInterval(() => {
      countdown.value--
      if (countdown.value === 0) {
        clearInterval(interval)
        isButtonDisabled.value = false
        countdown.value = 30
      }
    }, 1000)
  }
}
const verifySmsCode = async () => {
  const res = await verify({
    code: smsCode.value
  })
  if (res.success) {
    ElNotification({
      title: `${t('簡訊驗證成功')}`,
      type: 'success',
      duration: 1000,
      showClose: false
    })
    router.push('/user/info')
  }
}
</script>

<template>
  <div class="pages">
    <div class="sec-title">
      <span>{{ $lang('請驗證電話號碼') }}</span>
      <i class="fas fa-wallet"></i>
    </div>
    <div class="formSection">
      <div class="formContent">
        <button
          type="button"
          :class="
            isButtonDisabled ? 'buttonWhGreen btbDisabled' : 'buttonWhGreen'
          "
          :disabled="isButtonDisabled"
          @click="getPhoneCode"
        >
          <div v-if="!isButtonDisabled">
            <i class="fas fa-envelope"></i>
          </div>
          <div v-else>{{ countdown }}</div>
          <div>{{ $lang('發送驗證碼') }}</div>
        </button>
        <div class="verify_form">
          <div class="input-classic">
            <span class="input-title"> {{ $lang('手機號碼') }}</span>
            <div class="input-text">
              {{ playerStore.playerInfo.countryCode }}
              {{ playerStore.playerInfo.mobile }}
            </div>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $t('簡訊驗證碼') }}</span>
            <input v-trim-input v-model="smsCode" name="code" type="text" />
          </div>
          <div class="input-classic">
            <div class="info-text">
              <a :href="siteStore.chatbox" target="_blank"
                >{{ $t('收不到驗證碼') }}?</a
              >
            </div>
          </div>
        </div>
        <button type="button" class="buttonWhite" @click="verifySmsCode">
          {{ $lang('送出') }}
        </button>
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
  height: 50vh
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
  margin: 60px auto 60px auto
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
.btbDisabled
  background-color: #51765d
  color: #b9b9b9
  cursor: not-allowed
.buttonWhite
  margin: 60px auto 20px auto
  width: 100px
  height: 40px
  background-color: #c0c0c0
  border-radius: 5px
  text-align: center
  line-height: 40px
  cursor: pointer
  font-size: 16px
  color: #000
  display: flex
  justify-content: center
  align-items: center
  &:hover
    background-color: #f1f1f1
  @media screen and (max-width: 768px)
    width: 135px
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
