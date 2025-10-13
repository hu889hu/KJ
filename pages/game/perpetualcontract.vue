<script lang="ts" setup>
// import
const { t } = useI18n()
const siteStore = useSiteStore()
const PlayerStore = usePlayerStore()
const orderStore = useOrderStore()
const { queryKlines, queryRounds, queryOrder, bet } = useGameStore()
const { getListenkey } = PlayerStore
const { locale } = useI18n()
const lang = locale.value
const { queryInstruction, queryNews } = useSiteStore()
const router = useRouter()
const timeoutId = ref(null)
const hourDegrees = ref(0)
const minuteDegrees = ref(0)
const secondDegrees = ref(0)
const record = ref({
  title: t('未結訂單'),
  type: 'currentOrder',
  search: true
})
const search = ref({
  symbol: '',
  roundNo: '',
  dateRangeStart: '',
  dateRangeEnd: '',
  limit: 60,
  page: 1,
  pageSize: 100
})
// 訂單參數
const orderData = ref({
  playerId: '',
  productId: '',
  action: 'buy', // buy:開倉 sell:平仓
  type: 'limit', // market:市價 limit:限價
  qty: '',
  price: '',
  direction: '' // long:开多 short:开空
})
const leverage = ref(1)
const maxBetQty = computed(() => {
  // 获取最大可买数量
  if (orderData.value.action === 'buy') {
    return (
      Number(playerWalletBalance.value) /
      Number(
        availableCurrency.value
          .find((n) => n.symbol == 'BTCUSDT')
          ?.price.slice(-1)[0].close
      )
    ).toFixed(6)
  } else {
    return 0
  }
})
const showToolPopup = ref(false)
const symbol = ref('')
const symbolData: any = ref(null)
const availableCurrency: any = ref([])
const defaultTime = new Date(2000, 1, 1, 12, 0, 0)
const socket: any = ref(null)
const socketConnected = ref(false)
const betData = ref({
  playerId: PlayerStore.playerInfo.id,
  option: [],
  amount: '',
  roundNo: ''
})
const recordList = ref([])
const historyRecordList = ref([])
// 圖表數據值
const nowTimestamp: any = ref(null)
const socketNewPrice: any = ref(null)
const isFirstGet = ref(true)
const createChartData = ref(null)
const socketCurrentRoundCountdown = ref(0)
const news = ref(null)
const rule = ref(null)
const disableBet = ref(false)
const currentSelectSymbolPrice = ref(0)
const playerWalletBalance = computed(() => {
  const findWallet = PlayerStore.playerInfo.wallet.find(
    (wallet: any) => wallet.type === 2
  )
  if (findWallet) {
    return Number(findWallet.balance)
  } else {
    return 0
  }
})
const selectSymbol = (value: any) => {
  symbol.value = value.symbol
  symbolData.value = value.symbolData
  closeWebSocket()
  document.getElementById('coinBox').checked = false
}

// method
const goPopup = async (title: string) => {
  console.log('recordList', recordList)
  record.value.title = title
  showToolPopup.value = true
  search.value.symbol = symbol.value
  // 確認order數據

  if (title === t('未結訂單')) {
    orderList.value = socketOrderList.value.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    record.value.type = 'currentOrder'
    record.value.search = true
    return
  }
  if (title === t('交易歷史')) {
    orderList.value = socketOrderList.value.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    record.value.type = 'historyOrder'
    record.value.search = true
    return
  }
  if (title === t('餘額')) {
    record.value.title = ' 歷史總覽'
    record.value.type = 'historyRecord'
    const response = await queryRounds({
      symbol: symbol.value,
      limit: 60,
      page: 1,
      pageSize: 100
    })
    console.log('queryRounds', response.data.result)
    historyRecordList.value = response.data.result.filter((item: any) => {
      return Number(item.roundNo) < Number(betData.value.roundNo)
    })
    console.log('betData.value.roundNo', betData.value.roundNo)
    console.log('queryRounds', historyRecordList.value)
    record.value.search = true
    return
  }
  if (title === t('網站公告')) {
    record.value.type = 'announcement'
    record.value.search = false
    return
  }
  if (title === t('規則說明')) {
    record.value.type = 'rule'
    record.value.search = false
  }
}
const closePopup = () => {
  showToolPopup.value = false
}
const connectRecordList = computed(() => {
  const title = record.value.type
  switch (title) {
    case 'currentOrder':
      orderList.value = socketOrderList.value
        .filter((item: any) => item.status === 0)
        .sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        })
      return orderList.value
    case 'historyOrder':
      orderList.value = socketOrderList.value
        .filter((item: any) => item.status === 1)
        .sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        })
      return orderList.value
  }
})
const addBetGameType = (type: string) => {
  if (betData.value.option.includes(type)) {
    betData.value.option = betData.value.option.filter((item) => item !== type)
  } else {
    betData.value.option.push(type)
  }
  console.log(betData.value.option)
}
const checkBetData = () => {
  if (!disableBet.value) {
    disableBet.value = true
    try {
      betData.value.productId = symbolData.value.id
      console.log(betData.value)
      const pairData = symbolData.value
      console.log('pairData', pairData)
      // banned action
      if (pairData.banned) {
        ElNotification({
          message: pairData.notice,
          type: 'error',
          showClose: false
        })
        return
      }
      // banned player
      const bannedPlayer = pairData.bannedPlayers.find(
        (item: any) => item.playerId === PlayerStore.playerInfo?.id
      )
      if (bannedPlayer) {
        if (bannedPlayer.banned) {
          ElNotification({
            message: bannedPlayer.reason,
            type: 'error',
            showClose: false
          })
          return
        }
      }
      if (betData.value.amount === '') {
        ElNotification({
          message: `${t('請輸入下單金額')}`,
          type: 'error',
          showClose: false
        })
        return
      }
      if (betData.value.option.length === 0) {
        ElNotification({
          message: `${t('請選擇參與遊戲模式')}`,
          type: 'error',
          showClose: false
        })
        return
      }
      if (
        parseFloat(betData.value.amount) < symbolData.value.config.minBetAmount
      ) {
        ElNotification({
          message: ` ${t('最低交易金額為')} $ ${symbolData.value.config.minBetAmount}`,
          type: 'error',
          showClose: false
        })
        return
      }
      if (
        parseFloat(betData.value.amount) > symbolData.value.config.maxBetAmount
      ) {
        ElNotification({
          message: `${t('最高交易金額為')} $ ${symbolData.value.config.maxBetAmount}`,
          type: 'error',
          showClose: false
        })
        return
      }
      setTimeout(
        async () => {
          betData.value.amount = betData.value.amount.toString()
          const response = await bet(betData.value)
          console.log('bet response', response)
          if (response.success) {
            ElMessageBox.alert(
              `
               <p style="margin:0 0 8px 0"> ${t('投注期別')}: ${response.data.roundNo} </p>
               <p style="margin:0 0 8px 0"> ${t('投注匯率')}: ${response.data.openPrice
              } </p>
               <p style="margin:0 0 8px 0"> ${t('下注金額')}: ${response.data.amount} </p>
               <p style="margin:0 0 8px 0"> ${t('下注類別')}: ${gameOptionNameList(
                response.data.option
              )} </p>
               <p style="margin:0 0 8px 0"> ${t('時間')}: ${formatDate(
                response.data.openAt
              )} </p>
             `,
              `${t('下單成功')}`,
              {
                confirmButtonText: `${t('確認')}`,
                center: true,
                dangerouslyUseHTMLString: true
              }
            )
          } else {
            // ElNotification({
            //   title: response.message,
            //   type: 'error',
            //   showClose: false
            // })
          }
          clearBetData()
          await PlayerStore.fetchInfo()
        },
        bannedPlayer ? (bannedPlayer.delay + 1) * 1000 : 1000
      )
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        disableBet.value = false
      }, 3000)
    }
  }
}
const gameOptionOdd = (type: number) => {
  switch (type) {
    case 0:
      return symbolData.value
        ? symbolData.value.config.option[0].odds * 100 + '%'
        : 0.1 * 100 + '%'
    case 1:
      return symbolData.value
        ? symbolData.value.config.option[1].odds * 100 + '%'
        : 0.1 * 100 + '%'
    case 2:
      return symbolData.value
        ? symbolData.value.config.option[2].odds * 100 + '%'
        : 0.1 * 100 + '%'
    case 3:
      return symbolData.value
        ? symbolData.value.config.option[3].odds * 100 + '%'
        : 0.1 * 100 + '%'
    case 4:
      return symbolData.value
        ? symbolData.value.config.option[4].odds * 100 + '%'
        : 0.1 * 100 + '%'
    case 5:
      return symbolData.value
        ? symbolData.value.config.option[5].odds * 100 + '%'
        : 0.1 * 100 + '%'
    case 6:
      return symbolData.value
        ? symbolData.value.config.option[6].odds * 100 + '%'
        : 0.1 * 100 + '%'
    default:
      return ''
  }
}

