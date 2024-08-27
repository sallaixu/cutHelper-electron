import { createRouter,createWebHistory,createWebHashHistory } from 'vue-router'
import CutPage from '../components/CutPage.vue'
import About from '../components/About.vue'


const routes = [
    {
        path: '/',
        component: CutPage
    },
    {
        path: '/about',
        component: About
    }
]

const router = createRouter({
    // history: createWebHistory(),
    history:createWebHashHistory(),
    routes,
})
export default router