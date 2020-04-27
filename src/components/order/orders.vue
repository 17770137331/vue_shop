<template>
    <div class="ordersPage">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-input placeholder="请输入内容" class="ss" v-model="input3">
                        <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table class="table" :data="data" stripe background border>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格"></el-table-column>
                <el-table-column prop="order_pay" label="是否付款">
                    <template slot-scope="scope">
                       <el-tag v-if="scope.row.order_pay == 0" type="danger">未付款</el-tag>
                       <el-tag v-else type="success">已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货"></el-table-column>
                <el-table-column prop="update_time" label="下单时间">
                    <template slot-scope="scope">
                        {{ scope.row.update_time | toStringDate }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button @click="xg" size="mini" type="primary" icon="el-icon-edit"></el-button>
                        <el-button @click="wl" size="mini" type="success" icon="el-icon-location"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="param.pagenum"
            :page-sizes="[5, 10, 15]"
            :page-size="param.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="param.total">
            </el-pagination>
        </el-card>
        <el-dialog
        title="修改地址"
        :visible.sync="dialogVisible"
        width="50%"
        @close="handleClose"
        >
        <el-form :model="model" :rules="rules" ref="ref" label-width="100px">
            <el-form-item label="省时区/县" prop="sx">
                <el-cascader
                v-model="value"
                :options="model.sx"
                :props="{ expandTrigger: 'hover' }"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="xq">
                <el-input v-model="model.xq"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="qd">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
        title="物流进度"
        :visible.sync="dialogVisible2"
        width="50%"
        >
        <el-timeline>
            <el-timeline-item
            v-for="(activity, index) in wlxx"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
            </el-timeline-item>
        </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import cityDate from './citydata.js'
    export default {
        created() {
            this.list()
        },
        data() {
            return {
                // 搜索宽v-model
                input3: '',
                // table数据源
                data: [],
                // 查询table的参数
                param: {
                    query: this.input3,
                    pagenum: 1,
                    pagesize: 10,
                    total: 0
                },
                // 修改地址
                dialogVisible: false,
                // dialog model
                model: {
                    sx: cityDate,
                    xq: ''
                },
                // dialog rule
                rules: {
                    sx: [
                        { required: true, message: '请选择地址', trigger: 'blur' }
                    ],
                    xq: [
                        { required: true, message: '请输入详细地址', trigger: 'blur' }
                    ]
                },
                // cascader
                value: [],
                // dialog2
                dialogVisible2: false,
                // 物流信息
                wlxx: []
            }
        },
        methods: {
            // 获取table的数据
            async list() {
                const { data: res } = await this.$http.get('/orders', {
                    params: {
                        query: this.param.query,
                        pagenum: this.param.pagenum,
                        pagesize: this.param.pagesize
                    }
                })
                this.data = res.data.goods
                this.param.total = res.data.total
                console.log(res, this.data)
            },
            // 分页
            handleSizeChange(item) {
                console.log(this.param, 123)
                this.param.pagesize = item
                this.param.pagenum = 1
                this.list()
            },
            // 分页 页数
            handleCurrentChange(item) {
                this.param.pagenum = item
                this.list()
            },
            // 搜索
            search() {
                this.list()
            },
            // 修改
            xg() {
                this.dialogVisible = true
            },
            // dialog 确定
            qd() {
                this.$refs.ref.validate(item => {
                    if (!item) return null
                    this.dialogVisible = false
                })
            },
            // dialog close
            handleClose() {
                this.model.xg = ''
                this.value = []
                this.$refs.ref.resetFields()
            },
            // 查看物流进度
            async wl() {
                const { data: res } = await this.$http.get('/kuaidi/1106975712662')
                // console.log(res)
                this.wlxx = res.data
                this.dialogVisible2 = true
            }
        }
    }
</script>

<style lang="less" scoped>
.ordersPage{
    .table{
        font-size: 12px !important;
         margin-bottom: 20px;
    }
    .ss{
        width: 450px !important;
        margin-bottom: 20px;
    }
}
</style>
