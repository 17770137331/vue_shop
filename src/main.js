import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor)
Vue.component(ZkTable.name, ZkTable)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.localStorage.getItem('token')
        // console.log(config)
    return config
})
Vue.filter('toStringDate', item => {
    const sj = new Date(item)
    const y = sj.getFullYear()
    const m = (sj.getMonth() + 1 + '').padStart(2, '0')
    const d = (sj.getDate() + '').padStart(2, '0')

    const hh = (sj.getHours() + '').padStart(2, '0')
    const mm = (sj.getMinutes() + '').padStart(2, '0')
    const ss = (sj.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')