/*
 * @Author: lk
 * @Date: 2019-02-01 17:36:33
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-13 09:12:39
 */
import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
import Layout from '../views/layout/Layout'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/reset', component: _import('forgetPossword/index'), hidden: true },
  { path: '/retrieve', component: _import('emailAddress/index'), hidden: true },
  { path: '/register', component: _import('userRegistration/index'), hidden: true },
  // { path: '/registerSuccess', component: _import('registerSuccess/index'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  // { path: '*', redirect: '/404', hidden: true },
  {
    path: '',
    component: Layout,
    redirect: '/',
    children: [
      {
        path: '',
        component: _import('home/index'),
        name: 'home',
        meta: { title: '首页', icon: 'home' }
      }
    ]
  }

]

export const dashboardRouterMap = [
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
]
