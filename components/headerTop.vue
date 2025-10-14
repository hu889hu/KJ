<script lang="ts" setup>
const router = useRouter()
const siteStore = useSiteStore()
const { isLogin, signout } = useAuthStore()
const PlayerStore = usePlayerStore()
const emit = defineEmits(['onPopupState'])
const props = defineProps({
  opaque: { type: Boolean, default: false },
  absolute: { type: Boolean, default: false },
  top: { type: Boolean, default: false },
  header: { type: Boolean, default: false }
  // menu: { type: Boolean, default: false }
})
const playerWalletBalance = computed(() => {
  if (!isLogin()) {
    return 0
  }
  console.log(PlayerStore.playerInfo, 'PlayerStore.playerInfo')

  const findWallet = PlayerStore.playerInfo?.wallet.find(
    (wallet: any) => wallet.type === 13
  )
  if (findWallet) {
    return Number(findWallet.balance)
  } else {
    return 0
  }
})
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

const isCont = ref(false)
const isShw = ref(false)

const onPopup = () => {
  isShw.value = !isShw.value
  setTimeout(() => {
    isCont.value = !isCont.value
  }, 100)
}
const onClose = () => {
  isCont.value = !isCont.value
  setTimeout(() => {
    isShw.value = !isShw.value
  }, 300)
}
watch(
  () => isCont.value,
  (newVal) => {
    console.log('isCont.value', newVal)
    emit('onPopupState', newVal)
  }
)
</script>
<template>
  <div>
    <header :class="{ opaque: props.opaque, absolute: absolute, top: top }">
      <div class="header" v-if="props.header" style="padding: 0;border-bottom: 0;">
        <div class="goback" @click="navigateTo('/')">
          返回職員首頁
        </div>
      </div>
      <div class="header" v-if="!header">
        <div class="header-cont">
          <div class="header-el-text">
            <div class="header-el-subtitle">
              Hello!&nbsp;
              <span style="color: rgb(255, 142, 36);">
                {{ PlayerStore?.playerInfo?.username }}
              </span>
            </div>
            <div class="header-el-subtitle">
              <span v-if="isLogin()">
                <i class="fa-solid fa-dollar-sign"></i>
                {{
                  new Intl.NumberFormat('zh-TW').format(playerWalletBalance)
                }}</span>
            </div>
          </div>
          <div class="menu-btn2  is-pc">
            <div class="header-el-item hover-target">
              <span class="header-el-image">
                <img src="@/assets/images/caret.svg" alt="Phone">
              </span>

              <div class="header-el-text" @click="navigateTo('/info')">
                <div class="header-el-title" style="color: rgb(223, 189, 79);">個人資訊</div>
                <div class="header-el-subtitle">查看與修改個人資料</div>
              </div>

            </div>
            <div class="header-el-item hover-target">
              <span class="header-el-image">
                <img src="@/assets/images/button.svg" alt="Phone">
              </span>
              <div class="header-el-text" @click="navigateTo('/withdraw')">
                <div class="header-el-title" style="color: rgb(223, 189, 79);">財務申請</div>
                <div class="header-el-subtitle">填寫更新帳號與申請分數</div>
              </div>
            </div>
            <div class="header-el-item hover-target">
              <span class="header-el-image">
                <img src="@/assets/images/envelope.svg" alt="Phone">
              </span>
              <div class="header-el-text" @click="navigateTo('/workrecord')">
                <div class="header-el-title" style="color: rgb(223, 189, 79);">工作紀錄</div>
                <div class="header-el-subtitle">提供查閱您的相關紀錄</div>
              </div>
            </div>
          </div>
          <img src="@/assets/images/elele.svg" alt="" class="is-mobile" @click="onPopup">
        </div>
      </div>
      <div class="header is-pc" v-if="!props.header">
        <div class="header-cont">
          <ul class="menu">
            <li class="hover-target">
              <a @click="navigateTo('/')" style="background-color: #7497B5">職員中心</a>
            </li>
            <li class="hover-target">
              <a @click="navigateTo('/info')"> 個人資訊 </a>
            </li>
            <li class="hover-target">
              <a @click="navigateTo('/withdraw')">財務申請</a>
            </li>
            <li class="hover-target">
              <a @click="navigateTo('/record')"> 財務記錄 </a>
            </li>
            <li class="hover-target">
              <a @click="navigateTo('/conversion')"> 外幣轉換區 </a>
            </li>
            <li class="hover-target">
              <a @click="navigateTo('/workrecord')"> 工作記錄 </a>
            </li>
            <!-- <li class="hover-target">
              <a @click="navigateTo('/game/warrants')"> 認股權證 </a>
            </li> -->
            <li>
              <a @click="signout()" style="color: #ffff00;"> 登出 </a>
            </li>
          </ul>
          <div class="menu-btn hover-target">
            <a style="padding-right: 0;" @click="navigateTo('/game/warrants')">系統</a>
          </div>
        </div>
      </div>
    </header>

    <!-- popup -->
    <div v-show="isShw" class="popup-wrapper" @click.self="onClose">
      <div class="popup-content" :class="{ 'cont-left': isCont }" @click.stop="">
        <div class="popup-title">
          <img
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjOEI5NUEwIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSI+PHBhdGggZD0iTTIuNSAxLjVsMTYuMjYzIDE2LjI2M00xOC41IDEuNUwyLjIzNyAxNy43NjMiLz48L2c+PC9zdmc+"
            alt="" @click="onClose" />
          <div class="header-el-text">
          </div>
        </div>
        <div class="popup-menus">
          <ul class="menus">
            <li class="has-dropdown active menu-thumb">
              <a @click="navigateTo('/'), onClose()">職員中心</a>
            </li>
            <li class="menu-btn" style="color: #eb932e;" @click="navigateTo('/game/warrants')">
              <a style="padding-right: 0;">系統</a>
            </li>
            <li class="has-dropdown active menu-thumb">
              <a @click="navigateTo('/info'), onClose()">個人資訊</a>
            </li>
            <li>
              <a @click="navigateTo('/withdraw'), onClose()">財務申請</a>
            </li>
            <li>
              <a @click="navigateTo('/record'), onClose()"> 財務記錄 </a>
            </li>
            <li>
              <a @click="navigateTo('/conversion'), onClose()"> 外幣轉換區 </a>
            </li>
            <li>
              <a @click="navigateTo('/workrecord'), onClose()"> 工作記錄 </a>
            </li>
            <!-- <li>
              <a @click="navigateTo('/game/warrants'), onClose()">認股權證 </a>
            </li> -->
            <li>
              <a @click="signout()" style="color: #ffff00;"> 登出 </a>
            </li>
          </ul>
        </div>
        <div class="popup-btn"></div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="sass">
