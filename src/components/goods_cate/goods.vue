<template>
    <div class="goodsCatePage">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" clearable @clear="fn" v-model="param.query">
                        <el-button slot="append" @click="cx" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="16">
                    <el-button type="primary" @click="add">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table :data="list" stripe border class="eltable">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column width="670" label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格（元）" prop="goods_price"></el-table-column>
                <el-table-column width="80" label="商品重量" prop="goods_weight"></el-table-column>
                <el-table-column width="170" label="创建时间">
                     <template slot-scope="scope">
                       {{ scope.row.add_time | toStringDate }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="bianji(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button @click="det(scope.row)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <!-- <span class="demonstration">{{ param.total }}</span> -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="param.pagenum"
                    background
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="param.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="param.total">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog
        title="修改商品"
        :visible.sync="dialogVisible2"
        width="50%"
        @close="handleClose2">
        <el-form :model="model" label-width="80px">
            <el-form-item label="商品名称:">
                <el-input v-model="model.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格:">
                <el-input v-model="model.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量:">
                <el-input v-model="model.goods_weight"></el-input>
            </el-form-item>
        </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="queding">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        created() {
            this.goodsList()
        },
        data() {
            return {
                list: [],
                param: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10,
                    total: 0
                },
                dialogVisible2: false,
                model: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                },
                bianjiId: 0
            }
        },
        methods: {
            async goodsList() {
                const { data } = await this.$http.get('/goods', {
                    params: {
                        query: this.param.query,
                        pagenum: this.param.pagenum,
                        pagesize: this.param.pagesize
                    }
                })
                const { total, goods, pagenum } = data.data
                this.param.total = total
                console.log(data, pagenum)
                this.list = goods
            },
            handleSizeChange(item) {
                this.param.pagenum = 1
                this.param.pagesize = item
                this.goodsList()
            },
            handleCurrentChange(item) {
                this.param.pagenum = item
                this.goodsList()
            },
            // 查询
            cx() {
                this.goodsList()
            },
            // 查询清空
            fn() {
                this.goodsList()
            },
            // 删除商品
            async det(item) {
                const { data: res } = await this.$http.delete(`/goods/${item.goods_id}`)
                if (res.meta.status == 200) {
                    this.$message.success(res.meta.msg)
                } else {
                    this.$message.error(res.meta.msg)
                }
                this.goodsList()
                // console.log(res)
            },
            // 添加商品
            add() {
                this.$router.push('/goods/add')
            },
            // 编辑商品
            bianji(scope) {
                console.log(scope, 123)
                this.model.goods_name = scope.goods_name
                this.model.goods_price = scope.goods_price
                this.model.goods_weight = scope.goods_weight
                this.model.goods_number = scope.goods_number
                this.bianjiId = scope.goods_id
                this.dialogVisible2 = true
            },
            handleClose2() {
                this.dialogVisible2 = false
                this.model.goods_name = ''
                this.model.goods_price = 0
                this.model.goods_weight = 0
            },
            async queding() {
                const { data } = await this.$http.put(`goods/${this.bianjiId}`, this.model)
                console.log(data)
                this.goodsList()
                this.dialogVisible2 = true
            }
        }
    }
</script>

<style lang="less" scoped>
.eltable{
    margin-top: 20px;

}
.block {
    margin-top: 20px;
}
</style>
