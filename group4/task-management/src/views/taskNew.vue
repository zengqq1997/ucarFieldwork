<template>
  <div>
    <el-button @click="dialogFormVisible = true;showDialog=true"
               type="primary"
               style="float:right"><span>新增任务<i class="el-icon-plus"></i></span></el-button>
    <el-dialog title="新建任务"
               :visible.sync="dialogFormVisible"
               style="min-width:50em"
               :close-on-click-modal='false'>
      <el-form ref="form"
               :model="form"
               label-width="6em"
               @submit.native.prevent="sendTaskInfo"
               v-if="showDialog">
        <el-form-item label="任务名称:">
          <el-input v-model="form.title"
                    style="float:left;width=50%"
                    autofocus="autofocus"
                    placeholder="请输入至少4字的任务名称"></el-input>
        </el-form-item>
        <el-form-item label="任务需求:">
          <el-input type="textarea"
                    v-model="form.requirement"
                    placeholder="请输入至少15字的需求描述"></el-input>
        </el-form-item>
        <el-form-item label="截止时间:"
                      prop='disableTime'>
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="form.deadLine"
                          style="float:left;width:60%"
                          :picker-options="expireTimeOption"></el-date-picker>
        </el-form-item>
        <!-- <el-row type="flex"
                justify="left">
          <el-col :span="18"> -->
        <el-form-item label="详细需求:">
          <el-upload class="upload-demo"
                     ref="upload"
                     :with-credentials="true"
                     :limit="1"
                     :on-remove="handleRemove"
                     :before-remove="beforeRemove"
                     accept=".doc,.docx,.pdf"
                     :beforeUpload='beforeUpload'
                     :action="this.$http.defaults.baseURL+'/upload'"
                     :on-success="afterUpload"
                     :file-list="fileList">
            <el-button size="small"
                       type="primary"
                       style="float:left">点击上传</el-button>
            <!-- <div slot="tip"
                 class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
        <!-- </el-col>
        </el-row> -->
        <!-- </el-col> -->
        <!-- </el-row> -->
        <el-form-item>
          <el-button class="btn"
                     type="primary"
                     native-type="submit">立即发布</el-button>
          <el-button @click="dialogVisible">取消发布</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  title: 'taskNew',
  data () {
    return {
      showDialog: true,
      fileList: [],
      expireTimeOption: {
        disabledDate (date) { // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() <= Date.now()
        }
      },
      dialogFormVisible: false,
      form: {
        title: '',
        requirement: '',
        requirementFile: null,
        deadLine: ''
      }
    }
  },
  methods: {
    sendTaskInfo (form) {
      if (this.form.title.replace(/\s*/g, "").length <= 4 || this.form.requirement.replace(/\s*/g, "").length <= 15 || this.form.deadLine === '') {
        this.$message({
          message: '请将任务信息填写完整',
          type: 'error'
        });
      }
      else {

        this.$emit('func', this.form)
        this.dialogFormVisible = false
      }

    },
    dialogVisible () {
      this.dialogFormVisible = false
      console.log(this.form.requirementFile)
      if (this.form.requirementFile !== null) {
        this.$http.post(`delete/`, this.form)
      }
      this.form = {}
      this.form.requirementFile = null
      this.showDialog = false
    },
    afterUpload (res) {
      this.form.requirementFile = res.url

    },
    beforeUpload (file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'pdf'
      const extension2 = testmsg === 'docx'
      const extension3 = testmsg === 'doc'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!extension && !extension2) {
        this.$message({
          message: '上传文件只能是 pdf、docx、doc、格式!',
          type: 'warning'
        });
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 5MB!',
          type: 'warning'
        });
      }
      // console.log(this.fileList)
      return (extension || extension2 || extension3) && isLt2M
    },
    handleRemove () {
      this.$http.post(`delete/`, this.form)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }

  },

  components: {

  }
}
</script>

<style scoped>
body,
html {
  margin: 0;
  padding: 0;
}
.btn {
  margin-left: -1% !important;
}
.el-dialog__wrapper >>> .el-dialog {
  width: 36%;
  padding-right: 1em;
}
.upload-demo {
  overflow: hidden;
}
.upload-demo >>> .el-upload--text {
  float: left;
}
.upload-demo >>> .el-upload-list__item-name:first-child {
  margin-top: 3em;
  text-align: left;
}
</style>
