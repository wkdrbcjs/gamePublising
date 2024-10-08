// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import path from "path";

export default defineNuxtConfig({
  compatibilityDate: '2024-09-24',  // 애플리케이션의 호환성 날짜를 지정
  devtools: { enabled: false },      // devtool 사용

  // ssr 사용 설정 (디폴트: true)
  ssr: true,
  // 특정 페이지만 ssr 사용하지 않게 설정 -- 페이지 전체가 ssr되지 않는 것
  // 또는 특정 플러그인또는 특정 컴포넌트만 <ClientOnly>로 감싸면 나머지 부분은 ssr로 렌더링 됨
  routeRules: {
    /*'/your-spa-page': { ssr: false },*/
  },

  // 나중에 .env 파일에 변수 읽어오려면 여기에 작성
  // 사용 방법 : const config = useRuntimeConfig(); and config.public.~~
  // vue3는 vite 사용하는데 vite에서는 process.env로 .env 파일의 변수를 읽어올 수 없음
  // 때문에 import.meta~~ or useRuntimeConfig() 사용해야함.
  runtimeConfig: {
    public:{
      runtimeConfig_Test: process.env.RUNTEXT,

      supabase_url: process.env.SUPABASE_URL,
      supabase_apikey: process.env.SUPABASE_APIKEY,
      supabase_rolekey: process.env.SUPABASE_ROLEKEY,
    }
  },
  
  build: {
    transpile: [
      'vuetify',
      // '@townsquarelabs/ui-vue'
      'swiper',
    ],
  },
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/styles/font.scss',  // 전역 폰트
    'swiper/css',
    'swiper/css/navigation',
    'swiper/css/pagination',
    'swiper/css/scrollbar',
  ],
  // 플러그인 설정
  // plugins:[
  //   '~/plugins/apifetch.ts',
  //  '~/plugins/toast.client',
  // ],

  modules: [
    '@nuxt/image',
    //'@nuxtjs/i18n',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@nuxtjs/google-fonts',
  ],

  // 미들웨어 설정
  // Nuxt가 자동으로 등록하므로 /server/middleware 디렉토리에 미들웨어 파일 있는지만 확인 
  /*serverMiddleware: [
    '~/server/middleware/logger'
  ],*/

  

  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ["legacy-js-api"]
        }
      }
    }
  },
  app: {
    head: {
      title: 'Musubi Games',
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '16x16' },
      ]
    }
  },
  // supabase 설정
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_APIKEY, // 각 환경에 맞는 env 파일의 api key를 사용하게 됨.
    redirect: false,
  },

  // env 파일 포트번호 읽기
  devServer: {
    port: parseInt(process.env.NUXT_CLIENT_PORT ?? '1500')
  },

})