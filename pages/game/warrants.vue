<script lang="ts" setup>
const router = useRouter()
const siteStore = useSiteStore()
const PlayerStore = usePlayerStore()
const { isLogin } = useAuthStore()
const { t } = useI18n()
const { getListenkey } = PlayerStore
const socket: any = ref(null)
const socketConnected = ref(false)
const serverTime = ref({})
const productList = ref([])
const isFirstGet = ref(false)


const productUpdate = [
  {
    "_id": "68e225128334115195b7a87a",
    "siteId": "68dfa562e4e29afcdccca817",
    "name": "GaN-on-Diamond 功率晶片核心材料",
    "type": [
      "氮化鎵（GaN）外延層",
      "鑽石基板（CVD Diamond Substrate）",
      "金屬電極（Ti、Pt、Au、AlCu）",
      "鍵合材料（AuSn、Cu、奈米銀膠）"
    ],
    "validation": [
      "god"
    ]

  },
  {
    "_id": "68e225a023825dd0dda6e8bf",
    "siteId": "68dfa562e4e29afcdccca817",
    "name": "功率模組與散熱封裝材料",
    "type": [
      "高導熱基板（SiC、AlN、CVD 鑽石薄膜）",
      "封裝基板（AlN、Rogers PCB）",
      "熱介面材料（石墨烯塗層、PCM、高導熱凝膠）",
      "金屬散熱器（銅合金、鋁合金，含液冷/微通道冷板）"
    ],
    "validation": [
      "powermodule"
    ]

  },
  {
    "_id": "68e2274223825dd0dda6e8eb",
    "siteId": "68dfa562e4e29afcdccca817",
    "name": "微波/射頻系統材料",
    "type": [
      "射頻同軸電纜與接頭（Ag 鍍銅/PTFE）",
      "微波導波管/天線（不鏽鋼、鍍銀銅、陶瓷介質）",
      "匹配網路材料（高頻電容、電感、功率電阻）"
    ],
    "validation": [
      "microwave"
    ]

  },
  {
    "_id": "68e2277f23825dd0dda6e8f0",
    "siteId": "68dfa562e4e29afcdccca817",
    "name": "醫療導管與探頭材料（RFA & 心律不整）",
    "type": [
      "導管管身（Pebax、PTFE）",
      "電極頭端（PtIr、金鍍層、不鏽鋼）",
      "導絲與支撐（Nitinol、不鏽鋼絲）",
      "絕緣層（PI、醫療級矽膠）"
    ],
    "validation": [
      "medical"
    ]

  },
  {
    "_id": "68e227e78334115195b7a922",
    "siteId": "68dfa562e4e29afcdccca817",
    "name": "冷卻與安全控制材料",
    "type": [
      "冷卻管路（PU、矽膠）",
      "冷卻液（生理鹽水、滅菌水、液氮）",
      "感測材料（NiCr-NiAl 熱電偶、SiO₂ 光纖溫度感測器）"
    ],
    "validation": [
      "cooling"
    ]

  },
  {
    "_id": "68e2285d572c441d4e029611",
    "siteId": "68dfa562e4e29afcdccca817",
    "name": "醫療級外殼與界面材料",
    "type": [
      "機殼材料（ABS、PC、鋁合金）",
      "觸控面板（強化玻璃、ITO 薄膜）",
      "滅菌兼容塗層（PEEK、316L 不鏽鋼）"
    ],
    "validation": [
      "shell"
    ]

  }
]


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

    // 检查 POWERSOCKETURL 是否存在
    if (!POWERSOCKETURL) {
      console.error('POWERSOCKETURL is undefined or null')
      return
    }

    // 检查 listenkey 是否存在
    const listenkey = getListenkeyRes.data?.listenkey || getListenkeyRes?.listenkey
    if (!listenkey) {
      console.error('listenkey is undefined or null')
      return
    }

    // 添加重试机制
    const connectWithRetry = (url: string, retries: number = 3) => {
      const ws = new WebSocket(url)
      ws.onopen = (event) => {
        console.log('Connected to socket', event)
        socket.value = ws
        socketConnected.value = true
        sendMessage({
          op: 'subscribe',
          channel: ['product', 'order', 'round']
        })
      }
      ws.onmessage = async (e) => {
        const message = JSON.parse(e.data)
        // console.log('收到來自 socket 的訊息', message)
        const { event, data } = message

        switch (event) {
          case 'PRODUCT_UPDATE': {
            productList.value = data.result
            break
          }
          default:
            break
        }
      }
      ws.onclose = async () => {
        console.log('Disconnected from socket')
        isFirstGet.value = true
        socketConnected.value = false
        if (reconnected.value && retries > 0) {
          setTimeout(async () => {
            console.log(`Retrying connection... ${retries} attempts left`)
            connectWithRetry(url, retries - 1)
          }, 3000)
        }
      }
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        ws.close()
      }
    }

    connectWithRetry(`${POWERSOCKETURL}/${listenkey}`)
  } else {
    console.error('Failed to get listenkey', getListenkeyRes)
  }
}


const onPush = (path: string) => {
  if (path === '/') return navigateTo(path)
  let pathStr = '/game?type=' + path
  navigateTo(pathStr)
}

const time1 = ref()
const server1 = ref(0)
onMounted(async () => {
  time1.value = setInterval(() => {
    if (server1.value >= productList.value.length) {
      server1.value = 0
    } else {
      server1.value++
    }
  }, 2000)
  // await startConnectWebSocket()
  startAllRandomNumbers()

})
onBeforeUnmount(() => {
  clearInterval(time1.value)
  reconnected.value = false
  console.log('closeWebSocket', reconnected.value)
  closeWebSocket()
})

