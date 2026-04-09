/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

const temaSalvo = localStorage.getItem('temaApp') || 'light'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: temaSalvo,
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#FAFAFA',
          surface: '#FFFFFF',
          primary: '#1565C0',
          secondary: '#546E7A',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#181818',
          surface: '#242424',
          primary: '#90CAF9',
          secondary: '#B0BEC5',
        },
      },
    },
  },
})
