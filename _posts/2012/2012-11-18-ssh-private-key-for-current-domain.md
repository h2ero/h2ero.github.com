---
layout: post
title: ssh 不同域用不同private key
tags: ssh id_rsa.pub scp
categories: linux
---

##ssh key 生成

1. ssh-keygen 
2. 输入保存文件名，key将保存在~/.ssh/里面，如果不输入，默认将生成id_rsa，id_rsa.pub Enter file in which to save the key (/Users/apple/.ssh/id_rsa): 
3. 输入key的密码，这样即使别人拿到了你的private key不知道你的密码也是不能认证的。Enter passphrase (empty for no passphrase): 
4. 再次输入。Enter same passphrase again: 
##ssh连接指定key

当上面第二步有输入文件名的时候比如输入h2ero那么在~/.ssh/里面将会生成h2ero,h2ero.pub。连接主机的时候就需要通过 `ssh -i ~/.ssh/h2ero ubuntu@h2ero.cn`这样来指定private key.如果没有输入则不用添加-i参数。
当然用scp的时候也是可以这样的。
`scp -i ~/.ssh/h2ero ubuntu@h2ero.cn:~/h2ero.gz ~/backup/h2ero.gz`

##ssh不同域不同key

有的时候还是需要的，比如工作一个key，自己平时用一个key。在~/.ssh/config文件里面进行配置即可。比如针对github用特殊的key。

	Host github github.com
	Hostname github.com
	IdentityFile|~/.ssh/h2ero`
###用scp复制文件

