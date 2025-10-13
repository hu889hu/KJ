<script lang="ts" setup>
// listen to locale change
const { locale, setLocaleCookie } = useI18n()
watch(locale, (val) => {
  setLocaleCookie(val)
})
const { checkAccessToken, isLogin } = useAuthStore()
const route = useRoute()
const router = useRouter()
const checkTokenInterval = ref(0)
onMounted(() => {
  if (route.query.debug === 'true') {
    new VConsole({ theme: 'dark' })
  }

  if (route.query.error) {
    ElMessage.error(route.query.error)
    const newQuery = { ...route.query }
    delete newQuery.error
    router.replace({ query: newQuery })
  }

  const autoCheckAccessToken = async () => {
    const tokenExist = isLogin()
    // console.log(`autoCheckAccessToken @ ${new Date()}, isLogin: ${tokenExist}`)
    if (tokenExist) {
      await checkAccessToken('')
    } else {
      clearInterval(checkTokenInterval.value)
    }
  }
  checkTokenInterval.value = setInterval(() => {
    if (process.env.NODE_ENV !== 'development') autoCheckAccessToken()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(checkTokenInterval.value)
})
// header data
</script>

<template>
  <div class="layoutBox">
    <slot />
    <!-- <Gdpr /> -->
  </div>
</template>

<!-- headerContainer -->
<style scoped lang="sass"></style>

<style>
html,
body {
  scroll-behavior: smooth;
  /* touch-action: manipulation;
  -webkit-overflow-scrolling: touch; */
  /* -ms-overflow-style: none; */
  overflow-x: hidden;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  font-family: '-apple-system', 'BlinkMacSystemFont', 'sans-serif',
    'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial',
    'sans-serif';
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
</style>

<style>
.el-notification__group {
  width: 100%;
}
.el-icon,
.el-notification__closeBtn {
  top: 0;
  right: 0;
}
</style>

<style>
.el-sub-menu__title {
  height: 36px !important;
}
.el-menu-item {
  height: 36px !important;
}
</style>
