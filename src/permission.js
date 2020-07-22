/*
 * @Author: lk
 * @Date: 2019-02-01 17:38:40
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-14 11:14:15
 */
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/reset', '/retrieve', '/register', '/', '/targetTool']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      // if (!store.getters.name && !store.getters.userId) { // 判断当前用户是否已拉取完user_info信息
      //   store.dispatch('GetUserInfo').then(_ => {
      //     addRouter(next, to)
      //   })
      // } else {
      addRouter(next, to)
      // }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      addRouter(next, to)
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

/**
 * 添加路由
 * @param {*} next
 */
function addRouter(next, to) {
  if (store.getters.permission_routers.length === 0) {
    store.dispatch('GenerateRoutes').then(() => { // 根据roles权限生成可访问的路由表
      router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
      next({ ...to })
    })
  } else {
    next()
  }
}
