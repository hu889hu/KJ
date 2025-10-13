// transaction store
import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'

export const useTransactionStore = defineStore('transaction', () => {
  const nuxtapp = useNuxtApp()
  const { t } = nuxtapp.$i18n
  const { api: $API } = useApi()
  const { getAccessToken } = useAuthStore()
  const transactions = ref([])
  const queryTransaction = async (params: any) => {
    try {
      const res: any = await $API(`/transaction/query`, {
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
              title: `${t('查詢交易')}`,
              showClose: false,
              message: `${t(res.message)}`
            })
        return {
          success: false,
          message: `${t(res.message)}`
        }
      }
      transactions.value = res.data
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`fetch transaction error: `, error)
      // ElNotification({
      //   title: `${t('獲取交易錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const createTransaction = async (params: any) => {
    try {
      const res: any = await $API(`/transaction`, {
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
              title: `${t('建立交易失敗')}`,
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
      console.log(`create transaction error: `, error)
      // ElNotification({
      //   title: `${t('建立交易錯誤')}`,
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
    transactions,
    queryTransaction,
    createTransaction
  }
})
