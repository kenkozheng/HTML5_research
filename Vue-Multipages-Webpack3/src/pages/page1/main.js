import Vue from 'vue'
import App from './App.vue'
import '../../css/base.css'

new Vue({
    el: '#app',
    components: {App},
    template: '<App :msg="msg"/>',
    data: {
        msg: '1111'             //演示如何从初始化地方传递数据给子组件。也可以再app.vue这个组件中用vuex或者其他全局数据的方式获取数据
    }
})