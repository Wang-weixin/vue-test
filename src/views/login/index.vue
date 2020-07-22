/*
 * @Author: wk
 * @Date: 2020-07-07 16:24:55 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-10 15:38:43
  * @Description:  登录
 */
<template>
    <div class="login-container" :style="{backgroundImage:'url('+bjt+')'}">
      <div class="login-dark">
        <div class="login-demol">
          <img :src="block" alt="logo" class="logo" style="border:1px solid #000;  width: 28%;  height: 14%;">
          <div class="login-title">
            <img :src="block" alt="">  用户登录
          </div>
          <el-form  ref="form" :model="form" class="login-form">
            <el-form-item >
              <el-input v-model="form.loginName" placeholder="请输入手机号" clearable :class="{borderG:nameColor===1,borderR:nameColor===2}" @focus="focusColor('nameColor')" @blur="blurColor('nameColor')"></el-input>
            </el-form-item>
              <el-form-item >
              <el-input type="password" v-model="form.loginPasswd" placeholder="请输入密码" clearable :class="{borderG:passwdColor===1,borderR:passwdColor===2}" @focus="focusColor('passwdColor')" @blur="blurColor('passwdColor')"></el-input>
            </el-form-item>
             <el-form-item >
              <el-input  v-model="form.captcha" placeholder="请输入验证码" clearable :class="{borderG:captchaColor===1,borderR:captchaColor===2}" @focus="focusColor('captchaColor')"  @blur="blurColor('captchaColor')"></el-input>
              <a class="login-captcha"  @click="handleCaptcha">
                <img :src="verifyCode" />
              </a>
            </el-form-item>
            <div class="login-jump clearfix">
              <a @click="$router.push({ path: '/reset' })" class="a-left">忘记密码?</a>
              <a @click="$router.push('/register')" class="a-right">立即注册</a>
            </div>
             <el-button class="login-bt"
                   type="primary"
                   :loading="loading"
                   @click.native.prevent="handleLogin">立即登录</el-button>
             <div class="login-error">{{errMsg}}</div>
          </el-form>
        </div>
      </div>
    </div>
