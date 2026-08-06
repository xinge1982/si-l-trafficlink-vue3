import { createApp } from 'vue'
import { setupPinia } from './store'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './assets/css/base.css'
import { setupI18n } from './lang'
import router from './router'

async function bootstrap() {
  const app = createApp(App)
  setupPinia(app)
  setupI18n(app)
  app.use(router)
  app.use(ElementPlus, {
    locale: zhCn,
  })

  app.mount('#app')
}

bootstrap()