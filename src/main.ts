import './assets/styles/main.scss'
import 'animate.css'
import './assets/styles/animations.scss'

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

// 设置正确的视口高度（处理移动端100vh问题）
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// 初始化设置，并在窗口大小调整时重新计算
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);
setViewportHeight();
