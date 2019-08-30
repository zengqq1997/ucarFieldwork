<template>
  <div>
    <div style="margin-top: 0.8em">
      <el-input placeholder="请输入内容" v-model="searchKey" class="input-with-select" style="float:left;width:35%"
        clearable>
        <el-select v-model="searchValue" slot="prepend" placeholder="请选择" style="width:7.5em">
          <el-option label="发布时间" value="1"></el-option>
          <el-option label="任务标题" value="2"></el-option>
          <el-option label="发布者" value="3"></el-option>
        </el-select>
      </el-input>
    </div>
    <el-table :data="taskData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%"
      :default-sort="{prop: '', order: 'descending'}"> //下标应为(当前页-1)*每页数据数 到 当前页*每页数据数。使用slice方法进行取用
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="截止时间">
              <span>{{ props.row.deadLine }}</span>
            </el-form-item>
            <el-form-item label="任务需求">
              <span>{{ props.row.requirement }}</span>
            </el-form-item>
            <el-form-item label="需求文件">
              <span><a :href="props.row.requirementFile" download="">下载</a></span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="发布日期" width="150em" prop="publishDate" sortable>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.publishDate }}</span>
        </template>
    </el-table-column>
    <el-table-column
    label="任务标题"
    width="450em">
    <template slot-scope="scope">
  <div slot="reference" class="name-wrapper">
    <el-tag size="medium">{{ scope.row.title }}</el-tag>
  </div>
</template>
    </el-table-column>
    <el-table-column
    label="发布者"
    width="200em">
        <template slot-scope="scope">
  <div class="publisher">
    <el-tag type="info">{{ scope.row.publisher }}</el-tag>
  </div>
</template>
    </el-table-column>
    <el-table-column label="操作">
        <template slot-scope="scope">
  <!-- <el-button
            @click.native.prevent="getTask(scope.row._id, scope.row)"
            size="medium"
            type="primary"
            plain
            >领取任务</el-button> -->
  <!-- <el-button
            size="medium"
            type="primary"
            @click="edit(scope.row._id)"
            >编辑任务</el-button> -->
  <el-button size="medium" type="danger" @click="remove(scope.row._id)">删除任务</el-button>
</template>
    </el-table-column>
    </el-table>  
    <div class="block">
        <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      total: 10,
      currentPage: 1,
      pageSize: 7,
      searchKey: '',
      searchValue: '',
      taskData: [],
      searchData: [],
      isAdmin: '',
    }
  },
  created () { //在created里面自动获取数据
    this.isAdmin = this.toBool(localStorage.isAdmin);
    if (this.isAdmin) {
      this.fetch();
    } else {
      this.$message({
        message: "您无权访问该页面",
        type: "error"
      });
      this.$router.push('/taskCenter')
    }
  },
  mounted () {
    this.setSearchData();
  },
  watch: {
    searchKey () {
      if (this.searchKey === '') {
        this.taskData = this.searchData
      } else {
        this.taskData = []
        if (this.searchValue === '1') {
          for (let i = 0; i < this.searchData.length; i++) {
            if (this.searchData[i].publishDate.match(this.searchKey)) { this.taskData.push(this.searchData[i]) }
          }
        } else if (this.searchValue === '2') {
          for (let i = 0; i < this.searchData.length; i++) {
            if (this.searchData[i].title.match(this.searchKey)) { this.taskData.push(this.searchData[i]) }
          }
        } else if (this.searchValue === '3') {
          for (let i = 0; i < this.searchData.length; i++) {
            if (this.searchData[i].publisher.match(this.searchKey)) { this.taskData.push(this.searchData[i]) }
          }
        } else {
          alert('请先选择要搜索的内容')
        }
      }
    }
  },
  methods: {
    toBool (input) {
      if ("false" === input)
        return false;
      else
        return input;
    },
    fetch () {
      this.$http.get("/task").then(res => {
        console.log(res.data)
        var responseData = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].taskStatus == '未领取') {
            responseData.push(res.data[i])
          }
        }
        this.taskData = responseData;
      }).then(() => {
        this.setSearchData();
      })

    },
    setSearchData () {
      this.searchData = this.taskData;
    },
    // edit(id){
    //     this.$router.push(`/taskEdit/${id}`);
    // },
    remove (id) {
      this.$http.delete(`/task/${id}`).then(res => {
        this.$message({
          message: '任务删除成功',
          type: 'success'
        });
        this.fetch()
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },

    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
    },

  },
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
.el-tag--medium >>> {
  color: black;
  background-color: transparent;
  border-style: none;
  font-size: 1.1em;
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
.block >>> {
  margin-top: 1.5em;
}
.el-pager >>> li {
  font-size: 50px;
}
</style>

