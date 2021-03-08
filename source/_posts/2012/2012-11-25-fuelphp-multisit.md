---
layout: post
title: fuelphp 备忘
tags: fuelphp php framework
date: 2012-11-25
categories: php
---
来不起了，不过还是记一下。不然就忘了。FuelPHP主要和Kohana,CodeIgniter相关。很多东西都类似。支持HMVC,[Cascading Filesystem][0],namespace。这些也许就是选他的原因了，如果什么时候kohana支持namespace了一定还是用kohana。不过暂时还不支持，fuelphp看起来还不错，不过很多都不完善，比如Cascading File System就是个悲剧。也有可能是自己没有搞懂，最近都在折腾Kohana和Fuelphp，Kohana中如果有用到module是可以直接通过路由访问的。而且不用设置路由，基于CFS直接冲module里面找。省很多东西，配置文件来说Kohana是merge，而Fuelphp是rewrite，所以有要多弄很多东西。不过各有各的好处。

1. module直接访问，如果一个Module继承自另外一个Module，相同的Controller/action下，kohana不用再设置,不过带来的坏处就是不需要是的时候需要通过设置url router去屏蔽，其实这样是不可控制的。而Fuelphp需要设置Url router去控制，其实对于一站点或者一module来说就那么点点Controller这样可控制性更强。
2. Controller_Template，kohana和fuelphp都可以设置$template，不过对于继承的kohana可以通过CFS找到，Fuelphp只能设置的时候添加'NS::template/default'来找到，总是觉得[Cascading Filesystem][0]在Fuelphp里面没有体现出来。悲剧，不过实现起来还是比较简单，修改下源码即可实现。
3. Config合并和覆盖看个人喜欢，比较不喜欢kohana的合并。
4. Fuelphp的namespace。


[0]:http://kohanaframework.org/3.3/guide/kohana/files   "Cascading Filesystem"
