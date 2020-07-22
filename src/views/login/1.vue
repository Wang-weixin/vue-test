/*
 * @Author: wk
 * @Date: 2020-07-07 16:08:47 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-09 18:09:01
 * @Description:  用户登录
 */
<template>
  <div class="login-container">
    <div class="login-area clearfix">
      <div class="login-image">
        <img class="login-sign"
             :src="sign">
      </div>
      <el-form class="login-form"
               autoComplete="on"
               :model="loginForm"
               :rules="loginRules"
               ref="loginForm"
               label-position="left">
        <h1 class="login-title">
          睿思智得线上辅导系统
        </h1>
        <div class="form-options">
          <a :class="loginWays===1?'clickOption':''"
             @click="changeWays(1)">密码登录</a>&nbsp;|
          <a :class="loginWays===2?'clickOption':''"
             @click="changeWays(2)">验证码登录</a>
        </div>
        <el-form-item prop="username">
          <i class="login-icon user"
             :style="{backgroundImage:'url('+cutter+')'}"></i>
          <el-input name="username"
                    type="text"
                    v-model="loginForm.username"
                    placeholder="请输入用户名"
                    clearable />
          <div class="login-form-hr"></div>
        </el-form-item>

        <div v-if="loginWays===1">
          <el-form-item prop="password">
            <i class="login-icon passwd"
               :style="{backgroundImage:'url('+cutter+')'}"></i>
            <el-input name="password"
                      :type="passwordType"
                      @keyup.enter.native="handleLogin"
                      v-model="loginForm.password"
                      autoComplete="on"
                      placeholder="请输入密码"
                      clearable />
            <div class="login-form-hr"></div>
          </el-form-item>
          <el-form-item prop="captcha"
                        class="captcha">
            <i class="login-icon cap"
               :style="{backgroundImage:'url('+cutter+')'}"></i>
            <el-input name="captcha"
                      placeholder="请输入验证码"
                      clearable
                      v-model="loginForm.captcha"
                      @keyup.enter.native="handleLogin" />
            <a class="login-captcha"  @click="handleCaptcha">
              <img :src="verifyCode" />
              </a>
            <div class="login-form-hr"></div>
          </el-form-item>
        </div>
        <el-form-item prop="vetCode"
                      v-else
                      class="captcha">
          <i class="login-icon cap"
             :style="{backgroundImage:'url('+cutter+')'}"></i>
          <el-input name="vetCode"
                    placeholder="请输入短信验证码"
                    clearable
                    v-model="loginForm.vetCode"
                    @keyup.enter.native="handleLogin" />
          <el-button plain
                     type="primary"
                     :disabled="second!==0"
                     class="yanzheng-button login-captcha"
                     @click="timeBegin">
            <span v-if="second===0">获取验证码</span>
            <span v-else>{{second}}s后可重发</span>
          </el-button>
          <!-- <a class="login-captcha"
             @click="handleCaptcha"><img :src="verifyCode" /></a> -->
          <div class="login-form-hr"></div>
        </el-form-item>
        <div>
<a @click="$router.push({ path: '/reset' })">忘记密码?</a>
<a @click="$router.push('/register')">立即注册</a>
        </div>
        <el-button class="login-button"
                   type="primary"
                   :loading="loading"
                   @click.native.prevent="handleLogin">登&nbsp;&nbsp;录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { baseRequest } from '@/api/base'
