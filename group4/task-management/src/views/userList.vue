<template>
  <div>
    <el-input style="float:left; margin-top: 0.8em;"
              placeholder="请输入关键字查询"
              class="search"
              v-model="search"></el-input>
    <el-table :data="tables.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              :default-sort="{prop: '', order: 'descending'}"
              style="width: 100%; overflow:hidden;"
              ref="filterTable">
      <el-table-column width="50em">
        <template slot-scope="scope">
          <el-popover trigger="hover"
                      placement="top">
            <span>身份为管理员</span>
            <div slot="reference"
                 class="name-wrapper">
              <el-tag class="el-icon-user"
                      v-show="scope.row.isAdmin"></el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- <el-table-column label="id">
        <template slot-scope="scope">
          <span>{{scope.row._id}}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="用户名">
        <template slot-scope="scope">
          <el-popover trigger="hover"
                      placement="top">
            <p>联系电话: {{ scope.row.tel }}</p>
            <div slot="reference"
                 class="name-wrapper">
              <el-tag>{{ scope.row.username }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button style="font-size: 1em;"
                     type="danger"
                     size="small"
                     @click="remove(scope.row)"
                     :disabled="scope.row.isAdmin">删除用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination background
                     layout="prev, pager, next"
                     :total="total"
                     @current-change="current_change"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: "",
      total: 100,
      pagesize: 6,
      currentPage: 1,
      //虚假的数据
      userData: [],
      isAdmin: "",
    };
  },

  computed: {
    tables: function () {
      const search = this.search;

      if (search) {
        return this.userData.filter(function (dataNews) {
          return Object.keys(dataNews).some(function (key) {
            return (
              String(dataNews[key])
                .toLowerCase()
                .indexOf(search) > -1
            );
          });
        });
      }
      return this.userData;
    }
  },

  methods: {
    async fetch () {
      const res = await this.$http.get("/userList");
      this.userData = res.data;
    },
    async remove (row) {
      this.$confirm(`是否确定要删除用户"${row.username}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = this.$http.delete(`/user/${row._id}`);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.fetch();
      });
    },

    current_change: function (currentPage) {
      this.currentPage = currentPage;
    },

    filterHandler (value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    toBool (input) {
      if ("false" === input)
        return false;
      else
        return input;
    }
  },
  created () {
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
  }
};
</script>

<style scoped>
.el-input {
  margin-right: 7em;
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 23em;
}
.el-table--scrollable-y .el-table__body-wrapper {
  overflow-y: hidden !important;
}
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
.el-form--label-left .el-form-item__label {
  text-align: left;
  font-size: 0.5em;
  color: skyblue;
}
.el-form--inline .el-form-item__content {
  display: inline-block;
  vertical-align: middle;
  font-size: 0.4em;
  margin-left: 1em;
}
</style>