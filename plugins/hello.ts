// 注入方式 使用方式 $hello('world')
export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      hello: (msg: string): string => `Hello ${msg}`
    }
  }
})
