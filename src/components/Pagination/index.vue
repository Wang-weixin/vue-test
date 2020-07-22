<template>
    <div class="sur-pagination clearfix">
        <div class="sur-total fl">共{{this.total}}条</div>
        <el-pagination class="sur-pagetool fr" background layout="prev, pager, next"
                        @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNo"
                       :total="total"
                       :page-sizes="[10,15,20]"
                       :page-size="pageSize"></el-pagination>
    </div>
</template>
<script>
export default {
  name: 'surPagination',
  props: {
    total: {
      type: Number,
      default: null
    },
    pageNo: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 12
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('size-change', val)
    },
    handleCurrentChange(val) {
      this.$emit('current-change', val)
    }
  }
}
</script>
<style lang="scss">

.sur-pagination{
    height: 46px;
    line-height: 46px;
	background-color: #fafafa;
	border-radius: 0px 0px 10px 10px;
    border: solid 1px #dddddd;
    border-top: none;
    font-family: PingFangSC-Regular;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 0px;
    color: #222222;
    padding: 0 10px;
    .sur-pagetool{
        margin-top:7px;
    }
    // .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
    //     background-color: #ffffff;
    //     border-radius: 4px;
    //     border: solid 1px #888888;
    //     letter-spacing: 0px;
    //     color: #222222;
    //     font-size: 12px;
    //     min-width: 30px;
    //     font-weight: normal;
    //     text-align: center;
    // }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #00afff;
        border: solid 1px #00afff;
        color: #FFF;
    }
    .el-pagination.is-background .el-pager li:not(.active):hover {
        color: #00afff;
    }
}
</style>
    