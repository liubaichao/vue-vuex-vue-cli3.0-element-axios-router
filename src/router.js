import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import my from './assets/js/common.js' //全局函数

import Login from './views/Login.vue'

// import OnlineAudit from './views/admin/OnlineAudit.vue' //线上审核
// import ReceiptList from './views/admin/ReceiptList.vue' //回执单
// import PatientList from './views/admin/PatientList.vue' //患者管理
// import DrugPoint from './views/admin/DrugPoint.vue' //领药机构
// import VolunteerList from './views/admin/VolunteerList.vue'//志愿者管理
// import ExpressList from './views/admin/ExpressList.vue'//快递管理

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      name: '/',
      component: Login,
      meta: {
        title: '登陆',
      }
    },
    
    // {
    //   path: '/OnlineAudit',
    //   name: 'OnlineAudit',
    //   component: OnlineAudit,
    //   meta: {
    //     title: '线上审核',
    //     requireAuth: true
    //   }
    // },
    // {
    //   path: '/ReceiptList',
    //   name: 'ReceiptList',
    //   component: ReceiptList,
    //   meta: {
    //     title: '回执单',
    //     requireAuth: true
    //   }
    // },
    // {
    //   path: '/PatientList',
    //   name: 'PatientList',
    //   component: PatientList,
    //   meta: {
    //     title: '患者管理',
    //     requireAuth: true
    //   }
    // },
    // {
    //   path: '/DrugPoint',
    //   name: 'DrugPoint',
    //   component: DrugPoint,
    //   meta: {
    //     title: '领药机构',
    //     requireAuth: true
    //   }
    // },
    // {
    //   path: '/VolunteerList',
    //   name: 'VolunteerList',
    //   component: VolunteerList,
    //   meta: {
    //     title: '志愿者管理',
    //     requireAuth: true
    //   }
    // },
    // {
    //   path: '/ExpressList',
    //   name: 'ExpressList',
    //   component: ExpressList,
    //   meta: {
    //     title: '快递管理',
    //     requireAuth: true
    //   }
    // },
  ]
})

//动态加载路由 start
let userInfo = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):''
if(userInfo){ //此处解决用户手动清除缓存||刷新页面（store刷新就会清空），跳转login
  let userId = JSON.parse(localStorage.getItem('userInfo')).id
  store.dispatch('getRoleArr',{id:userId}).then(res=>{ //获取权限树，生成路由
    my.loadRouter(res ,router)
  })
}else{
  router.push('/')
}
//动态加载路由 end

//路由钩子函数 start
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if(to.matched.some(record => record.meta.requireAuth)){
    if(localStorage.getItem('userInfo')){
      next()
    }else{
      next('/')
    }
  }else{
    next()
  }
})
//路由钩子函数 end

export default router