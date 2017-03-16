---
layout: post
title: "容易被忽视的一道JavaScript面试题"
category: "JavaScript"
date: 2017-03-16
---

直接上题：

	function Foo(){

		getName = function () { alert(1); };

		retrun this;

	}

	Foo.getName = function () { alert(2); };

	Foo.prototype.getName = function () { alert(3); };

	var getName = function () { alert(4); };

	function getName() { alert(5); };

	//请写出以下输出结果

	Foo.getName();

	getName();

	Foo().getName();

	getName();

	new Foo.getName();

	new Foo().getName();

	new new Foo().getName();

答案是：

	Foo.getName(); //2

	getName(); //4

	Foo().getName(); //1

	getName(); //1

	new Foo.getName(); //2

	new Foo().getName(); //3

	new new Foo().getName(); //3

解析：

####第一问
*****
此题首先定义了一个叫Foo的函数，然后在内部创建了一个全局getName变量，并把一个匿名函数赋给当前变量，并返回一个this指针。之后为Foo创建了一个叫getName的静态属性存储了一个匿名函数，然后为Foo的原型对象创建了一个叫getName的匿名函数。之后通过函数变量表达式创建了一个叫getName的函数，最后申明一个getName函数。

第一问Foo.getName访问的自然是Foo函数的存储的静态属性，所以是2。


####第二问
*****
直接调用getName函数，所以跟1,2,3都没关系。那么来看，

var getName = function () { alert(4); };

function getName() { alert(5); };

相当于就是

var getName;

function getName() { alert(5); }

getName = function () { alert(4); };

这里考察另个概念，一是变量声明提升，二是函数表达式。


###变量声明提升
*****
也就是说所有声明变量或函数都会提升到当前函数顶部。

例如下面代码：
	console.log('x' in window) //true
	var x;
	x = 0;

代码执行时，js会先对代码进行预编译，js引擎会将声明语句提升至代码最上方，变为

	var x;
	console.log('x' in window) //true
	x = 0;

###函数表达式
*****
var getName 与 function getName 都是声明语句，区别在于前者是函数表达式，后者是函数声明。
函数表达式会将代码段拆分两行代码分别执行。

例如下面代码：
	console.log(X);
	var x = 1;
	function x(){}

实际的顺序为
	var x;
	function x(){};
	console.log(x)
	x = 1;

所以最终的函数声明x覆盖了变量声明的x。
同理，源代码最终执行的是：
	
	function Foo(){

		getName = function () { alert(1); };

		retrun this;

	}
	var getName;

	function getName() { alert(5); };

	getName = function () { alert(4); };

	getName(); //最终输出4


###第三问
*****
Foo().getName(); 先执行了Foo函数，然后调用Foo函数的返回值对象的getName属性函数。
Foo函数第一句是getName = function(){ alert(1); };这是一个赋值语句，没有做var声明，所以先向当前函数作用域内寻找getName变量，没有找到就向当前函数作用域上层寻找，找到了，也就是第二问的alert(4)函数，然后给它赋值为function(){alert(1)}。
此处实际上是讲外层作用域的getName函数修改了，其实说白了就是Foo函数下的getName是一个全局变量，此处返回一个this指针，指向window。
简单来讲，this的指向是由所在函数的调用方式决定的，而此处直接调用，this指向window对象。
所以Foo函数返回的是window对象，相当于执行window.getName()，而window中的getName已经被修改为alert(1)，所以输出1。

###第四问
*****
直接调用getName函数，相当于window.getName()，因为这个变量已经被Foo函数执行修改了，结果同1。


###第五问
*****
new Foo.getName(); 此处考察的是js的运算符优先级。（.）的优先级高于new操作，所以相当于

	new (Foo.getName)();

所以实际上讲getName作为构造函数来执行，弹出2。

js运算符优先级
![alt js-oprate](/assets/images/javaScript/js-operat.png "js-oprate")

参考链接：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)


####第六问
*****
 new Foo().getName() ，首先看运算符优先级括号高于new，实际执行为

	(new Foo()).getName()

遂先执行Foo函数，而Foo此时作为构造函数却有返回值，所以这里需要说明下js中的构造函数返回值问题

###构造函数的返回值
*****
传统语言中，构造函数不应该有返回值，实际执行的返回值就是当前构造函数的实例化对象。
而在js中构造函数可以有返回值也可以没有

1、没有返回值则按照其他语言一样返回实例化对象
![alt constructor1](/assets/images/javaScript/constructor1.png "实例化对象")

2、如有返回值则检查其是否为引用类型，如果不为引用类型，如基本类型（string，number，boolean，null，undefined）则与无返回值相同，实际返回其实例化对象。
![alt constructor2](/assets/images/javaScript/constructor2.png)

3、若返回值是引用类型，则实际返回值为这个引用类型。
![alt constructor3](/assets/images/javaScript/constructor3.png)

原题new Foo()返回的是this，而this在构造函数中本来就代表当前实例化对象，所以Foo函数返回实例化对象。
之后调用实例化对象的getName函数，因为Foo构造函数没有为实例化对象添加任何属性，因此找到了当前对象的原型（pototype），存在getName，遂输出3。


####第七问
*****
new new Foo().getName();同样是运算符优先级问题。

最终实际执行为：

	new ( ( new Foo() ).getName )();

先初始化Foo的实例化对象，然后将原型上的构造函数再次new

结果为3。

####总结
*****
此题涉及的知识点众多，包括变量定义提升、this指针指向、运算符优先级、原型、继承、全局变量污染、对象属性及原型属性优先级等等。所以基础很重要，提醒自己多看看书，别总是以为自己记不住，容易忘得东西才要多去看啊。给自己~



