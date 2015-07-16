/**
 * Created by kenkozheng on 2015/7/10.
 */

'use strict';

(function (win) {
    //配置baseUrl
    var baseUrl = document.getElementById('main').getAttribute('data-baseurl');

    /*
     * 文件依赖
     */
    var config = {
        baseUrl: baseUrl,           //依赖相对路径
        paths: {                    //如果某个前缀的依赖不是按照baseUrl拼接这么简单，就需要在这里指出
            director: 'libs/director',
            zepto: 'libs/zepto.min',
            underscore: 'libs/underscore',
            text: 'libs/text'             //用于requirejs导入html类型的依赖
        },
        shim: {                     //引入没有使用requirejs模块写法的类库。
            underscore: {
                exports: '_'
            },
            zepto: {
                exports: '$'
            },
            director: {
                exports: 'Router'
            }
        }
    };

    require.config(config);
    require(['zepto', 'router', 'underscore'], function($, router, _){
        win.appView = $('#container');      //用于各个模块控制视图变化
        win.$ = $;                          //暴露必要的全局变量，没必要拘泥于requirejs的强制模块化
        win._ = _;
        router.init();                      //开始监控url变化
    });


})(window);
