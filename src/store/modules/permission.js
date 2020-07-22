import { constantRouterMap } from '@/router'
const _import = require('@/router/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'
// import { tranformStr, isRepeatComponent } from '@/utils/index'

/**
 * 设置访问路由的component对应的组件
 * @param {菜单数据} menuData
 */
function setBaseRouter(menuData, baseData, parentPath) {
  for (const item of menuData) {
    if (item.component && item.component !== '') {
      // if (!isRepeatComponent(item.component)) {
      //   item.name = tranformStr(item.component)
      // } else {
      //   item.name = tranformStr(item.path)
      //   item.meta.name = tranformStr(item.component)
      // }
      try {
        item.component = _import(item.component)
      } catch (e) {
        item.component = _import('errorPage/404')
      }
    } else {
      item.component = _import('errorPage/404')
    }
    juRouter(parentPath, item, baseData)
  }
}

function juRouter(parentPath, item, baseData) {
  if (parentPath) {
    item.path = parentPath + '/' + item.path
  } else {
    item.path = item.path + ''
  }
  if (item.children && item.children.length > 0) {
    setBaseRouter(item.children, baseData, item.path)
  } else {
    baseData.push(item)
  }
}

/**
 * 设置路由最外层layout组件
 * @param {数据菜单} menuData
 */
function setLayout(menuData) {
  const baseMenu = []
  for (const iterator of menuData) {
    const itemMenu = {
      path: '/',
      component: Layout,
      children: [
        iterator
      ]
    }
    baseMenu.push(itemMenu)
  }
  return baseMenu
}

const permission = {
  state: {
    routers: [],
    addRouters: [],
    menu: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
    },
    CLEAR_ROUTERS: (state) => {
      state.routers = []
    }
  },
  actions: {
    GenerateRoutes({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        const menuData =
        [
          {
            path: '',
            name: 'home',
            component: 'home/index',
            meta: { title: '首页', icon: 'icon-shouye', isMenu: true }
          },
          {
            path: 'targetTool',
            name: 'targetTool',
            component: 'targetTool/index',
            meta: { title: '目标设定', icon: 'icon-mubiao', isMenu: true }
          },
          {
            path: 'targetTool1',
            name: 'targetTool1',
            component: 'targetTool/index1',
            meta: { title: '学习/辅导', icon: 'icon-xuexi', isMenu: true }
          },
          {
            path: 'targetTool11',
            name: 'targetTool11',
            component: 'targetTool/index11',
            meta: { title: '会员管理', icon: 'icon-huiyuan', isMenu: true }
          },
          {
            path: 'targetTool111',
            name: 'targetTool111',
            component: 'targetTool/index111',
            meta: { title: '关于我们', icon: 'icon-women', isMenu: true }
          },
          {
            path: 'targetTool1111',
            name: 'targetTool1111',
            component: 'targetTool/index1111',
            meta: { title: '系统管理', icon: 'icon-women', isMenu: true }
          },
          {
            path: 'test',
            name: 'test',
            component: 'targetTool/test',
            meta: { title: '相邻' }
          },
          {
            path: 'outside',
            meta: { title: 'outside' },
            children: [
              {
                path: '/inside',
                component: 'targetTool/inside',
                meta: { title: 'inside' }
              }
            ]
          }
        ]
        var baseData = [] // 路由数据数组
        setBaseRouter(menuData, baseData)
        const baseMenu = setLayout(baseData)
        commit('SET_ROUTERS', baseMenu)
        commit('SET_MENU', menuData)
        resolve(baseMenu)
      })
    }
  }
}

export default permission
