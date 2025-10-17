<script lang="ts" setup>
// import
const { t } = useI18n()
const siteStore = useSiteStore()
const PlayerStore = usePlayerStore()
const orderStore = useOrderStore()
const { queryKlines, queryRounds } = useGameStore()
const { getListenkey } = PlayerStore
const router = useRouter()
const route = useRoute()
const timeoutId = ref(null)
const hourDegrees = ref(0)
const minuteDegrees = ref(0)
const secondDegrees = ref(0)
const { signout } = useAuthStore()
const systemSwitch = ref(false)
const selectedPower = ref('none')
const popupSwitch = ref(false)
const recordList = ref([])
const socket: any = ref(null)
const socketConnected = ref(false)
const isFirstGet = ref(false)
const playerWallet = computed(() => {
  if (PlayerStore.playerInfo.wallet) {
    const wallet = PlayerStore.playerInfo.wallet.find((item) => item.type === 2)
    return wallet ? wallet.balance : 0
  } else {
    return 0
  }
})
const productList = ref([])
const ordertList = ref([])
const serverTime = ref({})
const selectProduct = ref('')
const typeLis = ref([])
const typeitem = ref('')
const selectProductOrder = ref({
  playerId: '',
  productId: typeLis.value._id,
  type: '',
  piece: '',
  validation: ''
})
const clearBetData = () => {
  // ckItem.value = ''
  // selectProductOrder.value = {
  //   playerId: '',
  //   productId: '',
  //   type: typeitem.value,
  //   piece: 0,
  //   validation: ''
  // }
}
const explanationList = ref([
  { key: '氮化鎵（GaN）外延層', text: '作為高電子遷移率的主動層，能實現高功率輸出與高耐壓特性。' },
  { key: '鑽石基板（CVD Diamond Substrate）', text: '提供超高熱導率（~2000 W/m·K），大幅降低熱阻，維持晶片穩定。' },

  { key: '金屬電極（Ti、Pt、Au、AlCu）', text: '形成歐姆接觸與電極焊點，確保導電性與機械可靠度。' },

  { key: '鍵合材料（AuSn、Cu、奈米銀膠）', text: '用於晶片與基板封裝，兼顧高導熱性與高結構強度。' },


  { key: '高導熱基板（SiC、AlN、CVD 鑽石薄膜）', text: '提供高效散熱通道，降低功率模組的熱阻。' },

  { key: '封裝基板（AlN、Rogers PCB）', text: 'AlN 基板強化導熱；Rogers 高頻 PCB 提供低損耗訊號傳輸。' },

  { key: '熱介面材料（石墨烯塗層、PCM、高導熱凝膠）', text: '填補晶片與散熱器之間的縫隙，提升散熱效率。' },

  { key: '金屬散熱器（銅合金、鋁合金，含液冷/微通道冷板）', text: '主動或被動散熱元件，維持設備運行穩定。' },


  { key: '射頻同軸電纜與接頭（Ag 鍍銅/PTFE）', text: '低損耗傳輸射頻訊號，PTFE 絕緣確保高頻穩定。' },

  { key: '微波導波管/天線（不鏽鋼、鍍銀銅、陶瓷介質）', text: '負責微波能量的傳導與輻射。' },

  { key: '匹配網路材料（高頻電容、電感、功率電阻）', text: '調整阻抗，避免訊號反射與能量損耗。' },


  { key: '導管管身（Pebax、PTFE）', text: 'Pebax 提供柔韌性與回彈性；PTFE 減少摩擦，便於血管操作。' },

  { key: '電極頭端（PtIr、金鍍層、不鏽鋼）', text: 'PtIr 具耐腐蝕與導電性，確保能量輸出穩定。' },

  { key: '導絲與支撐（Nitinol、不鏽鋼絲）', text: 'Nitinol 具形狀記憶與彈性，適合血管與心律治療器材。' },

  { key: '絕緣層（PI、醫療級矽膠）', text: '隔絕不必要的能量傳導，集中治療區域。' },


  { key: '冷卻管路（PU、矽膠）', text: '耐高溫且具柔韌性，適合體內外冷卻循環。' },

  { key: '冷卻液（生理鹽水、滅菌水、液氮）', text: '協助導管與探頭散熱，維持安全操作溫度。' },

  { key: '感測材料（NiCr-NiAl 熱電偶、SiO₂ 光纖溫度感測器）', text: '提供即時溫度監控，避免過熱損傷。' },


  { key: '機殼材料（ABS、PC、鋁合金）', text: '具耐衝擊、耐腐蝕與醫療級安全認證。' },

  { key: '觸控面板（強化玻璃、ITO 薄膜）', text: '提供操作界面，兼具透明度與導電性。' },

  { key: '滅菌兼容塗層（PEEK、316L 不鏽鋼）', text: '能耐高溫滅菌，確保長期醫療使用的安全性。' },
])