header
  position: relative
  z-index: 66
  color: #fff
  background-color: #2a4560
  top: 0
  left: 0
  right: 0
  width: 100%
  font-size: .9rem
  transition: all 0.3s ease-in-out
  .header
    width: 100%
    border-bottom: 1px solid rgba(255, 255, 255, .4)
    &:nth-child(1)
      padding: 14px 0
    .goback
      width: 100%
      padding: 10px 0
      text-align: center
      background-color: #000000
      color: #ffffff
      &:hover
        background-color: #2f3245
    .header-cont
      max-width: 1200px
      margin: 0 auto
      padding: 0 20px
      display: flex
      align-items: center
      justify-content: space-between      
      @media (max-width: 1280px)
        width: 100%
        padding: 0 2rem
      .header-el-text
        font-size: 16px
        font-weight: 700
        padding: 0 17px
      ul.menu
        list-style: none
        padding: 0
        margin: 0
        display: flex
        &>li
          position: relative
          display: flex
          &>a
            line-height: 52px
            padding: 10px 17px
            transition: 0.5s ease
            font-size: 20px
            display: flex
            align-items: center
            height: 100%
            font-weight: bold
            transition: all 0.5s ease
            &:hover
              background: #6685a1
      .menu-btn
        display: block
        height: 100%
        background-color: #7497B5
        line-height: 52px
        padding: 10px 25px
        text-transform: uppercase
        font-size: 20px
        font-weight: 500
        transition: 0.5s ease
        font-weight: bold
        text-shadow: 2px 4px 3px rgba(0, 0, 0, 0.3)
        &:hover
          background-color: #6685a1
      .menu-btn2
        display: flex
        flex-wrap: wrap
        justify-content: left
        gap: 12px
        .header-el-item
          display: flex
          align-items: stretch
          align-items: center
          column-gap: 12px
          margin-right: 20px
          &:hover
            .header-el-image
              &::after
                transform: translateY(0%)
            
          .header-el-image
            border: 1px solid #fff
            padding: 10px
            display: flex
            justify-content: center
            align-items: center
            position: relative
            overflow: hidden
            z-index: 0
            height: 100%
            &::after
              content: ''
              position: absolute
              top: 0
              z-index: -1
              width: 100%
              height: 100%
              transform: translateY(-100%)
              background: #7497B5
              transition: all .3s ease-in-out
            img
              width: 18px
              min-width: 18px
              max-width: 18px
              height: 18px
        .header-el-text
          padding: 0
          .header-el-title
            font-size: 14px
          .header-el-subtitle
            font-size: 16px
            line-height: 30px
            font-weight: 700

