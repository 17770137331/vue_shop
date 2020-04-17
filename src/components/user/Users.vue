<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
           <el-row :gutter="20">
               <el-col :span="8">
                   <el-input v-model="userInput" placeholder="请输入内容" clearable @clear="inputClean">
                       <el-button slot="append" icon="el-icon-search" @click="inputButton"></el-button>
                   </el-input>
               </el-col>
               <el-col :span="4">
                   <el-button type="primary" @click="centerDialogVisible=true">添加用户</el-button>
               </el-col>
           </el-row>
           <el-table  :data="userlist" :stripe="true" :border="true">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" >
                  <template slot-scope="scope">
                   <el-switch v-model="scope.row.mg_state" @change="switchchang(scope)"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="操作"  width="180">
                  <template slot-scope="scope">
                   <el-button @click="shancuUser(scope)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                   <el-button @click="deleteUser(scope)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                   <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="fenpenquanxian(scope)"></el-button>
                   </el-tooltip>
                  </template>
                </el-table-column>
            </el-table>
            <div class="block">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="param.pagenum"
                :page-sizes="[1, 2, 3, 4]"
                :page-size="param.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
        </el-card>
        <el-dialog
          @close="dialogClose"
          title="提示"
          :visible.sync="centerDialogVisible"
          width="50%"
          >
            <el-form ref="tableRef" :model="userForm" :rules="userFormRules" label-width="70px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="userForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="userForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="userForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
         @close="dialogClose2"
          title="修改用户信息"
          :visible.sync="dialogVisible"
          width="50%"
          >
          <el-form ref="xgForm" :model="xiugai" :rules="xguserFormRules" label-width="70px">
              <el-form-item label="用户名" prop="xgusername">
                <el-input v-model="xgusername"  disabled></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="xiugai.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="xiugai.mobile"></el-input>
              </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="xgUser">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="分配角色"
          :visible.sync="qxDialogVisible"
          width="50%"
          @close="fpclose"
          >
            <p>当前的用户：{{ fpusername }}</p>
            <p>当前的角色：{{ fprole_name }}</p>
            <p>分配新角色：
               <el-select v-model="fpvalue" placeholder="请选择">
                <el-option
                  v-for="item in qxsj"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
            </p>
            <span slot="footer" class="dialog-footer">
            <el-button @click="qxDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="fpqd">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    var checkEmail = (rule, value, cb) => {
      const resEmail = /^([a-zA-Z0-9])+@([a-zA-Z0-9])+(\.[a-zA-Z0-9])+/
      if (resEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }

    var checkMobile = (rule, value, cb) => {
      const resEmail = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (resEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      param: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      userInput: '',
      centerDialogVisible: false,
      dialogVisible: false,
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      xgusername: '',
      xiugai: {
        email: '',
        mobile: '',
        id: 1
      },
      userFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 15, message: '必须是6-15位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      xguserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      qxDialogVisible: false,
      fprole_name: '',
      fpusername: '',
      qxsj: [],
      fpvalue: '',
      fpid: 0,
      userId1: 0
    }
  },
  methods: {
    async getUserList () {
      // eslint-disable-next-line no-undef
      const { data } = await this.$http.get('/users', { params: this.param })
      // eslint-disable-next-line eqeqeq
      if (data.meta.status == 200) {
        this.userlist = data.data.users
        this.total = data.data.total
      }
      console.log(data)
    },
    handleSizeChange (newpagesize) {
      this.param.pagesize = newpagesize
      this.getUserList()
    },
    handleCurrentChange (newpagenum) {
      this.param.pagenum = newpagenum
      this.getUserList()
    },
    async switchchang (item) {
      // eslint-disable-next-line no-unused-vars
      const { status } = await this.$http.put(`users/${item.row.id}/state/${item.row.mg_state}`)
    },
    inputButton () {
      this.param.query = this.userInput
      this.getUserList()
    },
    inputClean () {
      this.param.query = this.userInput
      this.getUserList()
    },
    // eslint-disable-next-line vue/no-dupe-keys
    // centerDialogVisible () {
    //   this.centerDialogVisible = false
    // },
    dialogClose () {
      // console.log(this.$refs.tableRef)
      this.$refs.tableRef.resetFields()
    },
    addUser () {
      this.$refs.tableRef.validate(async (res) => {
        if (!res) return null
        const bb = await this.$http.post('/users', this.userForm)
        // console.log(bb)
        // eslint-disable-next-line eqeqeq
        if (bb.data.meta.status == 201) {
          this.$Message.success('添加成功')
          this.getUserList()
          this.centerDialogVisible = false
        } else {
          this.$Message.error('添加失败')
        }
      })
    },
    shancuUser (item) {
      // console.log(item)
      this.xiugai.id = parseInt(item.row.id)
      this.dialogVisible = true
      this.xgusername = item.row.role_name
      this.xiugai.email = item.row.email
      this.xiugai.mobile = item.row.mobile
    },
    xgUser () {
      this.$refs.xgForm.validate(async (res) => {
        if (!res) return null
        const sg = await this.$http.put(`users/${this.xiugai.id}`, { email: this.xiugai.email, mobile: this.xiugai.mobile })
        // console.log(sg)
        // eslint-disable-next-line eqeqeq
        if (sg.data.meta.status == 200) {
          this.$Message.success('修改成功')
          this.getUserList()
          this.dialogVisible = false
        } else {
          this.$Message.success('修改失败')
        }
        // console.log(this.xiugai.id)
      })
    },
    dialogClose2 () {
      // console.log(this.$refs.tableRef)
      this.$refs.xgForm.resetFields()
    },
    async deleteUser (item) {
      // console.log(item)
      const jk = await this.$MessageBox('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      // console.log(jk)
      // eslint-disable-next-line eqeqeq
      if (jk == 'confirm') {
        const sc = await this.$http.delete(`users/${item.row.id}`)
        // console.log(sc)
        // eslint-disable-next-line eqeqeq
        if (sc.data.meta.status == 200) {
          this.$Message.success('成功删除')
          this.getUserList()
          // this.dialogVisible = false
        }
      }
    },
    async fenpenquanxian(item) {
      const user = item.row
      this.userId1 = user.id
      // console.log(item)
      const { data } = await this.$http.get('/roles')
      // console.log(data)
      this.qxsj = data.data
      // this.fpid = user.id
      // console.log(this.fpid)
      this.fprole_name = user.role_name
      this.fpusername = user.username
      this.qxDialogVisible = true
    },
    async fpqd() {
      // console.log(this.fpid)
      if (!this.fpvalue) {
        return this.$Message('请分配角色')
      }
      const fp = await this.$http.put(`users/${this.userId1}/role`, { rid: this.fpvalue })
      this.$Message.success('角色分配成功')
      console.log(fp)
      this.qxDialogVisible = false
      this.getUserList()
    },
    fpclose() {
      this.fpvalue = ''
    }
  }
}
</script>

<style scoped>
.el-table{
  margin-top:15px;
}
</style>
