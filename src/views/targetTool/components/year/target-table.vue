/** 年度重要目标表格 */
<template>
  <div>
    <el-table
      v-loading="loading"
      class="table-main"
      :data="tableData"
      row-key="annualId"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      style="width: 100%">
      <el-table-column prop="goal" :label="label" show-overflow-tooltip>
        <template slot-scope="scope">
            <svg-icon :style="{color: icon(scope.row.sourceType).color ,fontSize:'16px'}" :icon-class="icon(scope.row.sourceType).icon" /> 
            <a class="alive-text" @click="updateHandle(scope.row)">{{scope.row.annualGoal}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="起始时间" align="center" width="180"></el-table-column>
      <el-table-column prop="endDate" label="预计达成时间" align="center" width="180"></el-table-column>
      <el-table-column prop="reachDate" label="达成时间" align="center" width="180"></el-table-column>
      <el-table-column align="center" width="160">
        <template slot="header">
            <a class="table-header-title" @click="addHandle"><svg-icon  icon-class="icon-add" /> 添加</a>
        </template>
        <template slot-scope="scope">
          <div class="achieved" v-if="scope.row.reachState === '0'">
            <svg-icon :style="{fontSize:'16px'}" icon-class="icon-flag" /> 已达成
          </div>
          <div v-else>
            <el-button @click.native.prevent="deleteRow(scope.row)" type="danger" plain size="mini">删除</el-button>
            <el-button type="primary" size="mini" @click.native.prevent="reachRow(scope.row)">达成</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <sur-pagination v-if="total > pageSize" :current-page="pageNo"
                    :total="total"
                    :page-size="pageSize"
                    @size-change="handleSizeChange"  
                    @current-change="handleCurrentChange">
    </sur-pagination>
    <target-form ref="form" @refresh="refresh" :id="id"></target-form>
    <reach ref="reach" @reachCallBack="reachCallBack"></reach>
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
import { icon } from './icon'
import json from './data.json'
import targetform from './target-form'
import Reach from '../Reach'

export default {
  components: {
    'target-form': targetform,
    Reach
  },
  props: {
    id: [String, Number],
    label: String
  },
  computed: {
    tableHight() {
      return this.$store.state.app.containHeight - 255
    }
  },
  data() {
    return {
      icon,
      loading: false,

      pageNo: 1,
      pageSize: 10,
      total: null,

      tableData: [],

      updateId: null
    }
  },
  created() {
    this.searchOption()
  },
  mounted() {
    // console.log(this.label)
  },
  methods: {
    searchOption(page) {
      if (!page) {
        this.pageNo = 1
      }
      this.loading = true
      const param = {
        viewYear: '2020',
        annualField: this.id,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      baseRequest('/rwAnnual/selects', param).then(response => {
        // this.tableData = response.data.item
        this.tableData = json
        this.total = 9
        this.pageSize = 10
        this.loading = false
      })
    },
    refresh() {
      this.searchOption()
    },
    addHandle() {
      this.$refs.form.openDialog()
    },
    updateHandle(row) {
      this.$refs.form.openDialog(row)
    },
    deleteRow(row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/rwAnnual/delete', { planId: row.annualId })
          .then(response => {
            this.$Message.success('操作成功')
            this.searchOption()
          })
      })
    },
    // 达成目标
    reachRow(row) {
      row.reachState = '0'
      this.updateId = row.annualId
      this.$refs.reach.openDialog(row.startDate)
    },
    /**
     * 达成
     */
    reachCallBack(date) {
      baseRequest('/rwAnnual/reach', { annualId: this.updateId, reachDate: date })
        .then(response => {
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
<style lang="scss" scoped>
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
</style>