// 創建獨立的隨機數生成器
const createRandomGenerator = () => {
  const isRunning = ref(false)
  const currentNumber = ref(0)
  let timer: NodeJS.Timeout | null = null

  const start = (min: number, max: number, interval: number = 1000) => {
    stop() // 先停止之前的計時器

    isRunning.value = true
    currentNumber.value = generateRandom(min, max)
    // console.log(`開始生成隨機數 [${min}-${max}]:`, currentNumber.value)

    timer = setInterval(() => {
      if (isRunning.value) {
        currentNumber.value = generateRandom(min, max)
        // console.log(`更新隨機數 [${min}-${max}]:`, currentNumber.value)
      }
    }, interval)
  }

  const stop = () => {
    isRunning.value = false
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const generateRandom = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const getCurrent = () => currentNumber.value

  return {
    isRunning,
    currentNumber,
    start,
    stop,
    getCurrent
  }
}

// 在組件中使用 - 創建12個獨立的生成器
const randomGenerators = Array.from({ length: 13 }, () => createRandomGenerator())

// 啟動所有生成器（可以在 mounted 或需要時調用）
const startAllRandomNumbers = () => {
  // 為每個生成器設置不同的範圍
  randomGenerators[0].start(56800000, 5689999)      // 1-10
  randomGenerators[1].start(14500000, 14599999)     // 10-20
  randomGenerators[2].start(63600000, 63699999)     // 20-30
  randomGenerators[3].start(54500000, 54599999)     // 30-40
  randomGenerators[4].start(94500000, 94599999)     // 40-50
  randomGenerators[5].start(78, 90)     // 50-60
  randomGenerators[6].start(78, 90)     // 60-70
  randomGenerators[7].start(78, 90)     // 70-80
  randomGenerators[8].start(78, 90)     // 80-90
  randomGenerators[9].start(540000, 549999)    // 90-100
  randomGenerators[10].start(540000, 549999)  // 100-110
  randomGenerators[11].start(500000, 900000)  // 110-120
  randomGenerators[12].start(500000, 900000)  // 110-120
}

// 停止所有生成器
const stopAllRandomNumbers = () => {
  randomGenerators.forEach(generator => generator.stop())
}

onUnmounted(() => {
  stopAllRandomNumbers()
})
</script>
<template>
  <div class="page">
    <RainBackground :drop-count="10" :min-speed="5" :max-speed="8" drop-color="hsl(200, 100%, 50%)"
      gradient-start="#13769a" gradient-end=" #090723" />
    <header>
      <div class="header-box">
        <h2>Data System</h2>
        <h4>數據多元整合系統 / <a @click="navigateTo('/')">返回首頁</a></h4>
      </div>
    </header>
    <div class="section1">
      <div class="game-left">
        <div class="box-title">
          <h5>數據管理選擇</h5>
        </div>
        <div class="left-items">
          <div class="item" v-for="(item, index) in productUpdate" @click="onPush(item.validation[0])"
            :class="server1 == index ? 'active' : ''">
            <img src="@/assets/images/kj-game/up.png" alt="" class="up">
            <span>{{ item.name }}</span>
            <img src="@/assets/images/kj-game/up.png" alt="" class="up">
          </div>
          <!-- <div class="item" @click="onPush('silicon')" :class="server1 == 2 ? 'active' : ''">
            <img src="@/assets/images/kj-game/up.png" alt="" class="up">
            <span>矽晶圓</span>
            <img src="@/assets/images/kj-game/up.png" alt="" class="up">
          </div>
          <div class="item" @click="onPush('iii-v')" :class="server1 == 3 ? 'active' : ''">
            <img src="@/assets/images/kj-game/up.png" alt="" class="up">
            <span>III-V</span>
            <img src="@/assets/images/kj-game/up.png" alt="" class="up">
          </div>
          <div class="item" @click="onPush('ai-chip')" :class="server1 == 4 ? 'active' : ''">
            <img src="@/assets/images/kj-game/up.png" alt="" class="up">
            <span>AI晶片</span>
            <img src="@/assets/images/kj-game/up.png" alt="" class="up">
          </div>
          <div class="item" @click="onPush('photonic')" :class="server1 == 5 ? 'active' : ''">
            <img src="@/assets/images/kj-game/up.png" alt="" class="up">
            <span>矽光子</span>
            <img src="@/assets/images/kj-game/up.png" alt="" class="up">
          </div>
          <div class="item" @click="onPush('warrants')" :class="server1 == 6 ? 'active' : ''">
            <img src="@/assets/images/kj-game/up.png" alt="" class="up">
            <span>阿巴阿布</span>
            <img src="@/assets/images/kj-game/up.png" alt="" class="up">
          </div> -->
        </div>
        <div class="box-title">
          <h5>類別數據百分比</h5>
        </div>
        <div>
          <br>
          <progressStrip :val="85" :max="100" con="活躍率" color="#09c4ca" />
          <br>
          <progressStrip :val="77" :max="100" con="流動率" color="#09c4ca" />
          <br>
          <progressStrip :val="93" :max="100" con="整合數" color="#09c4ca" />
        </div>
      </div>
      <div class="game-box">

        <div class="earth-number">
          <div class="earth-number-inner inner1">
            <h4>指數總和</h4>
            <h1>{{ randomGenerators[0].currentNumber }}</h1>
          </div>
          <div class="earth-number-inner inner2">
            <h4>指數總和</h4>
            <h1>{{ randomGenerators[1].currentNumber }}</h1>
          </div>
          <div class="earth-number-inner inner3">
            <h4>指數總和</h4>
            <h1>{{ randomGenerators[2].currentNumber }}</h1>
          </div>
          <div class="earth-number-inner inner4">
            <h4>指數總和</h4>
            <h1>{{ randomGenerators[3].currentNumber }}</h1>
          </div>
        </div>
        <div class="total-container">
          <div class="earth-container">
            <div class="earth-inner">
              <img src="@/assets/images/kj-game/cloud1.png" alt="">
              <div class="text">
                <h4>指數總和</h4>
                <h1>{{ randomGenerators[4].currentNumber }}</h1>
              </div>
            </div>
          </div>
          <div class="cicle1"></div>
          <div class="cicle2"></div>
          <div class="cicle3"></div>
          <div class="cicle4"></div>
          <div class="cicle5">
            <h4>{{ randomGenerators[5].currentNumber }}%</h4>
            <p>熱門度</p>
          </div>
          <div class="cicle6">
            <h4>{{ randomGenerators[6].currentNumber }}%</h4>
            <p>完成率</p>
          </div>
          <div class="cicle7">
            <h4>{{ randomGenerators[7].currentNumber }}%</h4>
            <p>比例</p>
          </div>
          <div class="cicle8">
            <h4>{{ randomGenerators[8].currentNumber }}%</h4>
            <p>波動程度</p>
          </div>
        </div>
      </div>
      <div class="game-right">
        <div class="box-title">
          <h5>指數當前分析</h5>
        </div>
        <ul>
          <li>
            <h5>Semiconductor</h5>
            <span>Activity Level</span>
            <em class="activityLevel" style="color: #f29701">{{ randomGenerators[9].currentNumber }}</em>
          </li>
          <li>
            <h5>Integrated circuit </h5>
            <span>Activity Level</span>
            <em class="activityLevel">{{ randomGenerators[10].currentNumber }}</em>
          </li>
          <li>
            <h5>AI on Chip / Silicon Photonics</h5>
            <span>Activity Level</span>
            <em class="activityLevel">{{ randomGenerators[11].currentNumber }} / {{ randomGenerators[12].currentNumber
            }}</em>
          </li>
        </ul>
        <div class="execution">
          <div class="execution-box">
            <div class="execution-item">
              <h5>轉換率</h5>
              <div class="schedule1">
                <waves :value="0.78" :label="'89%'" />
              </div>
              <div class="base"></div>
            </div>
            <div class="execution-item">
              <h5>獲利率</h5>
              <div class="schedule1">
                <waves :value="0.78" :label="'89%'" />
              </div>
              <div class="base"></div>
            </div>
          </div>
        </div>
        <div class="line-cart">
          <lineChart :data-length="29" :max-value="25" lineColor="#34a39a" :tooltip-trigger="'item'"
            :y-axis-name="'builder'" />
        </div>
      </div>
    </div>
    <footer>
      <div class=" footer-box">
        <h5>數據資訊</h5>
        <p>Data Status</p>
      </div>
    </footer>
  </div>
</template>
<style scoped lang="sass">
.page
  position: relative
  width: 100%
  height: 100vh
  overflow-x: hidden
  background: #000 url(@/assets/images/kj-game/53bg.png) center / 100% 100%
  @media (max-width: 752px)
    height: auto
  header
    position: absolute
    top: 0
    width: 100%
    height: 110px
    z-index: 3
    background: url(@/assets/images/kj-game/53titlebg.png) center / cover
    display: flex
    align-items: center
    justify-content: center
    .header-box
      text-align: center
      color: #fff
      font-weight: 500
      h2
        font-size: 40px
      h4
        font-size: 17px
      h2,h4,a
        background-image: -webkit-linear-gradient(bottom, #86919e, #fff)
        -webkit-background-clip: text
        -webkit-text-fill-color: transparent
  footer
    position: absolute
    bottom: 0
    width: 100%
    height: 91px
    z-index: 3
    background: url(@/assets/images/kj-game/53bottomsjbg.png) center / cover
    display: flex
    align-items: center
    justify-content: center
    padding: 0 20px 20px
    .footer-box
      text-align: center
      color: #fff
      h5
        background-image: -webkit-linear-gradient(bottom, #86919e, #fff)
        -webkit-background-clip: text
        -webkit-text-fill-color: transparent
        font-size: .8438rem
      p
        font-size: .625rem
        color: #0ac1c7
  .section1
    position: relative
    z-index: 2
    height: 100dvh
    width: 100%
    padding: 110px 2.5% 91px
    display: grid
    grid-template-columns: 1fr 3fr 1fr
    @media (max-width: 752px)
      display: block
      height: auto
    .box-title
      width: 100%
      height: 50px
      background: url(@/assets/images/kj-game/title.png) no-repeat center / cover
      background-size: 100%
      color: #fff
      text-align: center
      font-size: 0.9rem
      h5
        line-height: 50px
    .game-left
      .left-items
        padding-bottom: 20px
        .item
          position: relative
          background: url(@/assets/images/kj-game/border.png) no-repeat center / 100% 100%
          display: flex
          justify-content: center
          gap: 25px
          margin-left: 5%
          margin-right: 5%
          margin-block-start: 5%
          padding-left: 30px
          padding-top: 6%
          height: 60px
          &::before
            content: ''
            position: absolute
            left: -7%
            bottom: -5%
            width: 30px
            height: 30px
            background: url(@/assets/images/kj-game/green.png) no-repeat center / 100% 100% !important
          &.active
            background: url(@/assets/images/kj-game/border2.png) no-repeat center / 100% 100% !important
            &::before
              background: url(@/assets/images/kj-game/orange.png) no-repeat center / 100% 100% !important

          .up
            width: 7px
            height: 15px
          span
            color: #fff
            font-size: 12px
    .game-box
      position: relative
      @media (max-width: 752px)
        height: 650px
      .earth-number
        position: absolute
        width: 100%
        height: 100%
        .earth-number-inner
          position: absolute
          z-index: 1
          h4
            color: #0ac1c7
            font-size: 1rem
            font-family: '宋体'
            @media (max-width: 752px)
              font-size: 0.8rem
          h1
            font-family: 'LCdd'
            font-size: 2rem
            color: #f29701
            @media (max-width: 752px)
              font-size: 1.2rem
        .inner1
          top: 20%
          left: 4%
        .inner2
          top: 10%
          left: 38%
        .inner3
          top: 14%
          left: 62%
        .inner4
          top: 45%
          left: 75%
      .total-container
        position: relative
        background: url(https://upload.comethike.com/uploads/1759837388027.png) no-repeat 20% top / 130% 90%
        width: 100%
        height: 100%
        display: flex
        align-items: center
        justify-content: center
        .earth-container
          position: absolute
          top: 50%
          left: 50%
          z-index: 100
          transform: translate(-50%, -50%)
          display: flex
          justify-content: center
          align-items: center
          padding: 50px
          margin-top: 100px
          width: 450px
          height: 450px
          background: url(@/assets/images/kj-game/earth1.png) no-repeat center / 100% 100%
          .earth-inner
            position: relative
            width: 70%
            height: auto
            .text
              position: absolute
              top: 0
              left: 0
              width: 100%
              padding: 40px 30px 0
              text-align: left
              color: #003c63
              h4
                font-size: 1.2rem
              h2
                font-size: 2rem
                line-height: 40px
        .cicle1
          width: 12rem
          height: 12rem
          position: absolute
          top: 82%
          left: 50%
          transform-style: preserve-3d
          background: url(@/assets/images/kj-game/53gqbottomleft.png) no-repeat center
          background-size: 100%
          // transform: translateX(-50%) rotateX(75deg)
          animation: rotate4 2s linear infinite
        .cicle2
          position: absolute
          width: 16rem
          height: 16rem
          top: 75%
          left: 50%
          transform-style: preserve-3d
          background: url(@/assets/images/kj-game/53gqbottomleft.png) no-repeat center
          background-size: 100%
          // transform: translateX(-50%) rotateX(75deg)
          animation: rotate3 2s linear infinite
        .cicle3
          position: absolute
          width: 18rem
          height: 18rem
          top: 68%
          left: 50%
          transform-style: preserve-3d
          background: url(@/assets/images/kj-game/53gqbottomleft.png) no-repeat center
          background-size: 100%
          // transform: translateX(-50%) rotateX(75deg)
          animation: rotate4 2s linear infinite
        .cicle4
          position: absolute
          width: 100%
          height: 100%
          top: 30%
          left: 50%
          transform-style: preserve-3d
          background: url(@/assets/images/kj-game/circle.png) no-repeat center
          background-size: 100%
          // transform: translateX(-50%) rotateX(75deg)
          animation: rotate3 12s linear infinite
        .cicle5,.cicle6,.cicle7,.cicle8
          position: absolute
          width: 7rem
          height: 7rem
          top: 60%
          left: 50%
          z-index: 100
          margin-left: -2.5rem
          border-radius: 50%
          text-align: center
          h4
            font-size: 1.8rem
          p
            font-size: 1rem
            white-space: nowrap
        .cicle5
          background: url(@/assets/images/kj-game/circle1.png) no-repeat
          background-size: 100%
          animation: rotate5 20s linear infinite
          color: #f29701
          font-family: 'LCdd'
          font-size: 1.5rem
          padding: 30px
          text-align: center
          
        .cicle6
          background: url(@/assets/images/kj-game/circle2.png) no-repeat
          background-size: 100%
          padding: 30px
          animation: rotate6 20s linear infinite
          color: #0ac1c7
        .cicle7
          background: url(@/assets/images/kj-game/circle1.png) no-repeat
          background-size: 100%
          padding: 30px
          color: #f29701
          animation: rotate7 20s linear infinite
        .cicle8
          background: url(@/assets/images/kj-game/circle2.png) no-repeat
          background-size: 100%
          padding: 30px
          color: #0ac1c7
          animation: rotate8 20s linear infinite
    .game-right
      ul
        padding: 20px 5%
        color: #fff
        li
          display: flex
          flex-direction: column
          padding-bottom: 26px
          h5
            font-size: .8438rem
            font-weight: 600
          span
            font-size: .625rem
            margin-bottom: 16px
          em
            font-size: 1rem
            color: #0ac1c7
            font-weight: 500
            font-style: normal
      .execution
        width: 100%
        height: 25%
        overflow: hidden
        background: url(@/assets/images/kj-game/execution.png) no-repeat left / 80% 100%
        .execution-box
          display: flex
          justify-content: space-between
          position: relative
          padding-left: 15%
          padding-bottom: 13%
          height: 100%
          &::before
            content: '當前狀態'
            position: absolute
            top: 0
            left: 0
            width: 10px
            font-size: .825rem
            color: #fff
            margin-top: 10px
            margin-left: 14px
          .execution-item
            width: 50%
            padding-bottom: 30px
            h5
              color: #fff
              font-size: .625rem
              text-align: center
            .schedule1
              width: 100%
              height: 100px
              padding:0 15px 15px
            .base
              position: absolute
              width: 65px
              height: 65px
              bottom: -16px
              left: 50%
              background: url(@/assets/images/kj-game/2222.png)  no-repeat center / 100% 100%
              transform-style: preserve-3d
              transform: translateX(-50%) rotateX(75deg)
              animation: rotate2 1s linear infinite
      .line-cart
        position: relative
        height: 25%
// 動畫
@keyframes rotate2
  0% 
    transform: translateX(-50%) rotateX(75deg) rotateZ(0)
  100% 
    transform: translateX(-50%) rotateX(75deg) rotateZ(360deg)
@keyframes rotate3 
  0% 
    transform: translateX(-50%) rotateX(75deg) rotateZ(0)
  
  100% 
    transform: translateX(-50%) rotateX(75deg) rotateZ(360deg)
  

@keyframes rotate4 
  0% 
    transform: translateX(-50%) rotateX(75deg) rotateZ(0)
  
  100% 
    transform: translateX(-50%) rotateX(75deg) rotateZ(-360deg)
  

@keyframes rotate5 
  0% 
    transform: matrix3d(0.9, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 1, 0, 270, 0, 0, 1)
    z-index: 100
  
  1% 
    transform: matrix3d(0.92093, 0, 0, 0, 0, 0.92093, 0, 0, 0, 0, 1, 0, 269.46722, 6.27905, 0, 1)
    z-index: 100.06279
  
  2% 
    transform: matrix3d(0.94178, 0, 0, 0, 0, 0.94178, 0, 0, 0, 0, 1, 0, 267.87097, 12.53332, 0, 1)
    z-index: 100.12533
  
  3% 
    transform: matrix3d(0.96246, 0, 0, 0, 0, 0.96246, 0, 0, 0, 0, 1, 0, 265.21756, 18.73813, 0, 1)
    z-index: 100.18738
  
  4% 
    transform: matrix3d(0.9829, 0, 0, 0, 0, 0.9829, 0, 0, 0, 0, 1, 0, 261.51745, 24.86899, 0, 1)
    z-index: 100.24869
  
  5% 
    transform: matrix3d(1.00301, 0, 0, 0, 0, 1.00301, 0, 0, 0, 0, 1, 0, 256.78526, 30.9017, 0, 1)
    z-index: 100.30902
  
  6% 
    transform: matrix3d(1.02271, 0, 0, 0, 0, 1.02271, 0, 0, 0, 0, 1, 0, 251.03965, 36.81246, 0, 1)
    z-index: 100.36812
  
  7% 
    transform: matrix3d(1.04193, 0, 0, 0, 0, 1.04193, 0, 0, 0, 0, 1, 0, 244.3033, 42.57793, 0, 1)
    z-index: 100.42578
  
  8% 
    transform: matrix3d(1.06058, 0, 0, 0, 0, 1.06058, 0, 0, 0, 0, 1, 0, 236.6028, 48.17537, 0, 1)
    z-index: 100.48175
  
  9% 
    transform: matrix3d(1.07861, 0, 0, 0, 0, 1.07861, 0, 0, 0, 0, 1, 0, 227.96854, 53.58268, 0, 1)
    z-index: 100.53583
  
  10% 
    transform: matrix3d(1.09593, 0, 0, 0, 0, 1.09593, 0, 0, 0, 0, 1, 0, 218.43459, 58.77853, 0, 1)
    z-index: 100.58779
  
  11% 
    transform: matrix3d(1.11247, 0, 0, 0, 0, 1.11247, 0, 0, 0, 0, 1, 0, 208.03858, 63.7424, 0, 1)
    z-index: 100.63742
  
  12% 
    transform: matrix3d(1.12818, 0, 0, 0, 0, 1.12818, 0, 0, 0, 0, 1, 0, 196.82153, 68.45471, 0, 1)
    z-index: 100.68455
  
  13% 
    transform: matrix3d(1.14299, 0, 0, 0, 0, 1.14299, 0, 0, 0, 0, 1, 0, 184.82772, 72.89686, 0, 1)
    z-index: 100.72897
  
  14% 
    transform: matrix3d(1.15684, 0, 0, 0, 0, 1.15684, 0, 0, 0, 0, 1, 0, 172.10448, 77.05132, 0, 1)
    z-index: 100.77051
  
  15% 
    transform: matrix3d(1.16967, 0, 0, 0, 0, 1.16967, 0, 0, 0, 0, 1, 0, 158.70202, 80.9017, 0, 1)
    z-index: 100.80902
  
  16% 
    transform: matrix3d(1.18144, 0, 0, 0, 0, 1.18144, 0, 0, 0, 0, 1, 0, 144.67323, 84.43279, 0, 1)
    z-index: 100.84433
  
  17% 
    transform: matrix3d(1.1921, 0, 0, 0, 0, 1.1921, 0, 0, 0, 0, 1, 0, 130.07349, 87.63067, 0, 1)
    z-index: 100.87631
  
  18% 
    transform: matrix3d(1.20161, 0, 0, 0, 0, 1.20161, 0, 0, 0, 0, 1, 0, 114.96041, 90.48271, 0, 1)
    z-index: 100.90483
  
  19% 
    transform: matrix3d(1.20993, 0, 0, 0, 0, 1.20993, 0, 0, 0, 0, 1, 0, 99.39363, 92.97765, 0, 1)
    z-index: 100.92978
  
  20% 
    transform: matrix3d(1.21702, 0, 0, 0, 0, 1.21702, 0, 0, 0, 0, 1, 0, 83.43459, 95.10565, 0, 1)
    z-index: 100.95106
  
  21% 
    transform: matrix3d(1.22286, 0, 0, 0, 0, 1.22286, 0, 0, 0, 0, 1, 0, 67.14627, 96.85832, 0, 1)
    z-index: 100.96858
  
  22% 
    transform: matrix3d(1.22743, 0, 0, 0, 0, 1.22743, 0, 0, 0, 0, 1, 0, 50.59295, 98.22873, 0, 1)
    z-index: 100.98229
  
  23% 
    transform: matrix3d(1.2307, 0, 0, 0, 0, 1.2307, 0, 0, 0, 0, 1, 0, 33.83997, 99.21147, 0, 1)
    z-index: 100.99211
  
  24% 
    transform: matrix3d(1.23268, 0, 0, 0, 0, 1.23268, 0, 0, 0, 0, 1, 0, 16.95344, 99.80267, 0, 1)
    z-index: 100.99803
  
  25% 
    transform: matrix3d(1.23333, 0, 0, 0, 0, 1.23333, 0, 0, 0, 0, 1, 0, 0, 100, 0, 1)
    z-index: 101
  
  26% 
    transform: matrix3d(1.23268, 0, 0, 0, 0, 1.23268, 0, 0, 0, 0, 1, 0, -16.95344, 99.80267, 0, 1)
    z-index: 100.99803
  
  27% 
    transform: matrix3d(1.2307, 0, 0, 0, 0, 1.2307, 0, 0, 0, 0, 1, 0, -33.83997, 99.21147, 0, 1)
    z-index: 100.99211
  
  28% 
    transform: matrix3d(1.22743, 0, 0, 0, 0, 1.22743, 0, 0, 0, 0, 1, 0, -50.59295, 98.22873, 0, 1)
    z-index: 100.98229
  
  29% 
    transform: matrix3d(1.22286, 0, 0, 0, 0, 1.22286, 0, 0, 0, 0, 1, 0, -67.14627, 96.85832, 0, 1)
    z-index: 100.96858
  
  30% 
    transform: matrix3d(1.21702, 0, 0, 0, 0, 1.21702, 0, 0, 0, 0, 1, 0, -83.43459, 95.10565, 0, 1)
    z-index: 100.95106
  
  31% 
    transform: matrix3d(1.20993, 0, 0, 0, 0, 1.20993, 0, 0, 0, 0, 1, 0, -99.39363, 92.97765, 0, 1)
    z-index: 100.92978
  
  32% 
    transform: matrix3d(1.20161, 0, 0, 0, 0, 1.20161, 0, 0, 0, 0, 1, 0, -114.96041, 90.48271, 0, 1)
    z-index: 100.90483
  
  33% 
    transform: matrix3d(1.1921, 0, 0, 0, 0, 1.1921, 0, 0, 0, 0, 1, 0, -130.07349, 87.63067, 0, 1)
    z-index: 100.87631
  
  34% 
    transform: matrix3d(1.18144, 0, 0, 0, 0, 1.18144, 0, 0, 0, 0, 1, 0, -144.67323, 84.43279, 0, 1)
    z-index: 100.84433
  
  35% 
    transform: matrix3d(1.16967, 0, 0, 0, 0, 1.16967, 0, 0, 0, 0, 1, 0, -158.70202, 80.9017, 0, 1)
    z-index: 100.80902
  
  36% 
    transform: matrix3d(1.15684, 0, 0, 0, 0, 1.15684, 0, 0, 0, 0, 1, 0, -172.10448, 77.05132, 0, 1)
    z-index: 100.77051
  
  37% 
    transform: matrix3d(1.14299, 0, 0, 0, 0, 1.14299, 0, 0, 0, 0, 1, 0, -184.82772, 72.89686, 0, 1)
    z-index: 100.72897
  
  38% 
    transform: matrix3d(1.12818, 0, 0, 0, 0, 1.12818, 0, 0, 0, 0, 1, 0, -196.82153, 68.45471, 0, 1)
    z-index: 100.68455
  
  39% 
    transform: matrix3d(1.11247, 0, 0, 0, 0, 1.11247, 0, 0, 0, 0, 1, 0, -208.03858, 63.7424, 0, 1)
    z-index: 100.63742
  
  40% 
    transform: matrix3d(1.09593, 0, 0, 0, 0, 1.09593, 0, 0, 0, 0, 1, 0, -218.43459, 58.77853, 0, 1)
    z-index: 100.58779
  
  41% 
    transform: matrix3d(1.07861, 0, 0, 0, 0, 1.07861, 0, 0, 0, 0, 1, 0, -227.96854, 53.58268, 0, 1)
    z-index: 100.53583
  
  42% 
    transform: matrix3d(1.06058, 0, 0, 0, 0, 1.06058, 0, 0, 0, 0, 1, 0, -236.6028, 48.17537, 0, 1)
    z-index: 100.48175
  
  43% 
    transform: matrix3d(1.04193, 0, 0, 0, 0, 1.04193, 0, 0, 0, 0, 1, 0, -244.3033, 42.57793, 0, 1)
    z-index: 100.42578
  
  44% 
    transform: matrix3d(1.02271, 0, 0, 0, 0, 1.02271, 0, 0, 0, 0, 1, 0, -251.03965, 36.81246, 0, 1)
    z-index: 100.36812
  
  45% 
    transform: matrix3d(1.00301, 0, 0, 0, 0, 1.00301, 0, 0, 0, 0, 1, 0, -256.78526, 30.9017, 0, 1)
    z-index: 100.30902
  
  46% 
    transform: matrix3d(0.9829, 0, 0, 0, 0, 0.9829, 0, 0, 0, 0, 1, 0, -261.51745, 24.86899, 0, 1)
    z-index: 100.24869
  
  47% 
    transform: matrix3d(0.96246, 0, 0, 0, 0, 0.96246, 0, 0, 0, 0, 1, 0, -265.21756, 18.73813, 0, 1)
    z-index: 100.18738
  
  48% 
    transform: matrix3d(0.94178, 0, 0, 0, 0, 0.94178, 0, 0, 0, 0, 1, 0, -267.87097, 12.53332, 0, 1)
    z-index: 100.12533
  
  49% 
    transform: matrix3d(0.92093, 0, 0, 0, 0, 0.92093, 0, 0, 0, 0, 1, 0, -269.46722, 6.27905, 0, 1)
    z-index: 100.06279
  
  50% 
    transform: matrix3d(0.9, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 1, 0, -270, 0, 0, 1)
    z-index: 100
  
  51% 
    transform: matrix3d(0.87907, 0, 0, 0, 0, 0.87907, 0, 0, 0, 0, 1, 0, -269.46722, -6.27905, 0, 1)
    z-index: 99.93721
  
  52% 
    transform: matrix3d(0.85822, 0, 0, 0, 0, 0.85822, 0, 0, 0, 0, 1, 0, -267.87097, -12.53332, 0, 1)
    z-index: 99.87467
  
  53% 
    transform: matrix3d(0.83754, 0, 0, 0, 0, 0.83754, 0, 0, 0, 0, 1, 0, -265.21756, -18.73813, 0, 1)
    z-index: 99.81262
  
  54% 
    transform: matrix3d(0.8171, 0, 0, 0, 0, 0.8171, 0, 0, 0, 0, 1, 0, -261.51745, -24.86899, 0, 1)
    z-index: 99.75131
  
  55% 
    transform: matrix3d(0.79699, 0, 0, 0, 0, 0.79699, 0, 0, 0, 0, 1, 0, -256.78526, -30.9017, 0, 1)
    z-index: 99.69098
  
  56% 
    transform: matrix3d(0.77729, 0, 0, 0, 0, 0.77729, 0, 0, 0, 0, 1, 0, -251.03965, -36.81246, 0, 1)
    z-index: 99.63188
  
  57% 
    transform: matrix3d(0.75807, 0, 0, 0, 0, 0.75807, 0, 0, 0, 0, 1, 0, -244.3033, -42.57793, 0, 1)
    z-index: 99.57422
  
  58% 
    transform: matrix3d(0.73942, 0, 0, 0, 0, 0.73942, 0, 0, 0, 0, 1, 0, -236.6028, -48.17537, 0, 1)
    z-index: 99.51825
  
  59% 
    transform: matrix3d(0.72139, 0, 0, 0, 0, 0.72139, 0, 0, 0, 0, 1, 0, -227.96854, -53.58268, 0, 1)
    z-index: 99.46417
  
  60% 
    transform: matrix3d(0.70407, 0, 0, 0, 0, 0.70407, 0, 0, 0, 0, 1, 0, -218.43459, -58.77853, 0, 1)
    z-index: 99.41221
  
  61% 
    transform: matrix3d(0.68753, 0, 0, 0, 0, 0.68753, 0, 0, 0, 0, 1, 0, -208.03857, -63.7424, 0, 1)
    z-index: 99.36258
  
  62% 
    transform: matrix3d(0.67182, 0, 0, 0, 0, 0.67182, 0, 0, 0, 0, 1, 0, -196.82153, -68.45471, 0, 1)
    z-index: 99.31545
  
  63% 
    transform: matrix3d(0.65701, 0, 0, 0, 0, 0.65701, 0, 0, 0, 0, 1, 0, -184.82772, -72.89686, 0, 1)
    z-index: 99.27103
  
  64% 
    transform: matrix3d(0.64316, 0, 0, 0, 0, 0.64316, 0, 0, 0, 0, 1, 0, -172.10447, -77.05132, 0, 1)
    z-index: 99.22949
  
  65% 
    transform: matrix3d(0.63033, 0, 0, 0, 0, 0.63033, 0, 0, 0, 0, 1, 0, -158.70201, -80.9017, 0, 1)
    z-index: 99.19098
  
  66% 
    transform: matrix3d(0.61856, 0, 0, 0, 0, 0.61856, 0, 0, 0, 0, 1, 0, -144.67323, -84.43279, 0, 1)
    z-index: 99.15567
  
  67% 
    transform: matrix3d(0.6079, 0, 0, 0, 0, 0.6079, 0, 0, 0, 0, 1, 0, -130.07348, -87.63067, 0, 1)
    z-index: 99.12369
  
  68% 
    transform: matrix3d(0.59839, 0, 0, 0, 0, 0.59839, 0, 0, 0, 0, 1, 0, -114.96039, -90.4827, 0, 1)
    z-index: 99.09517
  
  69% 
    transform: matrix3d(0.59007, 0, 0, 0, 0, 0.59007, 0, 0, 0, 0, 1, 0, -99.39361, -92.97765, 0, 1)
    z-index: 99.07022
  
  70% 
    transform: matrix3d(0.58298, 0, 0, 0, 0, 0.58298, 0, 0, 0, 0, 1, 0, -83.43456, -95.10565, 0, 1)
    z-index: 99.04894
  
  71% 
    transform: matrix3d(0.57714, 0, 0, 0, 0, 0.57714, 0, 0, 0, 0, 1, 0, -67.14622, -96.85831, 0, 1)
    z-index: 99.03142
  
  72% 
    transform: matrix3d(0.57257, 0, 0, 0, 0, 0.57257, 0, 0, 0, 0, 1, 0, -50.59289, -98.22872, 0, 1)
    z-index: 99.01771
  
  73% 
    transform: matrix3d(0.5693, 0, 0, 0, 0, 0.5693, 0, 0, 0, 0, 1, 0, -33.83989, -99.21146, 0, 1)
    z-index: 99.00789
  
  74% 
    transform: matrix3d(0.56732, 0, 0, 0, 0, 0.56732, 0, 0, 0, 0, 1, 0, -16.95333, -99.80266, 0, 1)
    z-index: 99.00197
  
  75% 
    transform: matrix3d(0.56667, 0, 0, 0, 0, 0.56667, 0, 0, 0, 0, 1, 0, 0.00015, -99.99999, 0, 1)
    z-index: 99
  
  76% 
    transform: matrix3d(0.56732, 0, 0, 0, 0, 0.56732, 0, 0, 0, 0, 1, 0, 16.95364, -99.80266, 0, 1)
    z-index: 99.00197
  
  77% 
    transform: matrix3d(0.5693, 0, 0, 0, 0, 0.5693, 0, 0, 0, 0, 1, 0, 33.84024, -99.21145, 0, 1)
    z-index: 99.00789
  
  78% 
    transform: matrix3d(0.57257, 0, 0, 0, 0, 0.57257, 0, 0, 0, 0, 1, 0, 50.59331, -98.2287, 0, 1)
    z-index: 99.01771
  
  79% 
    transform: matrix3d(0.57714, 0, 0, 0, 0, 0.57714, 0, 0, 0, 0, 1, 0, 67.14674, -96.85828, 0, 1)
    z-index: 99.03142
  
  80% 
    transform: matrix3d(0.58298, 0, 0, 0, 0, 0.58298, 0, 0, 0, 0, 1, 0, 83.4352, -95.1056, 0, 1)
    z-index: 99.04894
  
  81% 
    transform: matrix3d(0.59007, 0, 0, 0, 0, 0.59007, 0, 0, 0, 0, 1, 0, 99.39444, -92.97758, 0, 1)
    z-index: 99.07022
  
  82% 
    transform: matrix3d(0.59839, 0, 0, 0, 0, 0.59839, 0, 0, 0, 0, 1, 0, 114.96147, -90.48262, 0, 1)
    z-index: 99.09517
  
  83% 
    transform: matrix3d(0.6079, 0, 0, 0, 0, 0.6079, 0, 0, 0, 0, 1, 0, 130.07487, -87.63055, 0, 1)
    z-index: 99.12369
  
  84% 
    transform: matrix3d(0.61856, 0, 0, 0, 0, 0.61856, 0, 0, 0, 0, 1, 0, 144.67503, -84.43264, 0, 1)
    z-index: 99.15567
  
  85% 
    transform: matrix3d(0.63033, 0, 0, 0, 0, 0.63033, 0, 0, 0, 0, 1, 0, 158.70434, -80.9015, 0, 1)
    z-index: 99.19099
  
  86% 
    transform: matrix3d(0.64316, 0, 0, 0, 0, 0.64316, 0, 0, 0, 0, 1, 0, 172.10748, -77.05106, 0, 1)
    z-index: 99.22949
  
  87% 
    transform: matrix3d(0.65701, 0, 0, 0, 0, 0.65701, 0, 0, 0, 0, 1, 0, 184.83158, -72.89652, 0, 1)
    z-index: 99.27103
  
  88% 
    transform: matrix3d(0.67182, 0, 0, 0, 0, 0.67182, 0, 0, 0, 0, 1, 0, 196.82649, -68.45427, 0, 1)
    z-index: 99.31546
  
  89% 
    transform: matrix3d(0.68753, 0, 0, 0, 0, 0.68753, 0, 0, 0, 0, 1, 0, 208.04493, -63.74182, 0, 1)
    z-index: 99.36258
  
  90% 
    transform: matrix3d(0.70407, 0, 0, 0, 0, 0.70407, 0, 0, 0, 0, 1, 0, 218.4427, -58.77778, 0, 1)
    z-index: 99.41222
  
  91% 
    transform: matrix3d(0.72139, 0, 0, 0, 0, 0.72139, 0, 0, 0, 0, 1, 0, 227.97887, -53.58172, 0, 1)
    z-index: 99.46418
  
  92% 
    transform: matrix3d(0.73942, 0, 0, 0, 0, 0.73942, 0, 0, 0, 0, 1, 0, 236.61593, -48.17414, 0, 1)
    z-index: 99.51826
  
  93% 
    transform: matrix3d(0.75808, 0, 0, 0, 0, 0.75808, 0, 0, 0, 0, 1, 0, 244.31993, -42.57636, 0, 1)
    z-index: 99.57424
  
  94% 
    transform: matrix3d(0.7773, 0, 0, 0, 0, 0.7773, 0, 0, 0, 0, 1, 0, 251.06067, -36.81045, 0, 1)
    z-index: 99.6319
  
  95% 
    transform: matrix3d(0.797, 0, 0, 0, 0, 0.797, 0, 0, 0, 0, 1, 0, 256.81175, -30.89914, 0, 1)
    z-index: 99.69101
  
  96% 
    transform: matrix3d(0.81711, 0, 0, 0, 0, 0.81711, 0, 0, 0, 0, 1, 0, 261.55076, -24.86574, 0, 1)
    z-index: 99.75134
  
  97% 
    transform: matrix3d(0.83755, 0, 0, 0, 0, 0.83755, 0, 0, 0, 0, 1, 0, 265.25934, -18.73401, 0, 1)
    z-index: 99.81266
  
  98% 
    transform: matrix3d(0.85824, 0, 0, 0, 0, 0.85824, 0, 0, 0, 0, 1, 0, 267.92326, -12.52811, 0, 1)
    z-index: 99.87472
  
  99% 
    transform: matrix3d(0.87909, 0, 0, 0, 0, 0.87909, 0, 0, 0, 0, 1, 0, 269.5325, -6.27248, 0, 1)
    z-index: 99.93728
  
  100% 
    transform: matrix3d(0.90003, 0, 0, 0, 0, 0.90003, 0, 0, 0, 0, 1, 0, 270.08133, 0.00827, 0, 1)
    z-index: 100.00008
  
@keyframes rotate6 
  0% 
    transform: matrix3d(1.23268, 0, 0, 0, 0, 1.23268, 0, 0, 0, 0, 1, 0, -16.95344, 99.80267, 0, 1)
    z-index: 100.99803
  
  1% 
    transform: matrix3d(1.2307, 0, 0, 0, 0, 1.2307, 0, 0, 0, 0, 1, 0, -33.83997, 99.21147, 0, 1)
    z-index: 100.99211
  
  2% 
    transform: matrix3d(1.22743, 0, 0, 0, 0, 1.22743, 0, 0, 0, 0, 1, 0, -50.59295, 98.22873, 0, 1)
    z-index: 100.98229
  
  3% 
    transform: matrix3d(1.22286, 0, 0, 0, 0, 1.22286, 0, 0, 0, 0, 1, 0, -67.14627, 96.85832, 0, 1)
    z-index: 100.96858
  
  4% 
    transform: matrix3d(1.21702, 0, 0, 0, 0, 1.21702, 0, 0, 0, 0, 1, 0, -83.43459, 95.10565, 0, 1)
    z-index: 100.95106
  
  5% 
    transform: matrix3d(1.20993, 0, 0, 0, 0, 1.20993, 0, 0, 0, 0, 1, 0, -99.39363, 92.97765, 0, 1)
    z-index: 100.92978
  
  6% 
    transform: matrix3d(1.20161, 0, 0, 0, 0, 1.20161, 0, 0, 0, 0, 1, 0, -114.96041, 90.48271, 0, 1)
    z-index: 100.90483
  
  7% 
    transform: matrix3d(1.1921, 0, 0, 0, 0, 1.1921, 0, 0, 0, 0, 1, 0, -130.07349, 87.63067, 0, 1)
    z-index: 100.87631
  
  8% 
    transform: matrix3d(1.18144, 0, 0, 0, 0, 1.18144, 0, 0, 0, 0, 1, 0, -144.67323, 84.43279, 0, 1)
    z-index: 100.84433
  
  9% 
    transform: matrix3d(1.16967, 0, 0, 0, 0, 1.16967, 0, 0, 0, 0, 1, 0, -158.70202, 80.9017, 0, 1)
    z-index: 100.80902
  
  10% 
    transform: matrix3d(1.15684, 0, 0, 0, 0, 1.15684, 0, 0, 0, 0, 1, 0, -172.10448, 77.05132, 0, 1)
    z-index: 100.77051
  
  11% 
    transform: matrix3d(1.14299, 0, 0, 0, 0, 1.14299, 0, 0, 0, 0, 1, 0, -184.82772, 72.89686, 0, 1)
    z-index: 100.72897
  
  12% 
    transform: matrix3d(1.12818, 0, 0, 0, 0, 1.12818, 0, 0, 0, 0, 1, 0, -196.82153, 68.45471, 0, 1)
    z-index: 100.68455
  
  13% 
    transform: matrix3d(1.11247, 0, 0, 0, 0, 1.11247, 0, 0, 0, 0, 1, 0, -208.03858, 63.7424, 0, 1)
    z-index: 100.63742
  
  14% 
    transform: matrix3d(1.09593, 0, 0, 0, 0, 1.09593, 0, 0, 0, 0, 1, 0, -218.43459, 58.77853, 0, 1)
    z-index: 100.58779
  
  15% 
    transform: matrix3d(1.07861, 0, 0, 0, 0, 1.07861, 0, 0, 0, 0, 1, 0, -227.96854, 53.58268, 0, 1)
    z-index: 100.53583
  
  16% 
    transform: matrix3d(1.06058, 0, 0, 0, 0, 1.06058, 0, 0, 0, 0, 1, 0, -236.6028, 48.17537, 0, 1)
    z-index: 100.48175
  
  17% 
    transform: matrix3d(1.04193, 0, 0, 0, 0, 1.04193, 0, 0, 0, 0, 1, 0, -244.3033, 42.57793, 0, 1)
    z-index: 100.42578
  
  18% 
    transform: matrix3d(1.02271, 0, 0, 0, 0, 1.02271, 0, 0, 0, 0, 1, 0, -251.03965, 36.81246, 0, 1)
    z-index: 100.36812
  
  19% 
    transform: matrix3d(1.00301, 0, 0, 0, 0, 1.00301, 0, 0, 0, 0, 1, 0, -256.78526, 30.9017, 0, 1)
    z-index: 100.30902
  
  20% 
    transform: matrix3d(0.9829, 0, 0, 0, 0, 0.9829, 0, 0, 0, 0, 1, 0, -261.51745, 24.86899, 0, 1)
    z-index: 100.24869
  
  21% 
    transform: matrix3d(0.96246, 0, 0, 0, 0, 0.96246, 0, 0, 0, 0, 1, 0, -265.21756, 18.73813, 0, 1)
    z-index: 100.18738
  
  22% 
    transform: matrix3d(0.94178, 0, 0, 0, 0, 0.94178, 0, 0, 0, 0, 1, 0, -267.87097, 12.53332, 0, 1)
    z-index: 100.12533
  
  23% 
    transform: matrix3d(0.92093, 0, 0, 0, 0, 0.92093, 0, 0, 0, 0, 1, 0, -269.46722, 6.27905, 0, 1)
    z-index: 100.06279
  
  24% 
    transform: matrix3d(0.9, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 1, 0, -270, 0, 0, 1)
    z-index: 100
  
  25% 
    transform: matrix3d(0.87907, 0, 0, 0, 0, 0.87907, 0, 0, 0, 0, 1, 0, -269.46722, -6.27905, 0, 1)
    z-index: 99.93721
  
  26% 
    transform: matrix3d(0.85822, 0, 0, 0, 0, 0.85822, 0, 0, 0, 0, 1, 0, -267.87097, -12.53332, 0, 1)
    z-index: 99.87467
  
  27% 
    transform: matrix3d(0.83754, 0, 0, 0, 0, 0.83754, 0, 0, 0, 0, 1, 0, -265.21756, -18.73813, 0, 1)
    z-index: 99.81262
  
  28% 
    transform: matrix3d(0.8171, 0, 0, 0, 0, 0.8171, 0, 0, 0, 0, 1, 0, -261.51745, -24.86899, 0, 1)
    z-index: 99.75131
  
  29% 
    transform: matrix3d(0.79699, 0, 0, 0, 0, 0.79699, 0, 0, 0, 0, 1, 0, -256.78526, -30.9017, 0, 1)
    z-index: 99.69098
  
  30% 
    transform: matrix3d(0.77729, 0, 0, 0, 0, 0.77729, 0, 0, 0, 0, 1, 0, -251.03965, -36.81246, 0, 1)
    z-index: 99.63188
  
  31% 
    transform: matrix3d(0.75807, 0, 0, 0, 0, 0.75807, 0, 0, 0, 0, 1, 0, -244.3033, -42.57793, 0, 1)
    z-index: 99.57422
  
  32% 
    transform: matrix3d(0.73942, 0, 0, 0, 0, 0.73942, 0, 0, 0, 0, 1, 0, -236.6028, -48.17537, 0, 1)
    z-index: 99.51825
  
  33% 
    transform: matrix3d(0.72139, 0, 0, 0, 0, 0.72139, 0, 0, 0, 0, 1, 0, -227.96854, -53.58268, 0, 1)
    z-index: 99.46417
  
  34% 
    transform: matrix3d(0.70407, 0, 0, 0, 0, 0.70407, 0, 0, 0, 0, 1, 0, -218.43459, -58.77853, 0, 1)
    z-index: 99.41221
  
  35% 
    transform: matrix3d(0.68753, 0, 0, 0, 0, 0.68753, 0, 0, 0, 0, 1, 0, -208.03857, -63.7424, 0, 1)
    z-index: 99.36258
  
  36% 
    transform: matrix3d(0.67182, 0, 0, 0, 0, 0.67182, 0, 0, 0, 0, 1, 0, -196.82153, -68.45471, 0, 1)
    z-index: 99.31545
  
  37% 
    transform: matrix3d(0.65701, 0, 0, 0, 0, 0.65701, 0, 0, 0, 0, 1, 0, -184.82772, -72.89686, 0, 1)
    z-index: 99.27103
  
  38% 
    transform: matrix3d(0.64316, 0, 0, 0, 0, 0.64316, 0, 0, 0, 0, 1, 0, -172.10447, -77.05132, 0, 1)
    z-index: 99.22949
  
  39% 
    transform: matrix3d(0.63033, 0, 0, 0, 0, 0.63033, 0, 0, 0, 0, 1, 0, -158.70201, -80.9017, 0, 1)
    z-index: 99.19098
  
  40% 
    transform: matrix3d(0.61856, 0, 0, 0, 0, 0.61856, 0, 0, 0, 0, 1, 0, -144.67323, -84.43279, 0, 1)
    z-index: 99.15567
  
  41% 
    transform: matrix3d(0.6079, 0, 0, 0, 0, 0.6079, 0, 0, 0, 0, 1, 0, -130.07348, -87.63067, 0, 1)
    z-index: 99.12369
  
  42% 
    transform: matrix3d(0.59839, 0, 0, 0, 0, 0.59839, 0, 0, 0, 0, 1, 0, -114.96039, -90.4827, 0, 1)
    z-index: 99.09517
  
  43% 
    transform: matrix3d(0.59007, 0, 0, 0, 0, 0.59007, 0, 0, 0, 0, 1, 0, -99.39361, -92.97765, 0, 1)
    z-index: 99.07022
  
  44% 
    transform: matrix3d(0.58298, 0, 0, 0, 0, 0.58298, 0, 0, 0, 0, 1, 0, -83.43456, -95.10565, 0, 1)
    z-index: 99.04894
  
  45% 
    transform: matrix3d(0.57714, 0, 0, 0, 0, 0.57714, 0, 0, 0, 0, 1, 0, -67.14622, -96.85831, 0, 1)
    z-index: 99.03142
  
  46% 
    transform: matrix3d(0.57257, 0, 0, 0, 0, 0.57257, 0, 0, 0, 0, 1, 0, -50.59289, -98.22872, 0, 1)
    z-index: 99.01771
  
  47% 
    transform: matrix3d(0.5693, 0, 0, 0, 0, 0.5693, 0, 0, 0, 0, 1, 0, -33.83989, -99.21146, 0, 1)
    z-index: 99.00789
  
  48% 
    transform: matrix3d(0.56732, 0, 0, 0, 0, 0.56732, 0, 0, 0, 0, 1, 0, -16.95333, -99.80266, 0, 1)
    z-index: 99.00197
  
  49% 
    transform: matrix3d(0.56667, 0, 0, 0, 0, 0.56667, 0, 0, 0, 0, 1, 0, 0.00015, -99.99999, 0, 1)
    z-index: 99
  
  50% 
    transform: matrix3d(0.56732, 0, 0, 0, 0, 0.56732, 0, 0, 0, 0, 1, 0, 16.95364, -99.80266, 0, 1)
    z-index: 99.00197
  
  51% 
    transform: matrix3d(0.5693, 0, 0, 0, 0, 0.5693, 0, 0, 0, 0, 1, 0, 33.84024, -99.21145, 0, 1)
    z-index: 99.00789
  
  52% 
    transform: matrix3d(0.57257, 0, 0, 0, 0, 0.57257, 0, 0, 0, 0, 1, 0, 50.59331, -98.2287, 0, 1)
    z-index: 99.01771
  
  53% 
    transform: matrix3d(0.57714, 0, 0, 0, 0, 0.57714, 0, 0, 0, 0, 1, 0, 67.14674, -96.85828, 0, 1)
    z-index: 99.03142
  
  54% 
    transform: matrix3d(0.58298, 0, 0, 0, 0, 0.58298, 0, 0, 0, 0, 1, 0, 83.4352, -95.1056, 0, 1)
    z-index: 99.04894
  
  55% 
    transform: matrix3d(0.59007, 0, 0, 0, 0, 0.59007, 0, 0, 0, 0, 1, 0, 99.39444, -92.97758, 0, 1)
    z-index: 99.07022
  
  56% 
    transform: matrix3d(0.59839, 0, 0, 0, 0, 0.59839, 0, 0, 0, 0, 1, 0, 114.96147, -90.48262, 0, 1)
    z-index: 99.09517
  
  57% 
    transform: matrix3d(0.6079, 0, 0, 0, 0, 0.6079, 0, 0, 0, 0, 1, 0, 130.07487, -87.63055, 0, 1)
    z-index: 99.12369
  
  58% 
    transform: matrix3d(0.61856, 0, 0, 0, 0, 0.61856, 0, 0, 0, 0, 1, 0, 144.67503, -84.43264, 0, 1)
    z-index: 99.15567
  
  59% 
    transform: matrix3d(0.63033, 0, 0, 0, 0, 0.63033, 0, 0, 0, 0, 1, 0, 158.70434, -80.9015, 0, 1)
    z-index: 99.19099
  
  60% 
    transform: matrix3d(0.64316, 0, 0, 0, 0, 0.64316, 0, 0, 0, 0, 1, 0, 172.10748, -77.05106, 0, 1)
    z-index: 99.22949
  
  61% 
    transform: matrix3d(0.65701, 0, 0, 0, 0, 0.65701, 0, 0, 0, 0, 1, 0, 184.83158, -72.89652, 0, 1)
    z-index: 99.27103
  
  62% 
    transform: matrix3d(0.67182, 0, 0, 0, 0, 0.67182, 0, 0, 0, 0, 1, 0, 196.82649, -68.45427, 0, 1)
    z-index: 99.31546
  
  63% 
    transform: matrix3d(0.68753, 0, 0, 0, 0, 0.68753, 0, 0, 0, 0, 1, 0, 208.04493, -63.74182, 0, 1)
    z-index: 99.36258
  
  64% 
    transform: matrix3d(0.70407, 0, 0, 0, 0, 0.70407, 0, 0, 0, 0, 1, 0, 218.4427, -58.77778, 0, 1)
    z-index: 99.41222
  
  65% 
    transform: matrix3d(0.72139, 0, 0, 0, 0, 0.72139, 0, 0, 0, 0, 1, 0, 227.97887, -53.58172, 0, 1)
    z-index: 99.46418
  
  66% 
    transform: matrix3d(0.73942, 0, 0, 0, 0, 0.73942, 0, 0, 0, 0, 1, 0, 236.61593, -48.17414, 0, 1)
    z-index: 99.51826
  
  67% 
    transform: matrix3d(0.75808, 0, 0, 0, 0, 0.75808, 0, 0, 0, 0, 1, 0, 244.31993, -42.57636, 0, 1)
    z-index: 99.57424
  
  68% 
    transform: matrix3d(0.7773, 0, 0, 0, 0, 0.7773, 0, 0, 0, 0, 1, 0, 251.06067, -36.81045, 0, 1)
    z-index: 99.6319
  
  69% 
    transform: matrix3d(0.797, 0, 0, 0, 0, 0.797, 0, 0, 0, 0, 1, 0, 256.81175, -30.89914, 0, 1)
    z-index: 99.69101
  
  70% 
    transform: matrix3d(0.81711, 0, 0, 0, 0, 0.81711, 0, 0, 0, 0, 1, 0, 261.55076, -24.86574, 0, 1)
    z-index: 99.75134
  
  71% 
    transform: matrix3d(0.83755, 0, 0, 0, 0, 0.83755, 0, 0, 0, 0, 1, 0, 265.25934, -18.73401, 0, 1)
    z-index: 99.81266
  
  72% 
    transform: matrix3d(0.85824, 0, 0, 0, 0, 0.85824, 0, 0, 0, 0, 1, 0, 267.92326, -12.52811, 0, 1)
    z-index: 99.87472
  
  73% 
    transform: matrix3d(0.87909, 0, 0, 0, 0, 0.87909, 0, 0, 0, 0, 1, 0, 269.5325, -6.27248, 0, 1)
    z-index: 99.93728
  
  74% 
    transform: matrix3d(0.90003, 0, 0, 0, 0, 0.90003, 0, 0, 0, 0, 1, 0, 270.08133, 0.00827, 0, 1)
    z-index: 100.00008
  
  75% 
    transform: matrix3d(0.9, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 1, 0, 270, 0, 0, 1)
    z-index: 100
  
  76% 
    transform: matrix3d(0.92093, 0, 0, 0, 0, 0.92093, 0, 0, 0, 0, 1, 0, 269.46722, 6.27905, 0, 1)
    z-index: 100.06279
  
  77% 
    transform: matrix3d(0.94178, 0, 0, 0, 0, 0.94178, 0, 0, 0, 0, 1, 0, 267.87097, 12.53332, 0, 1)
    z-index: 100.12533
  
  78% 
    transform: matrix3d(0.96246, 0, 0, 0, 0, 0.96246, 0, 0, 0, 0, 1, 0, 265.21756, 18.73813, 0, 1)
    z-index: 100.18738
  
  79% 
    transform: matrix3d(0.9829, 0, 0, 0, 0, 0.9829, 0, 0, 0, 0, 1, 0, 261.51745, 24.86899, 0, 1)
    z-index: 100.24869
  
  80% 
    transform: matrix3d(1.00301, 0, 0, 0, 0, 1.00301, 0, 0, 0, 0, 1, 0, 256.78526, 30.9017, 0, 1)
    z-index: 100.30902
  
  81% 
    transform: matrix3d(1.02271, 0, 0, 0, 0, 1.02271, 0, 0, 0, 0, 1, 0, 251.03965, 36.81246, 0, 1)
    z-index: 100.36812
  
  82% 
    transform: matrix3d(1.04193, 0, 0, 0, 0, 1.04193, 0, 0, 0, 0, 1, 0, 244.3033, 42.57793, 0, 1)
    z-index: 100.42578
  
  83% 
    transform: matrix3d(1.06058, 0, 0, 0, 0, 1.06058, 0, 0, 0, 0, 1, 0, 236.6028, 48.17537, 0, 1)
    z-index: 100.48175
  
  84% 
    transform: matrix3d(1.07861, 0, 0, 0, 0, 1.07861, 0, 0, 0, 0, 1, 0, 227.96854, 53.58268, 0, 1)
    z-index: 100.53583
  
  85% 
    transform: matrix3d(1.09593, 0, 0, 0, 0, 1.09593, 0, 0, 0, 0, 1, 0, 218.43459, 58.77853, 0, 1)
    z-index: 100.58779
  
  86% 
    transform: matrix3d(1.11247, 0, 0, 0, 0, 1.11247, 0, 0, 0, 0, 1, 0, 208.03858, 63.7424, 0, 1)
    z-index: 100.63742
  
  87% 
    transform: matrix3d(1.12818, 0, 0, 0, 0, 1.12818, 0, 0, 0, 0, 1, 0, 196.82153, 68.45471, 0, 1)
    z-index: 100.68455
  
  88% 
    transform: matrix3d(1.14299, 0, 0, 0, 0, 1.14299, 0, 0, 0, 0, 1, 0, 184.82772, 72.89686, 0, 1)
    z-index: 100.72897
  
  89% 
    transform: matrix3d(1.15684, 0, 0, 0, 0, 1.15684, 0, 0, 0, 0, 1, 0, 172.10448, 77.05132, 0, 1)
    z-index: 100.77051
  
  90% 
    transform: matrix3d(1.16967, 0, 0, 0, 0, 1.16967, 0, 0, 0, 0, 1, 0, 158.70202, 80.9017, 0, 1)
    z-index: 100.80902
  
  91% 
    transform: matrix3d(1.18144, 0, 0, 0, 0, 1.18144, 0, 0, 0, 0, 1, 0, 144.67323, 84.43279, 0, 1)
    z-index: 100.84433
  
  92% 
    transform: matrix3d(1.1921, 0, 0, 0, 0, 1.1921, 0, 0, 0, 0, 1, 0, 130.07349, 87.63067, 0, 1)
    z-index: 100.87631
  
  93% 
    transform: matrix3d(1.20161, 0, 0, 0, 0, 1.20161, 0, 0, 0, 0, 1, 0, 114.96041, 90.48271, 0, 1)
    z-index: 100.90483
  
  94% 
    transform: matrix3d(1.20993, 0, 0, 0, 0, 1.20993, 0, 0, 0, 0, 1, 0, 99.39363, 92.97765, 0, 1)
    z-index: 100.92978
  
  95% 
    transform: matrix3d(1.21702, 0, 0, 0, 0, 1.21702, 0, 0, 0, 0, 1, 0, 83.43459, 95.10565, 0, 1)
    z-index: 100.95106
  
  96% 
    transform: matrix3d(1.22286, 0, 0, 0, 0, 1.22286, 0, 0, 0, 0, 1, 0, 67.14627, 96.85832, 0, 1)
    z-index: 100.96858
  
  97% 
    transform: matrix3d(1.22743, 0, 0, 0, 0, 1.22743, 0, 0, 0, 0, 1, 0, 50.59295, 98.22873, 0, 1)
    z-index: 100.98229
  
  98% 
    transform: matrix3d(1.2307, 0, 0, 0, 0, 1.2307, 0, 0, 0, 0, 1, 0, 33.83997, 99.21147, 0, 1)
    z-index: 100.99211
  
  99% 
    transform: matrix3d(1.23268, 0, 0, 0, 0, 1.23268, 0, 0, 0, 0, 1, 0, 16.95344, 99.80267, 0, 1)
    z-index: 100.99803
  
  100% 
    transform: matrix3d(1.23333, 0, 0, 0, 0, 1.23333, 0, 0, 0, 0, 1, 0, 0, 100, 0, 1)
    z-index: 101
  

@keyframes rotate7 
  0% 
    transform: matrix3d(0.85822, 0, 0, 0, 0, 0.85822, 0, 0, 0, 0, 1, 0, -267.87097, -12.53332, 0, 1)
    z-index: 99.87467
  
  1% 
    transform: matrix3d(0.83754, 0, 0, 0, 0, 0.83754, 0, 0, 0, 0, 1, 0, -265.21756, -18.73813, 0, 1)
    z-index: 99.81262
  
  2% 
    transform: matrix3d(0.8171, 0, 0, 0, 0, 0.8171, 0, 0, 0, 0, 1, 0, -261.51745, -24.86899, 0, 1)
    z-index: 99.75131
  
  3% 
    transform: matrix3d(0.79699, 0, 0, 0, 0, 0.79699, 0, 0, 0, 0, 1, 0, -256.78526, -30.9017, 0, 1)
    z-index: 99.69098
  
  4% 
    transform: matrix3d(0.77729, 0, 0, 0, 0, 0.77729, 0, 0, 0, 0, 1, 0, -251.03965, -36.81246, 0, 1)
    z-index: 99.63188
  
  5% 
    transform: matrix3d(0.75807, 0, 0, 0, 0, 0.75807, 0, 0, 0, 0, 1, 0, -244.3033, -42.57793, 0, 1)
    z-index: 99.57422
  
  6% 
    transform: matrix3d(0.73942, 0, 0, 0, 0, 0.73942, 0, 0, 0, 0, 1, 0, -236.6028, -48.17537, 0, 1)
    z-index: 99.51825
  
  7% 
    transform: matrix3d(0.72139, 0, 0, 0, 0, 0.72139, 0, 0, 0, 0, 1, 0, -227.96854, -53.58268, 0, 1)
    z-index: 99.46417
  
  8% 
    transform: matrix3d(0.70407, 0, 0, 0, 0, 0.70407, 0, 0, 0, 0, 1, 0, -218.43459, -58.77853, 0, 1)
    z-index: 99.41221
  
  9% 
    transform: matrix3d(0.68753, 0, 0, 0, 0, 0.68753, 0, 0, 0, 0, 1, 0, -208.03857, -63.7424, 0, 1)
    z-index: 99.36258
  
  10% 
    transform: matrix3d(0.67182, 0, 0, 0, 0, 0.67182, 0, 0, 0, 0, 1, 0, -196.82153, -68.45471, 0, 1)
    z-index: 99.31545
  
  11% 
    transform: matrix3d(0.65701, 0, 0, 0, 0, 0.65701, 0, 0, 0, 0, 1, 0, -184.82772, -72.89686, 0, 1)
    z-index: 99.27103
  
  12% 
    transform: matrix3d(0.64316, 0, 0, 0, 0, 0.64316, 0, 0, 0, 0, 1, 0, -172.10447, -77.05132, 0, 1)
    z-index: 99.22949
  
  13% 
    transform: matrix3d(0.63033, 0, 0, 0, 0, 0.63033, 0, 0, 0, 0, 1, 0, -158.70201, -80.9017, 0, 1)
    z-index: 99.19098
  
  14% 
    transform: matrix3d(0.61856, 0, 0, 0, 0, 0.61856, 0, 0, 0, 0, 1, 0, -144.67323, -84.43279, 0, 1)
    z-index: 99.15567
  
  15% 
    transform: matrix3d(0.6079, 0, 0, 0, 0, 0.6079, 0, 0, 0, 0, 1, 0, -130.07348, -87.63067, 0, 1)
    z-index: 99.12369
  
  16% 
    transform: matrix3d(0.59839, 0, 0, 0, 0, 0.59839, 0, 0, 0, 0, 1, 0, -114.96039, -90.4827, 0, 1)
    z-index: 99.09517
  
  17% 
    transform: matrix3d(0.59007, 0, 0, 0, 0, 0.59007, 0, 0, 0, 0, 1, 0, -99.39361, -92.97765, 0, 1)
    z-index: 99.07022
  
  18% 
    transform: matrix3d(0.58298, 0, 0, 0, 0, 0.58298, 0, 0, 0, 0, 1, 0, -83.43456, -95.10565, 0, 1)
    z-index: 99.04894
  
  19% 
    transform: matrix3d(0.57714, 0, 0, 0, 0, 0.57714, 0, 0, 0, 0, 1, 0, -67.14622, -96.85831, 0, 1)
    z-index: 99.03142
  
  20% 
    transform: matrix3d(0.57257, 0, 0, 0, 0, 0.57257, 0, 0, 0, 0, 1, 0, -50.59289, -98.22872, 0, 1)
    z-index: 99.01771
  
  21% 
    transform: matrix3d(0.5693, 0, 0, 0, 0, 0.5693, 0, 0, 0, 0, 1, 0, -33.83989, -99.21146, 0, 1)
    z-index: 99.00789
  
  22% 
    transform: matrix3d(0.56732, 0, 0, 0, 0, 0.56732, 0, 0, 0, 0, 1, 0, -16.95333, -99.80266, 0, 1)
    z-index: 99.00197
  
  23% 
    transform: matrix3d(0.56667, 0, 0, 0, 0, 0.56667, 0, 0, 0, 0, 1, 0, 0.00015, -99.99999, 0, 1)
    z-index: 99
  
  24% 
    transform: matrix3d(0.56732, 0, 0, 0, 0, 0.56732, 0, 0, 0, 0, 1, 0, 16.95364, -99.80266, 0, 1)
    z-index: 99.00197
  
  25% 
    transform: matrix3d(0.5693, 0, 0, 0, 0, 0.5693, 0, 0, 0, 0, 1, 0, 33.84024, -99.21145, 0, 1)
    z-index: 99.00789
  
  26% 
    transform: matrix3d(0.57257, 0, 0, 0, 0, 0.57257, 0, 0, 0, 0, 1, 0, 50.59331, -98.2287, 0, 1)
    z-index: 99.01771
  
  27% 
    transform: matrix3d(0.57714, 0, 0, 0, 0, 0.57714, 0, 0, 0, 0, 1, 0, 67.14674, -96.85828, 0, 1)
    z-index: 99.03142
  
  28% 
    transform: matrix3d(0.58298, 0, 0, 0, 0, 0.58298, 0, 0, 0, 0, 1, 0, 83.4352, -95.1056, 0, 1)
    z-index: 99.04894
  
  29% 
    transform: matrix3d(0.59007, 0, 0, 0, 0, 0.59007, 0, 0, 0, 0, 1, 0, 99.39444, -92.97758, 0, 1)
    z-index: 99.07022
  
  30% 
    transform: matrix3d(0.59839, 0, 0, 0, 0, 0.59839, 0, 0, 0, 0, 1, 0, 114.96147, -90.48262, 0, 1)
    z-index: 99.09517
  
  31% 
    transform: matrix3d(0.6079, 0, 0, 0, 0, 0.6079, 0, 0, 0, 0, 1, 0, 130.07487, -87.63055, 0, 1)
    z-index: 99.12369
  
  32% 
    transform: matrix3d(0.61856, 0, 0, 0, 0, 0.61856, 0, 0, 0, 0, 1, 0, 144.67503, -84.43264, 0, 1)
    z-index: 99.15567
  
  33% 
    transform: matrix3d(0.63033, 0, 0, 0, 0, 0.63033, 0, 0, 0, 0, 1, 0, 158.70434, -80.9015, 0, 1)
    z-index: 99.19099
  
  34% 
    transform: matrix3d(0.64316, 0, 0, 0, 0, 0.64316, 0, 0, 0, 0, 1, 0, 172.10748, -77.05106, 0, 1)
    z-index: 99.22949
  
  35% 
    transform: matrix3d(0.65701, 0, 0, 0, 0, 0.65701, 0, 0, 0, 0, 1, 0, 184.83158, -72.89652, 0, 1)
    z-index: 99.27103
  
  36% 
    transform: matrix3d(0.67182, 0, 0, 0, 0, 0.67182, 0, 0, 0, 0, 1, 0, 196.82649, -68.45427, 0, 1)
    z-index: 99.31546
  
  37% 
    transform: matrix3d(0.68753, 0, 0, 0, 0, 0.68753, 0, 0, 0, 0, 1, 0, 208.04493, -63.74182, 0, 1)
    z-index: 99.36258
  
  38% 
    transform: matrix3d(0.70407, 0, 0, 0, 0, 0.70407, 0, 0, 0, 0, 1, 0, 218.4427, -58.77778, 0, 1)
    z-index: 99.41222
  
  39% 
    transform: matrix3d(0.72139, 0, 0, 0, 0, 0.72139, 0, 0, 0, 0, 1, 0, 227.97887, -53.58172, 0, 1)
    z-index: 99.46418
  
  40% 
    transform: matrix3d(0.73942, 0, 0, 0, 0, 0.73942, 0, 0, 0, 0, 1, 0, 236.61593, -48.17414, 0, 1)
    z-index: 99.51826
  
  41% 
    transform: matrix3d(0.75808, 0, 0, 0, 0, 0.75808, 0, 0, 0, 0, 1, 0, 244.31993, -42.57636, 0, 1)
    z-index: 99.57424
  
  42% 
    transform: matrix3d(0.7773, 0, 0, 0, 0, 0.7773, 0, 0, 0, 0, 1, 0, 251.06067, -36.81045, 0, 1)
    z-index: 99.6319
  
  43% 
    transform: matrix3d(0.797, 0, 0, 0, 0, 0.797, 0, 0, 0, 0, 1, 0, 256.81175, -30.89914, 0, 1)
    z-index: 99.69101
  
  44% 
    transform: matrix3d(0.81711, 0, 0, 0, 0, 0.81711, 0, 0, 0, 0, 1, 0, 261.55076, -24.86574, 0, 1)
    z-index: 99.75134
  
  45% 
    transform: matrix3d(0.83755, 0, 0, 0, 0, 0.83755, 0, 0, 0, 0, 1, 0, 265.25934, -18.73401, 0, 1)
    z-index: 99.81266
  
  46% 
    transform: matrix3d(0.85824, 0, 0, 0, 0, 0.85824, 0, 0, 0, 0, 1, 0, 267.92326, -12.52811, 0, 1)
    z-index: 99.87472
  
  47% 
    transform: matrix3d(0.87909, 0, 0, 0, 0, 0.87909, 0, 0, 0, 0, 1, 0, 269.5325, -6.27248, 0, 1)
    z-index: 99.93728
  
  48% 
    transform: matrix3d(0.90003, 0, 0, 0, 0, 0.90003, 0, 0, 0, 0, 1, 0, 270.08133, 0.00827, 0, 1)
    z-index: 100.00008
  
  49% 
    transform: matrix3d(0.9, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 1, 0, 270, 0, 0, 1)
    z-index: 100
  
  50% 
    transform: matrix3d(0.92093, 0, 0, 0, 0, 0.92093, 0, 0, 0, 0, 1, 0, 269.46722, 6.27905, 0, 1)
    z-index: 100.06279
  
  51% 
    transform: matrix3d(0.94178, 0, 0, 0, 0, 0.94178, 0, 0, 0, 0, 1, 0, 267.87097, 12.53332, 0, 1)
    z-index: 100.12533
  
  52% 
    transform: matrix3d(0.96246, 0, 0, 0, 0, 0.96246, 0, 0, 0, 0, 1, 0, 265.21756, 18.73813, 0, 1)
    z-index: 100.18738
  
  53% 
    transform: matrix3d(0.9829, 0, 0, 0, 0, 0.9829, 0, 0, 0, 0, 1, 0, 261.51745, 24.86899, 0, 1)
    z-index: 100.24869
  
  54% 
    transform: matrix3d(1.00301, 0, 0, 0, 0, 1.00301, 0, 0, 0, 0, 1, 0, 256.78526, 30.9017, 0, 1)
    z-index: 100.30902
  
  55% 
    transform: matrix3d(1.02271, 0, 0, 0, 0, 1.02271, 0, 0, 0, 0, 1, 0, 251.03965, 36.81246, 0, 1)
    z-index: 100.36812
  
  56% 
    transform: matrix3d(1.04193, 0, 0, 0, 0, 1.04193, 0, 0, 0, 0, 1, 0, 244.3033, 42.57793, 0, 1)
    z-index: 100.42578
  
  57% 
    transform: matrix3d(1.06058, 0, 0, 0, 0, 1.06058, 0, 0, 0, 0, 1, 0, 236.6028, 48.17537, 0, 1)
    z-index: 100.48175
  
  58% 
    transform: matrix3d(1.07861, 0, 0, 0, 0, 1.07861, 0, 0, 0, 0, 1, 0, 227.96854, 53.58268, 0, 1)
    z-index: 100.53583
  
  59% 
    transform: matrix3d(1.09593, 0, 0, 0, 0, 1.09593, 0, 0, 0, 0, 1, 0, 218.43459, 58.77853, 0, 1)
    z-index: 100.58779
  
  60% 
    transform: matrix3d(1.11247, 0, 0, 0, 0, 1.11247, 0, 0, 0, 0, 1, 0, 208.03858, 63.7424, 0, 1)
    z-index: 100.63742
  
  61% 
    transform: matrix3d(1.12818, 0, 0, 0, 0, 1.12818, 0, 0, 0, 0, 1, 0, 196.82153, 68.45471, 0, 1)
    z-index: 100.68455
  
  62% 
    transform: matrix3d(1.14299, 0, 0, 0, 0, 1.14299, 0, 0, 0, 0, 1, 0, 184.82772, 72.89686, 0, 1)
    z-index: 100.72897
  
  63% 
    transform: matrix3d(1.15684, 0, 0, 0, 0, 1.15684, 0, 0, 0, 0, 1, 0, 172.10448, 77.05132, 0, 1)
    z-index: 100.77051
  
  64% 
    transform: matrix3d(1.16967, 0, 0, 0, 0, 1.16967, 0, 0, 0, 0, 1, 0, 158.70202, 80.9017, 0, 1)
    z-index: 100.80902
  
  65% 
    transform: matrix3d(1.18144, 0, 0, 0, 0, 1.18144, 0, 0, 0, 0, 1, 0, 144.67323, 84.43279, 0, 1)
    z-index: 100.84433
  
  66% 
    transform: matrix3d(1.1921, 0, 0, 0, 0, 1.1921, 0, 0, 0, 0, 1, 0, 130.07349, 87.63067, 0, 1)
    z-index: 100.87631
  
  67% 
    transform: matrix3d(1.20161, 0, 0, 0, 0, 1.20161, 0, 0, 0, 0, 1, 0, 114.96041, 90.48271, 0, 1)
    z-index: 100.90483
  
  68% 
    transform: matrix3d(1.20993, 0, 0, 0, 0, 1.20993, 0, 0, 0, 0, 1, 0, 99.39363, 92.97765, 0, 1)
    z-index: 100.92978
  
  69% 
    transform: matrix3d(1.21702, 0, 0, 0, 0, 1.21702, 0, 0, 0, 0, 1, 0, 83.43459, 95.10565, 0, 1)
    z-index: 100.95106
  
  70% 
    transform: matrix3d(1.22286, 0, 0, 0, 0, 1.22286, 0, 0, 0, 0, 1, 0, 67.14627, 96.85832, 0, 1)
    z-index: 100.96858
  
  71% 
    transform: matrix3d(1.22743, 0, 0, 0, 0, 1.22743, 0, 0, 0, 0, 1, 0, 50.59295, 98.22873, 0, 1)
    z-index: 100.98229
  
  72% 
    transform: matrix3d(1.2307, 0, 0, 0, 0, 1.2307, 0, 0, 0, 0, 1, 0, 33.83997, 99.21147, 0, 1)
    z-index: 100.99211
  
  73% 
    transform: matrix3d(1.23268, 0, 0, 0, 0, 1.23268, 0, 0, 0, 0, 1, 0, 16.95344, 99.80267, 0, 1)
    z-index: 100.99803
  
  74% 
    transform: matrix3d(1.23333, 0, 0, 0, 0, 1.23333, 0, 0, 0, 0, 1, 0, 0, 100, 0, 1)
    z-index: 101
  
  75% 
    transform: matrix3d(1.23268, 0, 0, 0, 0, 1.23268, 0, 0, 0, 0, 1, 0, -16.95344, 99.80267, 0, 1)
    z-index: 100.99803
  
  76% 
    transform: matrix3d(1.2307, 0, 0, 0, 0, 1.2307, 0, 0, 0, 0, 1, 0, -33.83997, 99.21147, 0, 1)
    z-index: 100.99211
  
  77% 
    transform: matrix3d(1.22743, 0, 0, 0, 0, 1.22743, 0, 0, 0, 0, 1, 0, -50.59295, 98.22873, 0, 1)
    z-index: 100.98229
  
  78% 
    transform: matrix3d(1.22286, 0, 0, 0, 0, 1.22286, 0, 0, 0, 0, 1, 0, -67.14627, 96.85832, 0, 1)
    z-index: 100.96858
  
  79% 
    transform: matrix3d(1.21702, 0, 0, 0, 0, 1.21702, 0, 0, 0, 0, 1, 0, -83.43459, 95.10565, 0, 1)
    z-index: 100.95106
  
  80% 
    transform: matrix3d(1.20993, 0, 0, 0, 0, 1.20993, 0, 0, 0, 0, 1, 0, -99.39363, 92.97765, 0, 1)
    z-index: 100.92978
  
  81% 
    transform: matrix3d(1.20161, 0, 0, 0, 0, 1.20161, 0, 0, 0, 0, 1, 0, -114.96041, 90.48271, 0, 1)
    z-index: 100.90483
  
  82% 
    transform: matrix3d(1.1921, 0, 0, 0, 0, 1.1921, 0, 0, 0, 0, 1, 0, -130.07349, 87.63067, 0, 1)
    z-index: 100.87631
  
  83% 
    transform: matrix3d(1.18144, 0, 0, 0, 0, 1.18144, 0, 0, 0, 0, 1, 0, -144.67323, 84.43279, 0, 1)
    z-index: 100.84433
  
  84% 
    transform: matrix3d(1.16967, 0, 0, 0, 0, 1.16967, 0, 0, 0, 0, 1, 0, -158.70202, 80.9017, 0, 1)
    z-index: 100.80902
  
  85% 
    transform: matrix3d(1.15684, 0, 0, 0, 0, 1.15684, 0, 0, 0, 0, 1, 0, -172.10448, 77.05132, 0, 1)
    z-index: 100.77051
  
  86% 
    transform: matrix3d(1.14299, 0, 0, 0, 0, 1.14299, 0, 0, 0, 0, 1, 0, -184.82772, 72.89686, 0, 1)
    z-index: 100.72897
  
  87% 
    transform: matrix3d(1.12818, 0, 0, 0, 0, 1.12818, 0, 0, 0, 0, 1, 0, -196.82153, 68.45471, 0, 1)
    z-index: 100.68455
  
  88% 
    transform: matrix3d(1.11247, 0, 0, 0, 0, 1.11247, 0, 0, 0, 0, 1, 0, -208.03858, 63.7424, 0, 1)
    z-index: 100.63742
  
  89% 
    transform: matrix3d(1.09593, 0, 0, 0, 0, 1.09593, 0, 0, 0, 0, 1, 0, -218.43459, 58.77853, 0, 1)
    z-index: 100.58779
  
  90% 
    transform: matrix3d(1.07861, 0, 0, 0, 0, 1.07861, 0, 0, 0, 0, 1, 0, -227.96854, 53.58268, 0, 1)
    z-index: 100.53583
  
  91% 
    transform: matrix3d(1.06058, 0, 0, 0, 0, 1.06058, 0, 0, 0, 0, 1, 0, -236.6028, 48.17537, 0, 1)
    z-index: 100.48175
  
  92% 
    transform: matrix3d(1.04193, 0, 0, 0, 0, 1.04193, 0, 0, 0, 0, 1, 0, -244.3033, 42.57793, 0, 1)
    z-index: 100.42578
  
  93% 
    transform: matrix3d(1.02271, 0, 0, 0, 0, 1.02271, 0, 0, 0, 0, 1, 0, -251.03965, 36.81246, 0, 1)
    z-index: 100.36812
  
  94% 
    transform: matrix3d(1.00301, 0, 0, 0, 0, 1.00301, 0, 0, 0, 0, 1, 0, -256.78526, 30.9017, 0, 1)
    z-index: 100.30902
  
  95% 
    transform: matrix3d(0.9829, 0, 0, 0, 0, 0.9829, 0, 0, 0, 0, 1, 0, -261.51745, 24.86899, 0, 1)
    z-index: 100.24869
  
  96% 
    transform: matrix3d(0.96246, 0, 0, 0, 0, 0.96246, 0, 0, 0, 0, 1, 0, -265.21756, 18.73813, 0, 1)
    z-index: 100.18738
  
  97% 
    transform: matrix3d(0.94178, 0, 0, 0, 0, 0.94178, 0, 0, 0, 0, 1, 0, -267.87097, 12.53332, 0, 1)
    z-index: 100.12533
  
  98% 
    transform: matrix3d(0.92093, 0, 0, 0, 0, 0.92093, 0, 0, 0, 0, 1, 0, -269.46722, 6.27905, 0, 1)
    z-index: 100.06279
  
  99% 
    transform: matrix3d(0.9, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 1, 0, -270, 0, 0, 1)
    z-index: 100
  
  100% 
    transform: matrix3d(0.87907, 0, 0, 0, 0, 0.87907, 0, 0, 0, 0, 1, 0, -269.46722, -6.27905, 0, 1)
    z-index: 99.93721
  

@keyframes rotate8 
  0% 
    transform: matrix3d(0.57257, 0, 0, 0, 0, 0.57257, 0, 0, 0, 0, 1, 0, 50.59331, -98.2287, 0, 1)
    z-index: 99.01771
  
  1% 
    transform: matrix3d(0.57714, 0, 0, 0, 0, 0.57714, 0, 0, 0, 0, 1, 0, 67.14674, -96.85828, 0, 1)
    z-index: 99.03142
  
  2% 
    transform: matrix3d(0.58298, 0, 0, 0, 0, 0.58298, 0, 0, 0, 0, 1, 0, 83.4352, -95.1056, 0, 1)
    z-index: 99.04894
  
  3% 
    transform: matrix3d(0.59007, 0, 0, 0, 0, 0.59007, 0, 0, 0, 0, 1, 0, 99.39444, -92.97758, 0, 1)
    z-index: 99.07022
  
  4% 
    transform: matrix3d(0.59839, 0, 0, 0, 0, 0.59839, 0, 0, 0, 0, 1, 0, 114.96147, -90.48262, 0, 1)
    z-index: 99.09517
  
  5% 
    transform: matrix3d(0.6079, 0, 0, 0, 0, 0.6079, 0, 0, 0, 0, 1, 0, 130.07487, -87.63055, 0, 1)
    z-index: 99.12369
  
  6% 
    transform: matrix3d(0.61856, 0, 0, 0, 0, 0.61856, 0, 0, 0, 0, 1, 0, 144.67503, -84.43264, 0, 1)
    z-index: 99.15567
  
  7% 
    transform: matrix3d(0.63033, 0, 0, 0, 0, 0.63033, 0, 0, 0, 0, 1, 0, 158.70434, -80.9015, 0, 1)
    z-index: 99.19099
  
  8% 
    transform: matrix3d(0.64316, 0, 0, 0, 0, 0.64316, 0, 0, 0, 0, 1, 0, 172.10748, -77.05106, 0, 1)
    z-index: 99.22949
  
  9% 
    transform: matrix3d(0.65701, 0, 0, 0, 0, 0.65701, 0, 0, 0, 0, 1, 0, 184.83158, -72.89652, 0, 1)
    z-index: 99.27103
  
  10% 
    transform: matrix3d(0.67182, 0, 0, 0, 0, 0.67182, 0, 0, 0, 0, 1, 0, 196.82649, -68.45427, 0, 1)
    z-index: 99.31546
  
  11% 
    transform: matrix3d(0.68753, 0, 0, 0, 0, 0.68753, 0, 0, 0, 0, 1, 0, 208.04493, -63.74182, 0, 1)
    z-index: 99.36258
  
  12% 
    transform: matrix3d(0.70407, 0, 0, 0, 0, 0.70407, 0, 0, 0, 0, 1, 0, 218.4427, -58.77778, 0, 1)
    z-index: 99.41222
  
  13% 
    transform: matrix3d(0.72139, 0, 0, 0, 0, 0.72139, 0, 0, 0, 0, 1, 0, 227.97887, -53.58172, 0, 1)
    z-index: 99.46418
  
  14% 
    transform: matrix3d(0.73942, 0, 0, 0, 0, 0.73942, 0, 0, 0, 0, 1, 0, 236.61593, -48.17414, 0, 1)
    z-index: 99.51826
  
  15% 
    transform: matrix3d(0.75808, 0, 0, 0, 0, 0.75808, 0, 0, 0, 0, 1, 0, 244.31993, -42.57636, 0, 1)
    z-index: 99.57424
  
  16% 
    transform: matrix3d(0.7773, 0, 0, 0, 0, 0.7773, 0, 0, 0, 0, 1, 0, 251.06067, -36.81045, 0, 1)
    z-index: 99.6319
  
  17% 
    transform: matrix3d(0.797, 0, 0, 0, 0, 0.797, 0, 0, 0, 0, 1, 0, 256.81175, -30.89914, 0, 1)
    z-index: 99.69101
  
  18% 
    transform: matrix3d(0.81711, 0, 0, 0, 0, 0.81711, 0, 0, 0, 0, 1, 0, 261.55076, -24.86574, 0, 1)
    z-index: 99.75134
  
  19% 
    transform: matrix3d(0.83755, 0, 0, 0, 0, 0.83755, 0, 0, 0, 0, 1, 0, 265.25934, -18.73401, 0, 1)
    z-index: 99.81266
  
  20% 
    transform: matrix3d(0.85824, 0, 0, 0, 0, 0.85824, 0, 0, 0, 0, 1, 0, 267.92326, -12.52811, 0, 1)
    z-index: 99.87472
  
  21% 
    transform: matrix3d(0.87909, 0, 0, 0, 0, 0.87909, 0, 0, 0, 0, 1, 0, 269.5325, -6.27248, 0, 1)
    z-index: 99.93728
  
  22% 
    transform: matrix3d(0.90003, 0, 0, 0, 0, 0.90003, 0, 0, 0, 0, 1, 0, 270.08133, 0.00827, 0, 1)
    z-index: 100.00008
  
  23% 
    transform: matrix3d(0.9, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 1, 0, 270, 0, 0, 1)
    z-index: 100
  
  24% 
    transform: matrix3d(0.92093, 0, 0, 0, 0, 0.92093, 0, 0, 0, 0, 1, 0, 269.46722, 6.27905, 0, 1)
    z-index: 100.06279
  
  25% 
    transform: matrix3d(0.94178, 0, 0, 0, 0, 0.94178, 0, 0, 0, 0, 1, 0, 267.87097, 12.53332, 0, 1)
    z-index: 100.12533
  
  26% 
    transform: matrix3d(0.96246, 0, 0, 0, 0, 0.96246, 0, 0, 0, 0, 1, 0, 265.21756, 18.73813, 0, 1)
    z-index: 100.18738
  
  27% 
    transform: matrix3d(0.9829, 0, 0, 0, 0, 0.9829, 0, 0, 0, 0, 1, 0, 261.51745, 24.86899, 0, 1)
    z-index: 100.24869
  
  28% 
    transform: matrix3d(1.00301, 0, 0, 0, 0, 1.00301, 0, 0, 0, 0, 1, 0, 256.78526, 30.9017, 0, 1)
    z-index: 100.30902
  
  29% 
    transform: matrix3d(1.02271, 0, 0, 0, 0, 1.02271, 0, 0, 0, 0, 1, 0, 251.03965, 36.81246, 0, 1)
    z-index: 100.36812
  
  30% 
    transform: matrix3d(1.04193, 0, 0, 0, 0, 1.04193, 0, 0, 0, 0, 1, 0, 244.3033, 42.57793, 0, 1)
    z-index: 100.42578
  
  31% 
    transform: matrix3d(1.06058, 0, 0, 0, 0, 1.06058, 0, 0, 0, 0, 1, 0, 236.6028, 48.17537, 0, 1)
    z-index: 100.48175
  
  32% 
    transform: matrix3d(1.07861, 0, 0, 0, 0, 1.07861, 0, 0, 0, 0, 1, 0, 227.96854, 53.58268, 0, 1)
    z-index: 100.53583
  
  33% 
    transform: matrix3d(1.09593, 0, 0, 0, 0, 1.09593, 0, 0, 0, 0, 1, 0, 218.43459, 58.77853, 0, 1)
    z-index: 100.58779
  
  34% 
    transform: matrix3d(1.11247, 0, 0, 0, 0, 1.11247, 0, 0, 0, 0, 1, 0, 208.03858, 63.7424, 0, 1)
    z-index: 100.63742
  
  35% 
    transform: matrix3d(1.12818, 0, 0, 0, 0, 1.12818, 0, 0, 0, 0, 1, 0, 196.82153, 68.45471, 0, 1)
    z-index: 100.68455
  
  36% 
    transform: matrix3d(1.14299, 0, 0, 0, 0, 1.14299, 0, 0, 0, 0, 1, 0, 184.82772, 72.89686, 0, 1)
    z-index: 100.72897
  
  37% 
    transform: matrix3d(1.15684, 0, 0, 0, 0, 1.15684, 0, 0, 0, 0, 1, 0, 172.10448, 77.05132, 0, 1)
    z-index: 100.77051
  
  38% 
    transform: matrix3d(1.16967, 0, 0, 0, 0, 1.16967, 0, 0, 0, 0, 1, 0, 158.70202, 80.9017, 0, 1)
    z-index: 100.80902
  
  39% 
    transform: matrix3d(1.18144, 0, 0, 0, 0, 1.18144, 0, 0, 0, 0, 1, 0, 144.67323, 84.43279, 0, 1)
    z-index: 100.84433
  
  40% 
    transform: matrix3d(1.1921, 0, 0, 0, 0, 1.1921, 0, 0, 0, 0, 1, 0, 130.07349, 87.63067, 0, 1)
    z-index: 100.87631
  
  41% 
    transform: matrix3d(1.20161, 0, 0, 0, 0, 1.20161, 0, 0, 0, 0, 1, 0, 114.96041, 90.48271, 0, 1)
    z-index: 100.90483
  
  42% 
    transform: matrix3d(1.20993, 0, 0, 0, 0, 1.20993, 0, 0, 0, 0, 1, 0, 99.39363, 92.97765, 0, 1)
    z-index: 100.92978
  
  43% 
    transform: matrix3d(1.21702, 0, 0, 0, 0, 1.21702, 0, 0, 0, 0, 1, 0, 83.43459, 95.10565, 0, 1)
    z-index: 100.95106
  
  44% 
    transform: matrix3d(1.22286, 0, 0, 0, 0, 1.22286, 0, 0, 0, 0, 1, 0, 67.14627, 96.85832, 0, 1)
    z-index: 100.96858
  
  45% 
    transform: matrix3d(1.22743, 0, 0, 0, 0, 1.22743, 0, 0, 0, 0, 1, 0, 50.59295, 98.22873, 0, 1)
    z-index: 100.98229
  
  46% 
    transform: matrix3d(1.2307, 0, 0, 0, 0, 1.2307, 0, 0, 0, 0, 1, 0, 33.83997, 99.21147, 0, 1)
    z-index: 100.99211
  
  47% 
    transform: matrix3d(1.23268, 0, 0, 0, 0, 1.23268, 0, 0, 0, 0, 1, 0, 16.95344, 99.80267, 0, 1)
    z-index: 100.99803
  
  48% 
    transform: matrix3d(1.23333, 0, 0, 0, 0, 1.23333, 0, 0, 0, 0, 1, 0, 0, 100, 0, 1)
    z-index: 101
  
  49% 
    transform: matrix3d(1.23268, 0, 0, 0, 0, 1.23268, 0, 0, 0, 0, 1, 0, -16.95344, 99.80267, 0, 1)
    z-index: 100.99803
  
  50% 
    transform: matrix3d(1.2307, 0, 0, 0, 0, 1.2307, 0, 0, 0, 0, 1, 0, -33.83997, 99.21147, 0, 1)
    z-index: 100.99211
  
  51% 
    transform: matrix3d(1.22743, 0, 0, 0, 0, 1.22743, 0, 0, 0, 0, 1, 0, -50.59295, 98.22873, 0, 1)
    z-index: 100.98229
  
  52% 
    transform: matrix3d(1.22286, 0, 0, 0, 0, 1.22286, 0, 0, 0, 0, 1, 0, -67.14627, 96.85832, 0, 1)
    z-index: 100.96858
  
  53% 
    transform: matrix3d(1.21702, 0, 0, 0, 0, 1.21702, 0, 0, 0, 0, 1, 0, -83.43459, 95.10565, 0, 1)
    z-index: 100.95106
  
  54% 
    transform: matrix3d(1.20993, 0, 0, 0, 0, 1.20993, 0, 0, 0, 0, 1, 0, -99.39363, 92.97765, 0, 1)
    z-index: 100.92978
  
  55% 
    transform: matrix3d(1.20161, 0, 0, 0, 0, 1.20161, 0, 0, 0, 0, 1, 0, -114.96041, 90.48271, 0, 1)
    z-index: 100.90483
  
  56% 
    transform: matrix3d(1.1921, 0, 0, 0, 0, 1.1921, 0, 0, 0, 0, 1, 0, -130.07349, 87.63067, 0, 1)
    z-index: 100.87631
  
  57% 
    transform: matrix3d(1.18144, 0, 0, 0, 0, 1.18144, 0, 0, 0, 0, 1, 0, -144.67323, 84.43279, 0, 1)
    z-index: 100.84433
  
  58% 
    transform: matrix3d(1.16967, 0, 0, 0, 0, 1.16967, 0, 0, 0, 0, 1, 0, -158.70202, 80.9017, 0, 1)
    z-index: 100.80902
  
  59% 
    transform: matrix3d(1.15684, 0, 0, 0, 0, 1.15684, 0, 0, 0, 0, 1, 0, -172.10448, 77.05132, 0, 1)
    z-index: 100.77051
  
  60% 
    transform: matrix3d(1.14299, 0, 0, 0, 0, 1.14299, 0, 0, 0, 0, 1, 0, -184.82772, 72.89686, 0, 1)
    z-index: 100.72897
  
  61% 
    transform: matrix3d(1.12818, 0, 0, 0, 0, 1.12818, 0, 0, 0, 0, 1, 0, -196.82153, 68.45471, 0, 1)
    z-index: 100.68455
  
  62% 
    transform: matrix3d(1.11247, 0, 0, 0, 0, 1.11247, 0, 0, 0, 0, 1, 0, -208.03858, 63.7424, 0, 1)
    z-index: 100.63742
  
  63% 
    transform: matrix3d(1.09593, 0, 0, 0, 0, 1.09593, 0, 0, 0, 0, 1, 0, -218.43459, 58.77853, 0, 1)
    z-index: 100.58779
  
  64% 
    transform: matrix3d(1.07861, 0, 0, 0, 0, 1.07861, 0, 0, 0, 0, 1, 0, -227.96854, 53.58268, 0, 1)
    z-index: 100.53583
  
  65% 
    transform: matrix3d(1.06058, 0, 0, 0, 0, 1.06058, 0, 0, 0, 0, 1, 0, -236.6028, 48.17537, 0, 1)
    z-index: 100.48175
  
  66% 
    transform: matrix3d(1.04193, 0, 0, 0, 0, 1.04193, 0, 0, 0, 0, 1, 0, -244.3033, 42.57793, 0, 1)
    z-index: 100.42578
  
  67% 
    transform: matrix3d(1.02271, 0, 0, 0, 0, 1.02271, 0, 0, 0, 0, 1, 0, -251.03965, 36.81246, 0, 1)
    z-index: 100.36812
  
  68% 
    transform: matrix3d(1.00301, 0, 0, 0, 0, 1.00301, 0, 0, 0, 0, 1, 0, -256.78526, 30.9017, 0, 1)
    z-index: 100.30902
  
  69% 
    transform: matrix3d(0.9829, 0, 0, 0, 0, 0.9829, 0, 0, 0, 0, 1, 0, -261.51745, 24.86899, 0, 1)
    z-index: 100.24869
  
  70% 
    transform: matrix3d(0.96246, 0, 0, 0, 0, 0.96246, 0, 0, 0, 0, 1, 0, -265.21756, 18.73813, 0, 1)
    z-index: 100.18738
  
  71% 
    transform: matrix3d(0.94178, 0, 0, 0, 0, 0.94178, 0, 0, 0, 0, 1, 0, -267.87097, 12.53332, 0, 1)
    z-index: 100.12533
  
  72% 
    transform: matrix3d(0.92093, 0, 0, 0, 0, 0.92093, 0, 0, 0, 0, 1, 0, -269.46722, 6.27905, 0, 1)
    z-index: 100.06279
  
  73% 
    transform: matrix3d(0.9, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 1, 0, -270, 0, 0, 1)
    z-index: 100
  
  74% 
    transform: matrix3d(0.87907, 0, 0, 0, 0, 0.87907, 0, 0, 0, 0, 1, 0, -269.46722, -6.27905, 0, 1)
    z-index: 99.93721
  
  75% 
    transform: matrix3d(0.85822, 0, 0, 0, 0, 0.85822, 0, 0, 0, 0, 1, 0, -267.87097, -12.53332, 0, 1)
    z-index: 99.87467
  
  76% 
    transform: matrix3d(0.83754, 0, 0, 0, 0, 0.83754, 0, 0, 0, 0, 1, 0, -265.21756, -18.73813, 0, 1)
    z-index: 99.81262
  
  77% 
    transform: matrix3d(0.8171, 0, 0, 0, 0, 0.8171, 0, 0, 0, 0, 1, 0, -261.51745, -24.86899, 0, 1)
    z-index: 99.75131
  
  78% 
    transform: matrix3d(0.79699, 0, 0, 0, 0, 0.79699, 0, 0, 0, 0, 1, 0, -256.78526, -30.9017, 0, 1)
    z-index: 99.69098
  
  79% 
    transform: matrix3d(0.77729, 0, 0, 0, 0, 0.77729, 0, 0, 0, 0, 1, 0, -251.03965, -36.81246, 0, 1)
    z-index: 99.63188
  
  80% 
    transform: matrix3d(0.75807, 0, 0, 0, 0, 0.75807, 0, 0, 0, 0, 1, 0, -244.3033, -42.57793, 0, 1)
    z-index: 99.57422
  
  81% 
    transform: matrix3d(0.73942, 0, 0, 0, 0, 0.73942, 0, 0, 0, 0, 1, 0, -236.6028, -48.17537, 0, 1)
    z-index: 99.51825
  
  82% 
    transform: matrix3d(0.72139, 0, 0, 0, 0, 0.72139, 0, 0, 0, 0, 1, 0, -227.96854, -53.58268, 0, 1)
    z-index: 99.46417
  
  83% 
    transform: matrix3d(0.70407, 0, 0, 0, 0, 0.70407, 0, 0, 0, 0, 1, 0, -218.43459, -58.77853, 0, 1)
    z-index: 99.41221
  
  84% 
    transform: matrix3d(0.68753, 0, 0, 0, 0, 0.68753, 0, 0, 0, 0, 1, 0, -208.03857, -63.7424, 0, 1)
    z-index: 99.36258
  
  85% 
    transform: matrix3d(0.67182, 0, 0, 0, 0, 0.67182, 0, 0, 0, 0, 1, 0, -196.82153, -68.45471, 0, 1)
    z-index: 99.31545
  
  86% 
    transform: matrix3d(0.65701, 0, 0, 0, 0, 0.65701, 0, 0, 0, 0, 1, 0, -184.82772, -72.89686, 0, 1)
    z-index: 99.27103
  
  87% 
    transform: matrix3d(0.64316, 0, 0, 0, 0, 0.64316, 0, 0, 0, 0, 1, 0, -172.10447, -77.05132, 0, 1)
    z-index: 99.22949
  
  88% 
    transform: matrix3d(0.63033, 0, 0, 0, 0, 0.63033, 0, 0, 0, 0, 1, 0, -158.70201, -80.9017, 0, 1)
    z-index: 99.19098
  
  89% 
    transform: matrix3d(0.61856, 0, 0, 0, 0, 0.61856, 0, 0, 0, 0, 1, 0, -144.67323, -84.43279, 0, 1)
    z-index: 99.15567
  
  90% 
    transform: matrix3d(0.6079, 0, 0, 0, 0, 0.6079, 0, 0, 0, 0, 1, 0, -130.07348, -87.63067, 0, 1)
    z-index: 99.12369
  
  91% 
    transform: matrix3d(0.59839, 0, 0, 0, 0, 0.59839, 0, 0, 0, 0, 1, 0, -114.96039, -90.4827, 0, 1)
    z-index: 99.09517
  
  92% 
    transform: matrix3d(0.59007, 0, 0, 0, 0, 0.59007, 0, 0, 0, 0, 1, 0, -99.39361, -92.97765, 0, 1)
    z-index: 99.07022
  
  93% 
    transform: matrix3d(0.58298, 0, 0, 0, 0, 0.58298, 0, 0, 0, 0, 1, 0, -83.43456, -95.10565, 0, 1)
    z-index: 99.04894
  
  94% 
    transform: matrix3d(0.57714, 0, 0, 0, 0, 0.57714, 0, 0, 0, 0, 1, 0, -67.14622, -96.85831, 0, 1)
    z-index: 99.03142
  
  95% 
    transform: matrix3d(0.57257, 0, 0, 0, 0, 0.57257, 0, 0, 0, 0, 1, 0, -50.59289, -98.22872, 0, 1)
    z-index: 99.01771
  
  96% 
    transform: matrix3d(0.5693, 0, 0, 0, 0, 0.5693, 0, 0, 0, 0, 1, 0, -33.83989, -99.21146, 0, 1)
    z-index: 99.00789
  
  97% 
    transform: matrix3d(0.56732, 0, 0, 0, 0, 0.56732, 0, 0, 0, 0, 1, 0, -16.95333, -99.80266, 0, 1)
    z-index: 99.00197
  
  98% 
    transform: matrix3d(0.56667, 0, 0, 0, 0, 0.56667, 0, 0, 0, 0, 1, 0, 0.00015, -99.99999, 0, 1)
    z-index: 99
  
  99% 
    transform: matrix3d(0.56732, 0, 0, 0, 0, 0.56732, 0, 0, 0, 0, 1, 0, 16.95364, -99.80266, 0, 1)
    z-index: 99.00197
  
  100% 
    transform: matrix3d(0.5693, 0, 0, 0, 0, 0.5693, 0, 0, 0, 0, 1, 0, 33.84024, -99.21145, 0, 1)
    z-index: 99.00789
  

</style>
