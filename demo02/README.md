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
// axios设置,使用代理,解决跨域问题
axios: {
  proxy: true
},
proxy:{
  "/api/": "http://localhost:3001/"
}
````
  - 测试代码
  - users/_id.vue
````
export default {
  async asyncData({ params, $axios }) {
    // 注意返回的就是响应式数据
    const data = await $axios.$get(
      `/api/users/${params.id}`
    );
    if (data.ok) {
      return { user: data.user };
    }
    error({ statusCode: 400, message: "id有误, 查询失败" });
  }
}
````
  - server/api-server.js
````
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router({prefix:'/api/users'})

const users = [{ name: "tom", id: 1 }, { name: "jerry", id: 2 }];

router.get('/:id', ctx => {
  const user = users.find(u => u.id == ctx.params.id)
  if(user){
    ctx.body = {ok:1, user};
  } else{
    ctx.body = {ok:0}
  }
})

app.use(router.routes());
app.listen(3001);
````

# 拦截器的实现:
  - nuxt.config.js
````
plugins:[
  '@/plugins/axios'
]
````
  - /plugins/axios.js
````
export default function({ $axios }) {
    // onRequest为请求拦截器帮助方法
    $axios.onRequest(config => {
        // 给请求加头部信息
        if (!process.server) {
          config.headers.token = localStorage.getItem('token');
        }
    })
}
````

# vuex
  - 应用根目录下如果存在store目录, Nuxt.js将启用vuex状态树
  - 定义各状态树时具名导出state,mutations,getters,actions即可
  - /store/index.js
````
export const state = () => ({
  counter: 0
})

export const mutations = {
  increment(state){
    state.counter++
  }
}
````
  - /store/users.js
````
export const state = () => ({
  list: []
});
export const mutations = {
    set(state, list) {
        state.list = list;
    },
    add(state, name) {
        state.list.push({ name });
    }
}
````
  - 生成状态树如下:
````
nre Vuex.Store({
  state: () => ({
    counter: 0
  }),
  mutations: {
    increment (state) {
      state.counter++
    }
  },
  modules: {
    users: {
      namespaced: true,
      state: () => ({
        list: []
      }),
      mutations: {
        set(state, list) {
          state.list = list;
        },
        add (state, { text }) {
          state.list.push({
            text,
            done: false
          })
        }
      }
    }
  }
})
````
  - 使用状态, index中处于根,其他文件以文件名作为模块名,
  - users/index.vue
````
<template>
  <div>
    用户列表
    <p @click="increment">计数: {{ counter }}</p>
    <p><input type="text" placeholder="添加用户" @keyup.enter="add($event.target.value)"></p>
    <ul>
      <li v-for="user in list" :key="user.id">{{user.name}}</li>
    </ul>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'

function getUsers() {
  return new Promise(resolve =>{
    setTimeout(() => {
      resolve([{ name: "tom", id: 1 }, { name: "jerry", id: 2 }]);
    }, 1500);
  });
}

export default {
  fetch({store}){  // fetch在创建组件前执行填充状态树
    // 提交时注意命名空间
    return getUsers().then(users => store.commit('users/set',users))
  },
  computed: {
    ...mapState(['counter']),
    ...mapState('users',['list'])
  },
  methods: {
    ...mapMutations(['increment']),
    ...mapMutations('users',['add']),
  },
}
````

# Vue SSR实战
  - 新建工程
````
vue create ssr
````
  - 安装vsr
````
npm install vue-server-renderer --save
````
````
// 安装express
const express = require('express');
const Vue = require('vue');

const app = express();
const renderer = require('vue-server-renderer').createRenderer()
const page = new Vue({
  data:{
    name:'奇怪的栗子',
    count: 1
  },
  template:
  `
  <div>
    <h1>{{name}}</h1>
    <h1>{{count}}</h1>
  </div>
  `
  app.get('/', async function(req, res){
    const html = await renderer.renderToString(page);
    res.send(html)
  })

  app.listen(3000, ()=>{
    console.log('启动成功');
  })
})
````


