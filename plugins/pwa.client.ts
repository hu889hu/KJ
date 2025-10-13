export default defineNuxtPlugin(() => {
  if (isStandalone()) {
    console.log('[PWA] 当前运行在独立模式 (WebClip/PWA 桌面应用)')
  } else {
    console.log('[PWA] 当前运行在浏览器模式')
  }
})

function isStandalone() {
  if (typeof window === 'undefined') return false

  const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
  if (isIOS && (window.navigator as any).standalone) return true
  if (window.matchMedia('(display-mode: standalone)').matches) return true

  return false
}
