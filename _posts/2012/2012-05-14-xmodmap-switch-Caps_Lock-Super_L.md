---
layout: post
title: linux xmodmap修改键盘映射Caps_Lock和Super_L互换
tags: awesom Ubuntu xev xmodmap
categories: linux
---

换awesome窗口管理器去了。由于ubuntu的unity还是不太稳定。偶尔卡住半天，受不了果断会曾经的awesome。话说用Win/Super的时候太多了。琢磨了半天还是不太习惯，想着还是把Caps lock和super给换一下。

用`~$ xev |grep keycode` 按要互换的两个键的到以下信息：

{% highlight bash linenos %}
state 0×50, keycode 133 (keysym 0xffeb, Super_L), same_screen YES,
state 0×10, keycode  66(keysym 0xffe5, Caps_Lock), same_screen YES,
{% endhighlight %}

然后建立 .Xmodmap 输入以下内容

{% highlight bash linenos %}
clear mod4
clear lock
keycode 133 = Caps_Lock NoSymbol Caps_Lock NoSymbol Caps_Lock
keycode 66 = Super_L NoSymbol Super_L NoSymbol Super_L
add mod4 = Super_L
add lock = Caps_Lock
{% endhighlight %}

最后执行 `xmodmap .xmodmap && exec awesome`即可生效。



