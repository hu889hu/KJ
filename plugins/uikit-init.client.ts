export default defineNuxtPlugin(() => {
  if (process.client) {
    // 确保 UIkit 已全局可用
    if (!window.UIkit) {
      console.error('UIkit 未正确加载')
      return
    }

    // 可选：添加初始化逻辑
    console.log('UIkit 已加载', window.UIkit)
  }
})
