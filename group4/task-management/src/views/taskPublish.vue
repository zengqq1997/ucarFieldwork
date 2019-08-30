<template>
  <div>
    <div style="margin-top: 15px">
      <el-input placeholder="请输入内容"
                v-model="searchKey"
                class="input-with-select"
                style="float:left;width:35%"
                clearable>
        <el-select v-model="searchValue"
                   slot="prepend"
                   placeholder="请选择"
                   style="width:7.5em">
          <el-option label="发布时间"
                     value="1"></el-option>
          <el-option label="任务标题"
                     value="2"></el-option>
          <el-option label="任务状态"
                     value="3"></el-option>
        </el-select>
      </el-input>
    </div>
    <!--新增任务创建弹窗-->
    <taskNew @func='getTaskInfo'
             v-if="reFresh"></taskNew>
    <router-view></router-view>
    <el-table :data="taskData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              stripe
              style="width: 100%"
              :default-sort="{prop: 'publishDate', order: 'ascending'}">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left"
                   inline
                   class="demo-table-expand">
            <el-form-item label="任务需求:">
              <span>{{ props.row.requirement }}</span>
            </el-form-item>
            <el-form-item label="截止时间:">
              <span>{{ props.row.deadLine }}</span>
            </el-form-item>
            <el-form-item label="领取者:">
              <span>{{ props.row.getter }}</span>
            </el-form-item>
            <el-form-item label="需求文件:">
              <span><a :href="props.row.requirementFile"
                   download=""
                   target="_blank">下载</a></span>
            </el-form-item>
            <el-form-item label="提交文件">
              <span><a :href="props.row.submitFile"
                   download=""
                   target="_blank">下载</a></span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="发布日期"
                       prop="publishDate"
                       sortable
                       width="150em"
                       :sort-method="sortChange1">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.publishDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="任务标题"
                       prop="title"
                       width="300em">
      </el-table-column>

      <el-table-column label="状态"
                       prop="taskStatus">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <taskChange :index=scope.row._id
                      @func1='get2TaskInfo'
                      v-if="reFresh1"
                      style="display:inline-block"></taskChange>
          <router-view></router-view>
          <popover style="display:inline-block;margin-left:1em"
                   :row="scope.row"
                   @handleDelete="handleDelete"></popover>
          <router-view></router-view>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination layout="prev, pager, next"
                   @current-change="current_change"
                   :total="total"
                   background
                   style="margin-top:1.5em;">
    </el-pagination>

  </div>
</template>

<script>
import taskNew from './taskNew.vue'
import taskChange from './taskChange.vue'
import popover from '../components/popover.vue';
// import { type } from 'os'
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份 
    "d+": this.getDate(),                    //日 
    "h+": this.getHours(),                   //小时 
    "m+": this.getMinutes(),                 //分 
    "s+": this.getSeconds(),                 //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds()             //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
