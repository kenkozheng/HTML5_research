/**
 * Created by kenkozheng on 2015/7/10.
 */
define(['angular', 'text!module2/tpl.html'], function (angular, tpl) {

    //angular会自动根据controller函数的参数名，导入相应的服务
    return {
        controller: function ($scope, $http, $interval) {
            $scope.date = '2015-07-13';
        },
        tpl: tpl
    };
});