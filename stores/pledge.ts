// news store
import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'

export const usePledgeStore = defineStore('pledge', () => {
  const nuxtapp = useNuxtApp()
  const { t } = nuxtapp.$i18n
  const config = useRuntimeConfig()
  const { siteId } = config.public
  const { api: $API } = useApi()
  const productList = ref([])
  const categoryTree = ref([])
  const { getAccessToken, setAccessToken } = useAuthStore()

  const queryPublicCoupon = async (keyword: string, categoryId: string) => {
    try {
      console.log(`queryPublicCoupon : `, keyword, categoryId)
      const res: any = await $API(`/public/coupon/?siteId=${siteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keyword,
          categoryId,
          sortKey: 'sort',
          sortWay: 'asc'
        })
      })
      if (res.statusCode !== 200) {
        res.statusCode === 400
          ? null
          : ElNotification({
              title: `${t('查詢商城商品')}`,
              showClose: false,
              message: `${t(res.message)}`
            })
        return {
          success: false,
          message: `${t(res.message)}`
        }
      }
      categoryTree.value = res.data.categoryStructures.tree
      productList.value = res.data.products
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
  const buy = async (params: any) => {
    try {
      const res: any = await $API(`/pledge/buy`, {
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
              title: `${t('下單失敗')}`,
              showClose: false,
              message: res.message
            })
        return {
          success: false,
          message: res.message
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
    productList,
    categoryTree,
    queryPublicCoupon,
    buy
  }
})
