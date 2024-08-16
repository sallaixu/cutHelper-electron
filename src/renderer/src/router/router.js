import { createRouter,createWebHistory,createWebHashHistory } from 'vue-router'
import Versions from '../components/Versions.vue'
import My from '../components/My.vue'


const routes = [
    {
        path: '/',
        component:My
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