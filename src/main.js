import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './i18next'
import App from './App.vue'
import router from './router'
import { IonicVue } from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

/* Theme variables */
import './theme/variables.css'

import './registerServiceWorker'
import { persistencePlugin } from 'pinia-persistence-plugin'
import localforage from 'localforage'

const getItem = async (key) => {
    return await localforage.getItem(key)
}
const setItem = async (key, value) => {
    await localforage.setItem(key, value)
}
const removeItem = async (key) => {
    await localforage.removeItem(key)
}

const pinia = createPinia()
pinia.use(
    persistencePlugin({
        storeKeysPrefix: 'pinia',
        persistenceDefault: true,
        storageItemsDefault: [{ storage: { getItem, setItem, removeItem } }],
    })
)
const app = i18n(createApp(App))
    .use(IonicVue, { innerHTMLTemplatesEnabled: true })
    .use(router)
    .use(pinia)

router.isReady().then(() => {
    app.mount('#app')
})
