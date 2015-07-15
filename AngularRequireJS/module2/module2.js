/**
 * Created by kenkozheng on 2015/7/10.
 */
define(['angular', 'text!module2/tpl.html'], function (angular, tpl) {

    //angular会自动根据controller函数的参数名，导入相应的服务
    return {
        controller: function ($scope, $routeParams, $http, $interval) {
            console.log($routeParams);  //获得路由中的参数
            $scope.date = '2015-07-13';
        },
        tpl: tpl
    };

    //也可以使用这样的显式注入方式，angular执行controller函数前，会先读取$inject
    controller.$inject = ['$scope'];
    function controller(s){
        s.date = '2015-07-13';
    }
    return {controller:controller, tpl:tpl};
});