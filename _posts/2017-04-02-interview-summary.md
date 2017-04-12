---
layout: post
title: "面试小记 —— javascript（二）"
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
                dom.attachEvent('on' + type, handler);
            }catch(e){
                dom['on' + type] = handle;
            }
        }
    }

#### *  实现trim()函数，去除前后空格

    String.prototype.trim = function(){
        return this.replace(/(^\s*)|(\s*$)/g,'')
    }

#### *  http的请求类型，常见的状态码，什么是长链接，如果将页面缓存一天，服务器将如何设置？

    协议是指计算机通信网络中两台计算机之间进行通信所必须共同遵守的规定或规则，超文本传输协议(HTTP)是一种通信协议，它允许将超文本标记语言(HTML)文档从Web服务器传送到客户端的浏览器。
    1.http的8种请求类型，OPTIONS，HEAD，GET，POST，PUT，DELETE，TRACE，CONNECT
    2.常见的状态码：
        • “100″ : Continue（继续） 初始的请求已经接受，客户应当继续发送请求的其余部分。（HTTP 1.1新）       
        •  “101″ : Switching Protocols（切换协议） 请求者已要求服务器切换协议，服务器已确认并准备进行切换。（HTTP 1.1新）
        •  “200″ : OK（成功） 一切正常，对GET和POST请求的应答文档跟在后面。
        •  “201″ : Created（已创建）服务器已经创建了文档，Location头给出了它的URL。
        •  “202″ : Accepted（已接受）服务器已接受了请求，但尚未对其进行处理。
        •  “203″ : Non-Authoritative Information（非授权信息） 文档已经正常地返回，但一些应答头可能不正确，可能来自另一来源 。（HTTP 1.1新）。
        •  “204″ : No Content（无内容）未返回任何内容，浏览器应该继续显示原来的文档。
        •  “205″ : Reset Content（重置内容）没有新的内容，但浏览器应该重置它所显示的内容。用来强制浏览器清除表单输入内容（HTTP 1.1新）。
        •  “206″ : Partial Content（部分内容）服务器成功处理了部分 GET 请求。（HTTP 1.1新）
        •  “300″ : Multiple Choices（多种选择）客户请求的文档可以在多个位置找到，这些位置已经在返回的文档内列出。如果服务器要提出优先选择，则应该在Location应答头指明。
        •  “301″ : Moved Permanently（永久移动）请求的网页已被永久移动到新位置。服务器返回此响应（作为对 GET 或 HEAD 请求的响应）时，会自动将请求者转到新位置。
        •  “302″ : Found（临时移动）类似于301，但新的URL应该被视为临时性的替代，而不是永久性的。注意，在HTTP1.0中对应的状态信息是“Moved Temporatily”，出现该状态代码时，浏览器能够自动访问新的URL，因此它是一个很有用的状态代码。注意这个状态代码有时候可以和301替换使用。例如，如果浏览器错误地请求http://host/~user（缺少了后面的斜杠），有的服务器返回301，有的则返回302。严格地说，我们只能假定只有当原来的请求是GET时浏览器才会自动重定向。请参见307。
        •  “303″ : See Other（查看其他位置）类似于301/302，不同之处在于，如果原来的请求是POST，Location头指定的重定向目标文档应该通过GET提取（HTTP 1.1新）。
        •  “304″ : Not Modified（未修改）自从上次请求后，请求的网页未被修改过。原来缓冲的文档还可以继续使用，不会返回网页内容。
        •  “305″ : Use Proxy（使用代理）只能使用代理访问请求的网页。如果服务器返回此响应，那么，服务器还会指明请求者应当使用的代理。（HTTP 1.1新）
        •  “307″ : Temporary Redirect（临时重定向）和 302（Found）相同。许多浏览器会错误地响应302应答进行重定向，即使原来的请求是POST，即使它实际上只能在POST请求的应答是303时才能重定向。由于这个原因，HTTP 1.1新增了307，以便更加清除地区分几个状态代码：当出现303应答时，浏览器可以跟随重定向的GET和POST请求；如果是307应答，则浏览器只能跟随对GET请求的重定向。（HTTP 1.1新）
        •  “400″ : Bad Request（错误请求）请求出现语法错误。
        •  “401″ : Unauthorized（未授权）客户试图未经授权访问受密码保护的页面。应答中会包含一个WWW-Authenticate头，浏览器据此显示用户名字/密码对话框，然后在填写合适的Authorization头后再次发出请求。
        •  “403″ : Forbidden（已禁止） 资源不可用。服务器理解客户的请求，但拒绝处理它。通常由于服务器上文件或目录的权限设置导致。
        •  “404″ : Not Found（未找到）无法找到指定位置的资源。
        •  “405″ : Method Not Allowed（方法禁用）请求方法（GET、POST、HEAD、DELETE、PUT、TRACE等）禁用。（HTTP 1.1新）
        •  “406″ : Not Acceptable（不接受）指定的资源已经找到，但它的MIME类型和客户在Accpet头中所指定的不兼容（HTTP 1.1新）。
        •  “407″ : Proxy Authentication Required（需要代理授权）类似于401，表示客户必须先经过代理服务器的授权。（HTTP 1.1新）
        •  “408″ : Request Time-out（请求超时）服务器等候请求时超时。（HTTP 1.1新）
        •  “409″ : Conflict（冲突）通常和PUT请求有关。由于请求和资源的当前状态相冲突，因此请求不能成功。（HTTP 1.1新）
        •  “410″ : Gone（已删除）如果请求的资源已被永久删除，那么，服务器会返回此响应。该代码与 404（未找到）代码类似，但在资源以前有但现在已经不复存在的情况下，有时会替代 404 代码出现。如果资源已被永久删除，那么，您应当使用 301 代码指定该资源的新位置。（HTTP 1.1新）
        •  “411″ : Length Required（需要有效长度）不会接受包含无效内容长度标头字段的请求。（HTTP 1.1新）
        •  “412″ : Precondition Failed（未满足前提条件）服务器未满足请求者在请求中设置的其中一个前提条件。（HTTP 1.1新）
        •  “413″ : Request Entity Too Large（请求实体过大）请求实体过大，已超出服务器的处理能力。如果服务器认为自己能够稍后再处理该请求，则应该提供一个Retry-After头。（HTTP 1.1新）
        •  “414″ : Request-URI Too Large（请求的 URI 过长）请求的 URI（通常为网址）过长，服务器无法进行处理。
        •  “415″ : Unsupported Media Type（不支持的媒体类型）请求的格式不受请求页面的支持。
        •  “416″ : Requested range not satisfiable（请求范围不符合要求）服务器不能满足客户在请求中指定的Range头。（HTTP 1.1新）
        •  “417″ : Expectation Failed（未满足期望值）服务器未满足”期望”请求标头字段的要求。
        •  “500″ : Internal Server Error（服务器内部错误）服务器遇到错误，无法完成请求。
        •  “501″ : Not Implemented（尚未实施） 服务器不具备完成请求的功能。例如，当服务器无法识别请求方法时，服务器可能会返回此代码。
        •  “502″ : Bad Gateway（错误网关）服务器作为网关或者代理时，为了完成请求访问下一个服务器，但该服务器返回了非法的应答。
        •  “503″ : Service Unavailable（服务不可用）服务器由于维护或者负载过重未能应答。通常，这只是一种暂时的状态。
        •  “504″ : Gateway Time-out（网关超时） 由作为代理或网关的服务器使用，表示不能及时地从远程服务器获得应答。（HTTP 1.1新）
        •  “505″ : HTTP Version not supported（HTTP 版本不受支持）不支持请求中所使用的 HTTP 协议版本。
    3.连接->传输数据->保持连接 -> 传输数据-> 。。。 ->关闭连接。 长连接指建立SOCKET连接后不管是否使用都保持连接，但安全性较差。 
    4.方案一：
      Http Header
      Expires: 设置为后一天
      方案二： 把请求的html缓存入redis，ttl设置为86400s

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

    
