<template>
    <div>
      <Button type="info" @click="homeTu">退出</Button>
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
