// news store
import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'
import { pa } from 'element-plus/es/locale/index.mjs'

export const useTwstockStore = defineStore('twstock', () => {
  const nuxtapp = useNuxtApp()
  const { t } = nuxtapp.$i18n
  const config = useRuntimeConfig()
  const { siteId } = config.public
  const { api: $API } = useApi()
  const { getAccessToken, setAccessToken } = useAuthStore()
  const stockProductList = ref([])
  const ipoProductList = ref([])
  const pageStockInfo = ref({})

  const setPageStockInfo = (value: object) => {
    pageStockInfo.value = value
    console.log('pageStockInfo', pageStockInfo.value)
  }
  const getProductStock = async (filterKey: object, resetStores: boolean) => {
    try {
      const res: any = await $API(`/twstock/product/stock/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        },
        body: JSON.stringify(filterKey)
      })
      console.log('getProductStock :', res)
      if (resetStores) {
        res.data.result.forEach((item: any) => {
          const findIndex = stockProductList.value.findIndex((stock: any) => {
            return stock.id === item.id
          })
          if (findIndex === -1) {
            stockProductList.value.push(item)
          } else {
            stockProductList.value[findIndex] = item
          }
        })
        console.log('stockProductList :', stockProductList.value)
      }
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`getProductStock error: `, error)
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const getProductIpo = async (filterKey: object, resetStores: boolean) => {
    try {
      const res: any = await $API(`/twstock/product/ipo/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        },
        body: JSON.stringify(filterKey)
      })
      console.log('getProductIpo :', res)
      if (resetStores) {
        res.data.result.forEach((item: any) => {
          const findIndex = stockProductList.value.findIndex((stock: any) => {
            return stock.id === item.id
          })
          if (findIndex === -1) {
            ipoProductList.value.push(item)
          } else {
            ipoProductList.value[findIndex] = item
          }
        })
        console.log('ipoProductList :', ipoProductList.value)
      }
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`getProductStock error: `, error)
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const getNews = async (filterKey: object) => {
    try {
      const res: any = await $API(`/twstock/news`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        },
        params: filterKey
      })
      console.log('getNews :', res)
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`getNews error: `, error)
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const getStockKline = async (filterKey: object) => {
    try {
      const res: any = await $API(`/twstock/kline`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        },
        params: filterKey
      })
      console.log('getStockKline :', res)
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`getStockKline error: `, error)
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const getStockPosition = async (filterKey: object) => {
    try {
      const res: any = await $API(`/twstock/position/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        }
      })
      console.log('getStockPosition :', res)
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`getStockPosition error: `, error)
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const getStockOrder = async (filterKey: object) => {
    try {
      const res: any = await $API(`/twstock/order/stock/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        }
      })
      console.log('getStockOrder :', res)
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`getStockOrder error: `, error)
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const getIpoOrder = async (filterKey: object) => {
    try {
      const res: any = await $API(`/twstock/order/ipo/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        }
      })
      console.log('getIpoOrder :', res)
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`getIpoOrder error: `, error)
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const stockOrder = async (params: any) => {
    try {
      const res: any = await $API(`/twstock/order/stock`, {
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
              title: `${t('台股下單失敗')}`,
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
      console.log(`post stockOrder error: `, error)
      ElNotification({
        title: `${t('台股下單錯誤')}`,
        showClose: false,
        message: error.toString()
      })
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  const ipoOrder = async (params: any) => {
    try {
      const res: any = await $API(`/twstock/order/ipo`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAccessToken()
        }
      })
      if (res.statusCode !== 200) {
        ElNotification({
          title: `${t('IPO下單失敗')}`,
          showClose: false,
          message: res.message
        })
        return {
          success: false,
          message: res.message
        }
      }
      ElNotification({
        title: `${t('IPO申請認購成功')}`,
        showClose: false,
        message: res.message
      })
      return {
        success: true,
        data: res.data
      }
    } catch (error: any) {
      console.log(`post stockOrder error: `, error)
      ElNotification({
        title: `${t('IPO下單錯誤')}`,
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
    stockProductList,
    ipoProductList,
    pageStockInfo,
    setPageStockInfo,
    getProductStock,
    getProductIpo,
    getNews,
    getStockPosition,
    getStockOrder,
    getIpoOrder,
    getStockKline,
    stockOrder,
    ipoOrder
  }
})
