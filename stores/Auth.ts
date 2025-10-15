import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'
export const useAuthStore = defineStore('auth', () => {
  const nuxtapp = useNuxtApp()
  const { t } = nuxtapp.$i18n
  const config = useRuntimeConfig()
  const { siteId } = config.public
  const { api: $API } = useApi()
  const router = useRouter()
  const accessToken = useCookie('accessToken', {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  }) as any
  const referrerCodeCookiee = useCookie('referrerCode', {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  }) as any
  const getAccessToken = () => {
    const localStorageToken = ref(null)
    if (process.client) {
      localStorageToken.value = localStorage.getItem('accessToken')
    }
    // console.log('get localStorageToken', localStorageToken.value)
    // console.log('get useCookie', accessToken.value)
    return localStorageToken.value || accessToken.value
  }
  const checkAccessToken = async (_accessToken: String) => {
    try {
      if (process.client) {
        const res: any = await $API(`/token/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: _accessToken || getAccessToken()
          }
        })
        if (res.statusCode !== 200) {
          res.statusCode === 400
            ? null
            : ElNotification({
                title: `${t('權限失效')}`,
                message: `${t(res.message)}`,
                showClose: false
              })
          return false
        }
        return true
      } else {
        return true
      }
    } catch (error: any) {
      console.log('checkAccessToken error : ', error)
      return false
    }
  }
  const setAccessToken = (token: string) => {
    if (token) {
      accessToken.value = token
      if (process.client) {
        localStorage.setItem('accessToken', token)
      }
    } else {
      accessToken.value = null
      if (process.client) {
        localStorage.removeItem('accessToken')
      }
      console.log('權限失效 setAccessToken')
      router.push('/login')
    }
  }
  const signup = async (params: any) => {
    try {
      ElMessage({
        message: `${t('註冊中...')}`,
        type: 'info'
      })
      const res: any = await $API('/authorize/signup', {
        method: 'POST',
        body: JSON.stringify({
          siteId,
          ...params
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.statusCode !== 200) {
        ElMessage.error(`${t(res.message)}`)
        return {
          success: false
        }
      }
      ElMessage.success(`${t('註冊成功')}`)
      await signin({
        account: params.account,
        password: params.password
      })
      return {
        success: true
      }
    } catch (error: any) {
      console.log('Signup error : ', error)
      // ElNotification({
      //   title: `${t('註冊失敗')}`,
      //   message: error.toString(),
      //   showClose: false
      // })
      return {
        success: false
      }
    }
  }
  const signin = async (params: any) => {
    try {
      ElMessage({
        message: `${t('登入中...')}`,
        type: 'info',
        duration: 500
      })
      const res: any = await $API('/authorize/signin', {
        method: 'POST',
        body: JSON.stringify({
          siteId,
          ...params
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(`signin : `, res)
      if (res.statusCode !== 200) {
        // res.statusCode === 400
        //   ? null
        //   : ElMessage.error(
        //       res.message == '請聯繫客服' ? `${t('帳號異常')}` : res.message
        //     )
        if (res.statusCode === 401) {
          if (res.message == '請聯繫客服') {
            navigateTo('/error')
          } else {
            ElMessage.error(res.message)
          }
          console.log(res.message, 'res.message')
        }
        return {
          success: false
        }
      }
      ElMessage.success(`${t('登入成功')}`)
      accessToken.value = res.data.token
      referrerCodeCookiee.value = null
      if (process.client) {
        localStorage.setItem('accessToken', res.data.token)
      }
      if (res.data?.redirectUrl) return navigateTo(res.data.redirectUrl)
      return {
        success: true
      }
    } catch (error: any) {
      console.log('Signin error : ', error)
      // ElNotification({
      //   title: `${t('登入失敗')}`,
      //   message: error.toString(),
      //   showClose: false
      // })
      return {
        success: false
      }
    }
  }
  const isLogin = () => {
    const localStorageToken = ref(null)
    if (process.client) {
      localStorageToken.value = localStorage.getItem('accessToken')
    }
    return !!accessToken.value || !!localStorageToken.value
  }
  const signout = () => {
    setAccessToken('')
    ElNotification({
      title: `${t('登出成功')}`,
      showClose: false,
      duration: 1500
    })
  }

  return {
    accessToken,
    checkAccessToken,
    setAccessToken,
    getAccessToken,
    signup,
    signin,
    isLogin,
    signout
  }
})
