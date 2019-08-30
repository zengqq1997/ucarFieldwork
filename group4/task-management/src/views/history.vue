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
        <el-option label="截止时间"
                    value="1"></el-option>
        <el-option label="任务标题"
                    value="2"></el-option>
        <el-option label="发布者"
                    value="3"></el-option>
        </el-select>
    </el-input>
    </div>
      <el-table
      :data="taskData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :default-sort = "{prop: '', order: 'descending'}"
      style="width: 100%; overflow:hidden;"
      >
    
      <el-table-column type="expand"  >
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand" style="text-align: left;font-size:3em;">
          <el-form-item label="任务需求:" >
            <span>{{ props.row.requirement }}</span>
          </el-form-item>
            <br/>
          <el-form-item label="需求文件:">
          <span><a :href="props.row.requirementFile"
            download="">下载</a></span>
          </el-form-item>
            <br/>
          <el-form-item label="提交文件:">
            <span>{{ props.row.submitFile }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>


  //表格：发布时间(date1)、截止时间(date2)、任务名称(task)、发布者(name1)、任务状态(state)
      <el-table-column
        prop="publishData"
        label="发布时间"
        sortable
        width="175em"
        >
        <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.publishDate }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="deadLine"
        label="截止时间"
        sortable
        width="175em"
      >
        <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.deadLine }}</span>
        </template>
      </el-table-column>


      <el-table-column
        label="任务标题"
        width="400em">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.title }}</el-tag>
          </div>
        </template>
      </el-table-column>
    
      <el-table-column
        label="发布者"
        width="150em"
        prop="name1">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="info">{{ scope.row.publisher }}</el-tag>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column    
        label="任务状态"
        >
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium"  id="state1">
            {{ scope.row.taskStatus }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
  

  <!-- <el-table-column
      label="操作"
      >
      <template slot-scope="scope">
        <div slot="reference" class="name-wrapper">
          <el-button             
            @click.native.prevent="submitTask(scope.row._id, scope.row)"
            size="medium"
            type="primary"
            plain
          >提交任务</el-button>

        </div>
      </template>
    </el-table-column> -->

    </el-table>    
        <div style="text-align: center;margin-top: 30px;">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="current_change">
    </el-pagination>
    </div>
  

</div>

</template>

<script>

  export default 
{
  data() 
    {
      return {
        total:10,
        currentPage: 1,
        pageSize: 7,
        searchKey: '',
        searchValue: '',
        taskData:[],
        searchData:[],
        isAdmin:'',
      }
    },
    created() {
    this.isAdmin = this.toBool(localStorage.isAdmin);
    if(this.isAdmin){
    this.fetch();
    }else{
        this.$message({
        message: "您无权访问该页面",
        type: "error"
      });
        this.$router.push('/taskCenter')
    }
    },
    mounted() {
      this.setSearchData();
    },
    watch: {
      searchKey(){
        if (this.searchKey === '') {
            this.taskData = this.searchData
        } else {
            this.taskData = []
            if (this.searchValue === '1') {
            for (let i = 0; i < this.searchData.length; i++) {
                if (this.searchData[i].deadLine.match(this.searchKey)) { this.taskData.push(this.searchData[i]) }
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
    methods:
    {
    toBool(input) 
        { 
            if ("false" === input) 
                return false; 
            else  
                return input; 
        },
      fetch(){
        //能看到所有已经发布的任务
        this.$http.get("/task").then(res => {
          this.taskData = res.data;
        }).then(() =>{
          this.setSearchData();
        })
      },
      setSearchData(){
        this.searchData = this.taskData;
      },
      handleEdit(index, row) {console.log(index, row);},
      handleDelete(index, row) {console.log(index, row);},
      
    
      current_change(currentPage){
        this.currentPage = currentPage;
      },

      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
        

    },
} 
</script>

<style scoped>

    .el-table--scrollable-y .el-table__body-wrapper {
        overflow-y: hidden !important;
    }
      .el-table >>> th > .cell {
        font-size: 1.2em;
    }
    .el-table >>> td > .cell {
        font-size: 1.0em;
    }
    .el-table >>> td > .cell span {
        font-size: 1.1em;
    }
    .el-table >>> td, .el-table >>> th {
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
    .el-form--label-left .el-form-item__label {
        text-align: left;
        font-size: 0.5em;
        color:skyblue;
    }
.el-form--inline >>> .el-form-item__content {
  font-size: 1.1em;
}

</style>