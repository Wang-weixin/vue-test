<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item+index">
        <span v-if="!item.path" class="no-redirect">{{item.title}}</span>
        <router-link v-else class="redirect" :to="item.path">{{(item.title)}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: []
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      this.levelList = [{ title: '当前位置' }]
      const pathTitle = this.$route.meta.titlePath
      const allPath = this.$route.meta.allPath
      if (pathTitle) {
        const matched = pathTitle.split('/')
        let allPathMatched
        if (allPath) {
          allPathMatched = allPath.split(',')
        }
        matched.forEach((item, index) => {
          const obj = {
            title: item
          }
          if (allPathMatched) {
            const path = allPathMatched[index]
            if (path.includes('isTarget')) {
              const truePath = '/' + path.replace('isTarget', '')
              if (this.$route.path !== truePath) {
                obj.path = truePath
              }
            }
          }
          this.levelList.push(obj)
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 35px;
    margin-left: 10px;
    .no-redirect {
      // color: #97a8be;
      cursor: text;
    }
    .redirect{
      color:#409EFF;
  }
  }
</style>


