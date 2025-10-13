<script lang="ts" setup>
const router = useRouter()
const siteStore = useSiteStore()
const { signout } = useAuthStore()
const { queryChatbox } = siteStore
const PlayerStore = usePlayerStore()
const ticketStore = useTicketStore()
const { queryTicket } = ticketStore
const intervalId = ref(null)
const checkPath = (link: string) => {
  if (
    router.currentRoute.value.fullPath.replace('/model2', '') ===
    `/user/${link}`
  ) {
    return 'active'
  } else {
    return ''
  }
}
const unreadMessage = () => {
  const list = []
  ticketStore.tickets.forEach((item: any) => {
    if (
      item.thread.find(
        (message: any) => message.role !== 0 && message.read === null
      )
    ) {
      list.push(item)
    }
  })
  return list.length
}
onMounted(async () => {
  if (siteStore.siteData?.smsVerify === 1) {
    if (!PlayerStore.playerInfo?.smsVerify) {
      return navigateTo('/user/smsVerify')
    }
  }

  const queryChatboxPromise = queryChatbox()
  queryChatboxPromise
    .then((queryChatboxRes) => {
      // 處理響應結果
      console.log('queryChatboxRes', queryChatboxRes.data)
    })
    .catch((error) => {
      console.error('Error loading queryChatboxRes data:', error)
    })

  console.log('setInterval queryTicket')
  const queryTicket_INTERVAL = 3 * 1000
  intervalId.value = setInterval(async () => {
    const queryTicketPromise = queryTicket()
    queryTicketPromise
      .then((queryTicketRes) => {
        // 處理響應結果
        if (!queryTicketRes) {
          clearInterval(intervalId.value)
          intervalId.value = null
        }
      })
      .catch((error) => {
        console.error('Error loading queryTicketRes data:', error)
      })
  }, queryTicket_INTERVAL)
})
onBeforeUnmount(() => {
  if (intervalId.value) {
    console.log('clearInterval queryTicket', intervalId.value)
    clearInterval(intervalId.value)
    intervalId.value = null
  }
})
const gameWindowOpen = () => {
  const { isLogin } = useAuthStore()
  if (isLogin()) {
    if (siteStore.siteData?.smsVerify === 1) {
      if (!PlayerStore.playerInfo?.smsVerify) {
        return navigateTo('/user/smsVerify')
      } else {
        window.open(`${window.location.origin}/game`, '_blank')
      }
    } else {
      window.open(`${window.location.origin}/game`, '_blank')
    }
  } else {
    navigateTo('/login')
  }
}
watch(
  () => router.currentRoute.value.name,
  () => {
    if (siteStore.siteData?.smsVerify === 1) {
      if (!PlayerStore.playerInfo?.smsVerify) {
        return router.push('/user/smsVerify')
      }
    }
    if (router.currentRoute.value.name === 'user') {
      return navigateTo('/user/info')
    }
    document.getElementById('form-control').checked = false
  }
)

const pledgeSocketStore = usePledgeSocketStore()

