var path = require('path');
var webpack = require('webpack');
var WriteFilePlugin = require('write-file-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var VueSSRServerPlugin = require('vue-server-renderer/server-plugin');      //这个是关键

//kenko 修改点
var pages = ['page1', 'page2'];         //可以根据项目情况，自动分析目录文件生成
var entry = {};
pages.forEach(function (pageName) {
    entry[pageName] = `./web/pages/${pageName}/main.js`;
});
var dist = 'dist';
var publicPath = '/dist';         //express要做静态映射(server.js)
//////////////

module.exports = {
    target: 'node',
    entry: entry,
    output: {
        path: path.resolve(__dirname, `./${dist}/`),
        publicPath: publicPath,       //发布后在线访问的url。dev模式下，使用的是express在当前项目根目录启动
        filename: `[name].js`,   //'[name].[chunkhash].js', '[name].[hash:8].js'
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {}
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '/img/[name].[hash:8].[ext]'    //自动hash命名图片等资源，并修改路径。路径需要根据项目实际情况确定。语法参考：https://doc.webpack-china.org/loaders/file-loader/
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',

    plugins: [
        new VueSSRServerPlugin()
    ]
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            //sourceMap: true,  //开启max_line_len后会有报错，二选一
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true,
                pure_funcs: ['alert']       //去除相应的函数
            },
            output: {
                max_line_len: 100
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]);
}
