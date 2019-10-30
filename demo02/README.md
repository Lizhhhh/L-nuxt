# 目标
  - 熟悉nuxt的用法,后续若需要还得加强学习

# 启动
  - npm run serve

# 安装nuxt
````
  npx create-nuxt-app demo02(项目名)
````

# 页面
  - 页面组件实际上是Vue组件,只不过Nuxt.js为这些组件添加了一些特殊的配置项
````
<script>
export default {
  asyncData (context){
    // 每次组件加载前调用
    return { name: 'World' }
  },
  head () {
    // 设置页面meta
  }
}
````
  - 改变标题
  - /pages/users.vue
````
<script>
export default {
  layout: 'users',
  head: {
    title: '用户列表'
  }
}
</script>
````
  - 异步数据获取
  - asyncData方法使得我们可以在设置组件的数据之前能异步获取或处理数据
  - 范例代码:获取异步数据
````
<template>
  <div>
    用户列表
    <ul>
      <li v-for="user in users" :key="user.id">{{user.name}}</li>
    </ul>
  </div>
</template>

<script>
function getUsers() {
  return new Promise(resolve => {
    setTimeout(() =>{
      resolve([{ name: "tom", id: 1}, { name: 'jerry', id: 2 }]);
    }, 1500);
  });
}

export default {
  // 可以返回Promise
  // asyncData() {
  //    return getUsers().then(users => ({users}))
  // },
  // 也可以用async/await
  async asyncData() {  // 使用async/await
    const users = await getUsers()
    return {users}
  }
}
</script>
````
  - 注意事项:
    1. asyncData方法会在组件每次加载之前被调用
    2. asyncData可以在服务端或路由更新之前被调用
    3. 第一个参数被设定为当前页面的上下文对象
    4. Nuxt.js会将asyncData返回给数据融合组件data方法返回的数据一并返回给当前组件
    5. 由于asyncData方法是在组件初始化前被调用的,所以在方法内是没有办法通过this来引用组件的实例对象

# 上下问对象的使用
  - users/detail.vue
````
<script>
  export default {
    async asyncData({ query, error }) {
      if (query.id) {
        return { user: {name:'tom'} };
      }
      error({ statusCode: 400, message: '请传递用户id' })
    }
  }
</script>
// 可以从上下文获取参数、错误处理函数、重定向函数等等有用对象
````

# 整合axios
  - 安装@nuxt/axios: npm install @nuxtjs/axios
  - 配置: nuxt.config.js
````
modules: [
  '@nuxtjs/axios',
],
axios: {
  proxy: true
},
proxy:{
  "/api/": "http://localhost:3001/"
}
````
  - 测试代码
````
// 修改users/_id.vue
async asyncData({ params, $axios }) {
  // 注意返回的就是响应式数据
  const data = await $axios.$get(
    `/api/users/${params.id}`
  );

}
````