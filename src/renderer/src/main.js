import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import { message } from 'ant-design-vue';
const app = createApp(App)
message.config({top: `0px`,})
app.use(router)
app.mount('#app')

