/*
 * @Author: wk 
 * @Date: 2020-07-01 15:26:36 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-07 15:00:40
 * @Description:  忘记密码
 */
<template>
    <div class="ai-login">
        <login-top></login-top>
        <div class="ai-login-form">
                <el-form ref="form" :rules="rules" :model="item" class="login-form">
                    <h3 class="form-title">您好，在此重新设置您的密码</h3>
                      <el-form-item prop="loginName" v-if="this.bj!==2">
                        <el-input class="login-input" v-model.trim="item.loginName" name="username" type="text"
                        placeholder="请输入手机号码" @change="qqq"
                        >
                        </el-input>
                    </el-form-item>
                       <el-form-item prop="newPhone" v-if="this.bj===2">
                        <el-input class="login-input" v-model.trim="item.newPhone" name="newPhone" type="text"
                        placeholder="请输入新手机号码"
                        >
                        </el-input>
                    </el-form-item>
                         <el-form-item prop="email" v-if="retrieve==='手机找回密码'">
                        <el-input class="login-input" v-model.trim="item.email" name="email" type="text"
                        placeholder="请输入邮箱"
                        >
                        </el-input>
                    </el-form-item>
                          <el-form-item prop="emailCode" class="clearfix" v-if="retrieve==='手机找回密码'">
                        <el-input class="login-input" style="width:380px;" v-model.trim="item.emailCode"
                        placeholder="请输入邮箱验证码"
                        >
                        </el-input>
                        <el-button plain type="primary" :disabled="second!==0" style="float:right" @click="timeBeginEm">
                            <span v-if="second===0">获取验证码</span>
                            <span  v-else>{{second}}s后可重发</span>
                        </el-button>
                    </el-form-item>
                    <el-form-item v-if="retrieve==='邮箱找回密码'" prop="captcha" :error="error.captcha" class="clearfix">
                        <el-input class="login-input" style="width:380px;" v-model.trim="item.captcha"
                        placeholder="请输入图形验证码"
                        >
                        </el-input>
                        <img :src="verifyCode"  @click="handleCaptcha" style="height:38px;vertical-align: middle;float:right;"/>
                    </el-form-item>
                    <el-form-item prop="vetCode" class="clearfix" v-if="retrieve==='邮箱找回密码'">
                        <el-input class="login-input" style="width:380px;" v-model.trim="item.vetCode"
                        placeholder="请输入短信验证码"
                        >
                        </el-input>
                        <el-button plain type="primary" :disabled="second!==0" style="float:right" @click="timeBegin">
                            <span v-if="second===0">获取验证码</span>
                            <span  v-else>{{second}}s后可重发</span>
                        </el-button>
                    </el-form-item>
                    <el-form-item prop="loginPasswd" v-if="retrieve==='邮箱找回密码'">
                        <el-input class="login-input" v-model.trim="item.loginPasswd" show-password name="password"  type="text" auto-complete="new-password"
                        placeholder="请输入密码"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="loginPasswdAgain" v-if="retrieve==='邮箱找回密码'">
                        <el-input class="login-input" v-model.trim="item.loginPasswdAgain" show-password
                        placeholder="请再次输入密码"
                        >
                        </el-input>
                    </el-form-item>
                    <el-button v-if="retrieve==='邮箱找回密码'" type="primary" class="login-button" :loading="loading" @click.native.prevent="completeHandle">完成</el-button>
                    <el-button v-if="retrieve==='手机找回密码'" type="primary" class="login-button" :loading="loading" @click.native.prevent="nextStep">下一步</el-button>
                    <div class="clearfix">
                        <div class="login-setting">
                          <a v-if="retrieve==='邮箱找回密码'&&bj===1" @click="retrieve==='邮箱找回密码'?retrieve='手机找回密码':retrieve='邮箱找回密码'">邮箱找回密码</a>
                            <router-link to="/login" class="setting-options">已有账号，直接登录</router-link>
                        </div>
                    </div>
                </el-form>
        </div>
        <login-bottom></login-bottom>
    </div>
