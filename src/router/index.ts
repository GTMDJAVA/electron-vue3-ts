// src\router\index.ts
import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
    //  hash 模式。
    history: createWebHashHistory(),
    routes: [
        // 设置首页
        {
            path: '/',
            component: () => import('../components/Index.vue')
        },
        {
            path: '/calculator',
            component: () => import('../components/calculator/Calculator.vue')
        },
        // 配置helloworld页的路径
        {
            path: '/pictureToCharacter',
            component: () => import('../components/PictureToCharacter.vue')
        },
    ],
})

export default router