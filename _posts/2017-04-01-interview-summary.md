---
layout: post
title: "面试小记"
category: "JavaScript"
date: 2017-04-01
---
面试遇到的一些关于JavaScript问题

相关知识点：

数据类型、对象、function、继承、闭包、作用域、原型链、事件、跨域、异步和同步、前端MVVM框架、Http、Es6、Vue、Angular......

#### *  Js数据类型有哪些？

    1. 基本类型：Number，String，Boolean，Undefined，Null
    2. 引用类型：Object，Array，Function

#### *  介绍下Js的内置对象。

    Object是JavaScript中所有对象的父对象
    数据封装类对象：Object，Array，Boolean，Number，String
    其他对象：Function，Argument，Math，Date，RegExp，Error

#### *  说一下原型和原型链的概念

    Js所有的函数都有一个prototype属性，这个属性指向一个对象，即原型对象，原型对象的用途是使它包含的所有实例共享原型上的属性和方法。原型对象简称原型。
    由于原型本身也是对象，所以它也有自己的原型，而它自己的原型对象又有自己的原型，这样就形成了一条原型链。
    JavaScript引擎在访问对象时，如果在对象本身没找到，则会去原型链中寻找，如果找到，返回值。如果遍历整个原型链没找到，则返回undefined。

#### *  继承的几种方式

    1. 原型链继承
        核心：将父类的实例作为子类的原型

        function Super(){
            this.val = 1;
            this.arr = [1];
        }
        function Sub(){
            // ...
        }
        Sub.prototype = new Super(); //核心
        var sub1 = new Sub();
        var sub2 = new Sub();
        sub1.val = 2;
        sub1.arr.push(2);
        alert(sub1.val);    // 2
        alert(sub2.val);    // 1
        
        alert(sub1.arr);    // 1, 2
        alert(sub2.arr);    // 1, 2

        特点：
            优点：
                （1）父类新增原型方法/原型属性，子类都能访问到
                （2）简单，易于实现
            缺点：
                （1）来自原型对象的属性和方法是所有实例共享的,修改sub1.arr后sub2.arr也变了。
                （2）无法实现多继承
                （3）创建子类实例无法向父类构造函数传参

    2. 构造函数继承
        核心：借用父类构造函数来增强子类实例，等于复制父类的实例给子类

        function Super(val){
            this.val = val;
            this.arr = [1];

            this.fun = function(){
                // ...
            }
        }
        function Sub(val){
            Super.call(this, val) //核心
        }

        var sub1 = new Sub(1);
        var sub2 = new Sub(2);
        sub1.arr.push(2);
        alert(sub1.val);    // 1
        alert(sub2.val);    // 2
        
        alert(sub1.arr);    // 1, 2
        alert(sub2.arr);    // 1
        
        alert(sub1.fun === sub2.fun);   // false

        特点：
            优点：
                （1）解决了子类实例共享父类引用属性的问题
                （2）创建构造函数时，可以给父类构造函数传参
                （3）可以实现多继承（call多个父类对象）
            缺点：
                （1）无法实现函数复用，每个子类都有父类实例函数的副本，影响性能
                （2）实例是子类单独的实例
                （3）只能继承父类实例方法和属性，不能继承原型方法和属性

    3. 组合继承
        核心：将原型链和借用构造函数技术组合到一块，保证两者的优点，通过Super.call继承父类的属性和方法并保留智能传参的优点；通过Sub.prototype = new Super();继承父类函数，实现函数复用。

        function Super(val){
            // 
            this.val = val;
            this.arr = [1];

        }
        //在此处声明函数
        Super.prototype.fun1 = function(){
            console.log(this.val)
        };
        Super.prototype.fun2 = function(){
            console.log(this.arr)
        };
        function Sub(val){
            Super.call(this, val); //核心
        }
        Sub.prototype = new Super(); //核心
        Sub.prototype.constructor = Sub
        var sub1 = new Sub(1);
        var sub2 = new Sub(2)
        sub1.fun1();
        sub2.fun1();
        
        特点：
            优点：
                （1）不存在引用属性共享问题
                （2）可传参
                （3）函数可复用
            缺点：
                子类原型上有多余的父类实例属性，因为父类构造函数被调用了两次，生成了两份，子类实例的属性就屏蔽了原型上的，浪费内存。

    4. 原型式继承
        核心：创建一个临时的构造函数，然后将传入的函数作为这个构造函数的原型，最后返回这个临时构造函数的新实例

        function object(o){
            function F(){}
            F.prototype = o;
            return F();
        }
        function Super(){
            this.val = 1;
            this.arr = [1];
        }

        //拿到父类对象
        var sup = new Super(); //核心
        //复制
        var sub = object(sup)

        // 增强
        sub.attr1 = 1;
        sub.attr2 = 2;
        alert(sub.val);     // 1
        alert(sub.arr);     // 1
        alert(sub.attr1); 

        特点：
            优点：
                从已有对象衍生新的对象，不需要创建自定义类型（更像是对象复制）
            缺点：
                （1）原型引用属性会被所有实例共享，因为是用整个父类对象来充当了子类原型对象，所以这个缺陷无可避免
                （2）无法实现函数复用
    5. 寄生式继承
        核心：创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真地是他做了所有工作一样返回对象。

        function object(o){
            function F(){};
            F.prototype = o;
            return F();
        }
        function Super(){
            this.val = 1;
            this.arr = [1];
        }
        function getObject(obj){
            var clone = object(obj); //核心
            clone.attr = 1;
            return clone;
        }
        var sub = getObject(new Super());
        alert(sub.val);     // 1
        alert(sub.arr);     // 1
        alert(sub.attr1);   // 1

        特点：
            优点：
                不需要创建自定义对象
            缺点：
                无法实现函数复用

    6. 寄生组合式继承
        核心：通过借用构造函数来继承属性，通过原型链混成形成继承方式，切掉了原型对象上多余的那份父类实例属性

        function function object(o){
            function F(){}
            F.prototype = o;
            return F();
        }
        function Super(){
            this.val = 1;
            this.arr = [1];
        }
        //  在此处声明函数
    Super.prototype.fun1 = function(){

    };
    Super.prototype.fun2 = function(){

    };
    function Sub(){
        Super.call(this); //核心
    }

    var proto = object(Super.pototype); //核心
    proto.constructor = Sub; //核心
    Sub.prototype = proto; //核心

    var sub = new Sub();
    alert(sub.val);
    alert(sub.arr);

    特点：
        除了用起来比较麻烦点，算是比较完美了完美。
    
    PS：一般组合继承是最常用的

