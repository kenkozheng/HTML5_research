const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');
const path = require('path');
//const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

//let app = 'page1';      //因为要动态打包多个页面，所以这里都注释掉，在build.js和dev-sever中再动态注入
//let entry = {
//    [app]: `./web/pages/page1/entry-client.js`
//};

module.exports = merge(base, {
    target: 'node',
    devtool: '#source-map',
    //entry: entry,
    output: {
        filename: `[name].[hash:8].js`,
        libraryTarget: 'commonjs2'
    },
    resolve: {
        alias: {
            'page2Data': path.resolve(__dirname, '../web/lib/page2Data/nodejsData.js')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
        //new VueSSRServerPlugin({
        //    filename: `${app}/vue-ssr-server-bundle.json`
        //})
    ]
})
