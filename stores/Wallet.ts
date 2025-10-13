// wallet store : withdraw, deposit
import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'

export const useWalletStore = defineStore('wallet', () => {
  const nuxtapp = useNuxtApp()
  const { t } = nuxtapp.$i18n
  const { api: $API } = useApi()
  const { getAccessToken } = useAuthStore()
  const playerStore = usePlayerStore()
  const withdrawRecords = ref([])
  const depositRecords = ref([])
  const queryWalletLog = async (params: any) => {
    try {
      const res: any = await $API(`/wallet/log/query`, {
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
              title: `${t('查詢交易紀錄')}`,
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
      console.log(`query queryWalletLog error: `, error)
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const queryWithdrawRecord = async (params: any) => {
    try {
      const res: any = await $API(`/withdraw/query`, {
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
              title: `${t('查詢提款紀錄')}`,
              showClose: false,
              message: `${t(res.message)}`
            })
        withdrawRecords.value = []
        return {
          success: false,
          message: `${t(res.message)}`
        }
      }
      withdrawRecords.value = res.data
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`query withdraw record error: `, error)
      // ElNotification({
      //   title: `${t('查詢提款紀錄錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const queryTransferRecord = async (params: any) => {
    try {
      const res: any = await $API(`/uswap/query`, {
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
              title: `${t('查詢劃轉紀錄')}`,
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
      console.log(`query withdraw record error: `, error)
      // ElNotification({
      //   title: `${t('查詢提款紀錄錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const queryDepositRecords = async (params: any) => {
    try {
      const res: any = await $API(`/deposit/query`, {
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
              title: `${t('存款失敗')}`,
              showClose: false,
              message: `${t(res.message)}`
            })
        depositRecords.value = []
        return {
          success: false,
          message: `${t(res.message)}`
        }
      }
      depositRecords.value = res.data
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`deposit error: `, error)
      // ElNotification({
      //   title: `${t('存款錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const withdraw = async (params: any) => {
    try {
      const res: any = await $API(`/withdraw`, {
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
              title: `${t('提款失敗')}`,
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
      console.log(`withdraw error: `, error)
      // ElNotification({
      //   title: `${t('提款錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const transfer = async (params: any) => {
    try {
      const res: any = await $API(`/uswap`, {
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
              title: `${t('轉帳失敗')}`,
              showClose: false,
              message: `${t(res.message)}`
            })
        return {
          success: false,
          message: res.message
        }
      }
      return {
        success: true,
        data: res.data,
        message: res.message
      }
    } catch (error: any) {
      console.log(`transfer error: `, error)
      // ElNotification({
      //   title: `${t('提款錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const deeplink = async (params: any) => {
    try {
      const res: any = await $API(`/usdt/deeplink`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        },
        params
      })
      if (res.statusCode !== 200) {
        res.statusCode === 400
          ? null
          : ElNotification({
              title: `${t('授權失敗')}`,
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
      console.log(`withdraw error: `, error)
      // ElNotification({
      //   title: `${t('提款錯誤')}`,
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
    withdrawRecords,
    depositRecords,
    queryWithdrawRecord,
    queryTransferRecord,
    withdraw,
    transfer,
    queryDepositRecords,
    deeplink,
    queryWalletLog
  }
})
