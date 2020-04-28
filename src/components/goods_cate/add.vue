<template>
    <div class="addPage">
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-alert
                    title="添加商品信息"
                    center
                    type="info"
                    :closable="false"
                    show-icon></el-alert>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-steps :active="+activeName" finish-status="success" align-center>
                        <el-step title="基本信息"></el-step>
                        <el-step title="商品参数"></el-step>
                        <el-step title="商品属性"></el-step>
                        <el-step title="商品图片"></el-step>
                        <el-step title="商品内容"></el-step>
                        <el-step title="完成"></el-step>
                    </el-steps>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form :model="model" :rules="rules" ref="ref">
                    <el-tabs tab-position="left" style="height: 200px;" v-model="activeName" @tab-click="handleClick" :before-leave="handLeave">
                        <el-tab-pane label="基本信息" name="0">
                                <el-form-item label="商品名称" prop="goods_name">
                                    <el-input v-model="model.goods_name"></el-input>
                                </el-form-item>
                                <el-form-item label="商品价格" prop="goods_price">
                                    <el-input v-model="model.goods_price"></el-input>
                                </el-form-item>
                                <el-form-item label="商品重量" prop="goods_weight">
                                    <el-input v-model="model.goods_weight"></el-input>
                                </el-form-item>
                                <el-form-item label="商品数量" prop="goods_number">
                                    <el-input v-model="model.goods_number"></el-input>
                                </el-form-item>
                                <el-form-item label="商品分类" prop="goods_cat">
                                    <br>
                                    <el-cascader
                                    v-model="model.goods_cat"
                                    :options="cascaderValue"
                                    :props="porps"
                                    clearable
                                    @change="handleChange"></el-cascader>
                                </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品参数" name="1">
                            <div v-for="(item, index) in shopData" :key="index">
                                <p>{{ item.attr_name }}</p>
                                <el-checkbox-group v-model="item.attr_vals">
                                    <el-checkbox v-for="(item2, index) in item.attr_vals" :key="index" class="ckb" :label="item2" border></el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="商品属性" name="2">
                                <el-form-item v-for="(item, index) in shopSx" :key="index" :label="item.attr_name">
                                    <el-input v-model="item.attr_vals"></el-input>
                                </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品图片" name="3">
                            <el-upload
                            action="http://127.0.0.1:8888/api/private/v1/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="objheader"
                            :on-success="handleSuccess">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip"></div>
                            </el-upload>
                        </el-tab-pane>
                        <el-tab-pane label="商品内容" name="4">
                             <quill-editor
                            v-model="model.goods_introduce"
                            />
                            <el-button type="primary" class="btn" @click="add">添加商品</el-button>
                        </el-tab-pane>
                    </el-tabs>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="50%"
        >
        <img :src="url" alt="" class="img">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
    export default {
        created() {
            this.list()
        },
        data() {
            return {
                // tabs
                // steps
                activeName: 0,
                // form model
                model: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    goods_cat: [],
                    pics: [],
                    goods_introduce: '',
                    attrs: []
                },
                // form rules
                rules: {
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    goods_price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur' }
                    ],
                    goods_weight: [
                        { required: true, message: '请输入商品重量', trigger: 'blur' }
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' }
                    ],
                    goods_cat: [
                        { required: true, message: '请输入商品分类', trigger: 'blur' }
                    ]
                },
                // cascader选择到的值
                cascaderValue: [],
                // cascader porps
                porps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 商品参数数据源
                shopData: [],
                // 商品参数选择
                checked1: true,
                // 商品属性数据
                shopSx: [],
                // 文件上传请求头
                objheader: {
                    Authorization: window.localStorage.getItem('token')
                },
                // 显示上传的文件
                url: '',
                dialogVisible: false

            }
        },
        methods: {
            // 获取商品数据列表
            async list() {
                const { data: res } = await this.$http.get('/categories', {
                    params: {
                        type: [3]
                    }
                })
                // cascaderValue
                this.cascaderValue = res.data
                // console.log(res)
            },
            // 获取商品参数
            async list2() {
                const { data: res } = await this.$http.get(`/categories/${this.model.goods_cat[2]}/attributes`, {
                    params: {
                        sel: 'many'
                    }
                })
                res.data.forEach(element => {
                    element.attr_vals = element.attr_vals.length === 0 ? [] : element.attr_vals.split(' ')
                })
                this.shopData = res.data
                // console.log(res)
            },
            // 获取商品属性列表
            async list3() {
                const { data: res } = await this.$http.get(`/categories/${this.model.goods_cat[2]}/attributes`, {
                    params: {
                        sel: 'only'
                    }
                })
                this.shopSx = res.data
                console.log(res)
            },
            // tabs
            handleClick() {
                if (+this.activeName === 1) {
                    this.list2()
                } else if (+this.activeName === 2) {
                    this.list3()
                }
            },
            // tabs钩子函数
            handLeave (New, Older) {
                if (this.activeName !== 0) {
                    if (this.model.goods_cat.length === 0) {
                        this.$message.error('请选择分类')
                        return false
                    }
                }
            },
            // 触发cascader
            handleChange() {
                console.log(this.model.goods_cat)
            },
            // 文件上传预览图
            handlePreview(file) {
                console.log(file)
                this.url = file.response.data.url
                this.dialogVisible = true
            },
            // 文件上传预览图删除
            handleRemove(file) {
                // console.log(this.model)
                const dz = file.response.data.tmp_path
                // console.log(dz)
                const zhi = this.model.pics.findIndex(x => x == dz)
                // console.log(zhi)
                this.model.pics.splice(zhi, 1)
                // console.log(this.model)
            },
            // 监听文件是否上传成功
            handleSuccess(resp) {
                // console.log(resp)
                this.model.pics.push(resp.data.tmp_path)
                // console.log(this.model)
            },
            // 商品内容之添加商品
            async add() {
                this.$refs.ref.validate(item => {
                    if (!item) {
                        return this.$message.error('请填写必要的表单项')
                    }
                })
                // console.log(this.shopData)
                // console.log(this.shopSx)
                // console.log(this.model)
                this.shopData.forEach(item => {
                    const obj = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(' ')
                    }
                    this.model.attrs.push(obj)
                })
                this.shopSx.forEach(item => {
                     const obj = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals
                    }
                    this.model.attrs.push(obj)
                })
                const model2 = _.cloneDeep(this.model)
                model2.goods_cat = model2.goods_cat.join(',')
                console.log(model2)
                const { data: res } = await this.$http.post('/goods', model2)
                console.log(res)
                if (res.meta.status == 201) {
                    this.$message.success(res.meta.msg)
                    this.$router.push('/goods')
                } else {
                    this.$message.error(res.meta.msg)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.addPage{
    font-size: 12px !important;
    .el-col{
        margin-bottom: 20px;
    }
    .el-tabs{
        height: auto !important;
    }
    .ckb{
        margin: 0 10px 0 0 !important;
    }
    .img{
        width: 100%;
    }
    .btn{
        margin-top: 20px;
    }
}
</style>
