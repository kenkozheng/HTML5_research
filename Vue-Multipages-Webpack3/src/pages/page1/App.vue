<template>
  <div id="app" v-on:click="change">
    <img src="../../img/logo.png">
    <h1>{{ msg }}</h1>
    <h2>index</h2>
  </div>
</template>

<script>
    export default {
        name: 'app',
        props: ['msg'],   //从父组件的属性中获取过来的数据
        methods: {
            change (event) {
                // `event` 是原生 DOM 事件
                if (event) {
                    alert(event.target.tagName)
                }
                this.msg = 'changed';
            }
        }
    }
</script>

<style>
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
