var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

//kenko 修改点
var pages = ['page1', 'page2'];         //可以根据项目情况，自动分析目录文件生成
var entry = {};
pages.forEach(function (pageName) {
    entry[pageName] = `./src/pages/${pageName}/main.js`;
});
//////////////

module.exports = {
    entry: entry,
    output: {
        path: path.resolve(__dirname, `./dist/`),
        publicPath: process.env.NODE_ENV === 'production' ? '/' : '/dist/',       //发布后在线访问的url。dev模式下，使用的是express在当前项目根目录启动
        filename: `[name].js`   //'[name].[chunkhash].js', '[name].[hash:8].js'
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
                    name: 'img/[name].[hash:8].[ext]'    //自动hash命名图片等资源，并修改路径。路径需要根据项目实际情况确定。语法参考：https://doc.webpack-china.org/loaders/file-loader/
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
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
        port: 8088
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',

    //kenko 修改点
    //devserver使用memory-fs，并不直接写文件系统。配合WriteFilePlugin可以强制写入。
    //如果不使用devserver访问，就需要强制写入了。例如fiddler替换
    plugins: [
        //new WriteFilePlugin({
        //    //test: /\.css|\.html|\.js$/,     // Write only files that match the regexp
        //    useHashIndex: true  //Use hash index to write only files that have changed since the last iteration
        //})
    ]
}

//kenko 修改点
pages.forEach(function (pageName) {
    module.exports.plugins.push(
        new HtmlWebpackPlugin({
            title: pageName,
            filename: `${pageName}.html`,
            template: `./src/pages/tpl.html`,
            chunks: [pageName],
            inlineSource: '.(js|css)$' // embed all javascript and css inline。结合HtmlWebpackInlineSourcePlugin才有效果
        })
    );
});
//////////////

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new CleanWebpackPlugin(['dist']),
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
        }),
        //new HtmlWebpackPlugin({
        //    filename: `${pageName}.html`,
        //    template: `./src/pages/${pageName}/main.html`,
        //    inlineSource: '.(js|css)$' // embed all javascript and css inline
        //}),
        //new HtmlWebpackInlineSourcePlugin() //内联css、js
    ]);

    //kenko 修改点
    module.exports.plugins.push(
        new HtmlWebpackInlineSourcePlugin() //内联css、js。配合HtmlWebpackPlugin
    );
    //////////////
}
