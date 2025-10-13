import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.warnHandler = (msg, vm, trace) => {
    // 自定义警告处理逻辑
    // console.warn(`[Vue warn]: ${msg}\nTrace: ${trace}`);
  }
  nuxtApp.vueApp.config.silent = true // 关闭所有 Vue 警告
})
