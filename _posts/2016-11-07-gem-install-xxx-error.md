---
layout: post
title: "gem install XXX error"
category: "other"
date: 2016-11-07
---

关于gem install 出现报错

搭建这个博客的时候需要下载一个分页插件，要使用到ruby下gem命令，然后我一执行gem install  bundle报错：

为什么有这个？

由于国内网络原因（你懂的），导致 rubygems.org 存放在 Amazon S3 上面的资源文件间歇性连接失败。所以你会与遇到 gem install rack 或 bundle install 的时候半天没有响应，具体可以用 gem install rails -V 来查看执行过程。

既然这样被强了，只能寻找解决方案咯。
根据之前被强的经历，按照下面命令开始跑

1.删除默认的RubyGem镜像
# gem sources --remove https://rubygems.org/
 第一步是没有问题的

2.添加新的RubyGem镜像

 第二步报错了。但是按照以前的解决方案是没有问题的，困恼了很久，百度了一下才知道是因为淘宝的gem源已经不再维护了，而使用http://gems.ruby-china.org/，详情请见链接https://ruby-china.org/topics/29250，此文有个问题就是镜像源是采用http协议而不是https。
所以更正第二步
#gem sources -a http://gems.ruby-china.org/

如果需要配置代理服务器来连接网络，则 需要加上参数 -p 代理服务器信息,例如gem sources -a http://ruby.taobao.org/ -p http://127.0.0.1:8080/ 
 3.#gem sources -l 

 4.# gem install bundle

 成功~
