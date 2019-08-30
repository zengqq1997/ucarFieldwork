<template>
  <div>
    <el-tag style="font-size:1.4em;margin-top:1em;">个人信息</el-tag>
    <el-table :show-header="false"
              :data="personData"
              style=" margin:0 auto; width: 50em;border:none; margin-top: 1.5em;font-size:1.0em;">
      <el-table-column style="margin-left: -5em; text-align:center;">
        <template slot-scope="scope">
          <span style="border-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.value }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary"
               @click="modifyPassVisible = true"
               style="margin-left: -1em;margin-top:2.5em;">修改密码</el-button>
    <el-dialog title="密码修改"
               :visible.sync="modifyPassVisible"
               :close-on-click-modal="false"
               width="30em">
      <el-form :model="ruleForm"
               status-icon
               :rules="rules"
               ref="ruleForm"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="原密码"
                      prop="password">
          <el-input type="password"
                    v-model="ruleForm.password"
                    style="width: 23em"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码"
                      prop="newPass">
          <el-input type="password"
                    v-model="ruleForm.newPass"
                    style="width: 23em"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码"
                      prop="checkNewpass">
          <el-input type="password"
                    v-model="ruleForm.checkNewpass"
                    style="width: 23em"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitPass('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')"
                     style=" margin-left: 3em;">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-button type="primary"
               @click="modifyInfoVisible = true"
               style="margin-left: 4em;margin-top:2.5em;">修改信息</el-button>
    <el-dialog title="个人信息"
               :visible.sync="modifyInfoVisible"
               :close-on-click-modal="false"
               width="40em">
      <el-form>
        <el-form-item label="账号"
                      style="padding-left: 2em">
          <el-input v-model="newInfo.email"
                    autocomplete="off"
                    style="width: 31em;margin-left: -5em"
                    :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名"
                      style="padding-left:2em">
          <el-input v-model="newInfo.username"
                    autocomplete="off"
                    style="width: 31em;margin-left: -6em"></el-input>
        </el-form-item>
        <el-form-item label="性别"
                      style="padding-left: 2em;">
          <el-input v-model="newInfo.gender"
                    autocomplete="off"
                    style="width: 31em;margin-left: -5em"></el-input>
        </el-form-item>
        <el-form-item label="手机号"
                      style="padding-left: 2em;">
          <el-input v-model="newInfo.tel"
                    autocomplete="off"
                    style="width: 31em;margin-left: -6em"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitInfo('personInfo')">保存修改</el-button>
          <el-button @click="giveUp()"
                     style="margin-left: 4em">取消修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkNewpass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      passwords: [],
      personData: [{
        name: '账号',
        value: '',
      }, {
        name: '用户名',
        value: '',
      },
      {
        name: '性别',
        value: '',
      }, {
        name: '手机号',
        value: '',
      }
      ],
      user: {
        username: localStorage.name,
        email: localStorage.email,
      },
      newInfo: {
        email: '',
        username: '',
        gender: '',
        tel: ''
      },
      modifyInfoVisible: false,
      modifyPassVisible: false,
      ruleForm: {
        password: '',
        newPass: '',
        checkNewpass: '',
      },
      rules: {
        newPass: [
          { validator: validatePass, trigger: 'blur' }

        ],
        checkNewpass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      }
    };

  },
  created () {
    this.loadInfo();
  },
  methods: {

    loadInfo () {
      this.$http.post("user", this.user).then(res => {
        this.user = res.data;
        this.personData[0].value = this.user.email;
        this.personData[1].value = this.user.username;
        this.personData[2].value = this.user.gender;
        this.personData[3].value = this.user.tel;
        this.newInfo.email = this.user.email;
        this.newInfo.gender = this.user.gender;
        this.newInfo.username = this.user.username;
        this.newInfo.tel = this.user.tel;
        console.log(this.user)
      })
    },
    submitInfo (formName) {
      if (this.user.username === this.newInfo.username) {
        this.user.gender = this.newInfo.gender;
        this.user.tel = this.newInfo.tel;
        this.$http.put(`user/${this.user._id}`, this.user).then(res => {
          this.$message({
            message: '个人信息修改成功',
            type: 'success',
          });
          localStorage.name = this.user.username;
          this.user = res.data;
          setTimeout("location.reload()", 1000);
          location.reload();
        })
      }
      else {
        this.user.username = this.newInfo.username;
        this.user.gender = this.newInfo.gender;
        this.user.tel = this.newInfo.tel;
        this.$http.put(`user/change/${this.user._id}`, this.user).then(res => {
          this.$message({
            message: '个人信息修改成功',
            type: 'success',
          });
          localStorage.name = this.user.username;
          this.user = res.data;
          setTimeout("location.reload()", 1000);
          location.reload();
        })
      }
    },

    submitPass (formName) {

      this.passwords[0] = this.ruleForm.password;
      this.passwords[1] = this.ruleForm.newPass;
      if (this.ruleForm.newPass === this.ruleForm.checkNewpass) {
        if (this.ruleForm.newPass.length < 6 || this.rules.newPass > 30) {
          this.$message({
            message: '密码长度应为6-30个数字或字符',
            type: 'error',
          });
        }
        else {
          this.user.password = this.ruleForm.newPass;
          this.$http.put(`user/password/${this.user._id}`, this.passwords).then(res => {
            this.$message({
              message: '密码修改成功',
              type: 'success',
            });
          });
          this.modifyPassVisible = false;
        }
      }
      else {
        this.$message({
          message: '两次密码不一致',
          type: 'error',
        });
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    giveUp () {
      this.newInfo.username = this.personData[1].value;
      this.newInfo.gender = this.personData[2].value;
      this.newInfo.tel = this.personData[3].value;
      this.modifyInfoVisible = false;
    }
  }

}

</script>

<style scoped>
.el-table >>> td,
.el-table >>> th {
  text-align: center;
}
</style>