const showOption = (type: number) => {
  switch (type) {
    case 0:
      return symbolData.value ? symbolData.value.config.option[0].isOpen : false
    case 1:
      return symbolData.value ? symbolData.value.config.option[1].isOpen : false
    case 2:
      return symbolData.value ? symbolData.value.config.option[2].isOpen : false
    case 3:
      return symbolData.value ? symbolData.value.config.option[3].isOpen : false
    case 4:
      return symbolData.value ? symbolData.value.config.option[4].isOpen : false
    case 5:
      return symbolData.value ? symbolData.value.config.option[5].isOpen : false
    case 6:
      return symbolData.value ? symbolData.value.config.option[6].isOpen : false
    default:
      return true
  }
}

const clearBetData = () => {
  betData.value = {
    playerId: PlayerStore.playerInfo.id,
    productId: '',
    option: [],
    amount: '',
    roundNo: ''
  }
  document.getElementById('game-1').checked = false
  document.getElementById('game-2').checked = false
  document.getElementById('game-3').checked = false
  document.getElementById('game-4').checked = false
  document.getElementById('game-5').checked = false
  document.getElementById('game-6').checked = false
  document.getElementById('game-7').checked = false
}

const initMilliseconds = (timestamp: any) => {
  const newDate = new Date(timestamp)
  newDate.setMilliseconds(0)
  return newDate.getTime()
}