const onType = (type: string) => {
  typeitem.value = type
  systemSwitch.value = false
  let list = toRaw(productList.value)
  typeLis.value = list.filter(item => item.validation[0] == typeitem.value)[0]
  console.log(typeLis.value, 'typeLis.value');

  selectProductOrder.value.productId = typeLis.value._id
}
const explanationbox = ref(false)
const explanationtext = ref('')
const ckItem = ref('')
const seItem = ref('')
const onItem = (item: string) => {
  explanationbox.value = true
  explanationtext.value = explanationList.value.find((etitle) => etitle.key === item).text
  seItem.value = item
}
const sureItem = () => {
  explanationbox.value = false
  ckItem.value = seItem.value
  selectProductOrder.value.type = ckItem.value
}
const disableBet = ref(false)
const betRoundNo = ref(1)
const checkBetData = (tpite: string) => {
  console.log('selectProductOrder', selectProductOrder.value)
  if (betRoundNo.value === serverTime.value.currentRoundId) {
    ElNotification({
      message: '請稍等，待前一筆程序輸送完成后再進行操作',
      type: 'error',
      showClose: false
    })
    return
  }
  selectProductOrder.value.validation = tpite
  if (!disableBet.value) {
    disableBet.value = true
    try {
      if (selectProductOrder.value.type === '') {
        ElNotification({
          message: `${t('請選擇材料')}`,
          type: 'error',
          showClose: false
        })
        return
      }
      if (selectProductOrder.value.piece <= 0) {
        ElNotification({
          message: `${t('請選擇數額')}`,
          type: 'error',
          showClose: false
        })
        return
      }
      if (selectProductOrder.value.validation === '') {
        ElNotification({
          message: `${t('請選擇驗證方式')}`,
          type: 'error',
          showClose: false
        })
        return
      }
      setTimeout(async () => {
        selectProductOrder.value.playerId = PlayerStore?.playerInfo?.id
        console.log('selectProductOrder', PlayerStore.playerInfo)
        console.log('selectProductOrder', selectProductOrder.value)
        selectProductOrder.value.piece =
          selectProductOrder.value.piece.toString()
        const response = await orderStore.bet(selectProductOrder.value)
        if (response.success) {
          betRoundNo.value = serverTime.value.currentRoundId
          // ElMessageBox.alert(
          //   `
          //      <p style="margin:0 0 8px 0"> ${t('期別')}: ${serverTime.value.currentRoundId} </p>
          //      <p style="margin:0 0 8px 0"> ${t('轉換技術')}: ${selectProduct.value.name} </p>
          //      <p style="margin:0 0 8px 0"> ${t('光伏(pv)組件')}: ${selectProductOrder.value.type} </p>
          //      <p style="margin:0 0 8px 0"> ${t('數額')}: ${selectProductOrder.value.piece} </p>
          //      <p style="margin:0 0 8px 0"> ${t('驗證方式')}: ${selectProductOrder.value.validation} </p>
          //    `,
          //   `${t('執行正確')}`,
          //   {
          //     confirmButtonText: `${t('確認')}`,
          //     center: true,
          //     dangerouslyUseHTMLString: true
          //   }
          // )
          selectProductOrder.value.piece = ''
          ElNotification({
            title: '執行正確',
            type: 'success',
            showClose: false
          })
        } else {
          // ElNotification({
          //   title: response.message,
          //   type: 'error',
          //   showClose: false
          // })
        }
        clearBetData()
        selectProduct.value = ''
        await PlayerStore.fetchInfo()
      }, 0)
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        disableBet.value = false
      }, 3000)
    }
  }
}
// game socket
const reconnected = ref(true)
const closeWebSocket = async () => {
  if (socket.value) {
    socket.value.close()
  }
}
const sendMessage = (msg: any) => {
  // send message to server
  socket.value.send(JSON.stringify(msg))
}

