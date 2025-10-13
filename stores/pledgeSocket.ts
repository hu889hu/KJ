import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'
export const usePledgeSocketStore = defineStore('socket', () => {
  const ordersData = ref([])
  const newOrderData = ref({})
  const insertOrder = (data: any) => {
    newOrderData.value = data
    console.log('socket pong newOrderData: ', newOrderData.value)
    // notification new length of orders
    // ElNotification({
    //   title: '新訂單',
    //   message: `新訂單數量: ${data.length}`,
    //   type: 'success'
    // })
  }
  const updateOrders = (data: any) => {
    ordersData.value = data
    // notification new length of orders
    // ElNotification({
    //   title: '訂單更新',
    //   message: `更新訂單數量: ${data.length}`,
    //   type: 'success',
    //   duration: 1000
    // })
  }

  const productData = ref([])
  const updateProduct = (data: any) => {
    productData.value = data
  }

  const walletLogData = ref([])
  const updateWalletLog = (data: any) => {
    walletLogData.value = data
  }

  const walletData = ref({})
  const updateWallet = (data: any) => {
    walletData.value = data
  }

  const serverTimeInfo = reactive({
    serverTime: Date.now(),
    allowBetRoundId: '',
    allowBetRoundCountdown: 60,
    currentRoundId: '',
    currentRoundCountdown: 60
  })
  const updateServerTime = (data: any) => {
    // console.log('socket pong serverTimeInfo: ', data)
    serverTimeInfo.serverTime = data.serverTime
    serverTimeInfo.allowBetRoundId = data.allowBetRoundId
    serverTimeInfo.allowBetRoundCountdown = data.allowBetRoundCountdown
    serverTimeInfo.currentRoundId = data.currentRoundId
    serverTimeInfo.currentRoundCountdown = data.currentRoundCountdown
  }

  // game socket
  const { getListenkey } = usePlayerStore()
  const socket: any = ref(null)
  const socketConnected = ref(false)
  const isFirstGet = ref(false)
  const reconnected = ref(true)
  const closeWebSocket = async () => {
    if (socket.value) {
      reconnected.value = false
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
      const { PLEDGESOCKETURL } = runtimeConfig.public
      socket.value = new WebSocket(
        `${PLEDGESOCKETURL}/${getListenkeyRes.data.listenkey}`
      )
      socket.value.onopen = (event) => {
        console.log('Connected to socket', event)
        socketConnected.value = true
        sendMessage({
          op: 'subscribe',
          channel: ['product', 'order', 'wallet']
        })
      }
      socket.value.onmessage = async (e) => {
        const message = JSON.parse(e.data)
        // console.log('收到來自 socket 的訊息', message)
        const { event, data } = message
        switch (event) {
          case 'SERVER_TIME': {
            updateServerTime(data)
            break
          }
          default:
            break
        }
        switch (event) {
          case 'WALLETLOG_UPDATE': {
            const walletLogData = data.result.sort((a, b) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              )
            })
            updateWalletLog(walletLogData)
            break
          }
          default:
            break
        }
        switch (event) {
          case 'WALLET_UPDATE': {
            updateWallet(data)
            break
          }
          default:
            break
        }
        switch (event) {
          case 'PRODUCT_UPDATE': {
            const productData = data.result.sort((a, b) => {
              return new Date(b.sort).getTime() - new Date(a.sort).getTime()
            })
            updateProduct(productData)
            break
          }
          default:
            break
        }
        switch (event) {
          case 'ORDER_UPDATE': {
            const orderData = data.result.sort((a, b) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              )
            })
            updateOrders(orderData)
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
          setTimeout(async () => {
            await startConnectWebSocket()
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

  return {
    ordersData,
    newOrderData,
    insertOrder,
    updateOrders,
    serverTimeInfo,
    updateServerTime,
    productData,
    updateProduct,
    walletLogData,
    updateWalletLog,
    walletData,
    updateWallet,
    startConnectWebSocket,
    closeWebSocket
  }
})