const randomVolume = () => {
  return parseFloat((Math.random() * 100 + 1).toFixed(2))
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

const gameOptionNameList = (list: Array) => {
  const result = []
  list.forEach((item) => {
    result.push(gameOptionName(item))
  })
  return result.join(', ')
}
const gameOptionName = (type: Number) => {
  switch (type) {
    case 0:
      return `${t('高')}`
    case 1:
      return `${t('低')}`
    case 2:
      return `${t('單')}`
    case 3:
      return `${t('雙')}`
    case 4:
      return `${t('漲')}`
    case 5:
      return `${t('跌')}`
    case 6:
      return `${t('反指標')}`
    default:
      return ''
  }
}
const gameResultName = (type: Number) => {
  // 0 : 高、1 : 低、2 : 單、3 : 雙、4 : 漲、5 : 跌 6 : 合
  switch (type) {
    case 0:
      return `${t('高')}`
    case 1:
      return `${t('反指標')}`
    case 2:
      return `${t('單')}`
    case 3:
      return `${t('雙')}`
    case 4:
      return `${t('漲')}`
    case 5:
      return `${t('跌')}`
    case 6:
      return `${t('和')}`
    default:
      return `${t('未知')}`
  }
}
const getChartData = async (timestamp: any) => {
  // 取得遠端資料
  // 取 3 分鐘的資料
  const now = new Date(nowTimestamp.value)
  now.setSeconds(0, 0)
  now.setMinutes(now.getMinutes() - 3)
  const startTime = now.getTime()
  const endTime = timestamp
  // const data = {
  //   symbol: symbol.value,
  //   interval: '1',
  //   startTime,
  //   endTime
  // }
  // console.log(symbolData.value)
  const data = {
    productId: symbolData.value.id
  }
  const klineData = await queryKlines(data)
  if (klineData.success) {
    isFirstGet.value = false // 第一次獲取開關關閉
    const { result } = klineData.data
    // console.log('klines', result)
    const newKLines = Object.entries(result).map(([timestamp, value]) => {
      const volume = randomVolume()
      const turnover = Number(value.close) * volume
      return {
        timestamp: Number(timestamp) * 1000,
        open: Number(value.open),
        close: Number(value.close),
        high: Number(value.high),
        low: Number(value.low),
        volume,
        turnover
      }
    })
    createChartData.value = { newKLines, time: timestamp }
  }
}

const searchOrder = async () => {
  const startDate = new Date(search.value.dateRangeStart)
  search.value.dateRangeStart = startDate.getTime()
  const endDate = new Date(search.value.dateRangeEnd)
  search.value.dateRangeEnd = endDate.getTime()
  console.log('searchOrder', search.value)
  if (!search.value.dateRangeStart) {
    delete search.value.dateRangeStart
  }
  if (!search.value.dateRangeEnd) {
    delete search.value.dateRangeEnd
  }
  if (record.value.type !== 'historyRecord') {
    const response = await queryOrder(search.value)
    if (response.success) {
      orderList.value = response.data.result
    } else {
      ElNotification({
        message: response.message,
        type: 'error'
      })
    }
  } else {
    // 搜尋盤口
    const response = await queryRounds(search.value)
    if (response.success) {
      historyRecordList.value = response.data.result
    } else {
      ElNotification({
        message: response.message,
        type: 'error'
      })
    }
  }
  search.value.dateRangeStart = ''
  search.value.dateRangeEnd = ''
  search.value.roundNo = ''
}

const pickerOptions = {
  daterange: {
    maxTime: '', // 最大日期
    minTime: '', // 最小日期
    max: 30 // 限制范围 30天
  }
}
const disabledDate = (time) => {
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  return time.getTime() < threeMonthsAgo.getTime()
}

const productList: any = ref([])

const orderList: any = ref([])
const socketOrderList: any = ref([])
const ogOrderList: any = ref(null)
// ctyptoData
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
  const runtimeConfig = useRuntimeConfig()
  const { SOCKETBASE } = runtimeConfig.public
  socket.value = new WebSocket(
    `${SOCKETBASE}/${getListenkeyRes.data.listenkey}`
  )
  socket.value.onopen = (event) => {
    // console.log('Connected to socket', event)
    socketConnected.value = true
    sendMessage({
      op: 'subscribe',
      channel: ['kline', 'order', 'product']
    })
  }
  socket.value.onmessage = async (e) => {
    const message = JSON.parse(e.data)
    // console.log('收到來自 socket 的訊息', message);
    const { event, data } = message
    switch (event) {
      case 'PRODUCT_UPDATE': {
        // console.log('PRODUCT_UPDATE', data)
        productList.value = data.result
        if (symbolData.value === null) {
          symbol.value = productList.value[0].symbol
          symbolData.value = productList.value[0]
        }
        break
      }
      case 'ORDER_UPDATE': {
        // console.log('ORDER_UPDATE', data)
        socketOrderList.value = data.result
      }
      case 'KLINE_UPDATE': {
        // console.log('KLINE_UPDATE', data)
        if (productList.value.length > 0) {
          productList.value.forEach((item: any) => {
            const findSystemPrice = data.result.find(
              (socketData: any) => socketData.symbol === item.symbol
            )
            // console.log('findSystemPrice', findSystemPrice)

            const currency = availableCurrency.value.find(
              (currency: any) => currency.symbol === item.symbol
            )
            if (currency) {
              currency.price.push({
                open: parseFloat(
                  currency.price[currency.price.length - 1].close
                ),
                close: findSystemPrice.price
                  ? parseFloat(findSystemPrice.price.close)
                  : 0
              })
            } else {
              availableCurrency.value.push({
                symbol: item.symbol,
                price: [
                  {
                    open: findSystemPrice.price
                      ? parseFloat(findSystemPrice.price.open)
                      : 0,
                    close: findSystemPrice.price
                      ? parseFloat(findSystemPrice.price.close)
                      : 0
                  }
                ],
                symbolData: item
              })
            }
          })
          console.log()
        }

        // 圖表列表數據
        const { timestamp: correctTimestamp } = message
        const lastTimestamp = Math.floor(nowTimestamp.value / 1000)
        if (lastTimestamp !== Math.floor(correctTimestamp / 1000)) {
          const timestamp = initMilliseconds(correctTimestamp)
          nowTimestamp.value = timestamp
          const symbolData = data.result.find(
            (item) => item.symbol === symbol.value
          )
          // console.log('symbol.value', symbol.value)
          // console.log('symbolData', symbolData)
          // 已選擇數據整理
          if (symbolData) {
            const { price } = symbolData
            // 數據整理
            let newPrice = Object.entries(price).reduce((acc, [key, value]) => {
              acc[key] = parseFloat(value)
              return acc
            }, {})
            const volume = randomVolume()
            const turnover = newPrice.close * volume
            newPrice = {
              timestamp,
              ...newPrice,
              turnover,
              volume
            }
            socketNewPrice.value = newPrice

            // 第一次取得所有數據 & 產生空資料
            if (isFirstGet.value) getChartData(timestamp)

            // currentSelectSymbolPrice
            currentSelectSymbolPrice.value = price.close
          }
        }
        break
      }
      case 'SERVER_TIME': {
        const {
          currentRoundId,
          currentRoundCountdown,
          allowBetRoundId,
          allowBetRoundCountdown
        } = data
        betData.value.roundNo = allowBetRoundId
        socketCurrentRoundCountdown.value = allowBetRoundCountdown
        // console.log(data);
        if (currentRoundCountdown === 59) {
          await PlayerStore.fetchInfo()
          // const queryOrderRes = await orderStore.queryOrder({
          //   pair: symbol.value
          // })
          // recordList.value = queryOrderRes.data.result
        }
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
    if (reconnected) {
      await startConnectWebSocket()
      console.log('reconnected to socket')
    }
  }

  socket.value.onerror = (error) => {
    socketConnected.value = false
    console.error('WebSocket error:', error)
  }
}
// 更新時鐘的函數
const updateClock = () => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  hourDegrees.value = (hours % 12) * 30 + minutes * 0.5
  minuteDegrees.value = minutes * 6
  secondDegrees.value = seconds * 6
}
const percentCountNumber = ref(0.0005)
const percentCount = (now, last) => {
  // 計算變化量
  const change = now - last
  // 計算百分比變化 = (變化量 / 原始值) * 100
  const percent = (change / last) * 100
  // 返回格式化後的百分比，保留2位小數
  return percent.toFixed(2)
}
// 初次呼叫更新時鐘
updateClock()

// 定義一些狀態變數和函數
const currentTime = ref('')
const countdown60 = ref(60)
const countdown70 = ref(70)
const inputValue = ref(50)
const counting = ref({
  ers: 33.71,
  sers: 3.3,
  ber: 400,
  es: 70
})

const updateCountingNumber = (value, min, max, fixed) => {
  counting.value[value] = parseFloat(
    (Math.random() * (max - min) + min).toFixed(fixed)
  )
}

// 更新當前時間的函數
const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

// 更新 60 秒倒數計時的函數
const updateCountdown60 = () => {
  if (countdown60.value > 0) {
    countdown60.value--
  } else {
    countdown60.value = 60
  }
}

// 更新 70 秒倒數計時的函數
const updateCountdown70 = () => {
  if (countdown70.value > 0) {
    countdown70.value--
  } else {
    countdown70.value = 70
  }
}

const ersTimer = ref('')
const sersTimer = ref('')
const berTimer = ref('')
const esTimer = ref('')

// 組件掛載時設置計時器並更新時間和倒數計時
await onMounted(async () => {
  await startConnectWebSocket()
  updateRandomNumbers()
  const pair = symbol.value
  const type = 'game'
  const path = 'game'
  /** await Promise then  */
  // 開始加載數據（此處沒有使用 await，因此主線程不會被阻塞）
  const queryInstructionPromise = queryInstruction(lang, type)
  const queryNewsPromise = queryNews(lang, path)
  // 使用 .then() 方法處理異步任務結果
  queryInstructionPromise
    .then((queryInstructionRes) => {
      // 處理響應結果
      rule.value = queryInstructionRes.data
    })
    .catch((error) => {
      console.error('Error loading instruction data:', error)
    })

  queryNewsPromise
    .then((queryNewsRes) => {
      // 處理響應結果
      news.value = queryNewsRes.data
    })
    .catch((error) => {
      console.error('Error loading news data:', error)
    })

  updateTime()

  ersTimer.value = setInterval(
    () => updateCountingNumber('ers', 30, 50, 2),
    1000
  )
  sersTimer.value = setInterval(
    () => updateCountingNumber('sers', 3, 8, 1),
    1000
  )
  berTimer.value = setInterval(
    () => updateCountingNumber('ber', 400, 600, 1),
    1000
  )
  esTimer.value = setInterval(() => updateCountingNumber('es', 70, 90, 1), 1000)
})

// 組件卸載時清除計時器
onUnmounted(() => {
  clearInterval(timer)
  clearInterval(timer2)
})

onBeforeUnmount(() => {
  clearInterval(ersTimer)
  clearInterval(sersTimer)
  clearInterval(berTimer)
  clearInterval(esTimer)
  reconnected.value = false
  // console.log('closeWebSocket', reconnected.value)
  closeWebSocket()
})

// 處理加法按鈕事件的函數
const addToInput = (value) => {
  betData.value.amount = value
}

const cryptoSelect = ref(false)
const openCryptoSelect = () => {
  cryptoSelect.value = !cryptoSelect.value
}
const cryptoName = (crypto) => {
  switch (crypto.symbol) {
    case 'BTCUSDT':
      return '太陽能'
    case 'WFEURUSD':
      return '風能'
    case 'WFGBPUSD':
      return '地熱能'
    case 'WFUSDTWD':
      return '海洋能'
    default:
      return crypto.label || crypto.name || crypto.symbol
  }
}
// action methods
const symbolChange = (symbol: string) => {
  switch (symbol) {
    case 'BTCUSDT':
      return '太陽能'
    case 'WFEURUSD':
      return '風能'
    case 'WFGBPUSD':
      return '地熱能'
    case 'WFUSDTWD':
      return '海洋能'
    default:
      return ''
  }
}
const betFormatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'k'
  } else {
    return num.toString()
  }
}
const betAmountsList = computed(() => {
  if (symbolData.value) {
    return symbolData.value.config.betAmount
  } else {
    return []
  }
})
const changeLang = (value) => {
  locale.value = value
  console.log('change lang', locale.value)
}
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'k'
  } else {
    return num.toString()
  }
}
let selectName = ref('未結訂單')
const goSelect = (name: string) => {
  selectName.value = name
}
const volumeNumberUp = ref(
  Array.from({ length: 12 }, () =>
    (Math.random() * (0.2 - 0.000001) + 0.000001).toFixed(6)
  )
)
const volumeNumberNp = ref(
  Array.from({ length: 12 }, () =>
    (Math.random() * (0.2 - 0.000001) + 0.000001).toFixed(6)
  )
)
const volumeNumberComn = ref([
  { floot: 0.002962, price: 94072.12 },
  { floot: 0.114547, price: 93921.54 },
  { floot: 0.181463, price: 93649.6 },
  { floot: 0.193482, price: 93893.36 },
  { floot: 0.07423, price: 93691.11 },
  { floot: 0.088668, price: 93714.5 },
  { floot: 0.025549, price: 93514.98 },
  { floot: 0.06526, price: 93616.32 },
  { floot: 0.12094, price: 93652.25 },
  { floot: 0.121448, price: 93578.69 },
  { floot: 0.005938, price: 93749.36 },
  { floot: 0.051894, price: 93406.74 },
  { floot: 0.154084, price: 93979.15 },
  { floot: 0.110124, price: 94291.26 },
  { floot: 0.199021, price: 94063.36 },
  { floot: 0.117849, price: 93670.27 },
  { floot: 0.065609, price: 93384.55 },
  { floot: 0.098278, price: 93722.85 },
  { floot: 0.19035, price: 93708.21 },
  { floot: 0.037081, price: 93927.33 }
])
// 補零
const onZeroNum = (price: number | string, number: number) => {
  let priceStr1 = price.toString().split('.')[0]
  let priceStr = price.toString().split('.')[1]
  priceStr.length < number
    ? (priceStr = priceStr + '0'.repeat(number - priceStr.length))
    : priceStr
  return priceStr1 + '.' + priceStr
}

