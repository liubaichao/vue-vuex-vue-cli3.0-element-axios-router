import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'

import './assets/style.css'

import Viewer from 'v-viewer'//图片查看器
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer, {
  defaultOptions: {
      zIndex: 9999
  }
})

import my from './assets/js/common.js' //全局函数

Vue.prototype.$my = my //全局函数  使用方法  this.$my.getQueryString('openid')
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
