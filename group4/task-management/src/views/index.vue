<template>
  <div>
    <el-container>
      <el-header style="padding:0 2.1em;">
        <div id="bigTitle">
          <i class="el-icon-s-order"></i>
          <p>任务领取系统</p>
        </div>
        <div id="user">
          <span>亲爱的开发者：</span>
          <el-tag id="username">{{this.username}}</el-tag>
          <el-button id="logout" type="text" @click.native.prevent="Logout">
            点击注销</el-button>
        </div>
      </el-header>

      <el-container>
        <el-aside width="11.5em">
          <el-row class="tac">
            <el-col :span="12" style="width:100%;">
              <el-menu default-active="$route.path" router class="el-menu-vertical-demo" style="border-right:0;">
                <el-menu-item index="/taskCenter" style="font-size:1.1em;padding-left:10px;font-family:Microsoft Yahei"
                  v-if="!isAdmin">
                  <i class="el-icon-menu"></i>
                  <span slot="title">任务大厅</span>
                </el-menu-item>
                <el-menu-item index="/taskList" style="font-size:1.1em;padding-left:10px;font-family:Microsoft Yahei"
                  v-if="isAdmin">
                  <i class="el-icon-menu"></i>
                  <span slot="title">任务列表</span>
                </el-menu-item>
                <el-menu-item index="/taskPublish" style="font-size:1.1em;padding-left:10px;" v-if="!isAdmin">
                  <i class="el-icon-upload2"></i>
                  <span slot="title">发布任务</span>
                </el-menu-item>

                <el-menu-item index="/taskRecord" style="font-size:1.1em;padding-left:10px;" v-if="!isAdmin">
                  <i class="el-icon-s-operation"></i>
                  <span slot="title">任务记录</span>
                </el-menu-item>
                <el-menu-item index="/personInfo" style="font-size:1.1em;padding-left:10px;" v-if="!isAdmin">
                  <i class="el-icon-document"></i>
                  <span slot="title">个人信息</span>
                </el-menu-item>
                <el-menu-item index="/userList" style="font-size:1.1em;padding-left:10px;" v-if="isAdmin">
                  <i class="el-icon-setting"></i>
                  <span slot="title">用户列表</span>
                </el-menu-item>
                <el-menu-item index="/history" style="font-size:1.1em;padding-left:10px;" v-if="isAdmin">
                  <i class="el-icon-setting"></i>
                  <span slot="title">历史记录</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-container>
          <el-main style="padding:0 2em;background-color:transparent;text-align: center;
      line-height: 2em;">
            <router-view></router-view>
          </el-main>

        </el-container>
      </el-container>
      <!-- <el-footer>Footer</el-footer> -->
    </el-container>

  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      username: '',
      isAdmin: '',
    }
  },
  created () {
    this.username = localStorage.name;
    this.isAdmin = this.toBool(localStorage.isAdmin);

  },
  methods: {
    Logout () {
      this.$router.push('/login');
      localStorage.clear();
    },
    toBool (input) {
      if ("false" === input)
        return false;
      else
        return input;
    }
  },
}
</script>

<style>
html body {
  width: 100%;
  height: 100%;
  margin: 0;
  font-family: "Microsoft YaHei";
}
.el-header {
  text-align: center;
  line-height: 60px;
  padding: 0px 5em;
}

.el-aside {
  background-color: transparent;
  text-align: center;
  line-height: 200px;
  padding-left: 3em;
}
#username {
  font-size: 1em;
  margin-right: 1em;
}
#logout {
  font-size: 1em;
  margin-bottom: 0.3em;
}
#bigTitle {
  float: left;
  width: 40%;
  height: 100%;
  color: #409eff;
  vertical-align: middle;
}
#user {
  float: right;
}
#bigTitle p {
  font-size: 1.5em;
  margin-block-start: 0px;
  margin-block-end: 0px;
  float: left;
  margin: 0px;
}
.el-icon-s-order {
  float: left;
  font-size: 1.7em;
  margin-top: 2.9%;
}
</style>