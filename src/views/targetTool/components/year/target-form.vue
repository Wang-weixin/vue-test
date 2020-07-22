/** 年度重要目标表单 */
<template>
  <div>
    <el-dialog
      append-to-body
      :title="message[status].title"
      :visible.sync="formVisible"
      class="dialog-main"
      top="5%"
      width="400px"
      destroy-on-close
      :close-on-click-modal="false"
      >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item style="margin-top:0px;" prop="annualGoal">
            <div class="gps-label">完成此目标的明确行动步骤</div>
            <el-input type="textarea" :rows="4" style="" v-model="ruleForm.annualGoal" show-word-limit maxlength="200"></el-input>
        </el-form-item>
        <el-form-item prop="startDate">
            <div class="gps-label">目标日期</div>
            <el-date-picker style="width:100%" v-model="ruleForm.startDate"
                type="date"
                value-format='yyyy-MM-dd'
                :picker-options="pickerOptionsStart"
                >
            </el-date-picker>
        </el-form-item>
        <el-form-item prop="endData">
            <div class="gps-label">完成日期</div>
            <el-date-picker style="width:100%" v-model="ruleForm.endDate"
                type="date"
                value-format='yyyy-MM-dd'
                :picker-options="pickerOptionsEnd"
                >
            </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button  @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'

export default {
  components: {

  },
  props: {
    id: [String, Number]
  },
  computed: {

  },
  data() {
    return {
      formVisible: false,
      status: 0, // 0添加 1修改
      message: [
        { title: '添加目标计划', url: '/rwAnnual/add' },
        { title: '修改目标计划', url: '/rwAnnual/update' }
      ],

      ruleForm: {
        annualGoal: null,
        startDate: null,
        endDate: null
      },
      params: {},

      rules: {
        annualGoal: [
          { required: true, message: '请输入明确的行动步骤' }
        ],
        startDate: [
          { validator: (rule, value, callback) => {
            if (!value && this.ruleForm.endDate) {
              callback(new Error('请选择目标日期'))
            } else {
              callback()
            }
          } }
        ],
        endDate: [
          { validator: (rule, value, callback) => {
            if (!value && this.ruleForm.startDate) {
              callback(new Error('请完成日期日期'))
            } else {
              callback()
            }
          } }
        ]
      },
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.ruleForm.endDate !== '') {
            let date = this.ruleForm.endDate
            date = date.replace(/-/g, '/')
            const newDate = new Date(date).getTime()
            return time.getTime() > newDate
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.ruleForm.startDate !== '') {
            let date = this.ruleForm.startDate
            date = date.replace(/-/g, '/')
            const newDate = new Date(date).getTime()
            return time.getTime() < newDate
          }
        }
      }
    }
  },
  created() {},
  mounted() {
    // console.log(this.label)
  },
  methods: {
    // 打开弹框
    openDialog(row) {
      this.params = { annualField: this.id }
      this.formVisible = true

      if (row) { // 修改
        this.status = 1
        this.params.annualId = row.annualId
        this.params.sourceId = row.sourceId
        this.params.sourceType = row.sourceType

        this.ruleForm = {
          annualGoal: row.annualGoal,
          startDate: row.startDate,
          endDate: row.endDate
        }
      } else { // 添加
        this.status = 0

        this.ruleForm = {
          annualGoal: null,
          startDate: null,
          endDate: null
        }
        this.resetForm('ruleForm')
      }
    },
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const url = this.message[this.status].url
          const params = { ...this.params, ...this.ruleForm }
          baseRequest(url, params).then(() => {
            this.formVisible = false
            this.$emit('refresh')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>