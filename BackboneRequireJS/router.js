/**
 * Created by kenkozheng on 2015/7/10.
 */
define(['backbone'], function () {

    var Router = Backbone.Router.extend({

        routes: {
            'module1': 'module1',
            'module2(/:name)': 'module2',
            '*actions': 'defaultAction'
        },

        //路由初始化可以做一些事
        initialize: function () {
        },

        module1: function() {
            var url = 'module1/controller1.js';
            //这里不能用模块依赖的写法，而改为url的写法，是为了grunt requirejs打包的时候断开依赖链，分开多个文件
            require([url], function (controller) {
                controller();
            });
        },

        //name跟路由配置里边的:name一致
        module2: function(name) {
            var url = 'module2/controller2.js';
            require([url], function (controller) {
                controller(name);
            });
        },

        defaultAction: function () {
            console.log('404');
            location.hash = 'module2';
        }

    });

    var router = new Router();
    router.on('route', function (route, params) {
        console.log('hash change', arguments);  //这里route是路由对应的方法名
    });

    return router;    //这里必须的，让路由表执行
});