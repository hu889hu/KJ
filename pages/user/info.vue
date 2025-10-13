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
      <span>{{ $lang('會員列表') }}</span>
      <i class="fas fa-user-circle"></i>
    </div>
    <div class="sec-form-block">
      <div class="user-title">
        <span>{{ $lang('姓名') }}</span>
        <span>{{ playerStore.playerInfo.username }}</span>
      </div>
      <div class="user-title">
        <span>{{ $lang('帳號') }}</span>
        <span>{{ playerStore.playerInfo.account }}</span>
      </div>
      <div class="user-title">
        <span>{{ $lang('手機') }}</span>
        <span
          >{{ playerStore.playerInfo.countryCode }}
          {{ playerStore.playerInfo.mobile | maskMobile }}</span
        >
      </div>
      <div class="user-title">
        <span>{{ $lang('聯絡方式') }}</span>
        <span
          >《{{ playerStore.playerInfo.social.platform }}》
          {{ playerStore.playerInfo.social.id }}</span
        >
      </div>
      <div
        v-for="(item, index) in playerStore.playerInfo?.wallet"
        class="user-title"
      >
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
      <div class="flex align-center justify-between mt-5 flex-wrap">
        <div class="w-full">
          <label style="font-size: 17px; color: #000; font-weight: bold"
            >更換密碼 ▼</label
          >
          <div class="input-box" style="padding-top: 10px">
            <div class="input-field">
              <input
                v-model="pwd.oPwd"
                v-trim-input
                class="box"
                placeholder="舊密碼"
                :type="pwd.showoPwd ? 'text' : 'password'"
                @copy.prevent
                @paste.prevent
                @contextmenu.prevent
              />
            </div>
          </div>
          <div class="input-box" style="padding-top: 10px">
            <div class="input-field">
              <input
                v-model="pwd.nPwd"
                v-trim-input
                class="box"
                placeholder="新密碼"
                :type="pwd.shownPwd ? 'text' : 'password'"
                @copy.prevent
                @paste.prevent
                @contextmenu.prevent
              />
            </div>
          </div>
          <div class="input-box" style="padding-top: 10px">
            <div class="input-field">
              <input
                v-model="pwd.nPwdConfirm"
                v-trim-input
                class="box"
                placeholder="確認新密碼"
                :type="pwd.shownPwdConfirm ? 'text' : 'password'"
                @copy.prevent
                @paste.prevent
                @contextmenu.prevent
              />
            </div>
          </div>
          <br />
          <div class="btn" @click="sendPasswordChange(1)">確認修改</div>
        </div>
        <div class="w-full mt-5">
          <label style="font-size: 17px; color: #000; font-weight: bold"
            >更換提款密碼 ▼</label
          >
          <div class="input-box" style="padding-top: 10px">
            <div class="input-field">
              <input
                v-model="transactionPwd.oPwd"
                v-trim-input
                :type="transactionPwd.showoPwd ? 'text' : 'password'"
                class="box"
                placeholder="舊交易密碼"
                @copy.prevent
                @paste.prevent
                @contextmenu.prevent
              />
            </div>
          </div>
          <div class="input-box" style="padding-top: 10px">
            <div class="input-field">
              <input
                v-model="transactionPwd.nPwd"
                v-trim-input
                :type="transactionPwd.shownPwd ? 'text' : 'password'"
                class="box"
                placeholder="新交易密碼"
                @copy.prevent
                @paste.prevent
                @contextmenu.prevent
              />
            </div>
          </div>
          <div class="input-box" style="padding-top: 10px">
            <div class="input-field">
              <input
                v-model="transactionPwd.nPwdConfirm"
                v-trim-input
                :type="transactionPwd.shownPwdConfirm ? 'text' : 'password'"
                class="box"
                placeholder="確認交易密碼"
                @copy.prevent
                @paste.prevent
                @contextmenu.prevent
              />
            </div>
          </div>
          <br />
          <div class="btn" @click="sendPasswordChange(2)">確認修改</div>
        </div>
      </div>
    </div>
    <instruction></instruction>
  </div>
</template>
<style scoped lang="sass">
@import '@/assets/sass/user/model2/coin2.scss'
</style>
<style scoped lang="sass">

.content
  -webkit-box-flex: 1
  -ms-flex: 1 1 45rem
  flex: 1 1 45rem
  border-top: 0.10px solid #1995ed


.input-box
  display: -webkit-box
  display: -ms-flexbox
  display: flex
  -webkit-box-pack: justify
  -ms-flex-pack: justify
  justify-content: space-between
  -webkit-box-align: center
  -ms-flex-align: center
  align-items: center
  gap: 10px
  margin-bottom: 10px

.input-field
  width: 100%
  border: 1px solid #bcbcbc
  padding: 10px
  border-radius: 0.5rem
  width: 100%
  display: -webkit-box
  display: -ms-flexbox
  display: flex
  -webkit-box-align: center
  -ms-flex-align: center
  align-items: center
  gap: 10px
  transition: all .3s
  &:hover
    border: 1px solid #0a57a2

.box
  width: 100%
  font-size: 16px
  color: #666
  background-color: transparent
  text-transform: none
.btn
  font-size: 16px
  padding: 15px 30px
  text-align: center
  text-transform: uppercase
  width: 124px
  margin:0 0 0 auto
  color: #fff
  background-image: -webkit-linear-gradient(306deg, #0a57a2, #1995ed, #0a57a2)
  background-image: linear-gradient(144deg, #0a57a2, #1995ed, #0a57a2)
  background-size: 300% 100%
  border-radius: 20px
  cursor: pointer
  transition: all 0.2s linear
  &:hover
    background-position: 100% 0px
// label
//   padding-left: 40px
</style>