export default {
  created () {
    this.fetchTask()
  },
  mounted () {
    this.judgeStatus();
  },
  watch: {
    searchKey () {
      if (this.searchKey === '') {
        this.taskData = this.taskData2
      } else {
        this.taskData = []
        if (this.searchValue === '1') {
          for (let i = 0; i < this.taskData2.length; i++) {
            if (this.taskData2[i].publishDate.includes(this.searchKey)) { this.taskData.push(this.taskData2[i]) }
          }
        } else if (this.searchValue === '2') {
          for (let i = 0; i < this.taskData2.length; i++) {
            if (this.taskData2[i].title.includes(this.searchKey)) { this.taskData.push(this.taskData2[i]) }
          }
        } else if (this.searchValue === '3') {
          for (let i = 0; i < this.taskData2.length; i++) {
            if (this.taskData2[i].taskStatus.includes(this.searchKey)) { this.taskData.push(this.taskData2[i]) }
          }
        } else {
          alert('请先选择要搜索的内容')
        }
      }
    },
    taskData () {
      this.reFresh = false
      this.$nextTick(() => {
        this.reFresh = true
      })
      this.reFresh1 = false
      this.$nextTick(() => {
        this.reFresh1 = true
      })
    }
  },
  title: 'publishTask',
  data () {
    return {
      total: 50, // 默认数据总数
      pagesize: 7, // 每页的数据条数
      currentPage: 1, // 默认开始页面
      reFresh: true,
      reFresh1: true,
      reFresh2: true,
      searchKey: '',
      searchValue: '',
      taskData2: [],
      taskData: [],
      form: {
      },

      formLabelWidth: '120px'
    }
  },
  components: {
    taskNew,
    taskChange,
    popover
  },
  methods: {
    fetchTask () {
      // console.log(localStorage)
      this.$http.get('task').then(res => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].publisher === localStorage.name) {
            this.taskData.push(res.data[i])
          }
        }
      }).then(() => {
        this.judgeStatus()
      })
    },
    judgeStatus () {
      let time = new Date()

      for (let i = 0; i < this.taskData.length; i++) {
        let deadTime = new Date(this.taskData[i].deadLine)

        if (deadTime.getTime() < time.getTime() && this.taskData[i].taskStatus !== '已完成') {
          this.taskData[i].taskStatus = '已过期'
        }
      }
      this.taskData2 = this.taskData
    },

    handleDelete (row) {
      this.$http.delete(`task/${row._id}`).then(res => {
        if (row.requirementFile !== null) {
          this.$http.post(`delete/`, row)
        }

      }).then(res => {
        this.$message({
          message: '任务删除成功',
          type: 'success'
        });
        this.fetchTask()
      })
      location.reload()
    },
    getTaskInfo (taskInfo) {
      this.form = taskInfo
      this.taskData.push(this.form)
      let length = this.taskData.length
      let deadLine = new Date(this.form.deadLine).format('yyyy-MM-dd')
      this.taskData[length - 1].deadLine = deadLine
      let publishDate = new Date().format('yyyy-MM-dd')
      this.taskData[length - 1].publishDate = publishDate
      this.taskData[length - 1].getter = '无'
      this.taskData[length - 1].taskStatus = '未领取'
      this.taskData[length - 1].submitFile = null
      this.taskData[length - 1].publisher = localStorage.name;
      this.taskData[length - 1].getterEmail = null;
      this.taskData[length - 1].publisherEmail = localStorage.email;
      this.$http.post('task', this.taskData[length - 1]).then(res => {
        this.$message({
          message: '任务发布成功',
          type: 'success'
        });
      })
      location.reload()
    },
    get2TaskInfo (task2Info) {
      for (let i = 0; i < this.taskData.length; i++) {
        if (this.taskData[i]._id === task2Info._id) {
          this.taskData[i].requirement = task2Info.requirement
          let deadLine = new Date(task2Info.deadLine).format('yyyy-MM-dd')
          this.taskData[i].deadLine = deadLine
          console.log(task2Info.requirementFile)
          this.taskData[i].requirementFile = task2Info.requirementFile
          let publishDate = new Date().format('yyyy-MM-dd')
          this.taskData[i].publishDate = publishDate
          this.taskData[i].taskStatus = '未领取'
          console.log(this.taskData[i])
          this.$http.put(`task/${task2Info._id}`, this.taskData[i]).then(res => {
            this.$message({
              message: '任务修改成功',
              type: 'success'
            });
          })
        }
      }
      location.reload()
      // this.fetchTask();

    },
    created: function () {
      this.total = this.taskData.length
      console.log(this.total)
    },
    current_change: function (currentPage) {
      this.currentPage = currentPage
    },

    sortChange1 () {
      this.reFresh1 = false
      this.$nextTick(() => {
        this.reFresh1 = true
      })
    }




  }
}
</script>

<style scoped>
.el-table >>> th > .cell {
  font-size: 1.2em;
}
.el-table >>> td > .cell {
  font-size: 1em;
}
.el-table >>> td > .cell span {
  font-size: 1.1em;
}
.el-table >>> td,
.el-table >>> th {
  padding: 0.8em 0;
  text-align: center;
}
.demo-table-expand >>> label {
  width: 7em;
  color: #99a9bf;
  font-size: 1.2em;
}
.demo-table-expand >>> .el-form-item {
  margin-left: 5em;
  width: 100%;
  text-align: left;
  font-size: 14px;
}
.el-form--inline >>> .el-form-item__content {
  font-size: 1.1em;
}
</style>
