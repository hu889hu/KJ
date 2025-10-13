// 注入方式 使用方式 $hello('world')
import xssParse from '../utils/filterXss'
export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      lang: (msg: string): string => {
        // console.log(Object.keys(useI18n()))
        // check msg whether is in the current locale messages
        const { t, te, locale, messages } = useI18n()
        // console.log(getLocaleMessage('zh-TW'))
        // console.log(messages.value[locale.value])
        if (!te(msg)) {
          // if not, return original msg
          return msg
        }
        // if yes, return parsed msg
        return xssParse(t(msg))
      }
    }
  }
})
