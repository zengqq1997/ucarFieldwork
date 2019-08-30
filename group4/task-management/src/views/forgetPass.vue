<template>
  <div class="forgetPass"
       id="forgetPassBox">
    <el-button type="text"
               @click="centerDialogVisible = true">忘记密码</el-button>
    <div class="dialog">
      <el-dialog title="忘记密码"
                 color="blue"
                 :visible.sync="centerDialogVisible"
                 width="26em"
                 top="10vh"
                 center
                 :close-on-click-modal="false"
                 :append-to-body="true"
                 v-if="centerDialogVisible">
        <div>
          <el-form :model="forgetPassForm"
                   :status-icon="true"
                   :rules="forgetPassRules"
                   ref="forgetPassForm"
                   label-width="80px"
                   class="demo-ruleForm"
                   label-position="left"
                   @submit.native.prevent="forgetPass"
                   :hide-required-asterisk="false"
                   style="margin-left:1.5em;overflow:hidden">
            <el-form-item prop="email"
                          label="邮箱"
                          :hide-required-asterisk="false">
              <el-input v-model="forgetPassForm.email"></el-input>
            </el-form-item>
            <el-form-item label="验证码"
                          prop="vertifyCode"
                          style="width:12em">
              <el-input v-model="forgetPassForm.vertifyCode"
                        auto-complete="off"
                        style="width:100%;margin-left:0em; ">
              </el-input>
            </el-form-item>
            <el-button type="primary"
                       plain
                       @click="getCode"
                       :disabled="isDisabled"
                       id="emialcore"
                       style="float:left;margin-left:0.7em;width:7.5em;padding-left:0;padding-right:0;">{{ btnMsg }}
            </el-button>
            <el-form-item label="新密码"
                          prop="password">
              <el-input type="password"
                        v-model="forgetPassForm.password"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码"
                          prop="checkPass">
              <el-input type="password"
                        v-model="forgetPassForm.checkPass"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item style="width:100%;margin:0.8em 0 1em -2.2em;">
              <el-button type="primary"
                         native-type="submit"
                         style="  margin: 0px 0.7em 0px 2.2em; width: 6.5em; ">确认</el-button>
              <el-button @click="resetForm('forgetPassForm')"
                         style="  width:6.5em;">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
export default {
  name: "forget",
  data () {
    var validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.forgetPassForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      centerDialogVisible: false,
      forgetPassForm: {
        email: "", //邮箱
        vertifyCode: "", //验证码
        username: "", //用户名
        password: "", //密码
        checkPass: "" //检查密码
      },
      btnMsg: "发送验证码",
      isDisabled: false,
      time: 10,

      forgetPassRules: {
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
      }
    };
  },
  methods: {
    // 验证码发送
    getCode () {
      if (this.forgetPassForm.email == " ") {
        this.$message({
          message: "请正确填写信息",
          type: "error"
        });
      } else {
        this.$http
          .post(`login/${this.forgetPassForm.email}`, this.forgetPassForm)
          .then(res => {
            this.$message({
              message: "邮件已发送，请查看",
              type: "success"
            });
            console.log(res);
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

    //修改密码
    forgetPass () {
      if (this.forgetPassForm.email == " " || this.forgetPassForm.vertifyCode == " " || this.forgetPassForm.password.length < 6 || this.forgetPassForm.password.length > 30) {
        this.$message({
          message: "请正确填写信息",
          type: "error"
        });
      } else {
        this.$http
          .put(`login/${this.forgetPassForm.email}`, this.forgetPassForm)
          .then(res => {
            this.$message({
              message: "修改密码成功,请登录",
              type: "success"
            });
            console.log(res);
            setTimeout("location.reload()", 1000);
          });
      }
    },

    resetForm (formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.el-dialog__wrapper >>> .el-dialog {
  color: #4f6799;
  background-color: #ffffffe5;
  border: 1px solid #dcdee0;
  border-radius: 8px;
}
.el-input {
  width: 100%;
}
.el-form-item {
  float: left;
  position: relative;
}
.el-button--text {
  font-size: 14px;
}
.el-dialog__wrapper >>> .el-dialog__title {
  line-height: 24px;
  font-size: 20px;
  color: #409eff;
  font-family: YouYUan;
  font-weight: bold;
}
</style>
