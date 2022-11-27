<template>
  <div>
    <div class="login_container">
      <el-form :label-position="labelPosition" label-width="50px" :model="formLabelAlign">
        <el-form-item label="账号">
          <el-input v-model="formLabelAlign.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="formLabelAlign.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item class="tc">
          <el-button class="submit_btn" size="large" type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import {cookie} from "../../common/js/cookie";

  export default {
    data() {
      return {
        labelPosition: 'right',
        formLabelAlign: {
          username: '',
          password: '',
        }
      };
    },
    methods: {
      onSubmit() {
        const { username, password } = this.formLabelAlign
        if(!username) {
          this.$message.error('请输入账号')
          return
        }

        if(!password) {
          this.$message.error('请输入密码')
          return
        }

        const data = {
          username,
          password,
        }
        this.$http.post('common/login', data).then(res => {
          if(res.code == 200) {
            cookie.set('islogin', '1', 7)
            this.$router.push('/')
          }
        })
      }
    }
  }
</script>
<style scoped>
  .login_container {
    padding-top: 30vh;
    height: 70vh;
    margin: auto;
    width: 250px;
  }

  .submit_btn {
    display: inline-block;
    width: 200px;
  }
</style>
