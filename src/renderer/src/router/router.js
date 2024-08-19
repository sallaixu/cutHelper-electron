import { createRouter,createWebHistory,createWebHashHistory } from 'vue-router'
import Versions from '../components/Versions.vue'
import CutTime from '../components/CutTime.vue'


const routes = [
    {
        path: '/',
        component:CutTime
    },
    {
        path: '/versions',
        component:Versions
    }
]

const router = createRouter({
    // history: createWebHistory(),
    history:createWebHashHistory(),
    routes,
})
export default router