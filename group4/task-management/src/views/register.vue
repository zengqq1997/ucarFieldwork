
<template>
  <div class="backgroundDiv"
       :style="backgroundDiv">
    <div class="land1"
         id="registerBox">
      <div class="topzi1">
        <h2 style="margin-bottom:1.5em">账号注册</h2>
      </div>
      <el-form :model="registerForm"
               :status-icon="true"
               :rules="registerRules"
               ref="registerForm"
               label-width="80px"
               class="demo-ruleForm"
               label-position="left"
               @submit.native.prevent="register"
               style="margin-left:40px">
        <el-form-item prop="email"
                      label="邮箱"
                      :hide-required-asterisk="false">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>

        <el-form-item label="验证码"
                      prop="vertifyCode"
                      style="width:10.5em">
          <el-input v-model="registerForm.vertifyCode"
                    auto-complete="off"
                    style="width:100%;margin-left:0em">
          </el-input>
        </el-form-item>

        <el-button type="primary"
                   plain
                   @click="getCode"
                   :disabled="isDisabled"
                   id="emialcore"
                   style="float:left;margin-left:0.7em;width:7.5em;padding-left:0;padding-right:0;">{{ btnMsg }}
        </el-button>
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="registerForm.username"
                    auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="密码"
                      prop="password">
          <el-input type="password"
                    v-model="registerForm.password"
                    auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="确认密码"
                      prop="checkPass">
          <el-input type="password"
                    v-model="registerForm.checkPass"
                    auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item style="width:100%;margin-left:-2.2em;">
          <el-button type="primary"
                     native-type="submit"
                     style="  margin: 0px 0.5em 0px 2.6em; width: 6.5em; ">注册</el-button>
          <el-button @click="resetForm('registerForm')"
                     style="  width:6.5em;">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="loginBtn">
        <span style="margin:auto">已有账号？</span>
        <el-button type="text"
                   @click="goLogin"
                   style="position:relative;font-size: 14px;">去登录</el-button>
      </div>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    var validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      registerForm: {
        email: "", //邮箱
        vertifyCode: "", //验证码
        username: "", //用户名
        password: "", //密码
        checkPass: "" //检查密码
      },
      btnMsg: "发送验证码",
      isDisabled: false,
      time: 10,

      registerRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        vertifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ],
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 2, max: 30, message: "长度在2-30之间", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 30, message: "长度在6-30之间", trigger: "blur" }
        ],
        checkPass: [
          { required: true, validator: validateCheckPass, trigger: "blur" }
        ]
      },
      backgroundDiv: {
        backgroundImage: 'url(' + require('../assets/bg.jpg') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        height: '100%',
        width: '100%',
        position: 'fixed'
      }
    };
  },
  methods: {
    // 验证码发送
    getCode () {
      if (this.registerForm.email == " ") {
        this.$message({
          message: "请正确填写信息",
          type: "error"
        });
      } else {
        this.$http.post("register", this.registerForm).then(res => {
          console.log(res);
          this.$message({
            message: "邮件已发送，请查看",
            type: "success"
          });
        });
        let me = this;
        me.isDisabled = true;
        let interval = window.setInterval(function () {
          me.btnMsg = "" + me.time + "秒后重新发送";
          --me.time;
          if (me.time < 0) {
            me.btnMsg = "重新发送";
            me.time = 10;
            me.isDisabled = false;
            window.clearInterval(interval);
          }
        }, 1000);
      }
    },

    //注册
    register () {

      if (this.registerForm.email == " " || this.registerForm.vertifyCode == " " || this.registerForm.username.length < 2 || this.registerForm.username.length > 30 || this.registerForm.password.length < 6 || this.registerForm.password.length > 30) {
        this.$message({
          message: "请正确填写信息",
          type: "error"
        });
      } else {
        this.$http
          .post(`register/${this.registerForm.email}`, this.registerForm)
          .then(res => {
            console.log(111)
            console.log(res);
            this.$message({
              message: "注册成功，请登录",
              type: "success"
            });
            this.$router.push({ path: "/login" }); //post成功后跳到登录界面
            //console.log(this.registerForm)
          });
      }
    },
    goLogin () {
      this.$router.push({ path: "/login" });
    },

    resetForm (formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
html,
body {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
}
.topzi1 {
  font-family: YouYUan;
  color: #409eff;
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}
.land1 {
  width: 25em;
  overflow: hidden;
  position: relative;
  margin: auto;
  margin-top: 3em;
  background-color: #ffffffbe;
  border: 1px solid #dcdee0;
  border-radius: 8px;
}

.el-input {
  width: 100%;
}
.el-input__icon.el-input__validateIcon.el-icon-loading {
  display: none;
}
.el-form-item {
  float: left;
  position: relative;
  margin-bottom: 20px;
}

.el-button--text {
  font-size: 14px;
}
.el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0.5em;
}
.loginBtn {
  width: 100%;
  float: left;
  background-color: #e9edf7a8;
  text-align: center;
  vertical-align: middle;
  font-size: 14px;
  color: #56585c;
  line-height: 40px;
  padding-top: 0.3em;
  margin-top: -0.3em;
}
</style>
