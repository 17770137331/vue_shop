import Vue from 'vue'
import VueRouter from 'vue-router'
// const Login = () => import(/* webpackChunkName: "login" */ '../components/Login')
import Login from '../components/Login'
// const Home = () => import(/* webpackChunkName: "login" */ '../components/Home')
import Home from '../components/Home'
// const Welcome = () => import(/* webpackChunkName: "login" */ '../components/Welcome')
import Welcome from '../components/Welcome'
// const Users = () => import(/* webpackChunkName: "user" */ '../components/user/Users')
import Users from '../components/user/Users'
// const Roles = () => import(/* webpackChunkName: "power" */ '../components/power/Roles')
import Roles from '../components/power/Roles'
// const Rights = () => import(/* webpackChunkName: "power" */ '../components/power/Rights')
import Rights from '../components/power/Rights'
// const Goods = () => import(/* webpackChunkName: "goods" */ '../components/goods_cate/goods')
import Goods from '../components/goods_cate/goods'
// const Categories = () => import(/* webpackChunkName: "goods" */ '../components/goods_cate/categories')
import Categories from '../components/goods_cate/categories'
// const Params = () => import(/* webpackChunkName: "goods" */ '../components/goods_cate/params')
import Params from '../components/goods_cate/params'
// const Add = () => import(/* webpackChunkName: "goods" */ '../components/goods_cate/add')
import Add from '../components/goods_cate/add'
// const Orders = () => import(/* webpackChunkName: "order" */ '../components/order/orders')
import Orders from '../components/order/orders'
// const Report = () => import(/* webpackChunkName: "order" */ '../components/report/report')
import Report from '../components/report/report'
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
            },
            {
                path: '/reports',
                component: Report
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
    // eslint-disable-next-line eol-last
export default router