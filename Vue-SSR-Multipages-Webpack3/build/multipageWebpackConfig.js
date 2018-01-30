/**
 * 根据基础配置，根据路由配置，生成多个页面各自的webpack配置。主要功能是：把js和server文件分开不同目录，按文件划分目录。
 */
const router = require('../server/router.js');
const merge = require('webpack-merge');
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const isProd = process.env.NODE_ENV === 'production';

let webpackConfigMap = {};
for (let pageName in router) {
    let config = router[pageName];
    let cConfig = merge({}, clientConfig, {
        entry: {
            [pageName]: `${config.dir}/entry-client.js`        //buildEntryFiles生成的配置文件
        },
        output: {
            filename: isProd ? `js/${pageName}/[name].[chunkhash:8].js` : `js/${pageName}/[name].js` //dist目录
        },
        plugins: [
            new VueSSRClientPlugin({
                filename: `server/${pageName}/vue-ssr-client-manifest.json`//dist目录
            })
        ]
    });
    let sConfig = merge({}, serverConfig, {
        entry: {
            [pageName]: `${config.dir}/entry-server.js`        //buildEntryFiles生成的配置文件
        },
        plugins: [
            new VueSSRServerPlugin({
                filename: `server/${pageName}/vue-ssr-server-bundle.json`       //dist目录
            })
        ]
    });
    webpackConfigMap[pageName] = {clientConfig: cConfig, serverConfig: sConfig};
}

module.exports = webpackConfigMap;