// 連接 socket
const startConnectWebSocket = async () => {
  const getListenkeyRes = await getListenkey()
  console.log('getListenkeyRes', getListenkeyRes)
  if (getListenkeyRes.success) {
    const runtimeConfig = useRuntimeConfig()
    const { POWERSOCKETURL } = runtimeConfig.public
    socket.value = new WebSocket(
      `${POWERSOCKETURL}/${getListenkeyRes.data.listenkey}`
    )
    socket.value.onopen = (event) => {
      console.log('Connected to socket', event)
      socketConnected.value = true
      sendMessage({
        op: 'subscribe',
        channel: ['product', 'order', 'round']
      })
    }
    socket.value.onmessage = async (e) => {
      const message = JSON.parse(e.data)
      // console.log('收到來自 socket 的訊息', message)
      const { event, data } = message
      switch (event) {
        case 'SERVER_TIME': {
          serverTime.value = data
          break
        }
        default:
          break
      }
      switch (event) {
        case 'PRODUCT_UPDATE': {
          productList.value = data.result
          const type2 = route.query.type;
          console.log(route.query.type, 'route.query.type');
          await onType(type2)
          load.value = false
          break
        }
        default:
          break
      }
      switch (event) {
        case 'ORDER_UPDATE': {
          ordertList.value = data.result.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          })
          PlayerStore.fetchInfo()
          break
        }
        default:
          break
      }
    }
    socket.value.onclose = async () => {
      console.log('Disconnected from socket')
      isFirstGet.value = true
      socketConnected.value = false
      load.value = false
      if (reconnected) {
        setTimeout(async () => {
          // await startConnectWebSocket()
          console.log('reconnected to socket')
        }, 3000)
      }
    }

    socket.value.onerror = (error) => {
      socketConnected.value = false
      console.error('WebSocket error:', error)
    }
  }
}

const load = ref(false)
onMounted(async () => {
  load.value = true
  await startConnectWebSocket()
})

onBeforeUnmount(() => {
  reconnected.value = false
  closeWebSocket()
})

