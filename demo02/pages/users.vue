<template>
  <div>
    用户导航
    <nuxt-child></nuxt-child>
    <!-- {{foo.bar}} -->
    用户列表
    <ul>
      <li v-for="user in users" :key="user.id">{{user.name}}</li>
    </ul>
  </div>
</template>

<script>
function getUsers() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{ name: "tom", id: 1 }, { name: 'jerry', id: 2 }]);
    }, 1500);
  });
}

export default {
  layout: 'users',
  head: {
    title: '用户列表'
  },
  async asyncData() {
    // 使用 async/await
    const users = await getUsers();
    // return的数据最终会和data中合并
    return { users };
  },
}
</script>

<style lang="scss" scoped>
</style>
