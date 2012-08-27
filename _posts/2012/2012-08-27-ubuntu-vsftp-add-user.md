---
layout: post
title: linux vsftpd添加用户
tags: vsftpd ubuntu ftp
categories: linux
---
先修改`/etc/vsftpd.conf`去掉一下行注释。`#local_enable=YES`和`#write_enable=YES`。然后执行一下命令。

{% highlight bash linenos %}
sudo useradd h2ero -d /home/
sudo passwd h2ero
sudo service vsftpd restart
{% endhighlight %}
参考:[How to setup vsftpd FTP on Ubuntu Linux](http://cviorel.easyblog.ro/2009/03/05/how-to-setup-vsftpd-ftp-on-ubuntu-linux/)
