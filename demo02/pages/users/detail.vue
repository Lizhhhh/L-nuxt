<template>
  <div>
    <p> 用户详情 id: {{$route.query.id}}</p>
    <p> 用户详情 name: {{$route.query.name}} </p>
  </div>
</template>

<script>
export default {
  async asyncData({ query, error }) {
    if (query.id) {
      return { user: { name: 'tom' } };
    }
    error({ statusCode: 400, message: '请传递用户id' })
  }
}
</script>

<style lang="scss" scoped>
</style>
