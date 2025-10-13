// plugins/v-trim-input.js
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('trim-input', {
    beforeMount(el) {
      el.addEventListener('input', (event) => {
        if (event.isComposing) return
        const currentValue = event.target.value
        const trimmedValue = currentValue.replace(/\s+/g, '')

        // 只有当值有变化时才手动触发 input 事件
        if (trimmedValue !== currentValue) {
          event.target.value = trimmedValue
          event.target.dispatchEvent(new Event('input', { bubbles: true })) // 确保事件在捕获和冒泡阶段都能触发
        }
      })
    }
  })
})
