---
layout: post
title: wine删除菜单，重装后没有找回方法
tags: wine
categories: linux
---
重装了下Ubuntu把wine给删了，然后己悲剧了，重装多次都没有找回菜单，只能在控制台输入，实在受不了，找了下，来自官方的文档。
`～$vim ~/.config/menus/applications.menu` 删除<Deleted/>的即可
{% highlight bash linenos %}
<Menu>
	<Name>wine-wine</Name>
		<Menu>
			<Name>wine-Programs</Name>
		<Menu>
			<Name>wine-Programs-AutoHotkey</Name>
			<DirectoryDir>/home/user/.local/share/desktop-directories</DirectoryDir>
		</Menu>
		</Menu>
	<Deleted/>
</Menu>
{% endhighlight %}

来源：http://wiki.winehq.org/FAQ
