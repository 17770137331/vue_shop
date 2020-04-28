<template>
    <div class="powerPage">
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
                <el-table :data="tree" border class="eltable">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-row  :class="['centent','colone',index==0?'coloneTop':'']" v-for="(item, index) in scope.row.children" :key="item.id">
                                <!-- 一级权限 -->
                                <el-col :span="5">
                                    <el-tag closable @close="tagClose(scope.row,item.id)">{{ item.authName }}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 二级权限 -->
                                <el-col :span="19">
                                    <el-row :class="['centent',index2==0?'':'coloneTop']" v-for="(item2,index2) in item.children" :key="item2.id">
                                        <el-col :span="8">
                                             <el-tag closable @close="tagClose(scope.row,item2.id)" type="success">{{ item2.authName }}</el-tag>
                                             <i class="el-icon-caret-right"></i>
                                        </el-col>
                                        <el-col :span="16">
                                            <el-tag closable @close="tagClose(scope.row,item3.id)" v-for="item3 in item2.children" :key="item3.id" type="danger">{{ item3.authName }}</el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column label="角色" prop="roleName"></el-table-column>
                    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="fenpeiquanxian(scope)">分配权限</el-button>
                        </template>
                    </el-table-column>
                </el-table>
        </el-card>
        <el-dialog
        title="分配权限"
        :visible.sync="dialogVisible"
        width="50%"
        @close="dialogClose"
        :before-close="handleClose">
            <el-tree
                :data="qxdata"
                show-checkbox
                node-key="id"
                :props="treeProps"
                :default-expand-all="true"
                :default-checked-keys="defKeys"
                ref="treeRef"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    created() {
     this.hvTree()
    },
    data() {
        return {
            tree: [],
            dialogVisible: false,
            qxdata: [],
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            defKeys: [],
            qxid: 0
        }
    },
    methods: {
        async hvTree() {
            const tree = await this.$http.get('/roles')
            console.log(tree)
            this.tree = tree.data.data
        },
        async tagClose(id1, id2) {
            const jg = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)
            if (jg != 'confirm') {
                this.$message('取消删除')
            } else {
                const sc = await this.$http.delete(`roles/${id1.id}/rights/${id2}`)
                // console.log(123, sc)
                id1.children = sc.data.data
                // this.hvTree()
                this.$message('删除成功')
            }
        },
        async fenpeiquanxian(scope) {
            this.qxid = scope.row.id
            const { data } = await this.$http.get('rights/tree')
            //  console.log(123, scope.row.id)
            this.qxdata = data.data
            this.getLeafKeys(scope.row, this.defKeys)
            this.dialogVisible = true
            // console.log(this.expandedKeys)
        },
        getLeafKeys(node, arr) {
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                this.getLeafKeys(item, arr)
            })
        },
        handleClose() {
            this.dialogVisible = false
        },
        dialogClose() {
            // console.log(123, this.expandedKeys)
            this.defKeys = []
            // console.log(123, this.expandedKeys)
        },
        async allRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const str = keys.join(',')
            console.log(this.qxid, keys)
            const { data } = await this.$http.post(`roles/${this.qxid}/rights`, { rids: str })
            // console.log(data)
            if (data.meta.ststus != 200) {
                this.$message.success(data.meta.msg)
            }
            this.dialogVisible = false
            this.hvTree()
        }
    }
}
</script>

<style lang="less" scoped>
.eltable{
    margin-top: 20px;
    .el-tag{
    margin: 7px;
}
.colone{
    border-bottom:1px solid #eee;
}
.coloneTop{
    border-top:1px solid #eee;
}
.centent{
    display: flex;
    align-items: center;
}
}
</style>
