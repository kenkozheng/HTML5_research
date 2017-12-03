const appEntry = require('./generateAppEntry');
const webpack = require('webpack');

for (var page in appEntry) {
    webpack(appEntry[page].clientConfig, ()=>{});
    webpack(appEntry[page].serverConfig, ()=>{});
}