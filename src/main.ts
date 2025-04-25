import './assets/styles/main.scss'
import 'animate.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 创建Vue应用实例
const app = createApp(App)

app.use(createPinia())
app.use(router)

// 微信分享功能在组件级别进行初始化，以便不同页面可以有不同的分享内容
// 参见 WxShare.vue 组件和 wxShare.ts 工具函数

app.mount('#app')