const betFormatNumber = (num) => {
  if (Number(num) >= 1000000) {
    return (Number(num) / 1000000).toFixed(0) + 'M'
  } else if (Number(num) >= 1000) {
    return (Number(num) / 1000).toFixed(0) + 'k'
  } else {
    return Number(num).toString()
  }
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

const activitiesPerPage = ref(5)
const currentPage = ref(1)
const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const totalPages = computed(() => {
  return Math.ceil(ordertList.value.length / activitiesPerPage.value)
})
const displayedActivities = computed(() => {
  const start = (currentPage.value - 1) * activitiesPerPage.value
  return ordertList.value.slice(start, start + activitiesPerPage.value)
})





</script>

<template>
  <div>
    <div class="page-container">
      <video autoplay muted loop playsinline poster="@/assets/images/01-frame.jpg" v-if="typeitem == 'god'">
        <source src="https://upload.comethike.com/uploads/1759847122782.mp4" type="video/mp4">
        </source>
      </video>
      <video autoplay muted loop playsinline poster="@/assets/images/02-frame.jpg" v-if="typeitem == 'powermodule'">
        <source src="https://upload.comethike.com/uploads/1759847144519.mp4" type="video/mp4">
        </source>
      </video>
      <video autoplay muted loop playsinline poster="@/assets/images/03-frame.jpg" v-if="typeitem == 'microwave'">
        <source src="https://upload.comethike.com/uploads/1759847186077.mp4" type="video/mp4">
        </source>
      </video>
      <video autoplay muted loop playsinline poster="@/assets/images/04-frame.jpg" v-if="typeitem == 'medical'">
        <source src="https://upload.comethike.com/uploads/1759847208627.mp4" type="video/mp4">
        </source>
      </video>
      <video autoplay muted loop playsinline poster="@/assets/images/05-frame.jpg" v-if="typeitem == 'cooling'">
        <source src="https://upload.comethike.com/uploads/1759847223095.mp4" type="video/mp4">
        </source>
      </video>
      <video autoplay muted loop playsinline poster="@/assets/images/01-frame.jpg" v-if="typeitem == 'shell'">
        <source src="https://upload.comethike.com/uploads/1759847122782.mp4" type="video/mp4">
        </source>
      </video>
      <div class="content">
        <div class="nav-container">
          <div class="login-container">
            <div class="left-box">
              <div class="top-title">
                <span class="info-on">{{ $lang('Hello!') }} </span>
                <span style="color: rgb(255, 154, 87);font-weight: 700;"> {{ PlayerStore.playerInfo.account }}</span>
              </div>
              <div class="bottom-number">
                <span class="info-on">{{ $lang('USDT') }}: </span>
                <span style="color: rgb(255, 154, 87);font-weight: 700;">
                  {{ new Intl.NumberFormat('zh-TW').format(playerWallet) }}</span>
              </div>
            </div>
            <div class="right-box">
              <!-- <div class="record-switch" @click="popupSwitch = !popupSwitch">
                <div class="icon">
                  <i class="fa-regular fa-address-book"></i>
                </div>
                <div class="font-title">
                  {{ $lang('檢驗紀錄') }}
                </div>
              </div> -->
              <div class="menu" @click="systemSwitch = !systemSwitch">
                <span><i class="fa-solid fa-bars"></i></span>
              </div>
            </div>
          </div>
        </div>
        <div class="game-container">
          <div class="game-items">
            <div class="game-item-title">
              <small>{{ typeLis.name }}
                <!-- <a>Semiconductor</a> -->
              </small>
              <h1 class="title-text" style="text-shadow: rgb(97, 157, 212) 0.1em 0.1em 0.2em" v-if="typeLis.name">
                {{ $lang(`${typeLis.name}`) }}
              </h1>
              <div class="title-quantity">
                <div class="quantity-text">
                  {{ $lang('剩餘時間') }}:{{ serverTime?.currentRoundCountdown || '0' }}s
                  <!-- {{ new Intl.NumberFormat('zh-TW').format(playerWallet) }} -->
                </div>
              </div>
              <!-- <div class="title-number">
                <div class="number-text">
                  {{ $lang('編號') }} {{ serverTime?.currentRoundId }}
                  <br />
                  {{ serverTime?.currentRoundCountdown || '0' }}s
                </div>
              </div> -->
            </div>
            <div class="game-inp">
              <input v-model="selectProductOrder.piece" placeholder="請設置量額" />
            </div>
            <div class="game-item-content">
              <div class="game-item" :class="ckItem === ite ? 'active' : ''" @click="onItem(ite)"
                v-for="(ite, index) in typeLis.type" :key="index" v-if="productList.length > 0">
                <h1>{{ ite }}</h1>
              </div>
            </div>

            <div class="game-submit" @click="checkBetData(typeitem)">
              <span>{{ $lang('確認送出') }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="explanationbox" v-if="explanationbox">
      <h1>用途:{{ explanationtext }}</h1>
      <div class="btnbox">
        <div class="right" @click="explanationbox = false">取消</div>
        <div class="left" @click="sureItem">確定</div>
      </div>
    </div>
    <!-- <div v-if="popupSwitch" class="popup" @click.self="popupSwitch = !popupSwitch">
      <div class="card">
        <div class="title">{{ $lang('檢驗紀錄') }}</div>
        <div class="dataBox">
          <div class="col">
            <div v-for="(item, index) in displayedActivities" class="item">
              <div class="date">
                <div class="time">
                  {{ formatDate(item.createdAt) }}
                </div>
                <div v-if="item.status === 0" class="state false">
                  {{ $lang('等待驗證') }}
                </div>
                <div v-else>
                  <div v-if="item.profit > 0" class="state true">
                    {{ $lang('正確') }}
                  </div>
                  <div v-else class="state false">{{ $lang('錯誤') }}</div>
                </div>
              </div>
              <div class="leftBox">
                <div class="name">
                  【{{ $lang('期號') }}】{{ item.roundNo }}
                </div>
                <div class="type">
                  【{{ $lang('轉換技術') }}】{{ item.productName }}
                </div>
                <div class="type">
                  【{{ $lang('確認按鈕') }}】{{ item.option.validation }}
                </div>
              </div>
              <div class="rightBox">
                <div class="inValue">
                  【{{ $lang('光伏(pv)組件') }}】<span>{{
                    item.option.type
                  }}</span>
                </div>
                <div class="amount">
                  【{{ $lang('單位數值') }}】{{ item.amount }}
                </div>
              </div>
            </div>
          </div>
          <ul class="pagination">
            <li :class="currentPage === 1 ? 'disabled' : ''">
              <button type="button" class="btn btn-gold" @click="previousPage">
                « {{ $lang('上一頁') }}
              </button>
            </li>
            <li class="">
              <button type="button" class="btn btn-gold" @click="nextPage">
                {{ $lang('下一頁') }} »
              </button>
            </li>
          </ul>
        </div>
        <div class="closeBtn">
          <button type="button" @click="popupSwitch = !popupSwitch">
            {{ $lang('關閉') }}
          </button>
        </div>
      </div>
    </div> -->
    <div class="dropdown-menu" @click.self="systemSwitch = !systemSwitch" :class="systemSwitch ? 'active' : ''">
      <span @click="systemSwitch = !systemSwitch"><i class="fa-solid fa-xmark"></i></span>
      <div class="dropdown-content" :class="systemSwitch ? 'active' : ''">
        <div class="dropdown-item" @click="navigateTo('/game/warrants')">
          返回首頁
        </div>
        <div class="dropdown-item" :class="item.name" v-for="(item, index) in productList" :key="item"
          v-if="productList.length > 0" @click.stop="onType(item.validation[0])">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="loading-view" v-if="load">
      數據載入中
    </div>
  </div>
</template>

<style scoped lang="sass">
$border: 2px solid #354866
$round-14: 14px
$background: rgba(0, 0, 0, 0.6)
.bottom-number
  word-wrap: break-word
  line-height: 24px
  margin-left: 15px
.right-info
  text-align: end
  .info-on
    display: none
.page-container
  position: relative
  background-size: cover
  min-height: 100vh
  background-color: #111
  overflow: hidden
  video
    position: fixed
    top:0
    left: 0
    width: 100%
    height: 100%
    object-fit: cover
  // padding: 12px
.content
  height: 100vh
  overflow-y: auto
.nav-container
  position: sticky
  top: 0
  z-index: 15
.login-container
  margin: 0 auto
  display: flex
  align-items: center
  justify-content: space-between
  max-width: 1320px
  background-color: rgb(0 165 211 / 65%)
  padding: 15px 15px
  max-height: 70px
  color: #fff
  .left-box
    display: flex
    align-items: center
    font-size: 18px
    .logo
      // width: 35px
      height: 35px
      vertical-align: middle
      margin-right: 8px
  .right-box
    display: flex
    max-width: 40%
    .menu
      position: relative
      cursor: pointer
      // background-color: #007bff
      color: white
      // width: 120px
      padding: 10px 12px
      border-radius: 4px
      user-select: none
      text-align: center
      span
        width: 30px
        height: 30px
        font-size: 28px
.dropdown-menu
  position: fixed
  top: 0
  right: 0
  width: 100dvw
  height: 100dvh
  opacity: 0
  z-index: -1
  pointer-events: none
  transition: all .5s ease-in-out
  background-color: rgba(0, 0, 0, 0.5)
  &>span
    position: absolute
    z-index: 20
    top: 15px
    right: 30px
    cursor: pointer
    color: white
    font-size: 24px
    transition: all .2s ease
    &:hover
      transform: rotate(180deg)
      
  &.active
    z-index: 19
    opacity: 1
    pointer-events: auto
  .dropdown-content
    position: absolute
    right: 0
    top: 0
    height: 100%
    width: 330px
    background-color: rgba(0, 0, 0, 0.85)
    padding: 30px
    max-width: 100%
    font-size: 1rem
    text-align: left
    display: flex
    flex-direction: column
    justify-content: center
    z-index: 10
    transition: all .5s ease-in-out
    transform: translateX(100%)
    &.active
      transform: translateX(0)
    .dropdown-item
      display: block
      padding: 0.5rem 10px
      border-top: 1px solid rgba(0, 0, 0, 0.15)
      color: #ffffff
      &:hover
        color: #16181b
        background-color: #f8f9fa

.loading-view
  position: fixed
  top: 50%
  left: 50%
  padding: 40px 60px
  color: #fff
  background-color: #ffffff9a
  border-radius: 10px
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.562)
  transform: translate(-50%,-50%)
  animation: fadeLoad 1.5s ease-in-out infinite

@keyframes fadeLoad
  0% 
    transform: translate(-50%,20px)
  50%
    transform: translate(-50%,-20px)
  100%
    transform: translate(-50%,20px)
   
@keyframes fadeIn
  from 
    opacity: 0
    transform: translateY(20px)
  to 
    opacity: 1
    transform: translateY(0)
.game-container
  // height: 100vh
  overflow-y: auto

  .game-items
    margin: 80px auto
    max-width: 620px
    animation: fadeIn 1.5s ease-in-out
    display: flex
    flex-direction: column
    align-items: center
    padding: 15px
  .game-item-title
    width: 100%
    small
      color: #E07A5F
      display: block
      font-size: 20px
      font-weight: bold
      font-style: italic
      position: relative
      padding-left: 75px
      a
        color: #F2CC8F
      &::before
        content: ""
        background-color: #ffffff
        width: 50px
        height: 2px
        position: absolute
        top: 50%
        left: 35px
        transform: translate(-50%, 0)
        
    .title-text
      color: #ffffff
      padding: 10px 15px
      border-radius: 8px
      font-weight: bold
      letter-spacing: 2px
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.562)
      font-size: 3em
      margin: 15px 0 0
    .title-quantity
      padding-left: 50px
      .quantity-text
        font-size: 1rem
        margin: 10px 0
        color: #fff
    .title-number
      .number-text
        font-size: 1rem
        color: #fff
  .game-item-content
    margin-top: 10px
    padding: 0 20px
    width: 100%
    .game-item
      display: inline-block
      margin: 0 5px 10px 0
      padding: 10px 35px
      background: #feffcace
      color: #333
      cursor: pointer
      font-size: 22px
      font-weight: bold
      border-radius: 8px
      transition: background 0.3s ease
      &.active
        background: #00a308
        color: #fff
        cursor: default
        text-shadow: black 0.1em 0.1em 0.2em
        &:hover
          background: #00a308
          color: #fff
          cursor: default
          text-shadow: black 0.1em 0.1em 0.2em
      &:hover
        background: #00a8be
        color: #fff
      h1
        font-size: 22px
  .game-inp
    // margin-top: 40px
    width: 100%
    input
      width: 100%
      padding: 15px 20px
      font-size: 18px
      margin: 20px 0
      border-radius: 8px
      border: none
      outline: none
      background: rgba(255, 255, 255, 0.9)
      color: #000
      font-weight: 400
  .game-submit
    margin-top: 20px
    margin-bottom: 50px
    position: relative
    min-width: 100%
    background: #e76107
    border: 2px solid #fff8bc
    color: #FFFFFF
    font-size: 1.4rem
    font-weight: bold
    text-align: center
    text-decoration: none
    text-transform: uppercase
    overflow: hidden
    cursor: pointer
    padding: 10px 20px
    text-shadow: black 0.1em 0.1em 0.2em
    span
      z-index: 2
    &:hover
      &::before,&::after
        transform: translate3d(0, 0, 0)
    &::before
      content: ''
      position: absolute
      height: 100%
      width: 100%
      top: 0
      left: 0
      transform: translate3d(-100%, 0, 0)
      background-color: #ffc48d
      transition: transform 300ms cubic-bezier(0.55, 0.055, 0.675, 0.19)
    &::after
      content: ''
      position: absolute
      height: 100%
      width: 100%
      top: 0
      left: 0
      background-color: #0d01b6
      transform: translate3d(100%, 0, 0)
      transition: transform 300ms 300ms cubic-bezier(0.16, 0.73, 0.58, 0.62)
.explanationbox
  position: fixed
  z-index: 999
  top: 50%
  left: 50%
  transform: translate(-50%,-50%)
  width: 400px
  background-color: #000d15cc
  border: 2px solid rgba(0, 165, 211, 0.65)
  border-radius: 10px
  color: #fff
  padding: 40px 20px 20px
  h1
    font-size: 18px
  .btnbox
    display: flex
    margin-top: 30px
    justify-content: flex-end
    gap: 10px
    div
      padding: 3px 15px
      border-radius: 5px
      cursor: pointer
    .left
      background-color: #fff
      color: #111
      
</style>
