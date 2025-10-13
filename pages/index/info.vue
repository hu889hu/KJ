<script lang="ts" setup>
const playerStore = usePlayerStore()
const siteStore = useSiteStore()
const { t } = useI18n()
const walletName = (type) => {
  switch (type) {
    case 1:
      return siteStore.siteData.mainWalletType === type
        ? t('我的資產(電子錢包)')
        : t('美元資產(電子錢包)')
    case 2:
      return siteStore.siteData.mainWalletType === type
        ? t('我的資產(電子錢包)')
        : t('電力資產(電子錢包)')
    case 3:
      return siteStore.siteData.mainWalletType === type
        ? t('我的資產(電子錢包)')
        : t('商城資產(電子錢包)')
    case 4:
      return siteStore.siteData.mainWalletType === type
        ? t('我的資產(電子錢包)')
        : t('質押資產(電子錢包)')
    default:
      return t('其他資產')
  }
}
const { updatePassword, updateTrasactionPassword } = usePlayerStore()
const pwd = ref({
  oPwd: '',
  nPwd: '',
  nPwdConfirm: '',
  showoPwd: false,
  shownPwd: false,
  shownPwdConfirm: false
})
const transactionPwd = ref({
  oPwd: '',
  nPwd: '',
  nPwdConfirm: '',
  showoPwd: false,
  shownPwd: false,
  shownPwdConfirm: false
})
const changePwd = ref(false)
const changenTPwd = ref(false)
// updatePassword()  更新密碼
// updateTrasactionPassword()  更新交易密碼
watch(
  () => pwd.value.nPwdConfirm,
  (val) => {
    console.log(val, 'casas')

    if (val) {
      changePwd.value = true
    } else {
      changePwd.value = false
    }
  }
)
watch(
  () => transactionPwd.value.nPwdConfirm,
  (val) => {
    if (val) {
      changenTPwd.value = true
    } else {
      changenTPwd.value = false
    }
  }
)
const sendPasswordChange = async (type: number) => {
  console.log('changePwd.value', changePwd.value)
  console.log('changenTPwd.value', changenTPwd.value)
  if (changePwd.value && type == 1) {
    if (pwd.value.nPwd !== pwd.value.nPwdConfirm) {
      ElNotification({
        title: `${t('密碼不一致')}`,
        type: 'error',
        duration: 1000,
        showClose: false
      })
      return
    }
    const res = await updatePassword({
      password: pwd.value.oPwd,
      newPassword: pwd.value.nPwd
    })
    if (res.success) {
      pwd.value.oPwd = ''
      pwd.value.nPwd = ''
      pwd.value.nPwdConfirm = ''
    }
  }
  if (changenTPwd.value && type == 2) {
    if (transactionPwd.value.nPwd !== transactionPwd.value.nPwdConfirm) {
      ElNotification({
        title: `${t('交易密碼不一致')}`,
        type: 'error',
        duration: 1000,
        showClose: false
      })
      return
    }
    const res = await updateTrasactionPassword({
      password: transactionPwd.value.oPwd,
      newPassword: transactionPwd.value.nPwd
    })
    if (res.success) {
      transactionPwd.value.oPwd = ''
      transactionPwd.value.nPwd = ''
      transactionPwd.value.nPwdConfirm = ''
    }
  }
}
</script>
<template>
  <div class="page">
    <div class="sec-title">
      <div class="title">
        <h4>查閱資料與修改</h4>
        <h2>職員資訊</h2>
        <p>提供職員查看個人資訊與修改基本密碼、金鑰密碼。</p>
      </div>
      <div class="userif">
        <div class="user-title">
          <div class="icon">
            <img src="@/assets/images/info-icon1.svg" alt="">
          </div>
          <div>
            <span style="color: #7497b5;">{{ $lang('職員編號') }}</span>
            <span>{{ playerStore.playerInfo.account }}</span>
          </div>
        </div>
        <div class="user-title">
          <div class="icon">
            <img src="@/assets/images/info-icon2.svg" alt="">
          </div>
          <div>
            <span style="color: #7497b5;">{{ $lang('姓名') }}</span>
            <span>{{ playerStore.playerInfo.username }}</span>
          </div>
        </div>
        <div class="user-title">
          <div class="icon">
            <img src="@/assets/images/info-icon3.svg" alt="">
          </div>
          <div>
            <span style="color: #7497b5;">{{ $lang('手機') }}</span>
            <span>{{ playerStore.playerInfo.countryCode }}
              {{ playerStore.playerInfo.mobile | maskMobile }}</span>
          </div>
        </div>
        <div class="user-title">
          <div class="icon">
            <img src="@/assets/images/info-icon4.svg" alt="">
          </div>
          <div>
            <span style="color: #7497b5;">{{ $lang('聯絡方式') }}</span>
            <span>《{{ playerStore.playerInfo.social.platform }}》
              {{ playerStore.playerInfo.social.id }}</span>
          </div>
        </div>
        <div v-for="(item, index) in playerStore.playerInfo?.wallet" class="user-title" style="margin-top: 10px;">
          <span class="b-$lang">
            <b class="zh_TW">{{ walletName(item.type) }}</b>
          </span>
          <span class="get-wallet">
            $ {{ new Intl.NumberFormat('zh-tw').format(item.balance) }}
          </span>
        </div>
        <!-- <div class="user-title">
        <span class="b-$lang">
          <b class="zh_TW">{{ $lang('總資產') }}</b>
        </span>
        <span class="get-wallet">
          {{
            new Intl.NumberFormat('zh-TW').format(
              playerStore.playerInfo.balance
            )
          }}
        </span>
        </div> -->
      </div>
    </div>
    <div class="sec-form-block">
      <div class="sec-title">
        <div class="title">
          <h4>修改登入密碼</h4>
          <h2>修改相關資訊</h2>
        </div>
      </div>
      <div class="form-cont1">
        <div class="w-full">
          <div class="input-field">
            <div class="inp-icon">
              <img src="@/assets/images/button.svg" alt=""></img>
            </div>
            <input v-model="pwd.oPwd" v-trim-input class="box" placeholder="舊登入密碼"
              :type="pwd.showoPwd ? 'text' : 'password'" @copy.prevent @paste.prevent @contextmenu.prevent />
          </div>
          <div class="input-field">
            <div class="inp-icon">
              <img src="@/assets/images/button.svg" alt=""></img>
            </div>
            <input v-model="pwd.nPwd" v-trim-input class="box" placeholder="新登入密碼"
              :type="pwd.shownPwd ? 'text' : 'password'" @copy.prevent @paste.prevent @contextmenu.prevent />
          </div>
          <div class="input-field">
            <div class="inp-icon">
              <img src="@/assets/images/button.svg" alt=""></img>
            </div>
            <input v-model="pwd.nPwdConfirm" v-trim-input class="box" placeholder="確認新登入密碼"
              :type="pwd.shownPwdConfirm ? 'text' : 'password'" @copy.prevent @paste.prevent @contextmenu.prevent />
          </div>
          <br />
          <div class="btn" @click="sendPasswordChange(1)">確認修改登入密碼</div>
        </div>
        <div class="w-full">
          <div class="input-field">
            <div class="inp-icon">
              <img src="@/assets/images/inp-subject.svg" alt=""></img>
            </div>
            <input v-model="transactionPwd.oPwd" v-trim-input :type="transactionPwd.showoPwd ? 'text' : 'password'"
              class="box" placeholder="舊交易密碼" @copy.prevent @paste.prevent @contextmenu.prevent />
          </div>
          <div class="input-field">
            <div class="inp-icon">
              <img src="@/assets/images/inp-subject.svg" alt=""></img>
            </div>
            <input v-model="transactionPwd.nPwd" v-trim-input :type="transactionPwd.shownPwd ? 'text' : 'password'"
              class="box" placeholder="新交易密碼" @copy.prevent @paste.prevent @contextmenu.prevent />
          </div>
          <div class="input-field">
            <div class="inp-icon">
              <img src="@/assets/images/inp-subject.svg" alt=""></img>
            </div>
            <input v-model="transactionPwd.nPwdConfirm" v-trim-input
              :type="transactionPwd.shownPwdConfirm ? 'text' : 'password'" class="box" placeholder="確認新交易密碼"
              @copy.prevent @paste.prevent @contextmenu.prevent />
          </div>
          <br />
          <div class="btn" @click="sendPasswordChange(2)">確認修改交易密碼</div>
        </div>
      </div>
    </div>
    <instruction></instruction>
  </div>
