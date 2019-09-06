<template>
  <div id="app">
    <h1>3.0管理平台技术验证</h1>
    <h2>登录页面</h2>
    <el-button type="primary" @click="login">登录</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Use Vue 2.0 Today!'
    }
  },
  methods: {
    login(){
      location.assign('manager.html')
    }
  }
}
</script>

<style lang="postcss">
.index-card {
  width: 800px;
  margin: 100px auto;
}
</style>
