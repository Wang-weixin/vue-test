import request from '@/utils/request'
import { validateInputs } from '@/utils/index'

export function loginByUsername(username, password) {
  var params = {
    loginName: username,
    loginPasswd: password
  }
  return request({
    url: '/login/login',
    method: 'post',
    data: JSON.stringify(params)
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/login/getLoginUserInfo',
    method: 'post',
    data: JSON.stringify(validateInputs({ accessType: true }))
  })
}