</template>
<style scoped lang="sass">
.page
  overflow: hidden
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
    
  .sec-title
    max-width: 1200px
    margin: 80px auto
    padding: 0 20px
    display: flex
    flex-wrap: wrap
    justify-content: space-between
    @media (max-width: 992px)
      margin: 40px auto
    .title
      width: 460px
      h4
        font-size: 20px
        color: #7497B5
      h2
        color: #242222
        font-size: 42px
        margin-bottom: 16px
      p
        color: #656565
        font-size: 16px
    .userif
      display: flex
      flex-wrap: wrap
      .user-title
        width: 50%
        display: flex
        align-items: center
        gap: 10px
        span
          display: block
        .icon
          width: 38px
          height: 38px
          img
            width: 100%
            height: 100%
        .get-wallet
          font-weight: 600
          color: #7497b5
  .sec-form-block
    max-width: 1200px
    margin: 80px auto
    background-color: #2a4560
    padding: 60px 70px
    @media (max-width: 992px)
      padding: 30px 35px
      margin: 40px 20px
    .sec-title
      margin-block: 0
      .title
        margin-bottom: 0
      h4,h2
        color: #fff !important
    .w-full
      margin-top: 20px
    .form-cont1
      .btn
        font-weight: 600
        display: inline-block
        padding: 16px 35px
        font-size: 18px
        transition: background-color 0.5s ease
        background: #7497b5
        color: #fff
        &:hover
          background: #6685a1
      .input-field
        position: relative
        width: 100%
        margin-bottom: 20px
        .inp-icon
          position: absolute
          left: 0
          top: 50%
          transform: translateY(-50%)
          display: inline-block
          img
            width: 20px
            height: 20px
            object-fit: cover
        input
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
</style>
