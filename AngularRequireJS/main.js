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
            underscore: 'libs/underscore',
            angular: 'libs/angular',
            'angular-route': 'libs/angular-route',
            text: 'libs/text'             //用于requirejs导入html类型的依赖
        },
        shim: {                     //引入没有使用requirejs模块写法的类库。例如underscore这个类库，本来会有一个全局变量'_'。这里shim等于快速定义一个模块，把原来的全局变量'_'封装在局部，并导出为一个exports，变成跟普通requirejs模块一样
            underscore: {
                exports: '_'
            },
            angular: {
                exports: 'angular'
            },
            'angular-route': {
                deps: ['angular'],   //依赖什么模块
                exports: 'ngRouteModule'
            }
        }
    };

    require.config(config);

    require(['angular', 'router-cfg-version'], function(angular){
        angular.bootstrap(document, ['webapp']);
    });

})(window);
