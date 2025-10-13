<script lang="ts" setup>
// listen to locale change
const { locale, setLocaleCookie } = useI18n()

watch(locale, (val) => {
  setLocaleCookie(val)
})

const route = useRoute()
const router = useRouter()
const { checkAccessToken, isLogin } = useAuthStore()
const intervalId = ref(null)
const referrerCodeCookiee = useCookie('referrerCode', {
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
}) as any
if (!isLogin()) {
  navigateTo('/login')
}
const checksetInterval = async () => {
  const tokenExsit = isLogin()
  if (tokenExsit) {
    console.log('setInterval checkAccessToken')
    const ACCESS_TOKEN_VERIFY_INTERVAL = 3 * 1000
    intervalId.value = setInterval(async () => {
      const res = await checkAccessToken()
      if (!res) {
        clearsInterval()
      }
    }, ACCESS_TOKEN_VERIFY_INTERVAL)
  } else {
    clearsInterval()
  }
}

const clearsInterval = () => {
  if (intervalId.value) {
    console.log('clearInterval checkAccessToken', intervalId.value)
    clearInterval(intervalId.value)
    intervalId.value = null
  }
}

await onMounted(() => {
  checksetInterval()
  if (route.query.debug === 'true') {
    new VConsole({ theme: 'dark' })
  } else {
    console.log(`Debug mode env : `, process.env.NODE_ENV)
    if (process.env.NODE_ENV !== 'development') {
      console.log = () => { }
    }
  }

  if (route.query?.error) {
    // ElNotification({
    //   title: 'Oops!',
    //   message: route.query.error,
    //   type: 'error',
    //   showClose: false,
    //   duration: 2500
    // })
    ElMessage.error(route.query.error)
    const newQuery = { ...route.query }
    delete newQuery.error
    router.replace({ query: newQuery })
  }
  // 防止手機雙指放大
  document.addEventListener('gesturestart', function (e) {
    e.preventDefault()
  })
  if (siteStore.siteData.script) {
    // Extract script content
    const scriptContentMatch = siteStore.siteData.script.match(
      /<script[^>]*>([\s\S]*?)<\/script>/
    )
    if (scriptContentMatch && scriptContentMatch[1]) {
      const scriptContent = scriptContentMatch[1]
      // Append script to head
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.innerHTML = scriptContent
      document.head.appendChild(script)
    }
  }

  // referrer
  if (router.currentRoute.value.query.referrer) {
    referrerCodeCookiee.value =
      router.currentRoute.value.query.referrer.replace(/[^a-zA-Z0-9]/g, '')
  }
})

onBeforeUnmount(() => {
  clearsInterval()
})

// 動態設置favicon, title
console.log('router.currentRoute.value.name', router.currentRoute.value.name)
const routerName = (router: String) => {
  switch (router) {
    case 'index':
      return '首頁'
    case 'login':
      return '登入'
    case 'register':
      return '登入'
    case 'user':
      return '會員中心'
    case 'user-activity':
      return '優惠活動'
    case 'user-bank':
      return '銀行驗證'
    case 'user-deposit':
      return '會員儲值'
    case 'user-info':
      return '會員資訊'
    case 'user-message':
      return '站內訊息'
    case 'user-record':
      return '交易紀錄'
    case 'user-setting':
      return '會員設定'
    case 'user-smsVerify':
      return '手機驗證'
    case 'user-withdraw':
      return '會員提領'
    case 'game':
      return siteStore.siteData.gameName
  }
}
const siteStore = useSiteStore()
useHead({
  title: `${siteStore.siteData.title}`,
  meta: [
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    {
      name: 'apple-mobile-web-app-title',
      content: `${siteStore.siteData.title}`
    }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: `${siteStore.siteData.favicon}`
    }
  ]
  // script: [
  //   {
  //     type: 'text/javascript',
  //     children: siteStore.siteData.script
  //   }
  // ]
})

useSeoMeta({
  title: siteStore.siteData.title,
  description: siteStore.siteData.description,
  keywords: siteStore.siteData.keywords,
  ogTitle: siteStore.siteData.title,
  ogDescription: siteStore.siteData.description,
  ogImage: siteStore.siteData.favicon,
  twitterTitle: siteStore.siteData.title,
  twitterDescription: siteStore.siteData.description,
  twitterImage: siteStore.siteData.favicon
})

watch(
  () => router.currentRoute.value.name,
  async () => {
    console.log(
      'router.currentRoute.value.name',
      router.currentRoute.value.name
    )
    useHead({
      title: `${siteStore.siteData.title}`,
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: `${siteStore.siteData.favicon}`
        }
      ]
    })
    await clearsInterval()
    await checksetInterval()
  }
)

// 動態讀取i18n語系包

if (process.client) {
  if (window.navigator.standalone === true) {
    document.addEventListener(
      'click',
      (event) => {
        let node = event.target

        while (node && node.nodeName !== 'A' && node.nodeName !== 'HTML') {
          node = node.parentNode
        }

        if (
          node &&
          node.nodeName === 'A' &&
          node.href &&
          node.href.includes('http') &&
          node.href.includes(document.location.host)
        ) {
          event.preventDefault()
          document.location.href = node.href
        }
      },
      false
    )
  }
}
</script>

<template>
  <div>
    <slot />
  </div>
</template>

<style scoped lang="sass"></style>
<style>
html,
body {
  scroll-behavior: smooth;
  /* touch-action: manipulation;
  -webkit-overflow-scrolling: touch; */
  /* -ms-overflow-style: none; */
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  font-family: '-apple-system', 'BlinkMacSystemFont', 'sans-serif',
    'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial',
    'sans-serif';
  /* background-color: #e9fdd8; */
  /* overflow: hidden; */
}

html {
  height: 100%;
  background: transparent;
  /* -webkit-overflow-scrolling: touch; */
  /* background-attachment: fixed; */
  /* overflow:   scroll; */
  /* overflow: -moz-hidden-unscrollable; */
  /* background-color: rgb(250 250 250); */
}

/* Hide scrollbar for Chrome, Safari and Opera */

::-webkit-scrollbar {
  display: none;
  width: 0px;
  background: transparent;
  /* make scrollbar transparent */
}

/* Hide scrollbar for IE, Edge and Firefox */

/* *:not(input) { */
/* -webkit-touch-callout: none; */
/* IE and Edge */
/* -webkit-user-select: none; Firefox */
/* } */
html {
  /* font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box; */
}

*,
*::before,
*::after {
  box-sizing: border-box;
  position: relative;
  margin: 0;
}

a {
  text-decoration: none;
}

/* .el-button--warning {
  --el-button-bg-color: #ffb11a;
  --el-button-text-color: #000;
}

.van-nav-bar {
  --van-nav-bar-background: #00000000;
  padding: 12px 0;
}
.navBarleft {
  color: #000000;
} */
</style>
