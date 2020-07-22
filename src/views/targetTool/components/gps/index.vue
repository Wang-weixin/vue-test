<template>
    <div class="tt-gps">
        <h4 class="tt-title">目标计划清单</h4>
          <el-table
            v-loading="loading"
            :height="tableHight"
           class="table-main"
            :data="tableData"
            row-key="planId"
            border
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            style="width: 100%">
            <el-table-column
            prop="goal"
            label="目标"
            show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <svg-icon :style="{color:iconColors['$colorG'],fontSize:'16px'}" icon-class="icon-G" />  <a class="alive-text" @click="updateHandle(scope.row)">{{scope.row.goal}}</a>
                </template>
            </el-table-column>
            <el-table-column
            prop="rangeName"
            label="领域"
            align="center"
            width="180">
            </el-table-column>
            <el-table-column
            width="180"
            prop="startDate"
            align="center"
            label="起始时间">
            </el-table-column>
            <el-table-column
            width="180"
            prop="endDate"
            align="center"
            label="预计达成时间">
            </el-table-column>
            <el-table-column
            width="180"
            prop="endDate"
            align="center"
            label="达成时间">
            </el-table-column>
            <el-table-column
                align="center"
                width="160">
                <template slot="header">
                   <a class="table-header-title" @click="addHandle"><svg-icon  icon-class="icon-add" /> 添加</a>
                </template>
                <template slot-scope="scope">
                  <div class="achieved" v-if="scope.row.dacheng">
                    <svg-icon :style="{fontSize:'16px'}" icon-class="icon-flag" /> 已达成
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
                    @click="reachHandle(scope.row)"
                    type="primary"
                    size="mini">
                    达成
                    </el-button>
                  </div>
                </template>
            </el-table-column>
        </el-table>
        <sur-pagination
                      v-if="total <= 10" 
                       ::current-page="pageNo"
                       :total="total"
                       :page-size="pageSize"
                        @size-change="handleSizeChange"  @current-change="handleCurrentChange"></sur-pagination>
        <el-dialog
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
        </el-dialog>
        <reach ref="reach" @reachCallBack="reachCallBack"></reach>
    </div>
</template>
<script>
import { baseRequest } from '@/api/base'
import update from './update'
import Reach from '../Reach'

export default {
  components: {
    update,
    Reach
  },
  computed: {
    tableHight() {
      return this.$store.state.app.containHeight - 255
    }
  },
  data() {
    return {
      pageNo: 1,
      total: null,
      pageSize: 15,
      loading: false,
      updateVisible: false,
      updateStatus: 0, // 0添加 1修改
      updateId: null,
      errorText: '',
      isMinTarget: false,
      iconColors: {
        $colorG: '#db1717',
        $colorY: '#ff7700',
        $colorM: '#ffaa00',
        $colorW: '#04ae0f',
        $colorD: '#1dd3d1',
        $colorA: '#00a0e9',
        $colorC: '#0066ff',
        $colorF: '#a65fec',
        $colorL: '#ec5fe7',
        $colorH: '#e22c79'
      },
      tableData: []
    }
  },
  created() {
    this.searchOption()
  },
  methods: {
    searchOption(page) {
      if (!page) {
        this.pageNo = 1
      }
      this.loading = true
      const param = {
        pageNo: this.pageNo, pageSize: this.pageSize }
      baseRequest('/rwGoalPlan/selects', param).then(response => {
        this.tableData = response.data.item
        this.total = 500
        this.pageSize = 15
        this.loading = false
      })
    },
    addHandle() {
      this.errorText = ''
      this.updateStatus = 0
      this.updateId = null
      this.isMinTarget = false
      this.updateVisible = true
    },
    updateHandle(row) {
      this.errorText = ''
      this.updateStatus = 1
      this.updateId = row.planId
      this.isMinTarget = false
      for (const iterator of this.tableData) {
        if (iterator.children && iterator.children.length > 0) {
          for (const iterator2 of iterator.children) {
            if (iterator2.children && iterator2.children.length > 0) {
              if (iterator2.children.some(item => item.planId === this.updateId)) {
                this.isMinTarget = true
              }
            }
          }
        }
      }
      this.updateVisible = true
    },
    updateDone() {
      this.errorText = ''
      const formData = this.$refs.gpsUpdate.formData
      if (!formData.planRange && formData.planRange !== 0) {
        this.$refs.gpsUpdate.errorField = 'planRange'
        this.errorText = '请选择领域'
        return
      }
      if (formData.startDate && !formData.endDate) {
        this.$refs.gpsUpdate.errorField = 'startDate'
        this.errorText = '请选择预计达成时间'
        return
      }
      if (formData.endDate && !formData.startDate) {
        this.$refs.gpsUpdate.errorField = 'startDate'
        this.errorText = '请选择起始日期'
        return
      }
      if (!formData.goal) {
        this.$refs.gpsUpdate.errorField = 'goal'
        this.errorText = '请输入目标'
        return
      }
      if (this.updateStatus === 0) {
        baseRequest('/rwGoalPlan/add', this.$refs.gpsUpdate.formData).then(response => {
          this.searchOption()
          this.$Message.success('操作成功')
          this.updateVisible = false
        })
      } else {
        baseRequest('/rwGoalPlan/update', this.$refs.gpsUpdate.formData).then(response => {
          this.searchOption()
          this.$Message.success('操作成功')
          this.updateVisible = false
        })
      }
    },
    deleteRow(row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/rwGoalPlan/delete', { planId: row.planId }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    reachHandle(row) {
      this.updateId = row.planId
      this.$refs.reach.openDialog(row.startDate)
    },
    // isOverStartDate(startDate) {
    //   const nowDate = new Date().getTime()
    //   let rowDate = startDate + ' 00:00:00'
    //   rowDate = rowDate.replace(/-/g, '/')
    //   const bewforeDate = new Date(rowDate).getTime()
    //   return nowDate < bewforeDate
    // },
    /**
     * 达成
     */
    reachCallBack(date) {
      baseRequest('/rwGoalPlan/reach', { planId: this.updateId, reachDate: date }).then(response => {
        this.$Message.success('操作成功')
        this.searchOption()
      })
    },
    handleSizeChange(val) { // 分页
      this.pageSize = val
      this.searchOption()
    },
    handleCurrentChange(val) { // 分页
      this.pageNo = val
      this.searchOption(true)
    }
  }
}
</script>
<style lang="scss">
.tt-gps{
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
    .achieved{
      font-family: PingFangSC-Regular;
      font-weight: normal;
      font-stretch: normal;
      line-height: 17px;
      letter-spacing: 0px;
      color: #04ae0f;
      text-align: right;
      padding-right:10px;
    }
}
</style>