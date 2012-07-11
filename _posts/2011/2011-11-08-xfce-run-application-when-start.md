---
layout: post
title: xfce 设置开机启动
tags: xfce
categories: linux
---

实在受不了ubuntu11.10 unity的卡，就连在gnome3下面也卡，呜呜，不喜欢这两个窗口管理器，转到了xfce下面去了。以前用过，现在为了速度只好留在这上面了，Linus也是用的这个，说不喜欢Gnome3,其实Gnome2真的很好。

设置开机启动其实方法很多，可以在家目录的.bash .bashrc .profile 等中添加，也可以在/bin/bash 只是运行的用户不同而已，换了xfce后想添加几个程序，不过又不想在unity中添加，来自askubuntu上的答案，最近好多问题都是在这个上面找到的。

{% highlight bash linenos %}
#!/bin/bash
if [ "$DESKTOP_SESSION" = "xfce" ]; then
    launch_app
fi
{% endhighlight %}

