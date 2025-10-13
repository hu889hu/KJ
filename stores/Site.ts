// news store
import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'
import { Body } from '#build/components'

export const useSiteStore = defineStore('site', () => {
  const nuxtapp = useNuxtApp()
  const { t } = nuxtapp.$i18n
  const config = useRuntimeConfig()
  const { siteId } = config.public
  const { api: $API } = useApi()
  const { getAccessToken, setAccessToken } = useAuthStore()
  const siteData = ref({
    logo: ''
  })
  const news = ref(null)
  const campaign = ref([])
  const chatbox = ref(null)
  const referrerCodeCookiee = useCookie('referrerCode', {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  }) as any
  const queryInfo = async () => {
    try {
      const res: any = await $API(`/site/?siteId=${siteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.statusCode !== 200) {
        res.statusCode === 400
          ? null
          : ElNotification({
              title: `${t('查詢站點資訊')}`,
              showClose: false,
              message: `${t(res.message)}`
            })
        return {
          success: false,
          message: `${t(res.message)}`
        }
      }
      siteData.value = res.data
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`fetch site info error: `, error)
      // ElNotification({
      //   title: `${t('獲取站點資訊錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const queryNews = async (lang: string, path: string) => {
    try {
      console.log(`queryNews : `, lang)
      const res: any = await $API(`/site/press?siteId=${siteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        },
        params: {
          lang,
          path
        }
      })
      if (res.statusCode !== 200) {
        res.statusCode === 400
          ? null
          : ElNotification({
              title: `${t('查詢新聞')}`,
              showClose: false,
              message: `${t(res.message)}`
            })
        return {
          success: false,
          message: `${t(res.message)}`
        }
      }
      news.value = res.data
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`fetch news error: `, error)
      // ElNotification({
      //   title: `${t('獲取新聞錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const queryCampaign = async (lang: string) => {
    try {
      const res: any = await $API(`/site/campaign?siteId=${siteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        },
        params: {
          lang
        }
      })
      if (res.statusCode !== 200) {
        res.statusCode === 400
          ? null
          : ElNotification({
              title: `${t('查詢活動')}`,
              showClose: false,
              message: `${t(res.message)}`
            })
        return {
          success: false,
          message: `${t(res.message)}`
        }
      }
      campaign.value = res.data
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`fetch campaign error: `, error)
      // ElNotification({
      //   title: `${t('獲取活動錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const queryInstruction = async (lang: string, type: string) => {
    try {
      console.log(`queryInstruction : `, lang, type)
      const res: any = await $API(`/site/instruction?siteId=${siteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        },
        params: {
          lang,
          type
        }
      })
      if (res.statusCode !== 200) {
        res.statusCode === 400
          ? null
          : ElNotification({
              title: `${t('查詢公告')}`,
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
      console.log(`fetch instruction error: `, error)
      // ElNotification({
      //   title: `${t('獲取公告錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const queryBanner = async (lang: string, type: string) => {
    try {
      console.log(`queryBanner : `, lang, type)
      const res: any = await $API(`/site/banner?siteId=${siteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        },
        params: {
          lang,
          type
        }
      })
      if (res.statusCode !== 200) {
        res.statusCode === 400
          ? null
          : ElNotification({
              title: `${t('查詢橫幅')}`,
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
      console.log(`fetch queryBanner error: `, error)
      // ElNotification({
      //   title: `${t('獲取公告錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const queryChatbox = async () => {
    try {
      const res: any = await $API(
        referrerCodeCookiee.value
          ? `/site/chatbox/?siteId=${siteId}&referrer=${referrerCodeCookiee.value}`
          : `/site/chatbox/?siteId=${siteId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAccessToken()
          }
        }
      )
      if (res.statusCode !== 200) {
        // res.statusCode === 400
        //   ? null
        //   : ElNotification({
        //       title: `${t('查詢站點客服連結')}`,
        //       showClose: false,
        //       message: `${t(res.message)}`
        //     })
        return {
          success: false,
          message: `${t(res.message)}`
        }
      }
      chatbox.value = res.data.replace(/\s+/g, '')
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`fetch site chatbox error: `, error)
      // ElNotification({
      //   title: `${t('查詢站點客服連結錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const queryPublicCoupon = async (lang: string, type: string) => {
    try {
      console.log(`queryPublicCoupon : `, lang, type)
      const res: any = await $API(`/public/coupon/?siteId=${siteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.statusCode !== 200) {
        res.statusCode === 400
          ? null
          : ElNotification({
              title: `${t('查詢公告')}`,
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
      console.log(`fetch queryPublicCoupon error: `, error)
      // ElNotification({
      //   title: `${t('獲取公告錯誤')}`,
      //   showClose: false,
      //   message: error.toString()
      // })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const verfiyDomain = async (domain: string) => {
    try {
      console.log(`verfiyDomain : `, domain)
      const res: any = await $API(`/domain/verify/?siteId=${siteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domain
        })
      })
      if (res.statusCode !== 200) {
        // res.statusCode === 400
        //   ? null
        //   : ElNotification({
        //       title: `${t('查詢網域')}`,
        //       showClose: false,
        //       message: `${t(res.message)}`
        //     })
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
      console.log(`verfiyDomain error: `, error)
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  return {
    news,
    campaign,
    siteData,
    chatbox,
    queryInfo,
    queryNews,
    queryCampaign,
    queryInstruction,
    queryChatbox,
    queryPublicCoupon,
    queryBanner,
    verfiyDomain
  }
})
