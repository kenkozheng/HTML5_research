/**
 * 先自动生成各个页面的app.js、entry-client.js和entry-server.js
 * 然后调用webpack打包，按页面分目录存放各自的文件
 */

const fs = require('fs');
const path = require('path');
const router = require('../server/router.js');
const merge = require('webpack-merge');
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const isProd = process.env.NODE_ENV === 'production';

function buildEntryFiles(pageName, vueFile){
    let dir = path.resolve(__dirname, './appEntry-' + pageName);
    var tplDir = path.resolve(__dirname, './appEntryTemplate');
    try{
        fs.mkdirSync(dir);
    }catch(e){
    }
    let app = fs.readFileSync(tplDir + '/app.js', 'utf-8');
    let client = fs.readFileSync(tplDir + '/entry-client.js', 'utf-8');
    let server = fs.readFileSync(tplDir + '/entry-server.js', 'utf-8');
    app = app.replace('{{vue}}', vueFile);
    fs.writeFileSync(dir + '/app.js', app);
    fs.writeFileSync(dir + '/entry-client.js', client);
    fs.writeFileSync(dir + '/entry-server.js', server);
}

let webpackConfigMap = {};
for (let pageName in router) {
    let config = router[pageName];
    buildEntryFiles(pageName, config.vue);
    let cConfig = merge({}, clientConfig, {
        entry: {
            [pageName]: `./build/appEntry-${pageName}/entry-client.js`        //buildEntryFiles生成的配置文件
        },
        output: {
            filename: isProd ? `${pageName}/[name].[hash:8].js`:`${pageName}/[name].js` //dist目录
        },
        plugins: [
            new VueSSRClientPlugin({
                filename: `${pageName}/vue-ssr-client-manifest.json`//dist目录
            })
        ]
    });
    let sConfig = merge({}, serverConfig, {
        entry: {
            [pageName]: `./build/appEntry-${pageName}/entry-server.js`        //buildEntryFiles生成的配置文件
        },
        plugins: [
            new VueSSRServerPlugin({
                filename: `${pageName}/vue-ssr-server-bundle.json`       //dist目录
            })
        ]
    });
    webpackConfigMap[pageName] = {clientConfig: cConfig, serverConfig: sConfig};
}

module.exports = webpackConfigMap;