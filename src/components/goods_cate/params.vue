<template>
    <div class="paramsPage">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-alert
                    title="注意：只允许为第三级分类设置相关参数！"
                    type="warning"
                    show-icon></el-alert>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    选择商品分类：
                    <el-cascader
                    expand-trigger="hover"
                    clearable
                    v-model="cascaderValue"
                    :options="dialogList"
                    :props="cascaderProps"
                    @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button @click="dt" class="button" :disabled="isdis" size="mini" type="primary">添加参数</el-button>
                    <el-table :data="tableData1" border stripe>
                        <el-table-column type="expand" width="50">
                            <template slot-scope="scope">
                               <el-tag @close="closeTag(scope.row, index)" closable v-for="(item, index) in scope.row.attr_vals" :v-if="!scope.row.attr_vals" :key="index">
                                   {{ item }}
                               </el-tag>
                               <el-input
                                class="input-new-tag inputwidth"
                                v-if="inputVisible"
                                v-model="inputValue"
                                ref="saveTagInput"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                               <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                               <el-button @click="bj(scope.row)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                                <el-button @click="del(scope.row)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button @click="jt" class="button" :disabled="isdis" size="mini" type="primary">添加属性</el-button>
                    <el-table :data="tableData2" border stripe>
                        <el-table-column type="expand" width="50">
                            <template slot-scope="scope">
                               <el-tag @close="closeTag(scope.row, index)" closable v-for="(item, index) in scope.row.attr_vals" :v-if="!scope.row.attr_vals" :key="index">
                                   {{ item }}
                               </el-tag>
                               <el-input
                                class="input-new-tag inputwidth"
                                v-if="inputVisible"
                                v-model="inputValue"
                                ref="saveTagInput"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                               <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                               <el-button @click="bj(scope.row)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                                <el-button @click="del(scope.row)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog
        :title="activeName == 'many' ? '添加动态参数' : '添加静态参数'"
        :visible.sync="dialogVisible"
        width="50%"
        @close="clo"
        >
        <el-form :model="formModel" ref="formRef" :rules="formRules" label-width="80px">
            <el-form-item :label="activeName == 'many' ? '动态参数' : '静态属性'" prop="zhi">
                <el-input v-model="formModel.zhi"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogqd">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
        :title="activeName == 'many' ? '修改动态参数' : '修改静态属性'"
        :visible.sync="dialogVisible2"
        width="50%"
        @close="clo"
        >
        <el-form :model="formModel2" ref="formRef" :rules="formRules" label-width="110px">
            <el-form-item :label="activeName == 'many' ? '动态参数' : '静态属性'" prop="zhi">
                <el-input v-model="formModel2.zhi"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="dialogqd2">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        created() {
            this.dialogShopList()
        },
        data() {
            return {
                cascaderValue: [],
                dialogList: [],
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                activeName: 'many',
                // 动态参数数据源
                tableData1: [],
                // 静态参数数据源
                tableData2: [],
                dialogVisible: false,
                formModel: {
                    zhi: ''
                },
                formRules: {
                    zhi: [
                        { required: true, message: '请输入参数名称', trigger: 'blur' }
                    ]
                },
                dialogVisible2: false,
                formModel2: {
                    zhi: ''
                },
                attr_id: 0,
                inputVisible: false,
                inputValue: ''
            }
        },
        methods: {
            // 商品列表数据源
            async dialogShopList() {
                const { data: res } = await this.$http.get('/categories', {
                    params: {
                        type: [3]
                    }
                })
                this.dialogList = res.data
                // console.log(res.data)
            },
            handleChange() {
                if (this.cascaderValue.length === 0) {
                    this.tableData1 = []
                    this.tableData2 = []
                } else {
                    this.handleClick()
                }
                console.log(this.cascaderValue)
            },
            // 获取动态静态列表数据
            async handleClick() {
                if (this.cascaderValue.length === 0) return null
               const { data: res } = await this.$http.get(`/categories/${this.cascaderValue[2]}/attributes`, {
                        params: {
                            sel: this.activeName
                        }
                    })
                // console.log(res, 1111)
                res.data.forEach(element => {
                    element.attr_vals = element.attr_vals ? element.attr_vals.split(' ') : []
                })
                // eslint-disable-next-line eqeqeq
                if (this.activeName == 'many') {
                     this.tableData1 = res.data
                // eslint-disable-next-line eqeqeq
                } else if (this.activeName == 'only') {
                    this.tableData2 = res.data
                }
            },
            dt() {
                this.dialogVisible = true
            },
            jt() {
                this.dialogVisible = true
            },
            // 清空dialog的数据
            clo() {
                this.formModel.zhi = ''
                this.$refs.formRef.resetFields()
            },
            // dialog确定
            dialogqd() {
                // console.log(this.activeName)
                this.$refs.formRef.validate(async item => {
                    if (!item) return null
                    const { data: res } = await this.$http.post(`categories/${this.cascaderValue[2]}/attributes`, {
                        attr_sel: [this.activeName],
                        attr_name: this.formModel.zhi
                    })
                    // eslint-disable-next-line eqeqeq
                    if (res.meta.status == 201) {
                        this.$message.success(res.meta.msg)
                    } else {
                        this.$message.error(res.meta.msg)
                    }
                    this.handleClick()
                    // console.log(res.meta.status)
                })
                this.dialogVisible = false
            },
            bj(item) {
                this.attr_id = item.attr_id
                this.formModel2.zhi = item.attr_name
                this.dialogVisible2 = true
                // console.log(item, this.dialogVisible2)
            },
            dialogqd2() {
                this.$refs.formRef.validate(async item => {
                    // | :id       | 分类 ID                | 不能为空`携带在url中`      |
                    // | :attrId   | 属性 ID                | 不能为空`携带在url中`      |
                    // | attr_name | 新属性的名字           | 不能为空，携带在`请求体`中 |
                    // | attr_sel  | 属性的类型[many或only] | 不能为空，携带在`请求体`中 |
                    // | attr_vals | 参数的属性值           | 可选参数，携带在`请求体`中 |
                    if (!item) return null
                    const { data: res } = await this.$http.put(`/categories/${this.cascaderValue[2]}/attributes/${this.attr_id}`, {
                        attr_name: this.formModel2.zhi,
                        attr_sel: [this.activeName]
                    })
                    console.log(res)
                    // eslint-disable-next-line eqeqeq
                    if (res.meta.status == 200) {
                        this.$message.success('修改成功')
                    } else {
                        this.$message.error('修改失败')
                    }
                    this.handleClick()
                    this.dialogVisible2 = false
                })
            },
            async del(item) {
                const { data: res } = await this.$http.delete(`/categories/${this.cascaderValue[2]}/attributes/${item.attr_id}`)
                // console.log(res, item)
                // eslint-disable-next-line eqeqeq
                if (res.meta.status == 200) {
                    this.$message.success('删除成功')
                } else {
                    this.$message.error('删除失败')
                }
                this.handleClick()
            },
            // 修改标签
            async xgbq(item) {
                await this.$http.put(`/categories/${this.cascaderValue[2]}/attributes/${item.attr_id}`, {
                    attr_name: item.attr_name,
                    attr_sel: [item.attr_sel],
                    attr_vals: item.attr_vals.join(' ')
                })
            },
            // 关闭tag标签
            closeTag(item, index) {
                item.attr_vals.splice(index, 1)
                this.xgbq(item)
                // this.handleClick()
            },
            handleInputConfirm(item) {
                if (this.inputValue.trim().length!= 0) {
                     item.attr_vals.push(this.inputValue.trim())
                    this.xgbq(item)
                }
                this.inputValue = ''
                this.inputVisible = false
            },
           showInput() {
                this.inputVisible = true
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            }

        },
        computed: {
            // 判断tabs下的按钮是否隐藏
            isdis() {
                // eslint-disable-next-line eqeqeq
                return this.cascaderValue.length === 0
            }
        }
    }
</script>

<style scoped>
.el-row{
    margin-bottom: 20px;
}
.button{
    margin-bottom: 20px;
}
.el-tag{
    margin: 10px;
}
.inputwidth{
    width: 120px;
}
</style>
