import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#65C5A2',
            orange: '#fa7854',
            title: '#1f1f1f',
            text: '#4A4A4A',
            textlight: '#5D1715',
            white: '#fff',
            black: '#16161e',
            grey: '#afafaf',
            lightgrey: '#ececec',
            hover: '#5D1715',
          },
        },
        dark: {
          colors: {
            primary: '#1e88e5', // 기존 colors.blue.darken2 대체
            accent: '#424242', // 기존 colors.grey.darken3 대체
            secondary: '#ffb300', // 기존 colors.amber.darken3 대체
            info: '#26a69a', // 기존 colors.teal.lighten1 대체
            warning: '#ffa000', // 기존 colors.amber.base 대체
            error: '#d32f2f', // 기존 colors.deepOrange.accent4 대체
            success: '#00e676', // 기존 colors.green.accent3 대체
          },
        },
      },
    },
    defaults: {
      global: {
        font: {
          family: 'Roboto, sans-serif'
        }
      }
    }
  })
  nuxtApp.vueApp.use(vuetify)
})
