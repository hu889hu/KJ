// @ts-nocheck
// directive方式(模板語法) 使用方式 v-hello="'world'"
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('timex', {
    mounted(el: any, binding: any) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }
      const time = Intl.DateTimeFormat('zh-TW', options).format(binding.value)
      el.innerHTML = time
    }
  })
})
