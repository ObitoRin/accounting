import { createApp } from 'vue'
import { App } from './App'
import { createRouter } from 'vue-router'
import { routes } from './config/routes'
import { history } from './shared/history'
import '@svgstore'
import { createPinia, storeToRefs } from 'pinia'
import { useMeStore } from './stores/useMeStore';
import { useUserPreferenceStore } from './stores/useUserPreferenceStore'

const router = createRouter({ history, routes })
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')

const meStore = useMeStore()
const { mePromise } = storeToRefs(meStore)
meStore.fetchMe()

const userPreferenceStore = useUserPreferenceStore()
userPreferenceStore.getUserPreference(localStorage.userPreferenceStore)

const whiteList: Record<string, 'exact' | 'startsWith'> = {
  '/': 'exact',
  '/items': 'exact',
  '/welcome': 'startsWith',
  '/sign_in': 'startsWith',
}
router.beforeEach((to, from) => {
  for (const key in whiteList) {
    const value = whiteList[key]
    if (value === 'exact' && key === to.path) {
      return true
    }
    if (value === 'startsWith' && to.path.startsWith(key)) {
      return true
    }
  }
  return mePromise!.value!.then(
    () => true,
    () => '/sign_in?return_to=' + from.path
  )
})
