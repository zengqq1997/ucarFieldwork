<template>
  <div>
    <el-button size="mini"
               @click="fetchTask()">修改</el-button>
    <el-dialog title="编辑任务"
               :visible.sync="dialogFormVisible"
               class="dialogClass"
               :close-on-click-modal='false'>
      <el-form ref="form"
               :model="form"
               label-width="75px"
               id="elform"
               v-if="form.taskStatus==='已领取'||form.taskStatus==='已完成'"
               :disabled=true>
        <el-form-item label="任务名称:">
          <el-input v-model="form.title"
                    :disabled=true
                    style="float:left;"></el-input>
        </el-form-item>
        <el-form-item label="任务需求:">
          <el-input type="textarea"
                    v-model="form.requirement"
                    autofocus></el-input>
        </el-form-item>

        <el-form-item label="截止时间:"
                      prop='disableTime'>
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="form.deadLine"
                          style="float:left;width:60%"
                          :picker-options="expireTimeOption"></el-date-picker>
        </el-form-item>
        <!-- </el-col> -->
        <!-- </el-row> -->
        <el-form-item label="详细需求:">
          <el-upload class="upload-demo"
                     ref="upload"
                     :with-credentials="true"
                     :limit="1"
                     :on-remove="handleRemove"
                     :before-remove="beforeRemove"
                     :auto-upload="false"
                     accept=".doc,.docx,.txt"
                     :action="this.$http.defaults.baseURL+'/upload'"
                     :on-success="afterUpload"
                     :file-list="fileList"
                     v-if="showFileList">
            <el-button size="small"
                       type="primary">点击上传</el-button>
            <!-- <div slot="tip"
                class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button class="btn1"
                     type="primary"
                     @click="changeTaskInfo">确认修改</el-button>
          <el-button @click="dialogFormVisible = false">取消修改</el-button>
        </el-form-item>
      </el-form>
      <el-form ref="form"
               :model="form"
               label-width="75px"
               v-if="form.taskStatus==='未领取'||form.taskStatus==='已过期'"
               :disabled=false>
        <el-form-item label="任务名称:">
          <el-input v-model="form.title"
                    :disabled=true
                    style="float:left;width=50%;"></el-input>
        </el-form-item>
        <el-form-item label="任务需求:">
          <el-input type="textarea"
                    v-model="form.requirement"
                    autofocus="autofocus"></el-input>
        </el-form-item>

        <el-form-item label="截止时间:"
                      prop='disableTime'>
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="form.deadLine"
                          style="float:left;width:60%"
                          :picker-options="expireTimeOption"></el-date-picker>
        </el-form-item>
        <!-- </el-col> -->
        <!-- </el-row> -->
        <el-form-item label="详细需求:">
          <el-upload class="upload-demo"
                     ref="upload"
                     :with-credentials="true"
                     :limit="1"
                     :on-remove="handleRemove"
                     :before-remove="beforeRemove"
                     accept=".doc,.docx,.txt"
                     :action="this.$http.defaults.baseURL+'/upload'"
                     :on-success="afterUpload"
                     :file-list="fileList">
            <el-button size="small"
                       type="primary">点击上传</el-button>
            <!-- <div slot="tip"
                class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
        <el-form-item class="btn1">
          <el-button type="primary"
                     @click="changeTaskInfo">确认修改</el-button>
          <el-button @click="dialogVisible"
                     id="cancel">取消修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  title: 'changeTask',
  props: ['index'],
  data () {
    return {
      expireTimeOption: {
        disabledDate (date) { // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() <= Date.now()
        }
      },
      dialogFormVisible: false,
      showFileList: true,
      fileList: [],
      form: {
        title: '',
        requirement: '',
        requirementFile: null,
        deadLine: ''
      },
      form1: {
        title: '',
        requirement: '',
        requirementFile: null,
        deadLine: ''
      },
      flag: 0,
      filename: {}
    }
  },
  methods: {
    changeTaskInfo () {
      if (this.form.title.replace(/\s*/g, "").length <= 4 || this.form.requirement.replace(/\s*/g, "").length <= 15 || this.form.deadLine === '') {
        this.$message({
          message: '请将任务信息填写完整',
          type: 'error'
        });
      }
      else {
        if (this.flag === 1) {
          this.form.requirementFile = null
        }
        this.$emit('func1', this.form)
        this.dialogFormVisible = false
      }
    },
    fetchTask () {
      this.$http.get(`task/${this.index}`).then(res => {
        this.form = res.data
        this.form1 = res.data

        if (res.data.requirementFile !== null) {

          this.filename.name = res.data.requirementFile.split('/')[4].split('.')[0].split('-')[0]
          this.fileList.push(this.filename)
          console.log(this.fileList)
        }
      })
      this.dialogFormVisible = true;
      this.showFileList = true;
    },
    dialogVisible () {
      this.dialogFormVisible = false
      this.form = {}
      this.fileList = []
      this.form.requirementFile = null
      this.showFileList = false
    },
    afterUpload (res) {
      this.form.requirementFile = res.url
      this.flag = 0
    },
    handleRemove () {
      this.$http.post(`delete/change`, this.form).then(res => {
        this.flag = 1
        this.fileList = []
      })
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？,移除后将无法恢复`);

    }
  },
}
</script>

<style scoped>
body,
html {
  margin: 0;
  padding: 0;
}
/* .btn1 {
  margin-left: 20% !important;
} */
.btn1 .el-form-item__content {
  margin-left: 0% !important;
}
/* .el-input {
  width: 0;
} */

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
