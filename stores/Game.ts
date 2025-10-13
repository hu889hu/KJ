// game pages store
import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'

export const useGameStore = defineStore('gamePages', () => {
  const nuxtapp = useNuxtApp()
  const { t } = nuxtapp.$i18n
  const { api: $API } = useApi()
  const { getAccessToken } = useAuthStore()
  const rounds = ref([])
  const queryGameserviceLink = ref('')
  const queryRounds = async (params: any) => {
    try {
      const res: any = await $API(`/bp/round/query`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        }
      })
      if (res.statusCode !== 200) {
        res.statusCode === 400
          ? null
          : ElNotification({
              title: `${t('查詢局數')}`,
              showClose: false,
              message: `${t(res.message)}`
            })
        return {
          success: false,
          message: `${t(res.message)}`
        }
      }
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`fetch rounds error: `, error)
      // ElNotification({
      //   title: `${t('獲取局數錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const klines = ref([])
  const queryKlines = async (params: any) => {
    try {
      const res: any = await $API(`/bp/kline/query`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        }
      })
      if (res.statusCode !== 200) {
        res.statusCode === 400
          ? null
          : ElNotification({
              title: `${t('查詢K線')}`,
              showClose: false,
              message: `${t(res.message)}`
            })
        return {
          success: false,
          message: `${t(res.message)}`
        }
      }
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`fetch klines error: `, error)
      // ElNotification({
      //   title: `${t('獲取K線錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const queryGameservice = async (params: any) => {
    try {
      const res: any = await $API(`/gameservice/login`, {
        method: 'POST',
        body: {
          service: 'caipiao'
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        }
      })
      // console.log('queryGameservice', res)
      if (res.statusCode !== 200) {
        res.statusCode === 400
          ? null
          : ElNotification({
              title: `${t('獲取彩票')}`,
              showClose: false,
              message: `${t(res.message)}`
            })
        return {
          success: false,
          message: `${t(res.message)}`
        }
      } else {
        queryGameserviceLink.value = res.data
      }
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`queryGameservice error: `, error)
      // ElNotification({
      //   title: `${t('獲取彩票錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const gameserviceTransfer = async (params: any) => {
    try {
      const res: any = await $API(`/gameservice/transfer`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        }
      })
      console.log('gameserviceTransfer', res)
      if (res.statusCode !== 200) {
        res.statusCode === 400
          ? null
          : ElNotification({
              title: `${t('遊戲轉點')}`,
              showClose: false,
              message: `${t(res.message)}`
            })
        return {
          success: false,
          message: `${t(res.message)}`
        }
      } else {
        ElNotification({
          title: `${t('轉點成功')}`,
          showClose: true
        })
        return {
          success: true,
          data: res.data
        }
      }
    } catch (error: any) {
      console.log(`gameserviceTransfer error: `, error)
      // ElNotification({
      //   title: `${t('遊戲轉點錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const orders = ref([])
  const queryOrder = async (params: any) => {
    try {
      const res: any = await $API(`/bp/order/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        },
        body: JSON.stringify(params)
      })
      if (res.statusCode !== 200) {
        res.statusCode === 400
          ? null
          : ElNotification({
              title: `${t('查詢訂單紀錄')}`,
              showClose: false,
              message: `${t(res.message)}`
            })
        return {
          success: false,
          message: `${t(res.message)}`
        }
      }
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`fetch player order error: `, error)
      // ElNotification({
      //   title: `${t('獲取訂單紀錄錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const bet = async (params: any) => {
    try {
      const res: any = await $API(`/bp/bet`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        }
      })
      if (res.statusCode !== 200) {
        let message = ''
        if (res.statusCode === 400) {
          ElNotification({
            title: `${t('下注失敗')}`,
            type: 'error',
            showClose: false,
            message: `${t(res.data.message)}`
          })
          message = `${t(res.data.message)}`
        }
        if (res.statusCode === 401) {
          ElNotification({
            title: `${t('下注失敗')}`,
            type: 'error',
            showClose: false,
            message: `${t(res.data.message)}`
          })
          message = `${t(res.data.message)}`
        }
        return {
          success: false,
          message
        }
      }
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`post player bet error: `, error)
      ElNotification({
        title: `${t('下注錯誤')}`,
        showClose: false,
        message: error.toString()
      })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  return {
    rounds,
    queryRounds,
    klines,
    queryKlines,
    queryGameservice,
    queryGameserviceLink,
    gameserviceTransfer,
    orders,
    queryOrder,
    bet
  }
})
