/**
 * Created by kenkozheng on 2015/7/10.
 */
define(['text!module1/tpl.html'], function (tpl) {

    var View1 = Backbone.View.extend({
        el: '#container',

        initialize: function () {
        },

        render: function (name) {
            this.$el.html(_.template(tpl, {name: name}));
        }
    });

    return View1;
});