/*
 * @Author: lk
 * @Date: 2019-02-01 17:38:32
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-13 15:32:36
 * @Description:  入口js
 */
import Vue from 'vue'

import 'normalize.css/normalize.css'

import Element, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss'

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang'
import './icons'
import './errorLog'
import './permission'

import * as filters from './filters'

import elDragDialog from '@/directive/el-dragDialog'

Vue.use(Element, {
  size: 'medium',
  i18n: (key, value) => i18n.t(key, value)
})

import surPagination from '@/components/Pagination'
Vue.component('surPagination', surPagination)

Vue.prototype.$Message = Message
Vue.prototype.validateLimit = function(size) {
  return (rule, value, callback) => {
    if (!value) {
      callback()
    } else {
      if (value.length <= size) {
        callback()
      } else {
        callback(new Error('最多输入' + size + 'xxx'))
      }
    }
  }
}

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.directive('elDragDialog', elDragDialog)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
