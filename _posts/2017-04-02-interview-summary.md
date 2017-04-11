---
layout: post
title: "面试小记"
category: "JavaScript"
date: 2017-04-02
---
面试遇到的一些关于JavaScript问题

#### *  不使用全局变量，使用闭包写一个函数，逐渐返回从1逐步增加数值，比如从1增加到2再到3...

    var addSelf = (function(){
        var x = 1;
        return function(){
            return x++
        }
    })()

#### *  实现一个对象拷贝函数extend(target, srouce, isDeep)
    //isDeep为布尔值，target,srouce为复制对象
    function extend(target, srouce, isDeep){
        for(name in srouce){
            copy = srouce[name];
            if(isDeep && copy instanceof Array){
                target[name] = extend([], copy, isDeep);
            }else if(isDeep && copy instanceof Object){
                target[name] = extend({}, copy, isDeep);
            }else{
                target[name] = srouce[name];
            }
        }
         return target;
    }

#### *  实现一个通用的事件函数addEvent(dom, type, handler)

    function addEvent(dom, type, handler){
        try{
            dom.addEventListener(type, handler, false);
        }catch(e){
            try{
                obj.attachEvent('on' + type, handler);
            }catch(e){
                obj['on' + type] = handle;
            }
        }
    }

#### *  实现trim()函数，去除前后空格

    String.prototype.trim = function(){
        return this.replace(/(^\s*)|(\s*$)/g,'')
    }

#### *  http的请求类型，常见的状态码，什么是长链接，如果将页面缓存一天，服务器将如何设置？

    

#### *  一个页面从输入url地址到加载完成，这个过程发生了什么？请详细描述

    1.输入地址
    2.浏览器去查找域名的IP地址，这时候也包括DNS查找过程，包括： 浏览器缓存->系统缓存->路由器缓存...
    3.浏览像web服务器发送一个http请求
    4.服务器进行重定向响应
    5.浏览器追踪重定向地址
    6.服务器处理请求
    7.服务器返回http响应
    8.浏览器显示html
    9.浏览器加载HTML中的各种资源（如图片、音频、视频、CSS、JS等等）
    10.浏览器发送异步请求

#### * 谈谈性能优化

    1.减少http请求（打包js，css，合并图片css sprite，合理ajax缓存）
    2.减少DOM操作（尽量减少重绘和回流）
    3.使用CDN(内容发布网络):当页面中有很多资源的时候,可以从不同的服务中去读取,同时可以提高并行下载速度
    4.css置顶，js置底
    5.避免CSS表达式
    
#### * 说说HTML5的新技术，至少十条

    svg，Canvas，css3动画，video，audio，拖放（Drag 和 drop），web存储（localStorage,sessionStorage），Cache Manifest，Geolocation，各种语义化标签footer,header,section...

    
