<template>
    <div>
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-table :data="list" stripe border>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.level == 0">一级</el-tag>
                <el-tag v-if="scope.row.level == 1" type="success">二级</el-tag>
                <el-tag v-if="scope.row.level == 2" type="warning">三级</el-tag>
              </template>
            </el-table-column>
        </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
  async created() {
    const list = await this.$http.get('/rights/list')
    console.log(list)
    this.list = list.data.data
  },
  data() {
    return {
      list: [],
      level: '1'
    }
  }
}
</script>

<style scoped>

</style>
