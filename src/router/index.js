import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Roles from '../components/power/Roles'
import Rights from '../components/power/Rights'
import Goods from '../components/goods_cate/goods'
import Categories from '../components/goods_cate/categories'
import Params from '../components/goods_cate/params'
import Add from '../components/goods_cate/add'
import Orders from '../components/order/orders'
Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [{
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            },
            {
                path: '/roles',
                component: Roles
            },
            {
                path: '/rights',
                component: Rights
            },
            {
                path: '/goods',
                component: Goods
            },
            {
                path: '/goods/add',
                component: Add
            },
            {
                path: '/categories',
                component: Categories
            },
            {
                path: '/params',
                component: Params
            },
            {
                path: '/orders',
                component: Orders
            }
        ]
    }
]

const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {
    // eslint-disable-next-line eqeqeq
    if (to.path == '/login') next()
    if (!window.localStorage.getItem('token')) {
        next('/login')
    }
    next()
})
export default router