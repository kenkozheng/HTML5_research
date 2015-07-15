/**
 * Created by kenkozheng on 2015/7/10.
 */
define(['text!module2/tpl.html'], function (tpl) {

    var View2 = Backbone.View.extend({
        el: '#container',

        events: {
            'click button': 'clickSpan'     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
        },

        initialize: function () {
            this.model.on('nameEvent', this.render, this);      //监听事件
        },

        render: function () {
            this.$el.html(_.template(tpl, {name: this.model.get('name')}));     //类似java的DAO思想，一切通过get set操作
        },

        clickSpan: function (e) {
            alert('you clicked the button');
        }
    });

    return View2;
});