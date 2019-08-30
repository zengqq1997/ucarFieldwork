<template>
  <div class="note"
       :style="backgroundDiv">
    <div class="land"
         id="loginBox">
      <div class="topzi">
        <h1>神州</h1>
        <h3 style="margin-bottom:1.5em">任务领取系统</h3>
      </div>
      <el-form :model="loginForm"
               status-icon
               ref="loginForm"
               label-width="60px"
               label-position="right"
               class="demo-ruleForm"
               :hide-required-asterisk="true"
               style="margin-left:1em"
               @submit.native.prevent="login">
        <el-form-item prop="email"
                      label="账号">
          <el-input v-model="loginForm.email"
                    placeholder="用户名/邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="password"
                      label="密码">
          <el-input type="password"
                    v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-button type="primary"
                   native-type="submit"
                   style="margin:0 1em 1em 4.3em; width:30% ">登录</el-button>
        <el-button @click="resetForm('loginForm')"
                   style="margin-left: 0px; width:30% ">重置</el-button>
      </el-form>

      <div class="registerBtn">
        <span style="float:left;margin-left:3.5em">没有账号？</span>
        <el-button type="text"
                   @click="goRegister"
                   style="float:left;margin-right:2em;font-size: 14px;">注册</el-button>
        <forgetPass></forgetPass>
      </div>

      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import forgetPass from "../views/forgetPass.vue";

export default {
  components: {
    forgetPass
  },
  data () {


    return {
      loginForm: {
        email: "",
        password: ""
      },
      backgroundDiv: {
        backgroundImage: 'url(' + require('../assets/bg.jpg') + ')',
        backgroundRepeat: 'repeat',
        backgroundSize: '100% 100%',
        height: '100%',
        width: '100%',
        position: 'fixed'
      }

    };
  },
  methods: {
    async login () {
      const res = await this.$http.post("login", this.loginForm)
      localStorage.email = res.data.user.email;
      localStorage.isAdmin = res.data.user.isAdmin;
      localStorage.name = res.data.name;
      localStorage.token = res.data.token; //把token写入浏览器存储，如果关了浏览器就没有了，就用sessionstorage
      if (res.data.user.isAdmin) {
        this.$router.push({ path: "/taskList" }); //管理员post成功后跳到任务列表
      } else {
        this.$router.push({ path: "/taskCenter" }); //普通用户post成功后跳到任务界面
      }
      this.$message({
        message: "登录成功",
        type: "success"
      });

    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    goRegister () {
      this.$router.push({ path: "/register" });
    },
  }
};
</script>

<style scoped>
body {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
}
.topzi {
  font-family: YouYUan;
  color: #409eff;
  text-align: center;
  position: relative;
}
.land[data-v-7589b93f] {
  width: 20em;
  margin: auto;
  margin-top: 4em;
  background-color: #ffffffbe;
  border: 1px solid #dcdee0;
  border-radius: 8px;
  overflow: hidden;
}

.el-input {
  width: 80%;
  min-width: 168px;
}
label.el-form-item__label {
  padding-right: 0em;
  text-align: right;
}

label span {
  display: inline-block;
  width: 100%;
}
.content .el-from-item__content {
  margin-left: 5em;
}
.registerBtn {
  width: 100%;
  float: left;
  background-color: #e9edf7a8;
  text-align: center;
  vertical-align: middle;
  font-size: 14px;
  color: #56585c;
  line-height: 40px;
  padding-top: 0.3em;
  margin-top: 0.5em;
  /* overflow: hidden; */
}
</style>
