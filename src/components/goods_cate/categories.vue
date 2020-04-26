<template>
    <div class="categoriesPage">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addFenlei">添加分类</el-button>
                </el-col>
            </el-row>
            <zk-table
                class="zktable"
                :data="list"
                :columns="columns"
                :show-row-hover="false"
                :border="true"
                :selection-type="false"
                :expand-type="false"
                show-index
                index-text="#"
            >
                <template slot="isYouxiao" slot-scope="scope">
                    <i style="color:lightgreen;" class="el-icon-success" v-if="!scope.row.cat_deleted"></i>
                    <i class="el-icon-error" v-else-if="scope.row.cat_deleted"></i>
                </template>
                <template slot="tag" slot-scope="scope">
                   <el-tag size="mini" type="pirmary" v-if="scope.row.cat_level==0">一级</el-tag>
                   <el-tag size="mini" type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
                   <el-tag size="mini" type="danger" v-else-if="scope.row.cat_level==2">三级</el-tag>
                </template>
                <template slot="cz">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </zk-table>
            <div class="block">
                <!-- <span class="demonstration">{{ param.total }}</span> -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="param.pagenum"
                    :page-sizes="[3, 5, 10, 15]"
                    :page-size="param.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="param.total">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog
        title="添加分类"
        :visible.sync="dialogVisible"
        width="50%"
        @close="handleClose"
       >
            <el-form ref="formRef" :rules="rules" :model="form" label-width="100px">
                 <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="form.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader
                    expand-trigger="hover"
                    change-on-select
                    clearable
                    v-model="cascaderValue"
                    :options="dialogList"
                    :props="cascaderProps"
                    @change="handleChange"></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="qd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        created() {
            this.categories()
        },
        data() {
            return {
                // 数据源
                list: [],
                // 列
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name'
                    },
                     {
                        label: '是否有效',
                        prop: 'isYouxiao',
                        type: 'template',
                        template: 'isYouxiao'
                    },
                     {
                        label: '排序',
                        prop: 'tag',
                        type: 'template',
                        template: 'tag'
                    },
                     {
                        label: '操作',
                        prop: 'cz',
                        type: 'template',
                        template: 'cz'
                    }
                ],
                // 传递过去的数据
                param: {
                    type: [1, 2, 3],
                    pagenum: 1,
                    pagesize: 5,
                    total: 0
                },
                // 对话框
                dialogVisible: false,
                form: {
                    cat_pid: 0,
                    cat_name: '',
                    cat_level: 0
                },
                // 表单的规则
                rules: {
                    cat_name: [
                         { required: true, message: '请输入分类名称', trigger: 'blur' }
                    ]
                },
                // dialog的商品数据
                dialogList: [],
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                cascaderValue: []
            }
        },
        methods: {
            // 获取数据源
            async categories() {
                const { data: res } = await this.$http.get('/categories', {
                    params: {
                        type: this.param.type,
                        pagenum: this.param.pagenum,
                        pagesize: this.param.pagesize
                    }
                })
                const { result, total } = res.data
                this.param.total = total
                this.list = result
                console.log(res, result)
            },
            handleSizeChange(item) {
                this.param.pagenum = 1
                this.param.pagesize = item
                this.categories()
            },
            handleCurrentChange(item) {
               this.param.pagenum = item
               this.categories()
            },
            // 添加分类
            addFenlei() {
                this.dialogShopList()
                this.dialogVisible = true
            },
            // dialog关闭
            handleClose() {
               this.$refs.formRef.resetFields()
                this.form.cat_pid = 0
                this.form.cat_level = 0
                this.form.cat_name = ''
                this.cascaderValue = []
                this.dialogVisible = false
            },
            // dialog中的商品列表
            async dialogShopList() {
                const { data: res } = await this.$http.get('/categories', {
                    params: {
                        type: [2]
                    }
                })
                this.dialogList = res.data
                // console.log(res.data)
            },
            handleChange() {
                // console.log(this.cascaderValue)
                console.log(this.cascaderValue)
                 if (this.cascaderValue.length > 0) {
                        // 父级分类的Id
                        this.form.cat_pid = this.cascaderValue[this.cascaderValue.length - 1]
                        // 为当前分类的等级赋值
                        this.form.cat_level = this.cascaderValue.length
                    } else {
                        // 父级分类的Id
                        this.form.cat_pid = 0
                        // 为当前分类的等级赋值
                        this.form.cat_level = 0
                    }
            },
            // 对话框确定按扭
            qd() {
                this.$refs.formRef.validate(async item => {
                    if (!item) return null
                    const { data: res } = await this.$http.post('/categories', this.form)
                    if (res.meta.status !== 201) {
                        return this.$Message.error('添加分类失败')
                    }
                    this.$Message.success('添加分类成功')
                    console.log(res)
                    this.dialogVisible = false
                    this.categories()
                })
            }

        }
    }
</script>

<style scoped>
.zktable{
    margin-top: 20px;
}
.block{
    margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
