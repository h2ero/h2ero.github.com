---
layout: post
title: Apache2 虚拟目录 Apache VirtualHost on Ubuntu
tags:
- apache 
- url rewrite
- virtulhost
categories: linux
---

今天把ubuntu12.04给安装了，数据都迁移完了，值得赞下，使用中只是卡了一下，没有再像以前那样死机了。不过是没有以前那麽好看，比如字体渲染这些。不过已经满足了，再加上还有原来的gnome-pannel。

Apache给安装了，因为写的网站涉及到url重写的操作。所以需要单独的一个域名才可以，在Apache中实现下虚拟目录。上次是按照网上弄的，比较郁闷的是个人记性不好给忘了。第二次弄了半天也弄不好，弄了半天自己琢磨了下，结果很简单。

{% highlight bash linenos %}
cd /etc/apache2/sites-available
cp default youdomain.com.conf
{% endhighlight %}

然后修改下里面的两个选项：
{% highlight bash linenos %}
ServerName youdomain.com
DocumentRoot /home/h2ero/www/youdomain
<Directory /home/h2ero/www/youdomain>
然后a2ensite youdomain.com.conf
最后修改下/etc/hosts添加 127.0.0.1 youdomain.com
重启下Apache: apache2ctl restar
顺带提下模块的启用，直接ln -s /etc/apache2/mods-available/模块  ../mods-enabled  把先前站点配置里面的 AllowOverride 由NONE修改为ALL
{% endhighlight %}

重启下就OK.

