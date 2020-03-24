<template>
    <el-container class="home-container">
      <el-header>
        <div>后台管理系统</div>
        <el-Button type="info" @click="homeTu">退出</el-Button>
      </el-header>
      <el-container>
        <el-aside :width="iscollapse?'64px':'200px'">
          <div class="zhankai" @click="iszhankai">|||</div>
            <el-menu
              :router="true"
              :collapse-transition="false"
              :collapse="iscollapse"
              :unique-opened="true"
              :default-active="activePath"
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409EFF">
              <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                <template slot="title">
                  <i :class="obj[item.id]"></i>
                  <span>{{ item.authName }}</span>
                </template>
                <el-menu-item :index="'/'+item2.path" @click="Active('/'+item2.path)" v-for="item2 in item.children" :key="item2.id">
                  <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ item2.authName }}</span>
                </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.getMenuList()
    this.activePath = localStorage.getItem('activePath')
  },
  data () {
    return {
      menulist: [],
      obj: {
        // eslint-disable-next-line quote-props
        '125': 'iconfont icon-user',
        // eslint-disable-next-line quote-props
        '103': 'iconfont icon-tijikongjian',
        // eslint-disable-next-line quote-props
        '101': 'iconfont icon-shangpin',
        // eslint-disable-next-line quote-props
        '102': 'iconfont icon-danju',
        // eslint-disable-next-line quote-props
        '145': 'iconfont icon-baobiao'
      },
      iscollapse: false,
      activePath: ''
    }
  },
  methods: {
    homeTu () {
      window.localStorage.clear()
      this.$router.replace('/login')
    },
    async getMenuList () {
      // eslint-disable-next-line no-unused-vars
      const { data } = await this.$http.get('menus')
      // console.log(data)
      // eslint-disable-next-line eqeqeq
      if (data.meta.status != 200) {
        // this.$Message(data.meta.msg)
        return null
      }
      this.menulist = data.data
    },
    iszhankai () {
      this.iscollapse = !this.iscollapse
    },
    Active (item) {
      localStorage.setItem('activePath', item)
      this.activePath = item
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header {
  background-color: #373d41;
  justify-content: space-between;
  padding-left: 0;
  display: flex;
  align-items: center;
  > div{
    font-size: 25px;
    color: aliceblue;
  }
}
.el-aside{
  background-color: #333744;
  .el-menu{
    border-right: 0px;
  }
  .zhankai{
    background: #4a5064;
    color: white;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
.el-main{
  background-color: #EAEDF1;
}
.iconfont {
  margin-right: 10px;
}
</style>
