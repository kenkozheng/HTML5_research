import Vue from 'vue'
import App from './App.vue'
// import '../../css/base.css'      //要写到vue文件中

// 从客户端渲染改为SSR
// new Vue({
//   el: '#app',
//   render: h => h(App)
// })

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
    const app = new Vue({
        // 根实例简单的渲染应用程序组件。
        render: h => h(App)
    })
    return { app }
}