---
layout: post
title: Mac下配置Postfix使用SMTP
tags: Postfix Mac SMTP
categories: mac
---

上一次弄过，然后这一次再弄又给忘了，苦逼周末还在弄公司的东西。最近书也没有怎么看，自己的代码也没有怎么敲，现在在的这家公司感觉东西也学的差不多了。
公司用的发送Email用[Swift mailer][2]，Mac下SMTP需要用到[Postfix][3]这个软件，Mac自带。
###配置
`sudo vi /System/Library/LaunchDaemons/org.postfix.master.plist`
在`</dict>`加入`<key>RunAtLoad</key> <true/> <key>KeepAlive</key> <true/>`
###启用
{% highlight bash linenos %}
$ sudo launchctl
launchd% start org.postfix.master
#测试运行没有
telnet localhost 25
#停止
launchd% stop org.postfix.master
{% endhighlight %}
参考：

1. [Sending emails with PHP using Swiftmailer and SMTP on Mac OSX][0]
2. [How to Enable Local SMTP (Postfix) on OS-X Leopard][1]
[0]:http://marvelley.com/2011/02/02/sending-emails-with-php-using-swiftmailer-and-smtp-on-mac-osx/  
[1]:http://www.freshblurbs.com/blog/2009/05/10/how-enable-local-smtp-postfix-os-x-leopard.html
[2]: http://swiftmailer.org/
[3]: http://www.postfix.org/