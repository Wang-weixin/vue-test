<template>
    <div class="gps-update">
        <el-form ref="form" :model="formData" inline>
            <div class="gps-basic">
                <el-form-item >
                    <div class="gps-label required">领域</div>
                    <el-select style="width:253px;" :class="{'error-outline':errorField === 'planRange'}" @change="clearError('planRange')" v-model="formData.planRange">
                        <el-option v-for="item in rangeOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left:30px;">
                    <div class="gps-label">起始日期</div>
                    <el-date-picker v-model="formData.startDate"
                    :class="{'error-outline':errorField === 'startDate'}" @change="clearError('startDate')"
                        type="date"
                        style="width:253px;"
                        value-format='yyyy-MM-dd'
                        :picker-options="pickerOptionsStart"
                        >
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="margin-left:30px;">
                    <div class="gps-label">预计达成时间</div>
                    <el-date-picker v-model="formData.endDate"
                    :class="{'error-outline':errorField === 'startDate'}" @change="clearError('startDate')"
                        type="date"
                        style="width:253px;"
                        value-format='yyyy-MM-dd'
                        :picker-options="pickerOptionsEnd"
                        >
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="margin-left:30px;">
                    <div class="gps-label">达成日期</div>
                    <el-input :value="formData.reachDate"
                        disabled
                        style="width:253px;"
                        >
                    </el-input>
                </el-form-item>
            </div>
            <div class="gps-update-line"></div>
            <el-form-item style="margin-top:20px;">
                <div class="gps-label required">目标（要明确、可衡量的、可达成的、实际的、实质的）</div>
                <el-input :class="{'error-outline':errorField === 'goal'}" @change="clearError('goal')"
                type="textarea" :rows="4" style="width:1210px;" v-model.trim="formData.goal" show-word-limit maxlength="200"></el-input>
            </el-form-item>
            <el-form-item style="margin-top:0px;">
                <div class="gps-label">达成目标的效益或达成目标所能避免的损失</div>
                <el-input type="textarea" :rows="4" style="width:590px;" v-model.trim="formData.benefit" show-word-limit maxlength="200"></el-input>
            </el-form-item>
            <el-form-item style="margin-top:0px;margin-left:26px;">
                <div class="gps-label">与达成目标相关的所有资源（包括人、财、物、大市场、环境等）</div>
                <el-input type="textarea" :rows="4" style="width:590px;" v-model.trim="formData.resource" show-word-limit maxlength="200"></el-input>
            </el-form-item>
            <el-form-item style="margin-top:0px;">
                <div class="gps-label">可能的障碍</div>
                <el-input type="textarea" :rows="4" style="width:590px;" v-model.trim="formData.obstacle" show-word-limit maxlength="200"></el-input>
            </el-form-item>
            <el-form-item style="margin-top:0px;margin-left:26px;">
                <div class="gps-label">可能的解决方法</div>
                <el-input type="textarea" :rows="4" style="width:590px;" v-model.trim="formData.solve" show-word-limit maxlength="200"></el-input>
            </el-form-item>
            <div class="gps-update-line"></div>
             <el-table
            class="table-main detail-target"
                :data="formData.goalPlanConts"
                border
                >
                <el-table-column
                prop="contment"
                label="完成此目标的明确行动步骤"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <a class="alive-text" @click="updateDetail(scope)">{{scope.row.contment}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                prop="contType"
                label="类型"
                align="center"
                width="120">
                    <template slot-scope="scope">
                        {{contTypeOptions[scope.row.contType]}}
                    </template>
                </el-table-column>
                <el-table-column
                width="130"
                prop="targetDate"
                align="center"
                label="目标日期">
                </el-table-column>
                <el-table-column
                width="130"
                prop="finalDate"
                align="center"
                label="完成日期">
                </el-table-column>
                <el-table-column
                width="130"
                prop="reachDate"
                align="center"
                label="达成日期">
                </el-table-column>
                <el-table-column
                    align="center"
                    width="160">
                    <template slot="header">
                    <a class="table-header-title" @click="addHandle"><svg-icon  icon-class="icon-add" /> 添加</a>
                    </template>
                    <template slot-scope="scope">
                    <div class="achieved" v-if="scope.row.reachDate">
                        <svg-icon :style="{fontSize:'16px'}" icon-class="icon-flag" /> 已达成
                                                <el-button
                            @click.native.prevent="deleteRow(scope.row)"
                            type="danger"
                            plain
                            size="mini">
                            删除
                        </el-button>
                    </div>
                    <div v-else>
                        <el-button
                        @click.native.prevent="deleteRow(scope.row)"
                        type="danger"
                        plain
                        size="mini">
                        删除
                        </el-button>
                        <el-button
                        @click="reachHandle(scope)"
                        type="primary"
                        size="mini">
                        达成
                        </el-button>
                    </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="gps-update-line"></div>
            <el-form-item style="margin-top:20px;">
                <div class="gps-label">跟踪进度的方法</div>
                <el-input type="textarea" :rows="4" style="width:605px;" v-model.trim="formData.trackMethod" show-word-limit maxlength="200"></el-input>
            </el-form-item>
            <div class="gps-update-line"></div>
            <el-form-item style="margin-top:20px;margin-bottom:12px;height80px;width:605px;border-right:1px dashed #aaaaaa;">
                <div class="gps-label">这项目标符合你此项生活范围的价值观吗？</div>
                <div style="margin-top:10px;"> 
                  <el-radio v-model="formData.isValues" label="1">是</el-radio>
                  <el-radio v-model="formData.isValues" label="0">否</el-radio>
                </div>
            </el-form-item>
            <el-form-item style="margin-top:20px;margin-bottom:12px;height80px;width:605px;padding-left:28px;">
                <div class="gps-label">这项目标值得花时间、精力、金钱来达成吗？</div>
                <div style="margin-top:10px;"> 
                  <el-radio v-model="formData.isWorth" label="1">是</el-radio>
                  <el-radio v-model="formData.isWorth" label="0">否</el-radio>
                  <el-radio v-model="formData.isWorth" label="2">是，但要等以后</el-radio>
                </div>
            </el-form-item>
            <div class="gps-update-line"></div>
            <el-form-item style="margin-top:20px;width:1210px;">
                <div class="gps-label">具象化</div>
                <concretization :valueFigurat="formData.valueFigurat" @successUpload="successUpload"></concretization>
            </el-form-item>
            <div class="gps-update-line"></div>
            <el-form-item style="margin-top:20px;">
                <div class="gps-label">自我肯定宣言</div>
                <el-input type="textarea" :rows="4" style="width:605px;" v-model.trim="formData.valueDec" show-word-limit maxlength="200"></el-input>
            </el-form-item>
        </el-form>
        <el-dialog
           append-to-body
          :title="(this.updateStatus === 0?'添加':'修改')+'目标计划'"
          :visible.sync="updateVisible"
          class="dialog-main gps-detail-dialog"
          top="10%"
          width="400px"
          destroy-on-close
          :close-on-click-modal="false"
          >
          <el-form ref="formDetail" :model="detailData" :rules="detailRules">
            <el-form-item style="margin-top:0px;" prop="contment">
                <div class="form-label required">完成此目标的明确行动步骤</div>
                <el-input type="textarea" :rows="4" style="" v-model.trim="detailData.contment" show-word-limit maxlength="200"></el-input>
            </el-form-item>
            <el-form-item style="margin-top:0px;" prop="contType">
                <div class="form-label required">类型</div>
                <el-select style="width:100%" v-model="detailData.contType">
                    <el-option label="步骤" value="0"></el-option>
                    <el-option label="目标" :disabled="isMinTarget" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="targetDate">
                <div class="form-label">目标日期</div>
                <el-date-picker style="width:100%" v-model="detailData.targetDate"
                    type="date"
                    value-format='yyyy-MM-dd'
                    :picker-options="pickerOptionsStart1"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="finalDate">
                <div class="form-label">完成日期</div>
                <el-date-picker style="width:100%" v-model="detailData.finalDate"
                    type="date"
                    value-format='yyyy-MM-dd'
                    :picker-options="pickerOptionsEnd1"
                    >
                </el-date-picker>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <span class="dialog-error-msg">{{detailErrorMsg}}</span>
            <el-button  @click="updateVisible = false">取 消</el-button>
            <el-button type="primary" @click="detailSave">确 定</el-button>
          </span>
        </el-dialog>
        <reach ref="reach" @reachCallBack="reachCallBack"></reach>
    </div>
</template>
<script>
import { baseRequest } from '@/api/base'
import { deepClone } from '@/utils'
import Concretization from '../Concretization'
import Reach from '../Reach'
export default {
  components: { Concretization, Reach },
  props: {
    planId: [Number, String],
    isMinTarget: Boolean
  },
  created() {
    baseRequest('/rwCode/getOption').then(response => {
      this.rangeOptions = response.data.item
    })
    if (this.planId || this.planId === 0) {
      baseRequest('/rwGoalPlan/select', { planId: this.planId }).then(response => {
        for (const key in response.data.item) {
          if (this.formData.hasOwnProperty(key)) {
            this.formData[key] = response.data.item[key]
          }
        }
        this.formData.planId = response.data.item.planId
      })
    }
  },
  data() {
    return {
      errorField: '',
      formData: {
        planRange: null,
        startDate: null,
        endDate: null,
        reachDate: null,
        goal: null,
        benefit: null,
        resource: null,
        obstacle: null,
        solve: null,
        goalPlanConts: [
          // {
          //   contment: 'asdasdasdasdasd',
          //   contType: '0',
          //   targetDate: '2020-12-12',
          //   finalDate: '2020-12-15'
          // }
        ],
        trackMethod: null,
        isValues: '1',
        isWorth: '1',
        valueFigurat: '',
        valueDec: null
      },
      detailData: {
        contment: null,
        contType: null,
        targetDate: null,
        finalDate: null,
        reachDate: null
      },
      detailCurrentIndex: null,
      rangeOptions: {},
      contTypeOptions: {
        '0': '步骤',
        '1': '目标'
      },
      detailErrorMsg: '',
      updateStatus: 0,
      updateVisible: false,
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.formData.endDate !== '') {
            let date = this.formData.endDate + ' 00:00:00'
            date = date.replace(/-/g, '/')
            const newDate = new Date(date).getTime()
            return time.getTime() > newDate
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.formData.startDate !== '') {
            let date = this.formData.startDate + ' 00:00:00'
            date = date.replace(/-/g, '/')
            const newDate = new Date(date).getTime()
            return time.getTime() < newDate
          }
        }
      },
      pickerOptionsStart1: {
        disabledDate: (time) => {
          if (this.detailData.finalDate !== '') {
            let date = this.detailData.finalDate + ' 00:00:00'
            date = date.replace(/-/g, '/')
            const newDate = new Date(date).getTime()
            return time.getTime() > newDate
          }
        }
      },
      pickerOptionsEnd1: {
        disabledDate: (time) => {
          if (this.detailData.targetDate !== '') {
            let date = this.detailData.targetDate + ' 00:00:00'
            date = date.replace(/-/g, '/')
            const newDate = new Date(date).getTime()
            return time.getTime() < newDate
          }
        }
      },
      detailRules: {
        contment: [
          { required: true, message: '请输入明确的行动步骤' }
        ],
        contType: [
          { required: true, message: '请选择类型' }
        ],
        targetDate: [
          { validator: (rule, value, callback) => {
            if (!value && this.detailData.finalDate) {
              callback(new Error('请选择目标日期'))
            } else {
              callback()
            }
          } }
        ],
        finalDate: [
          { validator: (rule, value, callback) => {
            if (!value && this.detailData.targetDate) {
              callback(new Error('请完成日期日期'))
            } else {
              callback()
            }
          } }
        ]
      }
    }
  },
  methods: {
    // 点击达成
    reachHandle(scope) {
      this.detailCurrentIndex = scope.$index
      this.$refs.reach.openDialog()
    },
    // 达成回调
    reachCallBack(date) {
      this.formData.goalPlanConts[this.detailCurrentIndex].reachDate = date
    },
    // 点击添加
    addHandle() {
      this.updateStatus = 0
      this.detailData = {
        contment: null,
        contType: '0',
        targetDate: null,
        finalDate: null,
        reachDate: null
      }
      this.updateVisible = true
      this.$nextTick(_ => {
        this.$refs.formDetail.clearValidate()
      })
    },
    // 点击修改
    updateDetail(scope) {
      this.updateStatus = 1
      this.detailCurrentIndex = scope.$index
      for (const key in scope.row) {
        if (this.detailData.hasOwnProperty(key)) {
          this.detailData[key] = scope.row[key]
        }
      }
      this.updateVisible = true
    },
    // 点击删除
    deleteRow(row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formData.goalPlanConts.splice(this.detailCurrentIndex, 1)
      })
    },
    // 更新保存
    detailSave() {
      this.$refs['formDetail'].validate((valid) => {
        if (valid) {
          if (this.updateStatus === 0) {
            this.formData.goalPlanConts.push(deepClone(this.detailData))
          } else {
            for (const key in this.detailData) {
              if (this.formData.goalPlanConts[this.detailCurrentIndex].hasOwnProperty(key)) {
                this.formData.goalPlanConts[this.detailCurrentIndex][key] = this.detailData[key]
              }
            }
          }
          this.updateVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 上传成功回调
    successUpload(fileId) {
      this.formData.fileId = fileId
    },
    // 清楚错误信息
    clearError(field) {
      if (this.errorField === field) {
        this.errorField = ''
      }
    }
  }
}
</script>
<style lang="scss">
    .gps-update{
        .el-form--inline .el-form-item{
            margin-right: 0px
        }
        .gps-label{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            font-stretch: normal;
            line-height: 28px;
            letter-spacing: 0px;
            color: #222222;
            &.required:before {
              content: "*";
              color: #f56c6c;
              margin-right: 4px;
            }
        }
        .gps-update-line{
            border-bottom: dashed 1px #aaaaaa;
            margin-top:10px;
            width: 1210px;
        }
        .detail-target{
            margin:30px 0;
            width: 1210px;
        }
    }
    .dialog-main.gps-detail-dialog{
        .el-dialog{
            height: 600px;
        }
    }
</style>