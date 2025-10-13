<script lang="ts" setup>
const siteStore = useSiteStore()
const { queryChatbox } = siteStore
const { signin } = useAuthStore()
const passwordEyes = ref(false)
const recaptchaCode = ref('')
const recaptchaCheckFunction = ref(null)
const { t } = useI18n()

const fetchSigninApi = ref({
  account: '',
  password: ''
})

const showPassword = (type: boolean) => {
  passwordEyes.value = type
}

const setLogin = async () => {
  if (!fetchSigninApi.value.account) {
    ElMessage({
      message: t('請輸入帳號'),
      type: 'error'
    })
    return
  }
  if (!fetchSigninApi.value.password) {
    ElMessage({
      message: t('請輸入密碼'),
      type: 'error'
    })
    return
  }
  const recaptchaCheck = await recaptchaCheckFunction.value?.validate(
    recaptchaCode.value
  )
  if (!recaptchaCheck) {
    ElMessage({
      message: t('驗證碼錯誤'),
      type: 'error'
    })
  } else {
    const res = await signin(fetchSigninApi.value)

    if (res.success) {
      navigateTo('/')
    }
  }
}
const checkHepler = async (data) => {
  recaptchaCheckFunction.value = data
}

await useAsyncData(async () => {
  if (!router.currentRoute.value.name.inCludes('model')) {
    if (isLogin()) {
      navigateTo('/')
    }
  }
})

onMounted(async () => {
  const queryChatboxPromise = queryChatbox()
  queryChatboxPromise
    .then((queryChatboxRes) => {
      // 處理響應結果
      console.log('queryChatboxRes', queryChatboxRes.data)
    })
    .catch((error) => {
      console.error('Error loading queryChatboxRes data:', error)
    })
})

definePageMeta({
  layout: 'auth'
})
const openChatBox = () => {
  window.open(siteStore.chatbox, '_blank')
}
</script>

<template>
  <div class="layouts-auth">
    <div class="layouts-auth__video">
      <video autoplay muted loop playsinline poster="@/assets/images/login1-frame.jpg">
        <source src="https://upload.comethike.com/uploads/1759488877215.mp4" type="video/mp4" />
      </video>
    </div>
    <div class="layouts-auth__view">
      <div class="bg-layer">
        <div class="header-main">
          <div class="main-icon">
            <h1>登入技術系統</h1>
          </div>
          <div class="header-left-bottom">
            <div class="icon1">
              <input v-model="fetchSigninApi.account" v-trim-input type="text" name="acc" :placeholder="t('請輸入職員帳號')"
                class="inputStyle" />
            </div>
            <div class="icon1">
              <input v-model="fetchSigninApi.password" v-trim-input type="password" name="pass"
                :placeholder="t('請輸入密碼')" class="inputStyle" />
            </div>

            <div class="icon1">
              <recaptcha @check-hepler="checkHepler"></recaptcha>
            </div>
            <div class="icon1">
              <input v-model="recaptchaCode" v-trim-input type="text" :placeholder="t('請輸入驗證碼')" class="inputStyle"
                @keyup.enter="setLogin" />
            </div>

            <div>
              <div class="btn" @click="setLogin">{{ $lang('登入') }}</div>
              <div class="btn btn-reg" @click="navigateTo('/register')">
                {{ $lang('申請註冊') }}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.layouts-auth
  position: relative
  width: 100%
  min-height: 100dvh
  &__video

    height: 100vh
    width: auto
    overflow: hidden
    //filter: grayscale(1)
    &>video
      width: 100%
      height: 100%
      object-fit: cover
      object-position: center
  &__view
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    overflow-x: hidden
    overflow-y: auto
    .bg-layer
      background: rgba(0, 0, 0, 50%)
      min-height: 100vh
      display: flex
      justify-content: center
      align-items: center
      .header-main
        background: rgba(255, 255, 255, 0.98)
        padding: 40px 30px
        border-radius: 14px
        max-width: 480px
        width: 100%
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1)
        @media (max-width: 768px)
          margin-inline: 20px
        .main-icon
          text-align: center
          margin: 0 auto 20px
          h1
            font-size: 2rem
            font-weight: bold
            color: #f36d4c
            margin-bottom: 8px
        img
          max-width: 100%

        .icon1
          margin: 0 0 1rem
          display: flex
          align-items: center
          justify-content: center

          input
            padding: .8rem 1rem
            background: rgba(255, 255, 255)
            border: 1px solid rgba(0, 0, 0, 0.3)
            color: black
            width: 100%
            border-radius: 8px
          span
            min-width: 64px !important
            // white-space: nowrap

        .bottom
          margin: 1em 0 0

        .header-left-bottom .btn
          text-align: center  
          width: 100%
          padding: 16px
          font-size: 22px
          margin-top: 10px
          border: none
          border-radius: 8px
          background: linear-gradient(90deg, #4590f1, #0999e0)
          color: white
          font-weight: bold
          cursor: pointer
          text-shadow: 0 2px 2px rgba(0, 0, 0, 0.4)
          transition: 0.3s ease
          &:hover
            background: linear-gradient(90deg, #3f8efc, #00e0ff)            
          &.btn-reg
            background: linear-gradient(90deg, #ff6a00, #f9b20e)
            &:hover
              background: linear-gradient(90deg, #f5a623, #d83e00)
              color: #feffca
        a
          color: #585858
          margin: 0em

        .header-left-bottom p
          font-size: 17px
          color: #000
          display: inline-block
          width: 50%
          margin: 20px 0 0
          letter-spacing: 1px
          float: left

          a
            font-size: 16px
            font-weight: bold
            color: #000000
            text-transform: uppercase
        .links
          height: 57px
          cursor: pointer
          .right
            text-align: right
</style>