</template>
<script>
import { baseRequest } from '@/api/base'
import { encrypt } from '@/utils/encryption'
import { exsit, phone, password, email, verty } from '@/utils/validate'
let timer = null
const errorMsg = {
  loginName: null,
  captcha: null,
  vetCode: null
}
export default {
  data() {
    return {
      bj: 1,
      retrieve: '邮箱找回密码',
      second: 0,
      loading: false,
      item: {
        loginName: null,
        captcha: null,
        verifyRandom: null,
        vetCode: null,
        loginPasswd: null,
        loginPasswdAgain: null,
        email: null,
        emailCode: null,
        newPhone: null
      },
      error: {
        captcha: ''
      },
      verifyCode: '',
      rules: {
        loginName: [
          {
            validator: exsit('请输入手机号码'),
            trigger: 'blur'
          },
          {
            validator: phone('手机号码格式不正确'),
            trigger: 'blur'
          }

        ],
        newPhone: [
          {
            validator: exsit('请输入手机号码'),
            trigger: 'blur'
          },
          {
            validator: phone('手机号码格式不正确'),
            trigger: 'blur'
          }

        ],
        captcha: [
          {
            validator: exsit('请输入图形验证码'),
            trigger: 'blur'
          },
          {
            validator: verty('验证码格式不正确'),
            trigger: 'blur'
          }
        ],
        vetCode: [
          {
            validator: exsit('请输入短信验证码'),
            trigger: 'blur'
          }
        ],
        emailCode: [
          {
            validator: exsit('请输入短信验证码'),
            trigger: 'blur'
          }
        ],
        loginPasswd: [
          {
            validator: exsit('请输入密码'),
            trigger: 'blur'
          },
          {
            validator: password('密码必须是8-16位大小写字母、数字、特殊符合组合'),
            trigger: 'blur'
          }
        ],
        loginPasswdAgain: [
          {
            validator: exsit('请输入再次输入密码'),
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (this.item.loginPasswd === value) {
                callback()
              } else {
                callback('两次密码输入不一致')
              }
            },
            trigger: 'blur'
          }
        ],
        email: [
          {
            validator: exsit('请输入邮箱'),
            trigger: 'blur'
          },
          {
            validator: email('邮箱格式不正确'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.handleCaptcha()
  },
  methods: {
    qqq(val) {
      alert(val)
    },
    // 下一步
    nextStep() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.retrieve === '手机找回密码') {
            baseRequest('/login/getVerifyCode', { email: this.item.email, captcha: this.item.captcha, verifyRandom: this.verifyRandom }).then(response => {
              if (response.code === 2) {
                const validateMsg = response.data.validateMsg
                if (validateMsg.hasOwnProperty('email')) {
                  errorMsg.email = validateMsg.email
                  this.$refs.form.validateField('email')
                  errorMsg['email'] = ''
                }
                if (validateMsg.hasOwnProperty('emailCode')) {
                  errorMsg.emailCode = validateMsg.emailCode
                  this.$refs.form.validateField('emailCode')
                  errorMsg['emailCode'] = ''
                }
                this.loading = false
                return
              }
              // this.$message.success('请前往邮箱验证并修改密码')
              // this.$router.push({ path: 'login' })
              this.retrieve = '邮箱找回密码'
              this.bj = 2
              this.$refs.form.clearValidate()
            }).catch(_ => {
              this.loading = false
            })
          }
        } else {
          return false
        }
      })
    },
    // 点击切换验证码
    handleCaptcha() {
      baseRequest('/login/getVerifyCode', { date: new Date().getTime() }).then((response) => {
        this.verifyCode = 'data:image/png;base64,' + response.data.item.verifyCode
        this.item.verifyRandom = response.data.item.verifyRandom
      })
    },
    // 获取邮箱验证码
    timeBeginEm() {
      this.$refs.form.validateField('email', error => {
        if (!error) {
          baseRequest('/user/rwUser/sendEmailMsg', { requestPhone: this.item.email }).then(response => {
            if (response.code === 2) {
              this.$message.error(response.data.validateMsg.emailCode)
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
    // 获取验证码
    timeBegin() {
      this.$refs.form.validateField('loginName', error => {
        if (!error) {
          let phone = this.item.loginName
          if (this.bj === 2) {
            phone = this.item.newPhone
          }
          baseRequest('/rwPhoneVeriCodeRecords/sendShortMsg', { requestPhone: phone, state: '3' }).then(response => {
            if (response.code === 2) {
              this.$message.error(response.data.validateMsg.vetCode)
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
    // 完成
    completeHandle() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.retrieve === '邮箱找回密码') {
            encrypt(this.item.loginPasswd).then(password => {
              const params = {}
              params.loginName = this.item.loginName
              params.captcha = this.item.captcha
              params.captcha = this.item.captcha
              params.verifyRandom = this.verifyRandom
              params.vetCode = this.item.vetCode
              params.loginPasswd = password
              baseRequest('/rwUser/forgetPassword', params).then(response => {
                if (response.code === 2) {
                  const validateMsg = response.data.validateMsg
                  if (validateMsg.hasOwnProperty('loginName')) {
                    errorMsg.username = validateMsg.loginName
                    this.$refs.form.validateField('loginName')
                    errorMsg['username'] = ''
                  }
                  if (validateMsg.hasOwnProperty('newPhone')) {
                    errorMsg.newPhone = validateMsg.newPhone
                    this.$refs.form.validateField('newPhone')
                    errorMsg['newPhone'] = ''
                  }
                  if (validateMsg.hasOwnProperty('captcha')) {
                    this.verifyCode = 'data:image/png;base64,' + validateMsg.verifyCode
                    this.verifyRandom = validateMsg.verifyRandom
                    console.log('验证码错误')
                    this.$nextTick(function() {
                      errorMsg.captcha = validateMsg.captcha
                      this.$refs.form.validateField('captcha')
                      errorMsg['captcha'] = ''
                    })
                  }
                  if (validateMsg.hasOwnProperty('vetCode')) {
                    errorMsg.vetCode = validateMsg.vetCode
                    this.$refs.form.validateField('vetCode')
                    errorMsg['vetCode'] = ''
                  }
                  this.loading = false
                  return
                }
                this.$message.success('密码修改成功，请重新登录')
                this.$router.push({ path: 'login' })
              }).catch(_ => {
                this.loading = false
              })
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    $borderColor:#d8dada;
    $clickColor:#3463db;
    $fontColor:#8a8a8a;
    .ai-login-form{
        z-index: 1;
        position: relative;
        margin:132px auto 132px;
        height: 668px;;
        background: #fff;
        box-shadow: 0px 1px 20px 0 rgba(0,0,0,0.2);
        border-radius: 10px;
        width: 804px;
        overflow: hidden;
    }
    .login-form{
        margin:100px auto 0;
        width: 534px;
        .form-title{
            height:50px;
            margin: 0;
            font-size: 18px;
            text-align: center;
        }
        .login-input{
            height: 38px;
        }
        .login-button{
            width:100%;
            background-color: #3463db;
        }
        .login-setting{
            float: right;
            .setting-options{
                margin-left: 20px;
                height: 58px;
                line-height: 58px;
                font-size: 16px;
                color: $fontColor;
                &:hover{
                    color: $clickColor;
                }
            }
        }
    }
</style>