</template>
<script>
import bjt from '@/assets/images/bjt.png'
import block from '@/assets/images/block.png'
import { baseRequest } from '@/api/base'
import { encrypt } from '@/utils/encryption'
export default {
  data() {
    return {
      bjt,
      block,
      loading: false,
      errMsg: '',
      nameColor: 0,
      passwdColor: 0,
      captchaColor: 0,
      verifyRandom: '',
      verifyCode: '',
      form: {
        loginName: '',
        loginPasswd: '',
        captcha: ''
      }
    }
  },
  mounted() {
    this.handleCaptcha()
  },
  methods: {
    // 立即登录
    handleLogin() {
      this.errMsg = ''
      if (this.form.loginName) {
        if (!/^1[34578]\d{9}$/.test(this.form.loginName)) {
          this.nameColor = 2
          this.errMsg = '手机号码格式不正确'
          return
        }
      } else {
        this.nameColor = 2
        this.errMsg = '请输入手机号'
        return
      }
      if (!this.form.loginPasswd) {
        this.passwdColor = 2
        this.errMsg = '密码不能为空'
        return
      }
      if (!this.form.captcha) {
        this.captchaColor = 2
        this.errMsg = '验证码不能为空'
        return
      }
      this.loading = true
      encrypt(this.form.loginPasswd).then(password => {
        baseRequest('/user/login/', { loginName: this.form.loginName, loginPasswd: password, captcha: this.form.captcha, verifyRandom: this.verifyRandom }).then(response => {
          if (response.code === 2) {
            const validateMsg = response.data.validateMsg
            if (validateMsg.hasOwnProperty('loginName')) {
              this.nameColor = 2
              this.errMsg = validateMsg.loginName
            }
            if (validateMsg.hasOwnProperty('loginPassword')) {
              this.passwdColor = 2
              this.errMsg = validateMsg.loginName
            }
            if (validateMsg.hasOwnProperty('captcha')) {
              this.verifyCode = 'data:image/png;base64,' + validateMsg.verifyCode
              this.verifyRandom = validateMsg.verifyRandom
              this.$nextTick(function() {
                this.errMsg = validateMsg.captcha
                this.passwdColor = 2
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
    },
    // 点击切换验证码
    handleCaptcha() {
      baseRequest('/user/userLogin/getVerifyCode', { date: new Date().getTime() }).then((response) => {
        this.verifyCode = 'data:image/png;base64,' + response.data.item.verifyCode
        this.verifyRandom = response.data.item.verifyRandom
      })
    },
    focusColor(c) {
      if (c === 'nameColor') {
        this.nameColor = 1
      }
      if (c === 'passwdColor') {
        this.passwdColor = 1
      }
      if (c === 'captchaColor') {
        this.captchaColor = 1
      }
    },
    blurColor(c) {
      if (c === 'nameColor') {
        this.nameColor = 0
      }
      if (c === 'passwdColor') {
        this.passwdColor = 0
      }
      if (c === 'captchaColor') {
        this.captchaColor = 0
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.login-container{
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
  background-position: 0 0;
  background-repeat:no-repeat;
  background-size: 100% 100%;
  .login-dark{
	width: 50%;
	height: 100%;
	background-color: #222222;
	background: rgba(22,22,22,.06); 
    padding-top: 1px;
   .login-demol{
    margin: 0 auto;
    width: 52%;
	height: 70%;
	background-color: #ffffff;
	box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
	border-radius: 10px;
    position: relative;
     top: 50%; /*偏移*/
     margin-top: -34%; 
     .logo{
    width: 28%;
	height: 14%;
    margin-top: 12%;
    margin-left: 16%;
    // margin-bottom: 8%;
     }
    .login-title{
     width: 68%;
	height: 4%;
	font-family: PingFangSC-Semibold;
	font-size: 1rem;
	font-weight: 600;
	font-stretch: normal;
	line-height: 4%;
	letter-spacing: 0px;
	color: #222222;
    margin: 8% auto 4% auto;
    
    img {
    vertical-align: middle;
    height: 90%;
    width: 3px;
    margin-right: 5px;
       
    }
     }
     .login-form{
       width: 68%;
       height: 56%;
       margin: 0  auto;
       .login-jump{
	        height: 14px;
	        font-family: PingFangSC-Regular;
	        font-size: 0.5rem;
	        font-weight: normal;
	        font-stretch: normal;
	        line-height: 21px;
	        letter-spacing: 0px;
	        color: #555555;
          margin-top:-6px ;
          .a-left{
            float: left;
          }
          .a-right{
            float: right;
          }
           .a-left:hover{
            color: #00afff;
          }
           .a-right:hover{
            color: #00afff;
          }
       }
       .login-bt{
         width: 100%;
         height: 15%;
         margin-top: 8%;
       }
       .login-captcha{
         position: absolute;
          top: 50%;
          margin-top: -13px;
          right: 5px;
          img{
            width: 84px;
	          height: 26px;
            border-radius: 4px;
            display: block;
          }
       }
      
       .login-error{
	        height: 15px;
          text-align: center;
	        font-family: PingFangSC-Regular;
	        font-size: 14px;
	        font-weight: normal;
	        font-stretch: normal;
	        line-height: 25px;
	        letter-spacing: 0px;
	        color: #fb664a;
          margin-top: 5px;
       }
     }
    }
  }
}
</style>
<style lang="scss">
.login-container{
  .login-form{
    .el-form-item{
      height: 15%;
      margin-bottom: 6%;
      .el-form-item__content{
        height: 100%;
        .el-input{
            height: 100%;
            input{
               height: 100%;
            }
        }
      }
    }
  }
}
 .borderG{
         input{
           border-color: #00afff;
         }
       }
         .borderR{
         input{
           border-color: #F56C6C;
         }
       }
</style>