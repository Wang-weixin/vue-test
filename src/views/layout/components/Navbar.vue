/*
 * @Author: lk 
 * @Date: 2018-09-21 14:54:24 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-13 14:16:25
 * @Description:  
 */
<template>
  <div class="navbar no-text-select">
    <div class="navbar-container inside-container clearfix">
        <div class="navbar-left fl clearfix">
            <!-- <div class="logo">
                <h1><a href="javascript:;"
                  :style="{backgroundImage:'url('+logo+')'}">睿思智得线上辅导系统</a></h1>
              </div> -->
            <h1 class="logo-name fl">睿思智得线上辅导系统</h1>
            <nav class="menu fl">
              <ul class="clearfix">
                <template v-for="(item,index) in menu" >
                  <li v-if="!item.children && item.meta.isMenu" class="menu-item fl" @click="navigateTo(item.name)" :key="item+index" :class="{active:isActive(item)}">
                    <svg-icon v-if="item.meta.icon" :icon-class="item.meta.icon" />
                    <a class="menu-title">{{item.meta.title}}</a>
                  </li>
                  <li v-else-if="item.meta.isMenu" class="menu-item fl" :key="item+index" :class="{active:isActive(item)}">
                    <svg-icon v-if="item.meta.icon" :icon-class="item.meta.icon" />
                    <a class="menu-title">{{item.meta.title}}</a>
                    <a class="menu-title" v-for="(item,index) in item.children" :key="item+index">{{item.meta.title}}</a>
                  </li>
                </template>
              </ul>
            </nav>
        </div>
        <div class="navbar-right fr">
           <router-link :to="'login'">
              <div class="login-btn" type="primary">登录/注册</div>
           </router-link>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import logo from '@/assets/logo/logo.png'
export default {
  data() {
    return {
      // logo
    }
  },
  computed: {
    ...mapGetters([
      'bgColor',
      'menu',
      'addRouters'
    ])
  },
  components: {
  },
  methods: {
    navigateTo(name) {
      this.$router.push({ name })
    },
    isActive(item) {
      if (this.$route.name === 'home' && item.name === 'home') {
        return true
      } else if (this.$route.name === item.name || this.$route.path.startsWith(`/${item.path}/`)) {
        return true
      } else {
        return false
      }
    },
    logout() {
      this.$confirm('确定注销当前登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$navbarHieght:60px;
$menuMaring:25px;
$activeColor:#00afff;
.navbar {
	height: $navbarHieght;
	background-color: #ffffff;
	box-shadow: 0px 2px 10px 0px 
    rgba(0, 0, 0, 0.1);
  .navbar-container{
    height: $navbarHieght;
    background-color: #ffffff;
  }
  .logo-name{
    height: $navbarHieght;
    font-family: PingFangSC-Semibold;
    font-size: 22px;
    font-weight: normal;
    font-stretch: normal;
    line-height: $navbarHieght;
    letter-spacing: 1px;
    color: $activeColor;
    margin-right: $menuMaring;
    font-weight: bold;
  }
  .menu{
    height: $navbarHieght;
    line-height: $navbarHieght;
    .menu-item{
      margin:0 $menuMaring;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #222222;
      padding:0 10px;
      position: relative;
      cursor: pointer;
      &:hover{
        color:$activeColor;
      }
      &.active{
        background-image: linear-gradient(#fff, #cff0ff);
        color:$activeColor;
        &:after{
          content: "";
          position: absolute;
          width: 100%;
          height: 4px;
          background-color: $activeColor;
          left: 0;
          bottom:0;
        }
      }
    }
  }
  .navbar-right{
    line-height: $navbarHieght;
    .login-btn{
      width: 100px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      margin-top:15px;
      background-color: $activeColor;
      border-radius: 4px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #ffffff;
    }
  }
}
</style>
