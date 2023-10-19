import { defineCustomElement } from 'vue'
import App from './App.vue'

// createApp(App).mount('#app')
customElements.define('my-vue-app', defineCustomElement(App))

export const ICons = {}
