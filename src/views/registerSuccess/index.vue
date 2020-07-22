/*
 * @Author: lk
 * @Date: 2019-04-11 08:56:53
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-02 15:22:59
 * @Description:  注册成功
 */
<template>
    <div class="ai-login">
        <login-top></login-top>
        <div class="ai-login-form">
            <el-form ref="form"  class="login-form">
                <div class="register-success" :style="{backgroundImage:'url('+picture+')'}">
                    <p>非常感谢您的注册，点击完成可跳回登录!</p>
                    <!-- <p>{{$store.state.user.token | hidPhone}}</p> -->
                </div>
                <router-link to="/"><el-button type="primary" class="login-button" :loading="loading" >完成</el-button></router-link>
            </el-form>
        </div>
        <login-bottom></login-bottom>
    </div>
</template>
<script>
import picture from '@/assets/images/picture.png'
export default {
  data() {
    return {
      picture,
      loading: false,
      loginWays: 1 // 1密码登录 2验证码登录
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
        margin:226px auto;
        height: 464px;;
        background: #fff;
        box-shadow: 0px 1px 20px 0 rgba(0,0,0,0.2);
        border-radius: 10px;
        width: 804px;
        overflow: hidden;
    }
    .login-form{
        margin:26px auto 0;
        width: 534px;
        .register-success{
            height: 304px;
            background-repeat: no-repeat;
            background-position: center;
            padding-top: 184px;
            text-align: center;
            p{
                font-size: 18px;
                color:#333;
                &:last-of-type{
                    font-size: 16px;
                }
            }
        }
        .login-button{
            width:100%;
            background-color: #3463db;
        }
    }
</style>

