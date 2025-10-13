import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'
export const useOrderStore = defineStore('order', () => {
  const nuxtapp = useNuxtApp()
  const { t } = nuxtapp.$i18n
  const { api: $API } = useApi()
  const { getAccessToken, setAccessToken } = useAuthStore()
  const orders = ref([])
  const queryOrder = async (params: any) => {
    try {
      const res: any = await $API(`/order/query`, {
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
      const res: any = await $API(`/power/bet`, {
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
            title: `${t('下單失敗')}`,
            type: 'error',
            showClose: false,
            message: `${t(res.data.message)}`
          })
          message = `${t(res.data.message)}`
        }
        if (res.statusCode === 401) {
          ElNotification({
            title: `${t('下單失敗')}`,
            type: 'error',
            showClose: false,
            message: `${t('請確認網路連線')}`
          })
          message = `${t('請確認網路連線')}`
        }
        return {
          success: false,
          message: message
        }
      }
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`post player bet error: `, error)
      ElNotification({
        title: `${t('下單錯誤')}`,
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
    orders,
    queryOrder,
    bet
  }
})
