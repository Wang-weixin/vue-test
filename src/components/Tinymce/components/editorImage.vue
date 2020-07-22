<template>
  <div class="upload-container">
    <el-upload
        class="avatar-uploader"
        action=""
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleChange">
        <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">插入图片</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: []
    }
  },
  methods: {
    handleChange(file, fileList) {
      const isJPG = file.raw.type === 'image/jpg'
      const isJPEG = file.raw.type === 'image/jpeg'
      const isPng = file.raw.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG && !isPng && !isJPEG) {
        this.$message.error('上传图片只能是 png/jpg/jpeg 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5M!')
      }
      if ((isJPG || isPng || isJPEG) && isLt2M) {
        var reader = new FileReader()
        reader.readAsDataURL(file.raw)
        reader.onload = function(e) {
          this.$emit('successCBK', reader.result)
        }.bind(this)
        // this.item.expertsPic = URL.createObjectURL(file.raw)
      }
    }
    // checkAllSuccess() {
    //   return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    // },
    // handleSubmit() {
    //   const arr = Object.keys(this.listObj).map(v => this.listObj[v])
    //   if (!this.checkAllSuccess()) {
    //     this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
    //     return
    //   }
    //   this.$emit('successCBK', arr)
    //   this.listObj = {}
    //   this.fileList = []
    //   this.dialogVisible = false
    // },
    // handleSuccess(response, file) {
    //   const uid = file.uid
    //   const objKeyArr = Object.keys(this.listObj)
    //   for (let i = 0, len = objKeyArr.length; i < len; i++) {
    //     if (this.listObj[objKeyArr[i]].uid === uid) {
    //       this.listObj[objKeyArr[i]].url = response.files.file
    //       this.listObj[objKeyArr[i]].hasSuccess = true
    //       return
    //     }
    //   }
    // },
    // handleRemove(file) {
    //   const uid = file.uid
    //   const objKeyArr = Object.keys(this.listObj)
    //   for (let i = 0, len = objKeyArr.length; i < len; i++) {
    //     if (this.listObj[objKeyArr[i]].uid === uid) {
    //       delete this.listObj[objKeyArr[i]]
    //       return
    //     }
    //   }
    // },
    // beforeUpload(file) {
    //   const _self = this
    //   const _URL = window.URL || window.webkitURL
    //   const fileName = file.uid
    //   this.listObj[fileName] = {}
    //   return new Promise((resolve, reject) => {
    //     const img = new Image()
    //     img.src = _URL.createObjectURL(file)
    //     img.onload = function() {
    //       _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
    //     }
    //     resolve(true)
    //   })
    // }
  }
}
</script>
