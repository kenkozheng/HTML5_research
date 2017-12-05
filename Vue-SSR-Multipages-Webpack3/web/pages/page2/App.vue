<template>
    <div id="app" v-on:click="change">
        <img src="../../img/logo.png">
        <h1>{{ msg }}</h1>
        <h2>page2</h2>
    </div>
</template>

<script>
    export default {
        name: 'app',
        methods: {
            change (event) {
                this.$store.dispatch('setData', 'hello click');
            }
        },
        /**
         * 动态类型数据
         */
        computed: {
            msg () {
                return this.$store.state.msg
            }
        }
    }
</script>

<style>
    /*基础css的引入，从js搬到这里来*/
    @import '../../css/base.css';
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
