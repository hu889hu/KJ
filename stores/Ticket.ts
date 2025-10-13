// message store
import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'

export const useTicketStore = defineStore('ticket', () => {
  const nuxtapp = useNuxtApp()
  const { t } = nuxtapp.$i18n
  const { api: $API } = useApi()
  const { getAccessToken } = useAuthStore()
  const tickets = ref([])
  const queryTicket = async () => {
    const timestamp = 1704067200000
    const date = new Date(timestamp)
    try {
      const res: any = await $API(`/ticket/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        },
        body: JSON.stringify({
          dateRangeStart: date
        })
      })
      if (res.statusCode !== 200) {
        return {
          success: false
        }
      }
      tickets.value = res.data.result
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`fetch message error: `, error)
      // ElNotification({
      //   title: `${t('獲取訊息錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const createTicket = async (params: any) => {
    try {
      const res: any = await $API(`/ticket`, {
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
              title: `${t('建立訊息失敗')}`,
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
      console.log(`create message error: `, error)
      // ElNotification({
      //   title: `${t('建立訊息錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const read = async (params: any) => {
    try {
      const res: any = await $API(`/ticket/read`, {
        method: 'PATCH',
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
              title: `${t('訊息已讀失敗')}`,
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
      console.log(`read message error: `, error)
      // ElNotification({
      //   title: `${t('訊息已讀錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const reply = async (params: any) => {
    try {
      const res: any = await $API(`/ticket/reply`, {
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
              title: `${t('回覆訊息失敗')}`,
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
      console.log(`reply message error: `, error)
      // ElNotification({
      //   title: `${t('回覆訊息錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  return {
    tickets,
    createTicket,
    queryTicket,
    read,
    reply
  }
})
