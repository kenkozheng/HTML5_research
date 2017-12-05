import Vue from 'vue'
import App from './App.vue'
import {createStore} from './store.js'

export function createApp () {
    const store = createStore();
    const app = new Vue({
        store,
        // 根实例简单的渲染应用程序组件。
        render: h => h(App)
    });
    return { app, store }
}