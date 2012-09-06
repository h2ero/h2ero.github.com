---
layout: post
title: vim 对齐插件algin
tags: vim algin
categories: tip
---
转回头折腾很久前的，这下是所有的都给清空了，重新配置了下。现在觉得主要不是JAVA,.NET,其他语言都该用vim。
现在安装的插件就下面这些了，基本上的功能都实现了。
	/home/h2ero/.vim
	├── autoload
	│   └── pathogen.vim
	└── bundle
	    ├── align
	    ├── conque
	    ├── markdown
	    ├── nerdtree
	    ├── powerline
	    ├── pydiction
	    ├── pydoc
	    ├── pyflakes
	    ├── snipmate
	    ├── syntastic
	    ├── taglist
	    ├── VisIncr
	    └── zencoding-vim
其中的vim align很强大，
	var i=233,a=332
	var b=2,c=2
先设置对其方式:AlignCtrl r (右对齐) 选中后,输入 :Align = ,就可以对齐=和,。
	var i = 233 , a = 332
	var b = 2   , c = 2
如果不想选中的话可以直接:1,2Aligin =对目标代码所在行直接进行对齐,上面的，虽然对齐了不过却有一定的宽度。那么可以:AlignCtrl lp0P0,p为分割符前面的padding值，P是后面的，然后再:1,2Algin ,
	var  i  =  233,a  =  332
	var  b  =    2,c  =    2
其他高级功能看手册吧，其实想实现的是Mysql consloe中的table，用markdown写博客，table不好弄的。先要的效果就像下面这样。
	 +-------------+------------------+---------------------+----------------------+
	 |   Original  | AlignCtrl = = + -| AlignCtrl = =       | AlignCtrl C = + -    |
	 +-------------+------------------+---------------------+----------------------+
	 |a = b + c - d|a = b + c - d     |a = b + c - d        |a = b         + c - d |
	 |x = y = z + 2|x = y = z + 2     |x = y         = z + 2|x = y = z     + 2     |
	 |w = s - t = 0|w = s - t = 0     |w = s - t     = 0    |w = s - t = 0         |
	 +-------------+------------------+---------------------+----------------------+
 先建立
	| id | username | password | 
	||||
然后对齐
	| id | username | password | 
	|    |          |          | 
然后替换`:s/|/+/g`   `:s/\s/-/g`目前就是这样实现的了，看了一emacs对齐的才强大。
	+----+----------+----------+
	| id | username | password | 
	+----+----------+----------+
不过要先输入数据后再进行对齐替换。

