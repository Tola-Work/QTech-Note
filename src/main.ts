import { createApp } from 'vue'
import { store } from './store'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'

const app = createApp(App)

// Make store available globally
app.config.globalProperties.$store = store

app.use(router)
app.mount('#app')