.popup-wrapper
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, 0.2)
  z-index: 100
  display: flex
  justify-content: center
  align-items: center
  @media (min-width: 992px)
    display: none
  .popup-content
    overflow-y: scroll
    position: absolute
    right: 0
    background-color: #2a4560
    width: 100%
    height: 100dvh
    transform: translateX(100%)
    transition: all 0.3s ease-in-out
    padding: 20px
    .popup-title
      display: flex
      justify-content: space-between
      align-items: center
      padding-block-start: 1rem
      border-bottom: 1px solid rgba(255, 255, 255, .4)
      padding-bottom: 16px
      margin-bottom: 16px
       
      .header-el-text
        margin-left: 15px

      span
        font-size: 1rem
        font-weight: 700
        color: #fff
      img
        width: 28px
        height: 28px
        margin-inline: 1rem 0
        cursor: pointer
    .popup-menus
      .menus
        list-style: none
        padding: 0
        margin-block-end: 1.5625rem
        &>li
          margin-inline: 15px
          cursor: pointer
          color: #fff
          max-height: 70px
          overflow: hidden
          transition: all 0.5s ease-in-out
          font-size: 20px
          font-weight: 700
          &>a
            display: flex
            justify-content: space-between
            align-items: center
            text-decoration: none
            height: 60px
            .icon
              width: 1.5rem
              height: 1.5rem
              transition: all 0.2s ease-in-out
          .submenu
            &>li
              height: 46px
              line-height: 46px
              padding-inline: 15px
              &:hover
                color: #333333
        .logout
          width: 100%
          border: 1px solid #ccc
          height: 46px
          line-height: 46px
          border-radius: 2.5rem
          margin-block: .8rem
          color: #0267db99
          text-align: center
          justify-content: center
          font-size: 1.2rem
          transition: all 0.2s ease-in-out
          &:hover
            border: 1px solid #0267db99
            background: #0267db
            color: #fff
        .has-dropdown:hover
          max-height: 999px
          a .icon
            transform: rotate(180deg) !important
  .cont-left
    transform: translateX(0%)
.is-mobile
  display: none
@media (max-width: 992px)
  .is-pc
    display: none  !important
  .is-mobile
    display: block !important
</style>
