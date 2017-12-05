/**
 * 用于打包客户端部分的js逻辑
 */
import { createApp } from './app'

import {getTime2} from '../../lib/myDate'
console.log(getTime2());         //测试lib的两个导出模式

// 客户端特定引导逻辑……
const { app } = createApp(__INITIAL_STATE__)        //vue默认注入的全局变量数据
// 这里假定 App.vue 模板中根元素具有 `id="app"`（服务器渲染后就有这个id）
app.$mount('#app')