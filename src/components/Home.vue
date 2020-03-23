<template>
    <div>
      <el-Button type="info" @click="homeTu">退出</el-Button>
    </div>
</template>

<script>
export default {
  methods: {
    homeTu () {
      window.localStorage.clear()
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>

</style>
