<template>
    <div class="loginBackground">
        <div class="loginBackground_box">
            <div class="logo">
                <img src="../assets/logo.png" alt="">
            </div>
            <el-form  label-width="0px" ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="biaodan">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <el-form-item class="btn">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="loginFormRest">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 15, message: '必须是6-15位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginFormRest () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (res) => {
        if (!res) {
          return null
        }
        // eslint-disable-next-line no-unused-vars
        const { data } = await this.$http.post('/login', this.loginForm)
        // eslint-disable-next-line eqeqeq
        if (data.meta.status == 200) {
          this.$Message.success('登录成功！')
          // console.log(data)
          window.localStorage.setItem('token', data.data.token)
          this.$router.replace('/home')
        } else {
          this.$Message.error('登录失败')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
    .loginBackground{
        width:100%;
        height:100%;
        background-color: #2b4b6b;
        .loginBackground_box{
            width:450px;
            height:300px;
            background-color:#fff;
            border-radius: 3px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            .logo{
                width: 130px;
                height: 130px;
                border: 1px solid #eee;
                border-radius: 200px;
                padding: 10px;
                background: #fff;
                position: absolute;
                left: 50%;
                transform:translate(-50%,-50%);
                box-shadow:0 0 10px #ddd;
                img{
                    width:100%;
                    height: 100%;
                    border-radius: 200px;
                    border: 1px solid #eee;
                    background: #eee;
                }
            }
        }
        .biaodan{
            position: absolute;
            bottom: 0px;
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px;
        }
        .btn{
            display: flex;
            justify-content: flex-end;
        }
    }
</style>
