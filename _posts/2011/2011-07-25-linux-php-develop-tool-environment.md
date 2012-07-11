---
layout: post
title: 在Linux下搭建PHPeclipse开发环境
tags:
- Zend Studio
- Vim
- vrapper
- aptana
- eclipse
categories: php
---
在Linux开发PHP，一般可以通过一下几个途径：

1. vim+taglist，这个大家可以参照网上的方法。
下面两种方法是基于eclipse的，都安装一个vrapper插件，该插件提供一些Vim的操作，提高效率。
eclipse插件的安装：
	+ 一般是通过help-Install New Software , 然后点击Add输入对应插件的地址然后Next到最后即可。
	+ 第二种是通过直接下载插件的压缩包,解压后直接覆盖对应的elipse下的目录即可。
下面插件的安装提供URL，按照第一种方法安装。
2. eclipse+phpeclipse+vrapper
	+ phpeclipse – http://phpeclipse.sourceforge.net/update/stable/1.2.x/
	+ vrappe – http://vrapper.sourceforge.net/update-site/stable <br>
相关设置：
代码实时预览：
安装完成插件后点击Windows-Preference-PHPeclipse-Browser Preview Defaults 将前两个选项给勾选上分别是Refresh PHP browser view when opening editor 和 Show PHP browser view when opening editor.然后新建一PHP项目，点击File-New-Project-PHP-PHP Project 。建好项目之后在右侧Project Explore导航里面右击选择最后一个Properties- PHP Project Settings Use project settings.如果在打开Eclipse的时候你选择的workspace为www目录，那么该处在URL后面加上项目名称即可,比如我建立了一个share目录，那么对应的Project URL即为：http://localshost/share，结果这样设置后即可在打开项目中的PHP文件即可看到代码执行后的结果了。
3. eclipse+aptana+vrapper
	+ aptana – http://download.aptana.com/studio3/plugin/install <br>
aptana写UI的，不过新版本支持PHP，和PHPeclipse插件的不同是不提供实时预览，不过代码提示上提示所有版本是否支持。
4. Zend Studio + vrapper
这个其实才是标准的配置，
下载地址：http://www.zend.com/en/products/studio/downloads
