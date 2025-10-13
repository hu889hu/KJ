import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'
export const usePlayerStore = defineStore('player', () => {
  const nuxtapp = useNuxtApp()
  const { t } = nuxtapp.$i18n
  const config = useRuntimeConfig()
  const { siteId } = config.public
  const { api: $API } = useApi()
  const { getAccessToken, setAccessToken } = useAuthStore()
  const playerInfo = ref(null)
  const listenkey = ref(null)
  const router = useRouter()
  const fetchInfo = async () => {
    try {
      const res: any = await $API(`/player`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        }
      })
      if (res.statusCode !== 200) {
        // res.statusCode === 400
        //   ? null
        //   : ElNotification({
        //       title: `${t('查無用戶')}`,
        //       showClose: false,
        //       message: `${t(res.message)}`
        //     })
        return {
          success: false,
          message: `${t(res.message)}`
        }
      }
      playerInfo.value = res.data.data
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`fetch player info error: `, error)
      // ElNotification({
      //   title: `${t('獲取玩家訊息錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const updateInfo = async (params: any) => {
    try {
      const res: any = await $API(`/player`, {
        method: 'PUT',
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
              title: `${t('更新用戶資訊失敗')}`,
              showClose: false,
              message: `${t(res.message)}`
            })
        return {
          success: false,
          message: `${t(res.message)}`
        }
      }
      ElNotification({
        title: `${t('更新用戶資訊成功')}`,
        showClose: false
      })
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`update player info error: `, error)
      // ElNotification({
      //   title: `${t('更新玩家訊息錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const updatePassword = async (params: any) => {
    try {
      const res: any = await $API(`/password`, {
        method: 'PUT',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        }
      })
      console.log('res : ', res)
      if (res.statusCode !== 200) {
        res.statusCode === 400
          ? null
          : ElNotification({
              title: `${t('密碼更新失敗')}`,
              message: `${t(res.message)}`,
              showClose: false
            })
        return {
          success: false
        }
      }
      ElNotification({
        title: `${t('密碼更新成功')}`,
        showClose: false,
        type: 'success',
        duration: 1000
      })
      return {
        success: true
      }
    } catch (error: any) {
      console.log('updatePassword error : ', error)
      // ElNotification({
      //   title: `${t('查無用戶')}`,
      //   message: error.toString(),
      //   showClose: false
      // })
      return {
        success: false
      }
    }
  }
  const updateTrasactionPassword = async (params: any) => {
    try {
      const res: any = await $API(`/password/transaction`, {
        method: 'PUT',
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
              title: `${t('交易密碼更新失敗')}`,
              message: `${t(res.message)}`,
              showClose: false
            })
        return {
          success: false
        }
      }
      ElNotification({
        title: `${t('交易密碼更新成功')}`,
        showClose: false,
        type: 'success',
        duration: 1000
      })
      return {
        success: true
      }
    } catch (error: any) {
      console.log('updateTrasactionPassword error : ', error)
      // ElNotification({
      //   title: `${t('交易密碼更新失敗')}`,
      //   message: error.toString(),
      //   showClose: false
      // })
      return {
        success: false
      }
    }
  }
  const bankApply = async (params: any) => {
    try {
      console.log('params : ', params)
      const res: any = await $API(`/bankapply`, {
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
              title: `${t('申請銀行認證失敗')}`,
              message: `${t(res.message)}`,
              showClose: false
            })
        return {
          success: false
        }
      }
      ElNotification({
        title: `${t('申請銀行認證成功')}`,
        showClose: false
      })
      return {
        success: true
      }
    } catch (error: any) {
      console.log('applyBank error : ', error)
      // ElNotification({
      //   title: `${t('申請銀行認證失敗')}`,
      //   message: error.toString(),
      //   showClose: false
      // })
      return {
        success: false
      }
    }
  }
  const getListenkey = async () => {
    try {
      const res: any = await $API(`/token/listenkey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        }
      })
      if (res.statusCode !== 200) {
        // ElNotification({
        //   title: `${t('獲取listenkey失敗')}`,
        //   message: `${t(res.message)}`,
        //   showClose: false
        // })
        listenkey.value = null
        return {
          success: false
        }
      }
      listenkey.value = res.data
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log('getLinstenkey error : ', error)
      // ElNotification({
      //   title: `${t('獲取listenkey失敗')}`,
      //   message: error.toString(),
      //   showClose: false
      // })
      return {
        success: false
      }
    }
  }
  return {
    playerInfo,
    listenkey,
    // method
    fetchInfo,
    updateInfo,
    updatePassword,
    updateTrasactionPassword,
    bankApply,
    getListenkey
  }
})
