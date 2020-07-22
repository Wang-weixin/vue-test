<template>
  <div class="tt-year">
    <h4 class="tt-title">年度重要目标</h4>
    <div class="tt-plan" @click="addHandle">
      <div class="bg">
        <svg-icon class="icon-add-white"  icon-class="icon-shizi" />
        <span class="font">制定计划</span>
      </div>
    </div>
    <div v-for="(item, i) in options" :key="i" class="tt-table">
      <target-table :id="item.value" :label="item.name"></target-table>
      <div v-if="i < size - 1" class="line"></div>
    </div>
    <!-- <el-dialog
          :title="(this.updateStatus === 0?'添加':'修改')+'目标计划'"
          :visible.sync="updateVisible"
          class="dialog-main height80 noPaddingRight"
          top="5%"
          :close-on-click-modal="false"
          >
          <update v-if="updateVisible" ref="gpsUpdate" :planId="updateId" :isMinTarget="isMinTarget"></update>
          <span slot="footer">
            <span class="dialog-error-msg">{{errorText}}</span>
            <el-button  @click="updateVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateDone">确 定</el-button>
          </span>
        </el-dialog> -->
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
import { icon } from './icon'
import update from '../gps/update'
import targetTable from './target-table.vue'

export default {
  components: {
    update,
    'target-table': targetTable
  },
  computed: {
    tableHight() {
      return this.$store.state.app.containHeight - 255
    }
  },
  data() {
    return {
      icon,
      pageNo: 1,
      total: null,
      pageSize: 15,
      loading: false,
      updateVisible: false,
      updateStatus: 0, // 0添加 1修改
      updateId: null,
      options: [],
      size: 0
    }
  },
  created() {
    this.searchOption()
  },
  mounted() {},
  methods: {
    searchOption(page) {
      if (!page) {
        this.pageNo = 1
      }
      this.loading = false
      const param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      baseRequest('/rwCode/getOption', param)
        .then(response => {
          this.options = response.data.item
          this.size = this.options.length
        })
    },
    addHandle() {
      this.updateStatus = 0
      this.updateVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.tt-year{
    position: relative;
    padding:0 24px 24px;
    .tt-title{
        height: 66px;
        line-height: 66px;
        font-family: PingFangSC-Semibold;
        font-size: 18px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #222222;
        font-weight: bold;
    }

    .tt-plan {
      position: absolute;
      top: 19px;
      right: 24px;
      cursor: pointer;
      .bg {
        width: 100px;
        height: 28px;
        background-color: #04ae0f;
        border-radius: 4px;
        color: #ffffff;
        line-height: 28px;
        text-align: center;
        .icon-add-white {
          width: 12px;
        }
        .font {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          
        }
      }

    }
    .line {
      // position: relative;
      display: block;
      // width: 100%;
      height: 0;
      margin: 24px 20px;
      border-top: 1px dashed #aaaaaa;
    }
}
</style>