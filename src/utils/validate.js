/*
 * @Author: lk
 * @Date: 2019-02-01 17:37:56
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-08 16:37:48
 */
/**
 * 验证是否存在
 * @param {*} errMsg
 */
export function exsit(errMsg) {
  return (rule, value, callback) => {
    if (value) {
      callback()
    } else {
      callback(new Error(errMsg))
    }
  }
}

/**
 * 验证手机号
 * @param {*} errMsg
 */
export function phone(errMsg) {
  return (rule, value, callback) => {
    if (!value) {
      callback()
    } else {
      if (/^1[34578]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error(errMsg))
      }
    }
  }
}

/**
 * 验证邮箱
 * @param {*} errMsg
 */
export function email(errMsg) {
  return (rule, value, callback) => {
    console.log(value)
    if (!value) {
      callback()
    } else {
      if (
        /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value)
      ) {
        callback()
      } else {
        callback(new Error(errMsg))
      }
    }
  }
}

/**
 * 验证验证码
 * @param {*} errMsg
 */
export function verty(errMsg) {
  return (rule, value, callback) => {
    if (/^[0-9a-zA-Z]+$/.test(value)) {
      callback()
    } else {
      callback(new Error(errMsg))
    }
  }
}

/**
 * 验证密码
 * @param {*} errMsg
 */
export function passwordF(errMsg) {
  return (rule, value, callback) => {
    if (
      /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[~!@#$%^&*.]))|((?=.*[a-z])(?=.*[~!@#$%^&*.]))|((?=.*[0-9])(?=.*[~!@#$%^&*.]))).{8,16}$/.test(
        value
      )
    ) {
      callback()
    } else {
      callback(new Error(errMsg))
    }
  }
}

/**
 * 限定密码
 * @param {*} errMsg
 */
export function password(errMsg) {
  return (rule, value, callback) => {
    if (/(?!^(\d+|[a-z]+|[A-Z]+|[.~!@#$%^&*?()]+)$)^[\w.~!@#$%^&*?()]{8,16}$/.test(value)) {
      callback()
    } else {
      callback(new Error(errMsg))
    }
  }
}

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 手机号*/
export function validatePhoneNum(str) {
  return /^1[34578]\d{9}$/.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/**
 * 对请求参数的验证
 * @param {参数} map
 */
export function validateParams(map) {
  const params = {}
  for (const key in map) {
    validateParamsItem(key, map, params)
  }
  return params
}

function validateParamsItem(key, map, params) {
  if (key === 'paramConvertMap') {
    const paramConvertMap = {}
    for (const key2 in map[key]) {
      let param = map[key][key2] + ''
      param = param.replace(/(^\s*)|(\s*$)/g, '')
      if (param !== '' && param !== 'null') {
        paramConvertMap[key2] = param
      }
    }
    params.paramConvertMap = paramConvertMap
  } else {
    let param = map[key] + ''
    param = param.replace(/(^\s*)|(\s*$)/g, '')
    if (param !== '' && param !== 'null') {
      params[key] = param
    }
  }
}
