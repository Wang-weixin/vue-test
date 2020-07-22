<template>
    <!-- 达成空间 -->
      <el-dialog
           append-to-body
          :title="'确认达成'"
          :visible.sync="visible"
          class="dialog-main reach-dialog"
          top="10%"
          width="400px"
          destroy-on-close
          :close-on-click-modal="false">
            <div class="today-text" v-if="todayRanch">
                <span class="today-data">{{formData.reachData}}</span>,
                <a class="alive-text" @click="todayRanch = false">选择其他日期</a>
            </div>
            <el-form v-else ref="form-reach" :model="formData">
                <el-form-item prop="reachData" label="达成日期">
                    <el-date-picker style="width:100%" v-model="formData.reachData"
                        type="date"
                        value-format='yyyy-MM-dd'
                        :editable="false"
                        :clearable="false"
                        :picker-options="pickerOptions"
                        >
                    </el-date-picker>
                </el-form-item>
            </el-form>
         <span slot="footer">
            <!-- <span class="dialog-error-msg">请填写达成时间</span> -->
            <el-button  @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="saveHandle">确 定</el-button>
          </span>
      </el-dialog>

</template>
<script>
export default {
  data() {
    return {
      startDate: null,
      formData: {
        reachData: null
      },
      todayRanch: true,
      visible: false,
      pickerOptions: {
        disabledDate: (time) => {
          const nowDate = new Date().getTime()
          if (this.startDate) {
            let startDate = this.startDate + ' 00:00:00'
            startDate = startDate.replace(/-/g, '/')
            const bewforeDate = new Date(startDate).getTime()
            return time.getTime() > nowDate || time.getTime() < bewforeDate
          } else {
            return time.getTime() > nowDate
          }
        }
      }
    }
  },
  methods: {
    openDialog(startDate) {
      this.todayRanch = true
      this.startDate = startDate
      const day = new Date()
      var year = day.getFullYear()
      var month = day.getMonth() + 1
      var date = day.getDate()
      if (month < 10) { month = '0' + month }
      if (date < 10) { date = '0' + date }
      this.formData.reachData = year + '-' + month + '-' + date
      this.visible = true
    },
    saveHandle() {
      this.$emit('reachCallBack', this.formData.reachData)
      this.visible = false
    }
  }
}
</script>
<style lang="scss">
.dialog-main.reach-dialog{
    .el-dialog{
        height: auto;   
    }
}
.today-text{
    height: 50px;
    line-height: 50px;
    .today-data{
        font-weight: bold;
    }
}
</style>