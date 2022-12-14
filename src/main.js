import 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'

import App from './App'
import store from './store'
import Routers from './router'
import Util from 'common/js/setTitle'
import 'common/scss/index.scss'
import 'element-ui/lib/theme-default/index.css'
import AxiosPlugin from 'common/js/Axios'
import {cookie} from "./common/js/cookie";

Vue.use(AxiosPlugin)
Vue.use(ElementUI)
Vue.use(VueRouter)

// route config
const router = new VueRouter({
  routes: Routers
})
router.beforeEach((to, from, next) => {
  Util.title(to.meta.title)
  let islogin = cookie.get("islogin")
  if(to.name !== 'login' && islogin !== '1'){
    return next('/login')
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
