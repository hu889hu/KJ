<script lang="ts" setup>
const { t } = useI18n()
const router = useRouter()
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
const sendPasswordChange = async () => {
  console.log('changePwd.value', changePwd.value)
  console.log('changenTPwd.value', changenTPwd.value)
  if (changePwd.value) {
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
  if (changenTPwd.value) {
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
      <span>{{ $lang('帳戶設定') }}</span>
      <i class="fab fa-whmcs"></i>
    </div>
    <div class="formSection">
      <div class="formContent">
        <div class="title">
          {{ $lang('更改密碼') }}
        </div>
        <div class="form_input">
          <div class="inputTitle">
            {{ $lang('舊密碼') }}
          </div>
          <div class="inputIten padding_Right_more">
            <input
              v-trim-inputＦ
              v-model="pwd.oPwd"
              :type="pwd.showoPwd ? 'text' : 'password'"
              class="input_style"
              @copy.prevent
              @paste.prevent
              @contextmenu.prevent
            />
            <div v-if="!pwd.showoPwd" class="eyes" @click="pwd.showoPwd = true">
              <i class="fa-regular fa-eye-slash"></i>
            </div>
            <div v-else class="eyes" @click="pwd.showoPwd = false">
              <i class="fa-regular fa-eye"></i>
            </div>
          </div>
        </div>
        <div class="form_input">
          <div class="inputTitle">
            {{ $lang('新密碼') }}
          </div>
          <div class="inputIten padding_Right_more">
            <input
              v-trim-input
              v-model="pwd.nPwd"
              :type="pwd.shownPwd ? 'text' : 'password'"
              class="input_style"
              @copy.prevent
              @paste.prevent
              @contextmenu.prevent
            />
            <div v-if="!pwd.shownPwd" class="eyes" @click="pwd.shownPwd = true">
              <i class="fa-regular fa-eye-slash"></i>
            </div>
            <div v-else class="eyes" @click="pwd.shownPwd = false">
              <i class="fa-regular fa-eye"></i>
            </div>
          </div>
        </div>
        <div class="form_input">
          <div class="inputTitle">
            {{ $lang('確認密碼') }}
          </div>
          <div class="inputIten padding_Right_more">
            <input
              v-trim-input
              v-model="pwd.nPwdConfirm"
              :type="pwd.shownPwdConfirm ? 'text' : 'password'"
              class="input_style"
              @copy.prevent
              @paste.prevent
              @contextmenu.prevent
            />
            <div
              v-if="!pwd.shownPwdConfirm"
              class="eyes"
              @click="pwd.shownPwdConfirm = true"
            >
              <i class="fa-regular fa-eye-slash"></i>
            </div>
            <div v-else class="eyes" @click="pwd.shownPwdConfirm = false">
              <i class="fa-regular fa-eye"></i>
            </div>
          </div>
        </div>
        <div class="title">
          {{ $lang('更改交易密碼') }}
        </div>
        <div class="form_input">
          <div class="inputTitle">
            {{ $lang('舊交易密碼') }}
          </div>
          <div class="inputIten padding_Right_more">
            <input
              v-trim-input
              v-model="transactionPwd.oPwd"
              :type="transactionPwd.showoPwd ? 'text' : 'password'"
              class="input_style"
              @copy.prevent
              @paste.prevent
              @contextmenu.prevent
            />
            <div
              v-if="!transactionPwd.showoPwd"
              class="eyes"
              @click="transactionPwd.showoPwd = true"
            >
              <i class="fa-regular fa-eye-slash"></i>
            </div>
            <div v-else class="eyes" @click="transactionPwd.showoPwd = false">
              <i class="fa-regular fa-eye"></i>
            </div>
          </div>
        </div>
        <div class="form_input">
          <div class="inputTitle">
            {{ $lang('新交易密碼') }}
          </div>
          <div class="inputIten padding_Right_more">
            <input
              v-trim-input
              v-model="transactionPwd.nPwd"
              :type="transactionPwd.shownPwd ? 'text' : 'password'"
              class="input_style"
              @copy.prevent
              @paste.prevent
              @contextmenu.prevent
            />
            <div
              v-if="!transactionPwd.shownPwd"
              class="eyes"
              @click="transactionPwd.shownPwd = true"
            >
              <i class="fa-regular fa-eye-slash"></i>
            </div>
            <div v-else class="eyes" @click="transactionPwd.shownPwd = false">
              <i class="fa-regular fa-eye"></i>
            </div>
          </div>
        </div>
        <div class="form_input">
          <div class="inputTitle">
            {{ $lang('確認交易密碼') }}
          </div>
          <div class="inputIten padding_Right_more">
            <input
              v-trim-input
              v-model="transactionPwd.nPwdConfirm"
              :type="transactionPwd.shownPwdConfirm ? 'text' : 'password'"
              class="input_style"
              @copy.prevent
              @paste.prevent
              @contextmenu.prevent
            />
            <div
              v-if="!transactionPwd.shownPwdConfirm"
              class="eyes"
              @click="transactionPwd.shownPwdConfirm = true"
            >
              <i class="fa-regular fa-eye-slash"></i>
            </div>
            <div
              v-else
              class="eyes"
              @click="transactionPwd.shownPwdConfirm = false"
            >
              <i class="fa-regular fa-eye"></i>
            </div>
          </div>
        </div>
        <button type="button" class="buttonWhGreen" @click="sendPasswordChange">
          {{ $lang('送出變更') }}
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="sass">
@import '@/assets/sass/user/model2/coin2.scss'
</style>
<style scoped lang="sass">
.formSection
  margin: 20px 0 0 0
  width: 100%
  height: 65vh
  position: relative
  border-radius: 5px
  font-size: 16px
  // background-color: #afafaf
  border: 1px solid #fff
  overflow-y: auto
  @media screen and (max-width: 768px)
    height: 48vh
  .formContent
    width: 100%
    .title
      font-size: 16px
      margin: 20px auto
      padding: 0 30px
      color: black
</style>

<style scoped lang="sass">
.buttonWhGreen
  margin: 60px auto 60px auto
  width: 220px
  height: 40px
  background-color: #0baa54
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
    background-color: #3e82a9
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
  background-color: #fff
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
    border-radius: 5px
    width: 30%
    display: block
    text-align: center
    margin: 0 10px 0 0
    font-size: 16px
    padding: 5px 0
    background-color: #dedede
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