import { encrypt } from '@/utils/encryption'
// import { getToken } from '@/utils/auth'
import sign from '@/assets/images/sign.jpg'
import cutter from '@/assets/images/cutter.png'
import { exsit, phone } from '@/utils/validate'
let timer = null
const errorMsg = {
  username: '',
  password: '',
  captcha: '',
  vetCode: ''
}
export default {
  name: 'login',
  created() {
    // if (getToken()) {
    //   this.$router.push('/')
    // } else {
    this.handleCaptcha()
    // }
  },
  data() {
    return {
      sign,
      cutter,
      second: 0,
      loginWays: 1, // 1密码登录 2验证码登录
      verifyCode: '',
      verifyRandom: '',
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        vetCode: ''
      },
      loginRules:
      {
        username: [
          {
            validator: exsit('请输入手机号码'),
            trigger: 'blur'
          },
          {
            validator: phone('手机号码格式不正确'),
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (errorMsg.username) {
                callback(new Error(errorMsg.username))
              } else {
                callback()
              }
            }
          }
        ],
        password: [{ required: true, message: '密码不能为空' },
          {
            validator: (rule, value, callback) => {
              if (errorMsg.password) {
                callback(new Error(errorMsg.password))
              } else {
                callback()
              }
            }
          }],
        vetCode: [{ required: true, message: '短信验证码不能为空' },
          {
            validator: (rule, value, callback) => {
              if (errorMsg.vetCode) {
                callback(new Error(errorMsg.vetCode))
              } else {
                callback()
              }
            }
          }],
        captcha: [{ required: true, message: '验证码不能为空' },
          {
            validator: (rule, value, callback) => {
              if (errorMsg.captcha) {
                callback(new Error(errorMsg.captcha))
              } else {
                callback()
              }
            }
          }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },
  methods: {
    // 获取验证码
    timeBegin() {
      this.$refs.loginForm.validateField('username', error => {
        if (!error) {
          baseRequest('/rwPhoneVeriCodeRecords/sendShortMsg', { requestPhone: this.loginForm.username, state: '2' }).then(response => {
            if (response.code === 2) {
              this.$message.error(response.data.validateMsg.verCode)
            }
          })
          this.second = 59
          timer = setInterval(_ => {
            this.second--
            if (this.second <= 0) {
              clearInterval(timer)
            }
          }, 1000)
        }
      })
    },
    // 点击切换
    changeWays(type) {
      this.loginWays = type
      for (const index in this.loginForm) {
        this.loginForm[index] = ''
      }
      this.$refs.loginForm.clearValidate()
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    // 点击切换验证码
    handleCaptcha() {
      baseRequest('/login/getVerifyCode', { date: new Date().getTime() }).then((response) => {
        this.verifyCode = 'data:image/png;base64,' + response.data.item.verifyCode
        this.verifyRandom = response.data.item.verifyRandom
      })
    },
    // 点击登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginWays === 1) {
            // 加密：要测试的明文数据
            encrypt(this.loginForm.password).then(password => {
              const username = this.loginForm.username.trim()
              baseRequest('/login/loginPassword', { loginName: username, loginPasswd: password, captcha: this.loginForm.captcha, verifyRandom: this.verifyRandom }).then(response => {
                if (response.code === 2) {
                  const validateMsg = response.data.validateMsg
                  if (validateMsg.hasOwnProperty('loginName')) {
                    errorMsg.username = validateMsg.loginName
                    this.$refs.loginForm.validateField('username')
                    errorMsg['username'] = ''
                  }
                  if (validateMsg.hasOwnProperty('loginPassword')) {
                    errorMsg.password = validateMsg.loginPassword
                    this.$refs.loginForm.validateField('password')
                    errorMsg['password'] = ''
                    console.log('密码错误')
                  }
                  if (validateMsg.hasOwnProperty('captcha')) {
                    this.verifyCode = 'data:image/png;base64,' + validateMsg.verifyCode
                    this.verifyRandom = validateMsg.verifyRandom
                    console.log('验证码错误')
                    this.$nextTick(function() {
                      errorMsg.captcha = validateMsg.captcha
                      this.$refs.loginForm.validateField('captcha')
                      errorMsg['captcha'] = ''
                    })
                  }
                  this.loading = false
                  return
                }
                this.$store.dispatch('LoginByUsername', response.data.item.token).then(() => {
                // this.loading = false
                  this.$router.push({ path: '/' })
                }).catch(() => {
                  this.loading = false
                })
              }).catch(_ => {
                this.loading = false
              })
            })
          } else if (this.loginWays === 2) {
            baseRequest('/login/loginVerify', { loginName: this.loginForm.username, vetCode: this.loginForm.vetCode }).then(response => {
              if (response.code === 2) {
                const validateMsg = response.data.validateMsg
                if (validateMsg.hasOwnProperty('loginName')) {
                  errorMsg.username = validateMsg.loginName
                  this.$refs.loginForm.validateField('username')
                  errorMsg['username'] = ''
                }
                if (validateMsg.hasOwnProperty('vetCode')) {
                  errorMsg.vetCode = validateMsg.vetCode
                  this.$refs.loginForm.validateField('vetCode')
                  errorMsg['vetCode'] = ''
                }
                this.loading = false
                return
              }
              this.$store.dispatch('LoginByUsername', response.data.item.token).then(() => {
                // this.loading = false
                this.$router.push({ path: '/' })
              }).catch(() => {
                this.loading = false
              })
            }).catch(_ => {
              this.loading = false
            })
          }
        } else {
          // alert('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
  .login-area {
    height: 699px;
    width: 1080px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .login-image {
      width: 550px;
      box-shadow: 20px 0px 40px 5px #c4d4ec;
      border-radius: 10px;
      overflow: hidden;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      img {
        width: 100%;
        display: block;
      }
    }
    .login-form {
      width: calc(100% - 550px);
      background-color: #fff;
      margin: 22px 0;
      height: calc(100% - 44px);
      padding: 0 100px 0 88px;
      border-radius: 10px;
      position: absolute;
      top: 0;
      left: 550px;
      box-shadow: 1px 0px 11px 0px #dde2ee;
      .login-title {
        line-height: 222px;
        font-size: 1rem;
        font-weight: bold;
        color: #4574be;
        text-align: center;
        letter-spacing: 2px;
      }
      .form-options {
        height: 68px;
        line-height: 68px;
        // padding-left: 182px;
        text-align: center;
        font-size: 16px;
        color: #ababac;
        .clickOption {
          color: blue;
        }
      }
      .el-form-item {
        position: relative;
        .el-form-item__content {
          .login-icon {
            position: absolute;
            top: 4px;
            left: 0px;
            width: 26px;
            height: 26px;
            &.user {
              background-position: 55px 400px;
            }
            &.passwd {
              background-position: 55px 334px;
            }
            &.cap {
              background-position: 55px 272px;
            }
          }
        }
        .login-captcha {
          position: absolute;
          top: 0;
          right: 0;
          img {
            height: 35px;
            display: block;
          }
        }
      }
      .login-form-hr {
        height: 2px;
        border-bottom: 1px solid #3164b7;
        margin-bottom: 3px;
      }
      .login-button {
        width: 100%;
        margin-top: 30px;
        height: 47px;
        border-radius: 10px;
        background-image: linear-gradient(to right, #3264b7, #7ca7ef);
        // background-color: #3264b7;
        border: none;
        &:hover {
          background-image: linear-gradient(to right, #3d6cb8, #90b4f3);
        }
      }
      .el-input {
        display: inline-block;
        padding-left: 26px;
        input {
          background: transparent;
          border: 0px;
          -webkit-appearance: none;
          border-radius: 0px;
          padding: 2px 5px;
          color: #7ca6ee;
          font-size: 14px;
          &::-webkit-input-placeholder {
            color: #7ca6ee;
          }
          &::-moz-input-placeholder {
            color: #7ca6ee;
          }
          &::-ms-input-placeholder {
            color: #7ca6ee;
          }
        }
      }
    }
  }
  @media (max-width: 1517px) {
    height: auto;
    position: static;
    .login-area {
      margin: 184px auto;
    }
  }
}
</style>
