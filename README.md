# jQuery.Notification
一个基于jQuery的通知插件
可以直接使用animate.css动画，需要手动将css代码复制过来

https://github.com/vipterry/jQuery.Notification.git

/*
* @example
 //用法一
 <a class="Notification" n-title="你是谁？" n-text="你要做什么？" n-effect="none" n-image="" n-delay="5000">触发通知</a>

 //用法二
 $('.notify').Notification({
     title: '温馨提示！',
     text : '欢迎光临！',
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