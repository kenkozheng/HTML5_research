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
// export function createApp () {           //这个方式无法简单的传递data。必须引入vuex
//     const app = new Vue({
//         // 根实例简单的渲染应用程序组件。
//         render: h => h(App)
//     })
//     return { app }
// }

export function createApp (data) {
    const app = new Vue({
        components: {App},                      //演示如何从初始化地方传递数据给子组件。这个页面不使用vuex，展示简单粗暴的方式，配合global event bus即可https://vuejs.org/v2/guide/components.html#Non-Parent-Child-Communication
        template: '<App :appData="appData"/>',
        data: {
            //数据先在服务器渲染一遍，到了客户端会在重建一遍，如果客户端部分数据不一致，会重新渲染
            appData: data
        },
        mounted : function () {
            console.log('mounted')
        }
    });
    return { app };
}