module.exports = {
    'page1': {
        url: '/page1.html',                 //访问的url规则，用于express的get
        vue: 'web/pages/page1/App.vue',     //vue主文件，路径规则见build/build.js
        server: './page1/main.js',            //服务器逻辑，路径相对server.js
        title: 'Page1'                      //生成html的title
    },
    'page2': {
        url: '/page2.html',                 //访问的url规则，用于express的get
        vue: 'web/pages/page2/App.vue',     //vue主文件
        server: './page2/main.js',            //服务器逻辑
        title: 'Page2'                      //生成html的title
    }
}