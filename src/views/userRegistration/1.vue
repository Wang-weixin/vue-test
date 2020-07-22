/*
 * @Author: wk 
 * @Date: 2020-07-01 15:33:28 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-09 11:50:54
 * @Description:  用户注册
 */
<template>
    <div class="ai-login">
        <login-top></login-top>
        <div class="ai-login-form">
                <el-form ref="form" :rules="rules" :model="item" class="login-form">
                    <h3 class="form-title">欢迎注册</h3>
                    <el-form-item prop="loginName">
                        <el-input class="login-input" v-model.trim="item.loginName" name="username" type="text"
                        placeholder="请输入手机号码"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="captcha" :error="error.captcha" class="clearfix">
                        <el-input class="login-input" style="width:380px;" v-model.trim="item.captcha"
                        placeholder="请输入图形验证码"
                        >
                        </el-input>
                        <img :src="verifyCode"  @click="handleCaptcha" style="height:38px;vertical-align: middle;float:right;"/>
                    </el-form-item>
                    <el-form-item prop="vetCode" class="clearfix">
                        <el-input class="login-input" style="width:380px;" v-model.trim="item.vetCode"
                        placeholder="请输入短信验证码"
                        >
                        </el-input>
                        <el-button plain type="primary" :disabled="second!==0" style="float:right" @click="timeBegin">
                            <span v-if="second===0">获取验证码</span>
                            <span  v-else>{{second}}s后可重发</span>
                        </el-button>
                    </el-form-item>
                    <el-form-item prop="loginPasswd">
                        <el-input class="login-input" v-model.trim="item.loginPasswd" show-password name="password"  type="text" auto-complete="new-password"
                        placeholder="请输入密码"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="loginPasswdAgain">
                        <el-input class="login-input" v-model.trim="item.loginPasswdAgain" show-password
                        placeholder="请再次输入密码"
                        >
                        </el-input>
                    </el-form-item>
                        <el-form-item prop="email">
                        <el-input class="login-input" v-model.trim="item.email" show-password
                        placeholder="请输入邮箱"
                        >
                        </el-input>
                    </el-form-item>
                    <el-button type="primary" class="login-button" :loading="loading" @click.native.prevent="completeHandle">完成</el-button>
                    <div class="clearfix">
                        <div class="login-setting">
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
      second: 0,
      loading: false,
      item: {
        loginName: null,
        captcha: null,
        verifyRandom: null,
        vetCode: null,
        loginPasswd: null,
        loginPasswdAgain: null,
        email: null
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
          // {
          //   validator: (rules, value, callback) => {
          //     baseRequest('/aiPhoneVeriCodeRecords/verPhone', { requestPhone: value }).then(response => {
          //       if (response.code === 1) {
          //         if (response.data.item.status === '0') {
          //           callback()
          //         } else {
          //           callback(new Error('手机号已存在'))
          //         }
          //       } else {
          //         callback()
          //       }
          //     })
          //   },
          //   trigger: 'blur'
          // }
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
            validator: email('邮箱格式不正确'),
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback('请输入邮箱账号')
              }
            },
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
    // 点击切换验证码
    handleCaptcha() {
      baseRequest('/login/getVerifyCode', { date: new Date().getTime() }).then((response) => {
        this.verifyCode = 'data:image/png;base64,' + response.data.item.verifyCode
        this.item.verifyRandom = response.data.item.verifyRandom
      })
    },
    // 获取验证码
    timeBegin() {
      this.$refs.form.validateField('loginName', error => {
        if (!error) {
          baseRequest('/rwPhoneVeriCodeRecords/sendShortMsg', { requestPhone: this.item.loginName, state: '1' }).then(response => {
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
      // this.error.captcha = ''
      // this.$refs.form.validateField('loginName', error => {
      //   this.$refs.form.validateField('captcha', error2 => {
      //     if (!error && !error2) {
      //       baseRequest('/aiPlatUser/isVerifyCode', { imgCode: this.item.captcha, verifyRandom: this.item.verifyRandom }).then(response => {
      //         if (response && response.code === 2 && response.data.validateMsg.hasOwnProperty('verifyCode')) {
      //           this.verifyCode = 'data:image/png;base64,' + response.data.validateMsg.verifyCode
      //           this.item.verifyRandom = response.data.validateMsg.verifyRandom
      //           this.error.captcha = response.data.validateMsg.imgCode
      //         } else if (response && response.code === 1) {
      //           baseRequest('/aiPhoneVeriCodeRecords/sendShortMsg', { requestPhone: this.item.loginName, state: '1' }).then(response => {
      //             if (response.code === 2) {
      //               this.$message.error(response.data.validateMsg.vetCode)
      //             }
      //           })
      //           this.second = 59
      //           timer = setInterval(_ => {
      //             this.second--
      //             if (this.second <= 0) {
      //               clearInterval(timer)
      //             }
      //           }, 1000)
      //         }
      //       })
      //     }
      //   })
      // })
    },
    // 完成
    completeHandle() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          encrypt(this.item.loginPasswd).then(password => {
            const params = {}
            params.loginName = this.item.loginName
            params.captcha = this.item.captcha
            params.captcha = this.item.captcha
            params.verifyRandom = this.verifyRandom
            params.vetCode = this.item.vetCode
            params.loginPasswd = password
            params.email = this.item.email
            baseRequest('/rwUser/toCAdd', params).then(response => {
              if (response.code === 2) {
                const validateMsg = response.data.validateMsg
                if (validateMsg.hasOwnProperty('loginName')) {
                  errorMsg.username = validateMsg.loginName
                  this.$refs.form.validateField('loginName')
                  errorMsg['username'] = ''
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
              this.$router.push({ path: '/registerSuccess' })
              // this.$store.dispatch('LoginByUsername', response.data.item.token).then(() => {
              //   // this.loading = false
              //   this.$router.push({ path: '/registerSuccess' })
              // }).catch(() => {
              //   this.loading = false
              // })
            }).catch(_ => {
              this.loading = false
            })
          })
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