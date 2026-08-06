import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

export function setupPinia(app: App): void {
    app.use(pinia)
}

export { pinia }
export { useAppStore } from './store'
export type { StoreState } from './store'

export default pinia