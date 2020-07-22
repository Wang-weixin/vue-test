/*
 * @Author: mikey.zhaopeng 
 * @Date: 2020-07-09 17:23:16 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-10 16:26:13
 * @Description:  用户注册
 */
<template>
    <div class="login-container" :style="{backgroundImage:'url('+bjt+')'}">
      <div class="login-dark">
        <div class="login-demol">
          <img :src="block" alt="logo" class="logo" style="border:1px solid #000; ">
          <div class="login-title">
            <img :src="block" alt="">  用户注册
          </div>
          <el-form  ref="form" :model="form" class="login-form">
            <el-form-item >
              <el-input v-model="form.userName" placeholder="请输入姓名" clearable :class="{borderG:userColor===1,borderR:userColor===2}" @focus="focusColor('userColor')" @blur="blurColor('userColor')"></el-input>
            </el-form-item>
            <el-form-item >
              <el-input v-model="form.loginName" placeholder="请输入手机号" clearable :class="{borderG:nameColor===1,borderR:nameColor===2}" @focus="focusColor('nameColor')" @blur="blurColor('nameColor')"></el-input>
            </el-form-item>
              <el-form-item >
              <el-input v-model="form.smsCode"
               placeholder="请输入短信验证码" 
               clearable 
               :class="{borderG:vetColor===1,borderR:vetColor===2}"
               @focus="focusColor('vetColor')"
               @blur="blurColor('vetColor')"
               style="width:59%"
                ></el-input>
               <el-button plain type="primary" :disabled="second!==0" style="width:36%;height:100%;text-align:center;float:right;padding:0" @click="timeBeginEm">
                 <span v-if="second===0">获取验证码</span>
                 <span  v-else>{{second}}s后可重发</span>
               </el-button>
            </el-form-item>
              <el-form-item >
              <el-input type="password" v-model="form.loginPasswd" placeholder="请输入新密码" clearable :class="{borderG:passwdColor===1,borderR:passwdColor===2}" @focus="focusColor('passwdColor')" @blur="blurColor('passwdColor')"></el-input>
            </el-form-item>
              <el-form-item >
              <el-input type="password" v-model="form.secondPasswd" placeholder="再次输入新密码" clearable :class="{borderG:secondColor===1,borderR:secondColor===2}" @focus="focusColor('secondColor')" @blur="blurColor('secondColor')"></el-input>
            </el-form-item>
              <el-form-item >
              <el-input v-model="form.email" placeholder="请输入邮箱" clearable :class="{borderG:emailColor===1,borderR:emailColor===2}" @focus="focusColor('emailColor')" @blur="blurColor('emailColor')"></el-input>
            </el-form-item>
            <div class="login-jump clearfix">
              <a @click="$router.push('/login')" class="a-right">返回登录</a>
            </div>
             <el-button class="login-bt"
                   type="primary"
                   :loading="loading"
                   @click.native.prevent="handleLogin">立即注册</el-button>
             <div class="login-error">{{errMsg}}</div>
          </el-form>
        </div>
      </div>
   
    </div>
