export const useApi = () => {
  // package $fetch method
  const runtimeConfig = useRuntimeConfig()
  const { APIBASE } = runtimeConfig.public
  const router = useRouter()
  const authStore = useAuthStore()
  const nuxtapp = useNuxtApp()
  const { t } = nuxtapp.$i18n
  const checkLoading = (value: any) => {
    if (value.includes('/twstock/product/stock/query')) {
      return true
    } else {
      const urlList = ['/token/verify', '/ticket/query']
      return urlList.includes(value)
    }
  }
  const checkV2 = (value: any) => {
    const urlList = ['/game/power/order/query']
    return urlList.includes(value)
  }
  return {
    api: async (url: string, options: any) => {
      const accessTokenVerifyUrl = url.includes('/token/verify')
      const loading = accessTokenVerifyUrl
        ? null
        : router.currentRoute.value.name === 'game'
          ? null
          : checkLoading(url)
            ? null
            : ElLoading.service({
                lock: true,
                background: 'rgba(0, 0, 0, 0.6)'
              })
      const checkAPIBASE = checkV2(url) ? APIBASE : `${APIBASE}/v2`
      try {
        const response: any = await $fetch(`${checkAPIBASE}${url}`, {
          ...options
        })
        if (!checkLoading(url)) {
          console.log(`[Call API] ${url} response : `, response)
        }
        const { statusCode, data, message } = response
        // statusCode is 40x then show error message and navigate to /
        if ([402, 404, 409].includes(statusCode)) {
          if (process.client) loading?.close()
          response.message = `${t('請重新登入')}`
          authStore.setAccessToken('')
        } else {
          if (process.client) loading?.close()
        }
        return response
      } catch (error: any) {
        console.log(`API error : `, error.toString())
        if (process.client) loading?.close()
        return {
          statusCode: 400,
          message: `連線失敗, 請重新整理`
        }
      }
    }
  }
}
