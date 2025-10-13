// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  css: [
    '~/assets/sass/stock/main.css',
    'vant/lib/index.css',
    '~/public/uikit/uikit.min.css'
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@element-plus/nuxt',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate']
      }
    ],
    '@nuxtjs/i18n',
    '@vant/nuxt'
  ],

  // build: {
  //   transpile: ['@fortawesome/vue-fontawesome']
  // },

  // css: ['@fortawesome/fontawesome-svg-core/styles.css'],

  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@import "@/assets/sass/main.sass"'
        }
      }
    }
  },
  plugins: ['~/plugins/silent.js', `~/plugins/v-trim-input.js`],
  elementPlus: {
    /** Options */
  },

  imports: {
    dirs: ['stores']
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport:
        'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale = 1.0, user-scalable = no',
      meta: [
        {
          name: 'format-detection',
          content: 'telephone=no,email=no,adress=no'
        }, // telling iphone detection no transfer these contents
        { name: 'apple-touch-fullscreen', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/boxicons/2.1.2/css/boxicons.min.css'
        }
      ],
      style: [],
      script: [
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/js/all.min.js',
          async: true,
          tagPosition: 'head' // head | bodyOpen | bodyClose
        },
        {
          src: 'https://unpkg.com/vconsole@latest/dist/vconsole.min.js',
          async: true,
          tagPosition: 'head' // head | bodyOpen | bodyClose
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js',
          type: 'text/javascript'
        },
        {
          src: '/uikit/uikit.min.js',
          tagPosition: 'bodyClose'
        },
        {
          src: '/uikit/uikit-icons.min.js',
          tagPosition: 'bodyClose'
        }
      ],
      noscript: []
    }
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'zh_TW',
    detectBrowserLanguage: {
      useCookie: true,
      redirectOn: 'root' // recommended
    },
    locales: [
      { code: 'en_US', file: './language/en-US' },
      { code: 'zh_TW', file: './language/zh-TW' },
      { code: 'zh_CN', file: './language/zh-CN' },
      { code: 'ja_JP', file: './language/ja-JP' }
    ]
  },

  nitro: {},

  runtimeConfig: {
    public: {
      // update apibase url config
      SOCKETBASE: 'wss://bpsocket2.comethike.com:8443',
      // PLEDGESOCKETURL: 'wss://pledgesocket.comethike.com:8443',
      // POWERSOCKETURL: 'wss://powersocket.comethike.com:8443', // 添加这一行
      POWERSOCKETURL: 'wss://socket.adminpanela.com:8443', // 添加这一行
      // APIBASE: 'https://secretary-editing-kidney-yesterday.trycloudflare.com',
      APIBASE: 'https://api.adminpanela.com',
      // APIBASE: `https://dev.comethike.com`,
      // APIBASE: 'https://localhost.demoto.me/api',
      // APIBASE: `https://localhost.demoto.me`,
      // siteId: '68db604c9617294892b18ccd'
      siteId: '68dfa562e4e29afcdccca817'
    }
  },

  devServer: {
    port: 3089
  },

  compatibilityDate: '2024-07-29'
})
