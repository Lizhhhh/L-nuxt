<template>
  <div class="container">
    <div>
      <p>
        <logo />
      </p>
      <!-- 导航链接 -->
      <el-button @click="$router.push('/users')">用户</el-button>
      <el-button @click="$router.push({name:'users-detail', query:{id:1,name:'lz'}})">详情</el-button>
      <el-button @click="$router.push({name:'users-id',params:{id:1}})">详情 - id 1</el-button>
      <h1 class="title">
        nuxt-test
      </h1>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
