import { createRouter,createWebHistory,createWebHashHistory } from 'vue-router'
import CutPage from '../components/CutPage.vue'


const routes = [
    {
        path: '/',
        component:CutPage
    },
]

const router = createRouter({
    // history: createWebHistory(),
    history:createWebHashHistory(),
    routes,
})
export default router