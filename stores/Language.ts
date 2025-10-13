import { defineStore } from 'pinia'
interface Messages {
  [key: string]: string
}

interface Locales {
  code: string
  name: string
  messages: Messages
}

export const useLanguageStore = defineStore('language', () => {
  const { api: $API } = useApi()
  const { mergeLocaleMessage } = useI18n()
  const languages = ref([
    {
      code: 'zh_TW',
      name: '繁體中文',
      messages: {
        hello: '你好喔'
      }
    },
    {
      code: 'en_US',
      name: 'English',
      messages: {
        hello: 'HelloABC'
      }
    },
    {
      code: 'zh_CN',
      name: '简体中文',
      messages: {
        hello: '你好啊'
      }
    },

    {
      code: 'ja_JP',
      name: '日本語',
      messages: {
        hello: 'こんにちは'
      }
    }
  ])
  const fetchLanguages = async () => {
    try {
      const res: any = await $API(`/language`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const { statusCode, data, message } = res
      if (statusCode !== 200) {
        console.error('fetch languages error : ', message)
        return {
          success: false,
          message
        }
      }
      languages.value = data
      languages.value.forEach(({ code, name, messages }: Locales) => {
        mergeLocaleMessage({ code, name }, messages)
      })
    } catch (error: any) {
      console.error('fetch languages error : ', error)
      return {
        success: false,
        message: error.toString()
      }
    }
  }
  return {
    fetchLanguages,
    languages
  }
})
