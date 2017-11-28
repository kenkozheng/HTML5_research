/**
 * Created by kenkozheng on 2017/11/27.
 */

const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');
const express = require('express');
const server = express();
const { createBundleRenderer } = require('vue-server-renderer');
const resolve = file => path.resolve(__dirname, file);

function createRenderer (bundle, options) {
    // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
    return createBundleRenderer(bundle, Object.assign(options, {
        // for component caching
        cache: LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        // recommended for performance
        runInNewContext: false
    }))
}

server.use('/dist/img', express.static(resolve('../dist/img')));        //有更多静态文件再继续添加

/**
 * 不建议在server.js中写太多路由的事情，如果路由多了，建议迁移到额外一个配置表中
 */
server.get('/(:page).html', (req, res) => {
    const bundle = require('../dist/vue-ssr-server-bundle.json');       //加入判断是否production，如果不是，则每次都require，
    const template = fs.readFileSync(resolve('../web/tpl.html'), 'utf-8');
    let renderer = createRenderer(bundle, {
        template
    });
    renderer.renderToString(bundle, (err, html) => {
        if (err) {
            console.log(err);
            res.status(500).end('Internal Server Error');
            return
        }
        res.send(html);
        res.end();
    });
});

const port = 80;
server.listen(port, () => {
    console.log(`server started at localhost:${port}`)
});