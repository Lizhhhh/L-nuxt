// http 拦截器
export default function({ $axios }) {
    // onRequest为请求拦截器帮助方法
    $axios.onRequest(config => {
        // 给请求加头部信息
        if (!process.server) {
          config.headers.token = localStorage.getItem('token');
        }
    })
}