const timer = ref('')
const timer2 = ref('')
const updateRandomNumbers = () => {
  timer.value = setInterval(() => {
    // 決定要更新幾個數值（例如1-4個）
    const updateCount = Math.floor(Math.random() * 4) + 1

    // 創建要更新的索引集合
    const indexesToUpdate = new Set()
    while (indexesToUpdate.size < updateCount) {
      indexesToUpdate.add(Math.floor(Math.random() * 12))
    }

    // 更新選中的索引對應的數值
    volumeNumberUp.value = volumeNumberUp.value.map((num, index) =>
      indexesToUpdate.has(index)
        ? (Math.random() * (0.2 - 0.000001) + 0.000001).toFixed(6)
        : num
    )
  }, 1000)
  timer2.value = setInterval(() => {
    // 決定要更新幾個數值（例如1-4個）
    const updateCount = Math.floor(Math.random() * 4) + 1

    // 創建要更新的索引集合
    const indexesToUpdate = new Set()
    while (indexesToUpdate.size < updateCount) {
      indexesToUpdate.add(Math.floor(Math.random() * 12))
    }

    // 更新選中的索引對應的數值
    volumeNumberNp.value = volumeNumberNp.value.map((num, index) =>
      indexesToUpdate.has(index)
        ? (Math.random() * (0.2 - 0.000001) + 0.000001).toFixed(6)
        : num
    )
  }, 1000)
}
const numberFixed = (func: Function) => {
  return func()
}
const isCreatedTime = () => {
  return Math.random() * 100
}
const SelecPopup = ref(false)
const onSelecb = () => {
  SelecPopup.value = !SelecPopup.value
  console.log('???')
}
const ckboxCk = ref('ckbox1')

const validateInput2 = () => {
  orderData.value.price = orderData.value.price.replace(/[^0-9.]/g, '')
  orderData.value.price =
    orderData.value.action == 'buy'
      ? orderData.value.price > playerWalletBalance.value
        ? playerWalletBalance.value
        : orderData.value.price
      : 0
  orderData.value.qty = (
    Number(orderData.value.price) /
    availableCurrency.value
      .find((n) => n.symbol == 'BTCUSDT')
      .price.slice(-1)[0].close
  ).toFixed(6)
}
const validateInput = () => {
  orderData.value.qty = orderData.value.qty.replace(/[^0-9.]/g, '')
  orderData.value.qty =
    Number(orderData.value.qty) > Number(maxBetQty.value)
      ? maxBetQty.value
      : orderData.value.qty
  orderData.value.price = (
    Number(orderData.value.qty) *
    availableCurrency.value
      .find((n) => n.symbol == 'BTCUSDT')
      .price.slice(-1)[0].close
  ).toFixed(2)
}

const numberBlur = () => {
  orderData.value.qty = Number(orderData.value.qty)
  if (orderData.value.qty > maxBetQty.value) {
    orderData.value.qty = maxBetQty.value
    return
  } else {
    orderData.value.qty =
      orderData.value.qty > 0
        ? (
          Number(orderData.value.price) /
          availableCurrency.value
            .find((n) => n.symbol == 'BTCUSDT')
            .price.slice(-1)[0].close
        ).toFixed(6)
        : orderData.value.qty
    return
  }
}
const onSyncQty = () => {
  orderData.value.price = Number(orderData.value.price)
  orderData.value.qty = (
    orderData.value.price /
    availableCurrency.value
      .find((n) => n.symbol == 'BTCUSDT')
      .price.slice(-1)[0].close
  ).toFixed(6)
}
const ff = ref(true)
watch(
  () => orderData.value.action,
  (nVal) => {
    console.log(nVal)
    orderData.value.qty = ''
    orderData.value.price = ''
    // ff.value = false
    // setTimeout(() => {
    //   ff.value = true
    // }, 0)
  }
)
</script>

