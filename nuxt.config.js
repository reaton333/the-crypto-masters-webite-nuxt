import colors from 'vuetify/es5/util/colors'
import { apiEndpoint } from './sm.json'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Used for meta tags
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Your Crypto One-Stop-Shop',
    titleTemplate: '%s - The Crypto Masters',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '<b>TheCryptoMasters</b>.com | <b>The Crypto Masters</b> helping the general public to master and understanding of crypto assets!' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:wght@100;300;400;500;700;900&display=swap' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: '~/plugins/amCharts.js',
      ssr: false
    },
    '~/plugins/vuelidate'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/prismic',
    // '@/modules/generator',
  ],

  prismic: {
    // Full list of config options can be found here:
    // https://prismic.nuxtjs.org/configuration/
    endpoint: apiEndpoint,
    modern: true,
    preview: false, // disable previews
    apiOptions: {
      accessToken: 'MC5ZRG1sNkJFQUFDSUF4cllj.77-977-977-977-9fjXvv71RMjNcdO-_vQbvv70Z77-977-9Qi3vv73vv73vv70zNjh5Yu-_vSI7ew'
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/google-fonts',
    '@/modules/generator',
    ////////////////////////////////////////////////////
    ///// **** Make sure sitemap is the last item //////
    ////////////////////////////////////////////////////
    '@nuxtjs/sitemap' 
  ],

  sitemap: {
    hostname: 'https://thecryptomasters.com/',
    gzip: true,
    exclude: [
      '/account/**',
      '/admin/**',
      '/account',
      '/admin',
    ],
    defaults: {
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    routes: [
      '/crypto/1',
      '/crypto/2',
      {
        url: '/crypto/3',
        changefreq: 'daily',
        priority: 1,
        lastmod: '2017-06-30T13:30:00.000Z'
      }
    ]
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: {
      font: false,
    },
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#264653',
          accent: '#2A9D8F',
          secondary: '#E9C46A',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: '#E76F51',
          success: '#2A9D8F',
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["@prismicio/vue"],
  }
}