#### *  typeof和instanceof的区别
    typeof返回的是一个变量的基本类型，例如：number、boolean、string、undefined、Object、function；但是这个方法不适用于来判断数组，因为不管是数组还是对象，都会返回object。可以使用constructor判断

    alert(typeof(1)); //number
    alert(typeof(true)); //boolean
    var arr = [1,2,3,1]; 
    alert(arr.constructor === Array);   // true


    instanceof返回的是一个布尔值

    var a = {};
    alert(a instanceof Object);  //true
    var b = [];
    alert(b instanceof Array);  //true
    var arr = [1,2,3]; 
    alert(arr instanceof Array);   // true

    需要注意的是，instanceof只能用来判断对象和函数，不能用来判断字符串和数字等

#### *  写一个判断数组的js代码，兼容所有浏览器

    var arr = [1,2,3];
    function isArrayFn(obj){
        if(typeof.Array.isArray === 'function'){
            return Array.isArray(obj); //浏览器支持isArray()方法
        }else{
            reuturn Object.prototype.toString.call(obj) === '[Object Array]' 
        }
    }

#### *  事件流，事件委托，js事件的三个阶段

    事件流：IE的事件流叫事件冒泡流（由触发事件的具体元素逐层往上，一直到文档），Netscape事件流是事件捕获流（则与冒泡相反，最外层向内传播）
    事件委托：通俗来讲就是说把本来应该是自己做的事放到别人身上来做了，也就是利用冒泡的原理，把事件加到父级上，触发执行结果。有利于提高性能。
    三个阶段：捕获阶段，目标阶段，冒泡阶段。
        捕获阶段：事件由最外层的windows对象到目标节点父节点依次触发的阶段（由外向内）
        目标阶段：事件在目标节点上触发时的阶段。
        冒泡阶段：事件从目标节点的父节点到最外层的window对象依次触发的阶段。(从内到外)
    事件监听element.addEventListener(event, function, useCapture)，useCapture为布尔值，可选捕获或冒泡。默认为false，冒泡阶段。
        jquery事件委托
        var node = $('ul')
        node.on('click', 'li', function(){
            alert($(this).text());
        })

        js事件委托
        var node = document.getElementByTagName('ul');
        node.onclick =  function(e){
            var e = e || window.event,
                target = e.target || e.srcElement;
            if(target.nodeName.toLowerCase() == 'li'){
                alert(target.innerHTML)
            }
        }


#### *  跨域有哪几种方式

    jsonp、iframe、window.name、window.postMaessage、服务器上设置代理
    
#### *  jsonp的原理

    动态创建script，，并提供一个回调函数来接收第三方传递的Json数据，解析当前数据把它作为参数传递给服务器。

#### *  异步和同步

    

    

    
    