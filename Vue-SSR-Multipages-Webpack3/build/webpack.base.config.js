const path = require('path');
const webpack = require('webpack');

module.exports = {
    output: {
        path: path.resolve(__dirname, `../dist/`),
        publicPath: '/dist/',       //发布后在线访问的url
        filename: `[name].[hash:8].js`   //'[name].[chunkhash].js', '[name].[hash:8].js'
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
                loader: 'vue-loader'
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
            'vue$': 'vue/dist/vue.esm.js',
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
};

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
