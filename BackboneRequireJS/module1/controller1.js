/**
 * Created by kenkozheng on 2015/7/14.
 */
define(['module1/view1'], function (View) {

    var controller = function () {
        var view = new View();
        view.render('kenko');
    };
    return controller;
});