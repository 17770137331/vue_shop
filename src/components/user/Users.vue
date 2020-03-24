<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
           <el-row :gutter="30">
               <el-col :span="8">
                   <el-input placeholder="请输入内容">
                       <el-button slot="append" icon="el-icon-search"></el-button>
                   </el-input>
               </el-col>
               <el-row :span="4">
                   <el-button type="primary">添加用户</el-button>
               </el-row>
           </el-row>
           <el-table :data="userlist" :stripe="true" :border="true">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" >
                  <template slot-scope="scope">
                   <el-switch v-model="scope.row.mg_state"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="操作"  width="180">
                  <template slot-scope="scope">
                   <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                   <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                   <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                    <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
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
    </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      param: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0
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
    }
  }
}
</script>

<style scoped>
.el-table{
  margin-top:15px;
  
}
</style>
