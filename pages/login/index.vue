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
            <img src="@/assets/images/logo-login.jpg" alt="">
            <!-- <h1>AKASH SYSTEMS</h1> -->
          </div>
          <div class="header-left-bottom">
            <div class="icon1">
              <label for="">SIGN IN WITH ACCOUNT NAME</label>
              <input v-model="fetchSigninApi.account" v-trim-input type="text" name="acc" :placeholder="t('')"
                class="inputStyle" />
            </div>
            <div class="icon1">
              <label for="">PASSWORD</label>
              <input v-model="fetchSigninApi.password" v-trim-input type="password" name="pass" :placeholder="t('')"
                class="inputStyle" />
            </div>
            <div class="icon1 icon-flex">
              <label for="">CAPTCHA</label>
              <div class="captcha">
                <input v-model="recaptchaCode" v-trim-input type="text" :placeholder="t('')" class="inputStyle"
                  @keyup.enter="setLogin" />
                <span>
                  <recaptcha @check-hepler="checkHepler"></recaptcha>
                </span>
              </div>
            </div>

            <div>
              <div class="btn" @click="setLogin">{{ $lang('Sign in') }}</div>
              <div class="btn-reg">
                Don't have an account yet?<span @click="navigateTo('/register')"> {{ $lang('Register now for free')
                }}</span>
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
        background: #232323
        padding: 40px 0
        border-radius: 4px
        max-width: 600px
        width: 100%
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1)
        @media (max-width: 768px)
          margin-inline: 20px
        .main-icon
          text-align: left
          margin: 0 auto 20px
          padding: 0 10px
          h1
            font-size: 1.5rem
            font-weight: 500
            color: #fff
            margin-bottom: 8px
          img
            height: 62px
            max-width: 100%
        .icon-flex
          .captcha
            position: relative
            padding-inline-end: 120px
            span
              position: absolute
              top: 2px
              bottom: 2px
              right: 2px
        .icon1
          margin: 0 0 1rem
          label
            font-size: 14px
          &:focus 
            label
              color: #3c7db7
          input
            padding: .5rem 1rem
            background: rgba(49, 52, 61)
            border: 1px solid rgba(0, 0, 0, 0.3)
            color: #fff
            width: 100%
            border-radius: 2px
            
          span
            min-width: 64px !important
            // white-space: nowrap

        .bottom
          margin: 1em 0 0

        .header-left-bottom
          padding: 0 30px
          .btn
            text-align: center  
            width: 300px
            margin: 0 auto
            max-width: 100%
            padding: 10px 16px
            font-size: 22px
            margin-top: 20px
            border: none
            border-radius: 2px
            background: linear-gradient(90deg, #4590f1, #0999e0)
            color: white
            font-weight: bold
            cursor: pointer
            text-shadow: 0 2px 2px rgba(0, 0, 0, 0.4)
            transition: 0.3s ease
            &:hover
              background: linear-gradient(90deg, #3f8efc, #00e0ff)            
        .btn-reg
          margin-top: 40px
          text-align: right
          font-size: 14px
          span
            margin-left: 10px
            color: #8a8a8a
            transition: all .2s
            &:hover
              color: #ffffff
          
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