<template>
  <div class="cont" id="Base_Member">
    <headerTop :menu="false" routerCrt="/game/perpetualcontract"
      headerW100="width:100%;padding-inline:20px;height:56px;background:#14171a" />
    <main>
      <div class="currency">
        <div class="current-currency">
          <div @click="onSelecb()">
            {{
              symbolData
                ? symbolData.label || symbolData.name || symbolData.symbol
                : ''
            }}
          </div>
          <svg t="1746602661204" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="2608" width="32" height="32">
            <path
              d="M824.32 328.96c-12.8-12.8-33.28-12.8-45.44 0L481.92 624 183.68 328.96c-12.8-12.8-33.28-12.8-45.44 0-12.8 12.16-12.8 32.64 0 45.44l317.44 314.24c1.28 1.28 1.28 3.2 2.56 4.48 12.8 12.8 33.28 12.8 45.44 0l320-318.08C837.12 362.24 837.12 341.76 824.32 328.96z"
              p-id="2609"></path>
          </svg>
          <span v-if="availableCurrency.find((n) => n.symbol == 'BTCUSDT')?.price">{{
            // Math.trunc(
            // availableCurrency
            // .find((n) => n.symbol == 'BTCUSDT')
            // .price.slice(-1)[0].close
            // )
            availableCurrency
              .find((n) => n.symbol == 'BTCUSDT')
              .price.slice(-1)[0]
              .close.toFixed(2)
          }}</span>
          <div class="current-currency-popup" :class="{ 'current-currency-popup-aitive': SelecPopup }"
            @click="onSelecb()">
            <div class="popup-box" @click.stop="">
              <div class="popup-item popup-item2">
                <h5>市場</h5>
                <h5 class="item-right mx-2">價格</h5>
                <h5 class="item-right">即時</h5>
              </div>
              <div class="popup-item" v-for="item in availableCurrency">
                <div class="item">
                  {{
                    item.symbolData.label ||
                    item.symbolData.name ||
                    item.symbolData.symbol
                  }}
                </div>

                <div class="mx-2 item item-right">
                  {{ item.price[item.price.length - 1].close }}
                </div>
                <div class="item item-right" :class="item.price[item.price.length - 1].close >
                    item.price[item.price.length - 1].open
                    ? 'up'
                    : 'down'
                  ">
                  {{
                    item.price[item.price.length - 1].close >
                      item.price[item.price.length - 1].open
                      ? '+'
                      : ''
                  }}{{
                    percentCount(
                      item.price[item.price.length - 1].close,
                      item.price[item.price.length - 1].open
                    )
                  }}%
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="current-currency-renew">
          <div class="renew-item">
            <div class="changeTit">及時</div>
            <div class="changeNum" v-if="availableCurrency.find((n) => n.symbol == 'BTCUSDT')?.price" :class="Number(
              percentCount(
                availableCurrency
                  .find((n) => n.symbol == 'BTCUSDT')
                  ?.price.slice(-1)[0].close,
                availableCurrency
                  .find((n) => n.symbol == 'BTCUSDT')
                  ?.price.slice(-1)[0].open
              )
            ) > 0
                ? 'up'
                : 'down'
              ">
              {{
                Number(
                  percentCount(
                    availableCurrency
                      .find((n) => n.symbol == 'BTCUSDT')
                      .price.slice(-1)[0].close,
                    availableCurrency
                      .find((n) => n.symbol == 'BTCUSDT')
                      .price.slice(-1)[0].open
                  )
                ) > 0
                  ? '+'
                  : ''
              }}
              {{
                percentCount(
                  availableCurrency
                    .find((n) => n.symbol == 'BTCUSDT')
                    .price.slice(-1)[0].close,
                  availableCurrency
                    .find((n) => n.symbol == 'BTCUSDT')
                    .price.slice(-1)[0].open
                )
              }}%
            </div>
          </div>
        </div>
      </div>
      <div class="inside-page">
        <div class="game-info">
          <tvWidgetGet :symbol="'BINANCE:BTCUSDT.P'" />
        </div>
        <div class="currency-data">
          <div class="currency-data-box">
            <div class="entrust-area" v-if="availableCurrency.find((n) => n.symbol == 'BTCUSDT')?.price">
              <h4>訂單表</h4>
              <ul class="buy-sell">
                <li class="text">價格</li>
                <li class="text">數量</li>
              </ul>
              <div class="entrust-sell">
                <div v-for="item in volumeNumberUp.sort((a, b) => b - a)" class="sell-item">
                  <div class="quantity-price">
                    <span class="price">{{
                      (
                        availableCurrency
                          .find((n) => n.symbol == 'BTCUSDT')
                          .price.slice(-1)[0].close *
                        (1 + percentCountNumber * item)
                      ).toFixed(2)
                    }}</span>
                    <span class="quantity">{{ item }}</span>
                  </div>
                  <div class="proportion" :style="`width:${item * 100}%`"></div>
                </div>
              </div>
              <div class="current-price" :class="availableCurrency.find((n) => n.symbol == 'BTCUSDT').price[
                  availableCurrency.find((n) => n.symbol == 'BTCUSDT').price
                    .length - 1
                ].close >
                  availableCurrency.find((n) => n.symbol == 'BTCUSDT').price[
                    availableCurrency.find((n) => n.symbol == 'BTCUSDT').price
                      .length - 1
                  ].open
                  ? 'down'
                  : 'up'
                " v-if="
                  availableCurrency.find((n) => n.symbol == 'BTCUSDT').price
                ">
                {{
                  // Math.trunc(
                  // availableCurrency
                  // .find((n) => n.symbol == 'BTCUSDT')
                  // .price.slice(-1)[0].close
                  // )
                  availableCurrency
                    .find((n) => n.symbol == 'BTCUSDT')
                    .price.slice(-1)[0]
                    .close.toFixed(2)
                }}
                <svg t="1746450332425" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="6071" v-if="
                    availableCurrency.find((n) => n.symbol == 'BTCUSDT').price[
                      availableCurrency.find((n) => n.symbol == 'BTCUSDT').price
                        .length - 1
                    ].close >
                    availableCurrency.find((n) => n.symbol == 'BTCUSDT').price[
                      availableCurrency.find((n) => n.symbol == 'BTCUSDT').price
                        .length - 1
                    ].open
                  ">
                  <path
                    d="M500.8726958 48.36230734c4.89601391-4.89601391 11.42403228-7.56656721 18.24877928-7.56656721 14.24295016 0 25.81534703 11.57239687 25.81534648 25.81534649L544.9368221 971.48349896c0 6.97311104-2.67055329 13.35276536-7.56656775 18.24877982-4.89601391 4.89601391-11.42403228 7.56656721-18.24877928 7.5665672-6.824747 0-13.35276536-2.67055329-18.24877981-7.56656774-4.89601391-4.89601391-7.56656721-11.42403228-7.56656721-18.24877928L493.23194604 66.68526917c0-6.97311104 2.74473531-13.42694738 7.64074977-18.32296183z"
                    p-id="6072" fill="#df4249"></path>
                  <path
                    d="M753.31414607 614.29702073c8.9760256-8.9760256 23.51570384-10.01457388 33.67864231-2.3738252 5.5636521 4.08001169 9.12438964 10.16293792 10.16293792 16.98768491 1.0385483 6.824747-0.7418202 13.64949399-4.82183188 19.21314609l-252.51563284 338.86351694c-0.7418202 1.0385483-1.55782243 2.00291455-2.44800723 2.89309935-8.9760256 8.9760256-23.51570384 10.01457388-33.67864177 2.37382466-5.48947008-4.1541937-9.12438964-10.16293792-10.16293792-16.98768492-1.0385483-6.824747 0.7418202-13.64949399 4.8218319-19.21314608l252.51563283-338.86351694c0.7418202-1.0385483 1.63200446-2.07709658 2.44800668-2.89309881z"
                    p-id="6073" fill="#df4249"></path>
                  <path
                    d="M248.20869838 614.37120276c0.89018425-0.89018425 1.85455052-1.70618647 2.89309935-2.44800723 5.5636521-4.08001169 12.31421708-5.78619816 19.21314609-4.82183191 6.824747 1.0385483 12.90767323 4.59928582 16.98768492 10.16293794L539.74407957 956.05363647c7.56656721 10.23711995 6.60220094 24.70261617-2.37382522 33.6786423-0.89018425 0.89018425-1.85455052 1.70618647-2.89309881 2.44800669-5.48947008 4.1541937-12.31421708 5.78619816-19.21314608 4.82183189-6.824747-1.0385483-12.90767323-4.59928582-16.98768492-10.16293792l-252.51563284-338.86351694c-7.49238518-10.16293792-6.52801891-24.62843414 2.44800668-33.60445974z"
                    p-id="6074" fill="#df4249"></path>
                </svg>
                <svg t="1746450562371" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="6224" v-else>
                  <path
                    d="M523.1273042 975.63769266c-4.89601391 4.89601391-11.42403228 7.56656721-18.24877928 7.56656721-14.24295016 0-25.81534703-11.57239687-25.81534648-25.81534649L479.0631779 52.51650104c0-6.97311104 2.67055329-13.35276536 7.56656775-18.24877982 4.89601391-4.89601391 11.42403228-7.56656721 18.24877928-7.5665672 6.824747 0 13.35276536 2.67055329 18.24877981 7.56656774 4.89601391 4.89601391 7.56656721 11.42403228 7.56656721 18.24877928L530.76805396 957.31473083c0 6.97311104-2.74473531 13.42694738-7.64074977 18.32296183z"
                    p-id="6225" fill="#276d45"></path>
                  <path
                    d="M270.68585393 409.70297927c-8.9760256 8.9760256-23.51570384 10.01457388-33.67864231 2.3738252-5.5636521-4.08001169-9.12438964-10.16293792-10.16293792-16.98768491-1.0385483-6.824747 0.7418202-13.64949399 4.82183188-19.21314609l252.51563284-338.86351694c0.7418202-1.0385483 1.55782243-2.00291455 2.44800723-2.89309935 8.9760256-8.9760256 23.51570384-10.01457388 33.67864177-2.37382466 5.48947008 4.1541937 9.12438964 10.16293792 10.16293792 16.98768492 1.0385483 6.824747-0.7418202 13.64949399-4.8218319 19.21314608l-252.51563283 338.86351694c-0.7418202 1.0385483-1.63200446 2.07709658-2.44800668 2.89309881z"
                    p-id="6226" fill="#276d45"></path>
                  <path
                    d="M775.79130162 409.62879724c-0.89018425 0.89018425-1.85455052 1.70618647-2.89309935 2.44800723-5.5636521 4.08001169-12.31421708 5.78619816-19.21314609 4.82183191-6.824747-1.0385483-12.90767323-4.59928582-16.98768492-10.16293794L484.25592043 67.94636353c-7.56656721-10.23711995-6.60220094-24.70261617 2.37382522-33.6786423 0.89018425-0.89018425 1.85455052-1.70618647 2.89309881-2.44800669 5.48947008-4.1541937 12.31421708-5.78619816 19.21314608-4.82183189 6.824747 1.0385483 12.90767323 4.59928582 16.98768492 10.16293792l252.51563284 338.86351694c7.49238518 10.16293792 6.52801891 24.62843414-2.44800668 33.60445974z"
                    p-id="6227" fill="#276d45"></path>
                </svg>
              </div>
              <div class="entrust-buy" v-if="
                availableCurrency.find((n) => n.symbol == 'BTCUSDT')?.price
              ">
                <div v-for="item in volumeNumberNp.sort((a, b) => a - b)" class="buy-item">
                  <div class="quantity-price">
                    <span class="price">{{
                      (
                        availableCurrency
                          .find((n) => n.symbol == 'BTCUSDT')
                          .price.slice(-1)[0].close *
                        (1 - percentCountNumber * item)
                      ).toFixed(2)
                    }}</span>
                    <span class="quantity">{{ item }}</span>
                  </div>
                  <div class="proportion" :style="`width:${item * 100}%`"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="entrust-area-trade">
          <div class="trade-tit">交易</div>
          <ul class="buy-sell">
            <li class="text">價格</li>
            <li class="text">數量</li>
          </ul>
          <div class="entrust-buy" v-if="availableCurrency.find((n) => n.symbol == 'BTCUSDT')?.price">
            <div v-for="(item, index) in volumeNumberComn" class="buy-item">
              <div class="quantity-price" :class="index == 2 ||
                  index == 6 ||
                  index == 7 ||
                  index == 11 ||
                  index == 18 ||
                  index == 19
                  ? 'up'
                  : 'down'
                ">
                <span class="price">{{ onZeroNum(item.price, 2) }}</span>
                <span class="quantity">{{ onZeroNum(item.floot, 6) }}</span>
              </div>
              <div class="proportion" :class="index == 2 ||
                  index == 6 ||
                  index == 7 ||
                  index == 11 ||
                  index == 18 ||
                  index == 19
                  ? 'up up-bg'
                  : 'down down-bg'
                " :style="`width:4px`"></div>
            </div>
          </div>
        </div>
        <div class="place-an-order">
          <div class="control-box">
            <div class="ckboxs">
              <div class="ckbox" :class="{ ckbox1: orderData.action == 'buy' }" @click="orderData.action = 'buy'">
                開倉
              </div>
              <div class="ckbox" :class="{ ckbox2: orderData.action == 'sell' }" @click="orderData.action = 'sell'">
                平倉
              </div>
            </div>
            <div class="available">
              <div class="available-left">可用</div>
              <div class="available-right">
                <div class="available-price">
                  ${{
                    new Intl.NumberFormat('zh-TW').format(
                      Number(playerWalletBalance)
                    )
                  }}
                  {{ 'USDT' }}
                </div>
              </div>
            </div>
            <div class="available">
              <div class="available-left">杠桿</div>
              <div class="available-right">
                <div class="right-leverage">
                  <span>x</span>
                  <div class="leverage">
                    <div class="leverage-item" @click="
                      () => {
                        leverage = 1
                      }
                    " :class="{ 'leverage-ative': leverage == 1 }">
                      1
                    </div>
                    <div class="leverage-item" @click="
                      () => {
                        leverage = 3
                      }
                    " :class="{ 'leverage-ative': leverage == 3 }">
                      3
                    </div>
                    <div class="leverage-item" @click="
                      () => {
                        leverage = 5
                      }
                    " :class="{ 'leverage-ative2': leverage == 5 }">
                      5
                    </div>
                    <div class="leverage-item" @click="
                      () => {
                        leverage = 10
                      }
                    " :class="{ 'leverage-ative2': leverage == 10 }">
                      10
                    </div>

                    <div class="leverage-item" @click="
                      () => {
                        leverage = 30
                      }
                    " :class="{ 'leverage-ative3': leverage == 30 }">
                      30
                    </div>
                    <div class="leverage-item" @click="
                      () => {
                        leverage = 50
                      }
                    " :class="{ 'leverage-ative3': leverage == 50 }">
                      50
                    </div>
                    <div class="leverage-item" @click="
                      () => {
                        leverage = 100
                      }
                    " :class="{ 'leverage-ative3': leverage == 100 }">
                      100
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="number-input">
              <input ref="number" placeholder="數量" v-model="orderData.qty" @input="validateInput"
                @blur="numberBlur()" />
              <div class="btn-group">
                {{ 'BTC' }}
              </div>
            </div>
            <div class="slider">
              <RangeSlider v-if="ff" v-model="orderData.price" :min="0"
                :max="orderData.action == 'buy' ? playerWalletBalance : 0" :step="1" @onSyncQty="onSyncQty" />
            </div>
            <div class="number-input">
              <input ref="number" placeholder="市價" @input="validateInput2" v-model="orderData.price" />
              <div class="btn-group">
                {{ '' }}
              </div>
            </div>

            <div class="submit-box">
              <div class="available">
                <div class="available-left">
                  {{ orderData.action == 'buy' ? '可開多' : '多倉持倉' }}
                </div>
                <div class="available-right">
                  <div class="available-price">
                    {{
                      // new Intl.NumberFormat('zh-TW').format(
                      // Number(playerWalletBalance)
                      // )
                      orderData.action == 'buy' ? orderData.qty : 0
                    }}
                    {{ 'BTC' }}
                  </div>
                </div>
              </div>
              <div class="submit ckbox1">
                {{ orderData.action == 'buy' ? '開多' : '平空' }}
              </div>
              <div class="available">
                <div class="available-left">
                  {{ orderData.action == 'buy' ? '可開空' : '空倉持倉' }}
                </div>
                <div class="available-right">
                  <div class="available-price">
                    {{
                      // new Intl.NumberFormat('zh-TW').format(
                      // Number(playerWalletBalance)
                      // )
                      0
                    }}
                    {{ 'BTC' }}
                  </div>
                </div>
              </div>
              <div class="submit ckbox2">
                {{ orderData.action == 'buy' ? '開空' : '平多' }}
              </div>
            </div>
          </div>
        </div>
        <div class="currency-tabs">
          <div class="link-block">
            <div class="strip" :style="{
              transform:
                selectName == '未結訂單'
                  ? 'translateX(0)'
                  : selectName == '交易歷史'
                    ? 'translateX(80px)'
                    : selectName == '餘額'
                      ? 'translateX(160px)'
                      : ''
            }"></div>
            <div class="info-item" :class="{ active: selectName == '未結訂單' }" data-toggle="modal"
              data-target=".formModal" data-type="0" @click="goSelect('未結訂單')">
              {{ $lang('未結訂單') }}
            </div>
            <div class="info-item" :class="{ active: selectName == '交易歷史' }" data-toggle="modal"
              data-target=".formModal" data-type="1" @click="goSelect('交易歷史')">
              {{ $lang('交易歷史') }}
            </div>
            <div class="info-item" :class="{ active: selectName == '餘額' }" data-toggle="modal" data-target=".formModal"
              data-type="2" @click="goSelect('餘額')">
              {{ $lang('餘額') }}
            </div>
          </div>
          <div class="currency-items"></div>
        </div>
        <div class="currency-list px-4">
          <div v-for="item in availableCurrency" :key="item.symbol" class="nav-list mr-2">
            <div class="nav-name" style="color: #ddd">
              {{
                item.symbolData.label ||
                item.symbolData.name ||
                item.symbolData.symbol
              }}
            </div>
            <span class="mx-2" :class="item.price[item.price.length - 1].close >
                item.price[item.price.length - 1].open
                ? 'up'
                : 'down'
              ">{{
                percentCount(
                  item.price[item.price.length - 1].close,
                  item.price[item.price.length - 1].open
                )
              }}%
            </span>

            <span style="color: #ddd">{{
              item.price[item.price.length - 1].close
              }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<style scoped lang="sass">
*
  box-sizing: border-box !important
.down
  color: #df4249 !important
.down-bg
  background: #df4249 !important
.up
  color: #00a35a !important
.up-bg
  background: #00a35a !important
.cont
  height: 100dvh
  width: 100dvw
  overflow: hidden
  background: #14171a
  color: #fff
  font-size: 14px
  @media (max-width:992px)
    overflow-y: scroll
main
  height: 100%
  padding-block-start: 56px
  .currency
    display: flex
    align-items: center
    padding: 8px 12px
    border-block-start: 2px solid rgba(255, 255, 255, .2)
    border-block-end: 1px solid rgba(255, 255, 255, .2)
    .current-currency
      color: rgb(115, 84, 255)
      font-weight: 600
      font-size: 12px
      display: flex
      align-items: center
      span
        color: #fff
        font-size: 14px
        margin-left: 8px
      .icon
        width: 14px
        height: 14px
        fill: rgb(115, 84, 255)
      .current-currency-popup-aitive
        display: block !important
      .current-currency-popup
        position: fixed
        font-weight: 400
        top: 0
        bottom: 0
        left: 0
        right: 0
        width: 100%
        height: 100%
        z-index: 99
        padding-top: 56px
        display: none
        transition: all .3s

        .popup-box
          height: 56dvh
          width: 360px
          border-radius: 5px
          padding-block-end: 10px
          overflow-y: scroll
          background: #25282a
          box-shadow: 0 0 5px 0 rgba(255, 255, 255, .1)
          // @media (max-width: 768px)
          //   width: 100%
          .popup-item
            display: grid
            grid-template-columns: 33% 37% 30%
            height: 30px
            padding: 0 20px
            border-block-end: 1px solid #1c1f21
            align-items: center
            cursor: not-allowed
            &:hover
              background: #343739
            h5
              font-size: .75rem
              color:#808285
            .item
              color: #fff
            .item-right
              text-align: right
          .popup-item2
            position: sticky
            top: 0
            background: #25282a
            z-index: 2
            &:hover
              background: #25282a
    .current-currency-renew
      display: flex
      padding-left: 14px
      .renew-item
        padding-left: 10px
        .changeTit
          color: #939598
          font-size: 11px
        .changeNum
          font-size: 12px
          line-height: 16px
          font-weight: 600
.inside-page
  flex: 1
  display: grid
  grid-template-columns: minmax(auto, calc(100vw - 600px)) 300px 300px
  grid-template-rows: auto 33.333333%
  height: calc( 100% - 52.5px)
  padding-block-end: 32px
  @media (max-width:992px)
    display: flex
    flex-wrap: wrap
    width: 100%
  .game-info
    grid-column: 1 / 2
    grid-row: 1 / 2
    @media (max-width: 992px)
      width: 100%
      height: 40%
  .buy-sell
    display: flex
    justify-content: space-between
    align-items: center
    padding: 2px 8px
    font-size: 12px
    color: #999
    border-block:2px solid rgba(255, 255, 255, .1)
    position: sticky
    top:2.5rem
    background: #14171a
    z-index: 2
  .currency-data
    overflow-y: auto
    height: calc( 100% * 2 / 3  )
    border-inline-start: 1px solid rgba(255, 255, 255, .2)
    grid-column: 2 / 3
    grid-row: 1 / 3
    @media (max-width: 992px)
      width: 50%
      height: auto
    .currency-data-box
      height: 100%
    .entrust-area
      position: relative
      top: 0
      height: 100%
      h4
        position: sticky
        top: 0
        background: #14171a
        z-index: 2
        font-size: 1rem
        font-weight: 600
        padding:0 8px
        line-height: 40px
        height: 40px
        border-block-start: 1px solid rgba(255, 255, 255, .2)
        border-block-end: 1px solid rgba(255, 255, 255, .1)
      .current-price
        height: 36px
        line-height: 36px
        border-block:1px dashed rgba(255, 255, 255, .1)
        font-size: 1rem
        font-weight: 600
        padding-inline: 8px
        display: flex
        align-items: center
        .icon
          width: 13px
          height: 13px
          margin-left: 3px
      .entrust-buy,.entrust-sell
        width: 100%
        line-height: 16px

  .quantity-price
    height: 1rem
    margin: 1px 0
    padding:3px 8px
    font-size: .75rem
    display: flex
    justify-content: space-between
    align-items: center
    transition: all 0.15s cubic-bezier(0.645, 0.045, 0.355, 1)
    &:hover
      background: rgba(255, 255, 255, .1)
  .entrust-buy
    color: #276d45
    .proportion
      position: absolute
      bottom: 0
      left: 0
      top: 0
      background: #276d4545
      transition: all 0.5s
  .entrust-sell
    color: #df4249
    .proportion
      position: absolute
      bottom: 0
      left: 0
      top: 0
      background: #df424945
      transition: all 0.5s
  .entrust-area-trade
    background: #14171a
    grid-column: 2 / 3
    grid-row: 2 / 3
    position: relative
    overflow-y: auto
    @media (max-width: 1200px)
      display: none
    .buy-sell
      border-block-start: 2px solid rgba(255, 255, 255, .2)
      position: sticky
      top:2.5rem
      background: #14171a
      z-index: 2
    .trade-tit
      position: sticky
      top: 0
      z-index: 2
      background: #14171a
      height: 40px
      line-height: 38px
      border-block-start: 2px solid rgba(255, 255, 255, .2)
      padding: 0 8px
    .entrust-buy
      padding-left: 1px
  .place-an-order
    border-block-start: 1px solid rgba(255, 255, 255, .2)
    border-inline-start: 2px solid rgba(255, 255, 255, .2)
    grid-row: 1 / 3
    background: #14171a
    @media (max-width: 992px)
      width: 50%
    .control-box
      padding: 16px 16px 0
      @media (max-width: 992px)
        padding: 8px 8px 0
      .ckboxs
        display: grid
        grid-template-columns: 1fr 1fr
        border-radius: 5px
        overflow: hidden
        background: rgba(37, 40, 42, .5)
        border: 1px solid rgba(255, 255, 255, .2)
        margin-bottom: 10px
        @media (max-width: 992px)
          margin-bottom: 5px
        .ckbox
          text-align: center
          line-height: 28px
          color: #939598
          transition: all .3s ease
          &:hover
            background: rgba(255, 255, 255, .2)
    .ckbox1
      color:#fff !important
      background: #00a35a !important
    .ckbox2
      color:#fff !important
      background: #df4249 !important
    .submit-box
      margin-top: 12px
    .submit
      margin-top: 12px
      margin-bottom: 12px
      height: 40px
      border-radius: 10px
      line-height: 40px
      text-align: center
      filter: brightness(.8)
      &:hover
        filter: brightness(1)

  .currency-tabs
    background: #14171a
    position: relative
    border-block-start: 2px solid rgba(255, 255, 255, .2)
    border-inline-end: 1px solid rgba(255, 255, 255, .2)
    grid-column: 1 / 2
    grid-row: 2 / 3
    overflow-y: scroll
    @media (max-width: 1200px)
      grid-column: 1 / 3
      grid-row: 2 / 3
    @media (max-width: 992px)
      width: 100%
    .link-block
      background: #14171a
      border-block-end: 2px solid rgba(255, 255, 255, .2)
      position: sticky
      top: 0
      z-index: 2
      display: flex
      line-height: 38px
      .strip
        position: absolute
        bottom: -2px
        width: 80px
        height: 2px
        background: #fff
        transition: all .3s ease-in-out
      .info-item
        min-width: 5rem
        color: #939598
        text-align: center
        padding: 0 12px
        transition: all .3s ease-in-out
        white-space: nowrap
      .info-item.active
        color: #fff
    .currency-items
      min-height: 200px
  .currency-list
    background: #14171a
    position: absolute
    bottom: 0
    width: 100%
    height: 32px
    border-block-start: 2px solid rgba(255, 255, 255, .2)
    display: flex
    align-items: center
    overflow-x: scroll
    @media (max-width: 992px)
      position: relative
      bottom: 0
    .nav-list
      display: flex
      white-space: nowrap
.price-inout
  margin-top: 10px
  border-radius: 8px
  background: #FFFFFF22
  padding: 10px
  cursor: pointer

  // .title
  //   font-size: 14px
  input
    width: 100%
    background: transparent
.number-input
  margin-top: 10px
  border-radius: 8px
  background: #FFFFFF22
  padding: 10px
  display: flex
  align-items: center
  cursor: pointer
  box-sizing: border-box
  height: 41px
  border: 1px solid #ffffff00
  transition: all .2s ease-in-out
  @media (max-width: 992px)
    margin-top: 4px
  &:hover
    border: 1px solid #ffffff88
  input
    width: 100%
    background: transparent

  .btn-group
    display: flex
    align-items: center
    margin-left: 3px
    color: #939598
    .icon
      width: 10px
      height: 10px
      margin-left: 3px
.available
  display: flex
  align-items: center
  margin-top: 2px
  font-size: 14px

  .available-left
    display: flex
    color: #ffffff88
    line-height: 16px
    margin-right: 10px
    white-space: nowrap
    word-wrap: normal
  .available-right
    display: flex
    align-items: center
    justify-content: center
    color: rgba(255,255 ,255 , .9)
    .icon
      width: 15px
      height: 15px
      margin-left: 3px
    .right-leverage
      display: grid
      align-items: center
      grid-template-columns: 8px 1fr
      margin-block: 5px
      span
        font-size: 12px
        line-height: 12px
        color: #ddd
        white-space: nowrap
        word-wrap: normal
      .leverage
        display: grid
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr
        @media (max-width: 768px)
          grid-template-columns: 1fr 1fr 1fr 1fr
        @media (max-width: 414px)
          grid-template-columns: 1fr 1fr 1fr
        .leverage-item
          min-width: 26px
          background: #25282a
          padding-inline: 3px
          border-radius:4px
          margin-inline: 2px
          margin-bottom: 2px
          text-align: center
          transition: all .3s ease
          cursor: pointer
          &:hover
            background: #888
        .leverage-ative
          background: #00a35a  !important
        .leverage-ative2
          background: #f3b167  !important
        .leverage-ative3
          background: #df4249  !important
.trading
  display: block
  .trading-open,.trading-close
    transition: all .3s ease-in-out
    .trading-btn
      width: 100%
      margin-block: 10px
      padding-block: 8px
      border-radius: 25px
      background: #26a64f
      display: flex
      align-items: center
      justify-content: center
  .trading-close .trading-btn
    background: #ca3f66
</style>