</template>
<script>
import bjt from '@/assets/images/bjt.png'
import block from '@/assets/images/block.png'
import iconSuccess from '@/assets/images/icon-success.png'
import { baseRequest } from '@/api/base'
import { encrypt } from '@/utils/encryption'
let timer = null
export default {
  data() {
    return {
      bjt,
      block,
      iconSuccess,
      second: 0,
      loading: false,
      errMsg: '',
      nameColor: 0,
      vetColor: 0,
      passwdColor: 0,
      secondColor: 0,
      userColor: 0,
      emailColor: 0,
      form: {
        userName: '',
        loginName: '',
        loginPasswd: '',
        secondPasswd: '',
        email: '',
        smsCode: ''
      }
    }
  },
  mounted() {
  },
  methods: {
    // 获取短信验证码
    timeBeginEm() {
      if (this.form.loginName) {
        if (/^1[34578]\d{9}$/.test(this.form.loginName)) {
          baseRequest('/user/rwPhoneVeriCodeRecords/sendShortMsg', { requestPhone: this.form.loginName, state: '1' }).then(response => {
            if (response.code === 2) {
              this.errMsg = response.msg
            }
            this.errMsg = ''
          })
          this.second = 180
          timer = setInterval(_ => {
            this.second--
            if (this.second <= 0) {
              clearInterval(timer)
            }
          }, 1000)
        } else {
          this.nameColor = 2
          this.errMsg = '手机号码格式不正确'
          return
        }
      } else {
        this.nameColor = 2
        this.errMsg = '请输入手机号'
        return
      }
    },
    // 立即登录
    handleLogin() {
      this.errMsg = ''
      if (!this.form.userName) {
        this.userColor = 2
        this.errMsg = '姓名不能为空'
        return
      }
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
      if (!this.form.smsCode) {
        this.vetColor = 2
        this.errMsg = '验证码不能为空'
        return
      }
      if (this.form.loginPasswd) {
        if (!/(?!^(\d+|[a-z]+|[A-Z]+|[.~!@#$%^&*?()]+)$)^[\w.~!@#$%^&*?()]{8,16}$/.test(this.form.loginPasswd)) {
          this.passwdColor = 2
          this.errMsg = '密码为8-16位大小写字母,数字,特殊符号组合'
          return
        }
      } else {
        this.passwdColor = 2
        this.errMsg = '密码不能为空'
        return
      }
      if (this.form.secondPasswd) {
        if (this.form.loginPasswd !== this.form.secondPasswd) {
          this.secondColor = 2
          this.errMsg = '两次输入的密码不相同,请重新输入'
          return
        }
      } else {
        this.secondColor = 2
        this.errMsg = '确认密码不能为空'
        return
      }
      if (this.form.email) {
        if (!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.form.email)) {
          this.emailColor = 2
          this.errMsg = '邮箱格式不正确'
          return
        }
      } else {
        this.emailColor = 2
        this.errMsg = '请输入邮箱'
        return
      }

      this.loading = true
      encrypt(this.form.loginPasswd).then(password => {
        baseRequest('/user/rwUser/toCAdd', { userName: this.form.userName, loginName: this.form.loginName, loginPasswd: password, smsCode: this.form.smsCode, email: this.form.email }).then(response => {
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
            if (validateMsg.hasOwnProperty('smsCode')) {
              this.passwdColor = 2
              this.errMsg = validateMsg.smsCode
            }
            if (validateMsg.hasOwnProperty('email')) {
              this.emailColor = 2
              this.errMsg = validateMsg.email
            }

            this.loading = false
            return
          }
          this.$router.push('/login')
        }).catch(_ => {
          this.loading = false
        })
      })
    },
    focusColor(c) {
      if (c === 'nameColor') {
        this.nameColor = 1
      }
      if (c === 'passwdColor') {
        this.passwdColor = 1
      }
      if (c === 'secondColor') {
        this.secondColor = 1
      }
      if (c === 'vetColor') {
        this.vetColor = 1
      }
      if (c === 'userColor') {
        this.userColor = 1
      }
      if (c === 'emailColor') {
        this.emailColor = 1
      }
    },
    blurColor(c) {
      if (c === 'nameColor') {
        this.nameColor = 0
      }
      if (c === 'passwdColor') {
        this.passwdColor = 0
      }
      if (c === 'secondColor') {
        this.secondColor = 0
      }
      if (c === 'vetColor') {
        this.vetColor = 0
      }
      if (c === 'userColor') {
        this.userColor = 0
      }
      if (c === 'emailColor') {
        this.emailColor = 0
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
  .mengban{
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 999;
      background-color: rgba(22,22,22,.6);
      .box{
	width: 310px;
	height: 228px;
	background-color: #ffffff;
	box-shadow: 0px 2px 10px 0px 
		rgba(0, 0, 0, 0.2);
	border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50% ;
  margin-top: -155px;
  margin-left: -114px;
  text-align: center;
  img{
    width: 48px;
	height: 48px;
  margin-top: 40px;
  }
  p{
	height: 16px;
  margin-top: 16px;
	font-family: PingFangSC-Regular;
	font-size: 16px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 25px;
	letter-spacing: 0px;
	color: #222222;
  }
  .box-bt{
	width: 274px;
	height: 50px;
	background-color: #00afff;
	border-radius: 4px;
margin-top: 40px;
  }
      }
  }
  .login-dark{
	width: 50%;
	height: 100%;
	background-color: #222222;
	background: rgba(22,22,22,.06); 
    padding-top: 1px;
   .login-demol{
    margin: 0 auto;
    width: 52%;
	height: 93%;
	background-color: #ffffff;
	box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
	border-radius: 10px;
    position: relative;
     top: 50%; /*偏移*/
     margin-top: -45%; 
     .logo{
    width: 16%;
	height: 8%;
    margin-top: 9%;
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
    margin: 5% auto 4% auto;
    
    img {
    vertical-align: middle;
    height: 90%;
    width: 3px;
    margin-right: 5px;
       
    }
     }
     .login-form{
       width: 68%;
       height: 44%;
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
          margin-top:-8px ;
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
         height: 14%;
         margin-top: 5%;
       }
   
       .login-error{
	        height: 15px;
          text-align: center;
	        font-family: PingFangSC-Regular;
	        font-size: 12px;
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
// .login-container {
//   input{
//     height: 3vw !important;
//   }
// input::-webkit-input-placeholder {
//     /* placeholder颜色 */
//     color: #aab2bd;
//     /* placeholder字体大小 */
//     font-size: 12px;
// }
// }
</style>