await onMounted(async () => {
  // 判斷gameType 是否有 5 pledge type
  if (siteStore.siteData?.gameType?.find((item: any) => item === 5)) {
    await pledgeSocketStore.startConnectWebSocket()
  }
})
onBeforeUnmount(() => {
  // 判斷gameType 是否有 5 pledge type
  if (siteStore.siteData?.gameType?.find((item: any) => item === 5)) {
    pledgeSocketStore.closeWebSocket()
  }
})
onMounted(() => {
  if (window) {
    console.log('window', window.innerWidth)
    window.addEventListener('scroll', handleScroll)
  }
})
const scrollTop = ref(0)
const handleScroll = () => {
  scrollTop.value = window.scrollY
}
onUnmounted(() => {
  if (window) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>
<template>
  <div class="page-cont">
    <client-only>
      <headerTop :opaque="scrollTop > 0"></headerTop>
      <div class="userpage">
        <div class="form-block">
          <div class="gw template">
            <div class="form-container big">
              <input id="form-control" type="checkbox" hidden />
              <div class="form-row">
                <div class="left-block">
                  <label for="form-control" class="form-close">
                    <i class="fas fa-long-arrow-alt-left"></i>
                  </label>
                  <a target="_blank" class="auth" @click="gameWindowOpen">
                    <i class="fas fa-chart-line"></i>
                    {{ $lang('互動平臺') }}
                  </a>
                  <!-- <a
                  v-if="
                    siteStore.siteData?.gameType?.find(
                      (item: any) => item === 5
                    )
                  "
                  :class="checkPath('pledge')"
                  @click="navigateTo(`/user/pledge`)"
                >
                  <i class="fas fa-coins"></i>
                  {{ $lang('質押') }}
                </a> -->
                  <a
                    :class="checkPath('info')"
                    @click="navigateTo(`/user/info`)"
                  >
                    <i class="fas fa-user-circle"></i>
                    {{ $lang('會員資料') }}
                  </a>
                  <a
                    :class="checkPath('activity')"
                    @click="navigateTo(`/user/activity`)"
                  >
                    <i class="fas fa-gift"></i>
                    {{ $lang('優惠活動') }}
                  </a>
                  <!-- <a
                  :class="checkPath('setting')"
                  @click="navigateTo(`/user/setting`)"
                >
                  <i class="fab fa-whmcs"></i>
                  {{ $lang('會員設定') }}
                </a> -->
                  <!-- <a
                    :class="checkPath('deposit')"
                    @click="navigateTo(`/user/deposit`)"
                  >
                    <i class="fas fa-wallet"></i>
                    {{ $lang('置入資產') }}
                  </a> -->
                  <a
                    :class="checkPath('withdraw') || checkPath('bank')"
                    @click="navigateTo(`/user/withdraw`)"
                  >
                    <i class="fas fa-wallet"></i>
                    {{ $lang('資產提款') }}
                  </a>
                  <!-- <a
                :class="checkPath('gamePage')"
                @click="navigateTo(`/user/gamePage`)"
              >
                <i class="fab fa-fantasy-flight-games"></i>
                {{ $lang("其他交易") }}
              </a> -->
                  <!-- <a :class="checkPath('news')" @click="navigateTo(`/user/news`)">
                  <i class="far fa-comment-alt"></i>
                  {{ $lang('網站公告') }}
                </a> -->
                  <a
                    :class="checkPath('record')"
                    @click="navigateTo(`/user/record`)"
                  >
                    <i class="fas fa-history"></i>
                    {{ $lang('交易紀錄') }}
                  </a>
                  <a
                    :class="checkPath('message')"
                    class="message"
                    @click="navigateTo(`/user/message`)"
                  >
                    <i class="far fa-comments"></i>
                    {{ $lang('站內訊息') }}
                    <span v-if="unreadMessage() > 0" class="badgeOpint"> </span>
                  </a>
                  <a :href="siteStore.chatbox" target="_blank">
                    <i class="fas fa-headset"></i>
                    {{ $lang('聯繫客服') }}
                  </a>
                </div>
                <div class="right-block">
                  <label for="form-control" class="form-btn">
                    <i class="fas fa-list"></i>
                  </label>
                  <router-view></router-view>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>
<style scoped lang="sass">
@import '@/assets/sass/user/model2/coin2.scss'
.page-cont
  width: 100%
  min-height: 100dvh
  // overflow-y: auto
  background: url('@/assets/images/about-hbg.jpg') no-repeat center center / cover
  padding-top: 76px
.form-block
  overflow-y: auto
  @media screen and (max-width: 768px)
    padding: 0 0 200px 0
input[type='checkbox']
  display: none
</style>

<style scoped lang="sass">
.left-block
  a
    svg
      margin-right: 10px
</style>

<style scoped>
.form-row {
  cursor: pointer;
}
.message {
  position: relative;
}
.badgeOpint {
  background-color: #ff0000;
  color: #fff;
  border-radius: 50%;
  /* position: absolute; */
  margin: 0 0 0 10px;
  width: 10px;
  height: 10px;
}
</style>

<style scoped lang="sass">
.navBar
  display: flex
  justify-content: space-between
  align-items: center
  padding: 25px 30px
  .left
    width: 50%
  .right
    width: 50%
    display: flex
    justify-content: flex-end
    align-items: center
</style>

<style scoped lang="sass">
a
  border-radius: 4px
  min-width: 100px
  padding: 5px 16px
  margin: .5em
  font-size: 14px
  letter-spacing: .15px
  white-space: normal
  transition: all .5s ease-in-out
  text-align: center
  font-weight: bold
  cursor: pointer
.btn-login
  max-width: 130px
  background-color: #262f37
  border: 1px solid #262f37
  color: #fff
  display: flex
  align-items: center
  justify-content: center
  flex-flow: row nowrap
  border-radius: 50px
  svg
    width: 22px
    display: inline-block
    margin-left: 10px
.btn-reg
  background-color: rgba(255, 255, 255, .8)
  backdrop-filter: blur(30px)
  border: 1px solid #ebedf0
  color: #0f1215
</style>

<style>
.input {
  min-height: 16px;
}
</style>
