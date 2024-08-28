import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import CutPage from '../components/CutPage.vue'
import About from '../components/About.vue'
import Setting from '../components/setting/Setting.vue'


const routes = [{
    path: '/',
    component: CutPage
  },
  {
    path: '/about',
    component: About
  },
  {

    path: '/setting',
    component: Setting

  }
]

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
})
export default router