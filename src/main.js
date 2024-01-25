import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import apiPlugin from './plugins/api';
import App from './App.vue'
import router from './router'
import piniaPersist from 'pinia-plugin-persist'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersist)
app.use(pinia)
app.use(apiPlugin)
app.use(router)

app.mount('#app')
