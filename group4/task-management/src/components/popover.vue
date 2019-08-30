<template>
  <!-- 组件代码 -->
  <span>
    <el-popover ref="popover5"
                placement="top"
                width="160"
                v-model="visible">
      <p>确定删除这个任务吗</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini"
                   type="default"
                   @click="visible = false">取消</el-button>
        <el-button type="danger"
                   size="mini"
                   @click="deleteItem(row._id)">确定</el-button>
      </div>
    </el-popover>
    <el-button v-popover:popover5
               size="mini"
               type="danger"
               v-if="row.taskStatus=='未领取'||row.taskStatus=='已过期'"
               :disabled=false>删除</el-button>
    <el-button v-popover:popover5
               size="mini"
               type="danger"
               v-if="row.taskStatus=='已完成'||row.taskStatus=='已领取'"
               :disabled=true>删除</el-button>
  </span>
</template>
 
<script>
module.exports = {
  name: "popover",
  props: ["row"],
  data: function () {
    return {
      visible: false
    };
  },
  methods: {

    deleteItem (id) {
      // this.$http.delete(`task/${id}`).then(res => {
      //   this.$message({
      //     message: '任务删除成功',
      //     type: 'success'
      //   })

      // }).then(() => {
      this.$emit('handleDelete', this.row);
      // })
      this.visible = false;
    }
  }
};
</script>