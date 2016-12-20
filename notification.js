/**
 * Created by terry.chen on 2016/10/28.
 * Requires jQuery_v1.8+
 * Copyright (c) 2016 Terry.Chen
 * github : https://github.com/vipterry/jQuery.Notification.git
 * 一个基于jQuery的通知插件 可以直接使用animate.css动画，需要手动将css代码复制过来
 * Version : 0.2
 * Modified by Terry on 2016/12/07. 增加Promise式callback
 */
'use strict';

/*
 * @example
 //用法一
 <a class="Notification" n-title="你是谁？" n-text="你要做什么？" n-effect="none" n-image="" n-delay="5000">触发通知</a>

 //用法二
 $('.notify').Notification({
 title: '温馨提示！',
 text : '欢迎访问罗宾医生！',
 effect : 'none',
 image : '',
 delay : 5000
 });

 //用法三
 $.Notification.create({
 title : '自动触发！',
 text : '是啊，自动触发的啊！'
 })

 window.Notification === $.Notification
 * */

(function(window, $){

    var number = 0,
        Notification ={},
        $body = $(document.body),
        nInstance = {};

    var fixBody = $body.find('#notificationBox');
    $body = fixBody.length ? fixBody : $('<div id="notificationBox"></div>').appendTo($body);

    /*
     * 通知默认设置
     * */
    Notification.config = {
        title : '温馨提示！',
        text : "欢迎访问罗宾医生！",
        image : "./images/lb_logo.jpg",
        effect : 'flipInX',
        delay : 2000,
        position : 'left'
    };

    /*
     * 拼装通知模版html工具
     * @param options [object] 参数参考：【通知默认设置】
     * @return [object] 生成id和html字符串
     * */
    var template = function (options){
        number++;
        options = $.extend({}, Notification.config, options || {});

        var textHtml = '<div class="text">' + options.text + '</div>';
        var titleHtml = '<div class="title">' + options.title + '</div>';
        var imageHtml =  options.image ? '<div class="illustration"><img src="' + options.image + '" width="70" height="70" /></div>' : '';

        return {
            id: number,
            content: '<div class="notification animated '+ options.effect + ' ' + options.position +' " data-nid="'+number+'"><div class="dismiss" data-nid="'+number+'">&#10006;</div>'+imageHtml+'<div class="text">' + titleHtml + textHtml + '</div></div>'
        };
    };

    /*
     * 创建一条通知
     * @param config [object] 创建通知的参数【参考默认设置】
     * */
    Notification.create = function(config){
        if (typeof config !== 'object'){
            config = {
                text : config
            };
        }
        config = $.extend({},Notification.config, config);
        var notification = template(config);
        var id = notification.id;
        nInstance[id] = {};
        nInstance[id].defer = $.Deferred();
        nInstance[id].template = $(notification.content).appendTo($body);
        nInstance[id].template.find('.dismiss').one('click',function(){
            Notification.hide($(this).data('nid'));
        });
        Notification._createHideTack(id, config.delay);
        return nInstance[id].defer.promise();
    };

    /*
     * 删除一条通知
     * @param id 需要删除的通知id
     * */
    Notification.hide = function(id){
        nInstance[id].defer.resolve(id);
        nInstance[id].template.dequeue().hide(250,function(){
            $(this).remove();
            try{
                delete nInstance[id];
            }catch (e){console.error(e);}
        });
    };

    /*
     * 清除所有通知
     * */
    Notification.clearAll = function(){
        $.each(nInstance,function(key){
            Notification.hide(key);
        })
    };

    /*
     * 创建删除一条通知延迟列队[内部用]
     * @param _id [int] 通知的id
     * @param delay [int] 延迟执行的时间【ms】
     * */
    Notification._createHideTack = function(_id, delay){
        nInstance[_id].template.delay(delay).queue(function(){
            Notification.hide(_id);
        });
    };

    $.extend({
        /*
         * 通知的实例方法 【使用请查看Notification对象方法】
         * */
        Notification : Notification,
        /*
         * 设置通知的默认参数【注意：替换全局默认值】
         * @param _config [object] 需要替换的通知的全局默认参数
         * @return 返回有效的通知参数
         * */
        NotificationConfig : function(_config){
            if ($.isPlainObject(_config)){
                $.extend(Notification.config,_config)
            }
            return Notification.config;
        },
    });

    $.fn.extend({
        /*
         * 节点创建点击触发通知
         * @param config [object] 创建通知的参数 【参考默认设置】
         * */
        Notification : function(config){
            if (!this.length) return false;

            var _this = this;
            _this.on('click',function(){
                var _config = {
                    title : _this.attr('n-title'),
                    text : _this.attr('n-text'),
                    image : _this.attr('n-image'),
                    effect : _this.attr('n-effect'),
                    delay : _this.attr('n-delay')
                };
                $.Notification.create($.extend({},_config,config));
            });

            return this;
        }
    });

    /*
     * 添加 class 触发事件
     * */
    $(function(){
        $('.Notification').Notification();
    });

    //注册到window对象下
    window.Notification = $.Notification;
})(window, jQuery);

/*===========================
 Notification AMD Export
 ===========================*/
if (typeof(module) !== 'undefined')
{
    module.exports = window.Notification;
}
else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.Notification;
    });
}