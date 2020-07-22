<template>
<!-- 上传图片 -->
    <div class="concretization">
        <div class="img-box" v-if="valueFigurat || jxhImage" v-loading="imageLoading">
            <img class="avatar-image"  :src="jxhImage?jxhImage:(baseUrl+valueFigurat)">
            <el-upload
                class="jxh-btn"
                ref="upload"
                :data="{'a':'1'}"
                action="/rwFile/upload"
                :http-request="sourceUploadRequest"
                :show-file-list="false"
                :auto-upload="true">
                <el-button size="small" >重选</el-button>
            </el-upload>
        </div>
        <el-upload
            v-loading="imageLoading"
            v-else
            class="avatar-uploader"
            ref="upload"
            :data="{'a':'1'}"
            action="/rwFile/upload"
            :http-request="sourceUploadRequest"
            :show-file-list="false"
            :auto-upload="true">
            <i  class="el-icon-upload avatar-uploader-icon">点击上传</i>
            </el-upload>
</div>
</template>
<script>
import { baseUpload } from '@/api/base'
export default {
  props: {
    valueFigurat: String
  },
  data() {
    return {
      imageLoading: false,
      jxhImage: '',
      baseUrl: process.env.BASE_API
    }
  },
  methods: {
    sourceUploadRequest(content) {
      const patt = new RegExp('.*\.(jpg|jpeg|png|JPG|JPEG|PNG)$')
      if (!patt.test(content.file.name)) {
        this.$refs.upload.clearFiles
        this.$message({
          showClose: true,
          message: '错误的文件类型,请选择jpg/jpeg/png文件上传',
          type: 'error'
        })
        return
      }
      const isLt5M = content.file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$refs.upload.clearFiles
        this.$message({
          showClose: true,
          message: '文件大小不能超过5M',
          type: 'error'
        })
        return
      }
      var form = new FormData()
      form.append('file', content.file)
      this.imageLoading = true

      baseUpload('/rwFile/upload', form).then((response) => {
        // this.fileId = response.data.item.fileId
        var reader = new FileReader()
        reader.readAsDataURL(content.file)
        reader.onload = e => {
        //   const params = { reader: reader, fileId: response.data.item.fileId }
          this.jxhImage = reader.result
          this.imageLoading = false
          this.$emit('successUpload', response.data.item.fileId)
        }
      }, _ => {
        this.$refs.upload.clearFiles()
        this.imageLoading = false
        this.$message({
          showClose: true,
          message: '上传失败',
          type: 'error'
        })
      })
    }
  }
}
</script>
<style lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: block;
    width: 360px;
  }
    .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 360px;
    height: 240px;
    line-height: 240px;
    text-align: center;
    color: #409EFF;
  }
  .avatar {
    width: 360px;
    height: 240px;
    display: block;
  }
  .img-box{
      position: relative;
    .avatar-image{
        display: block;
        width: 360px;
        height: 240px;
    }
    .jxh-btn{
        position:absolute;
        bottom:0;
        left: 380px;
    }
  }
  
</style>