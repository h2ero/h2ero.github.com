---
layout: post
title: grub rescue Ubuntu开机问题
tags: 
date: 2011-04-13
categories: linux
---
昨天晚上格式化了两个分区，今天早晨起来然后Ubuntu1就罢工了，直接显示grub rescue看到grub就知道是引导出错了，拿出刻录的Ubuntu的cd在网上查了半天，基本都给解决了，不过以前哪个开机启动画面的分辨率又给恢复为以前的样子了，郁闷。

原因：格式化分区后，分区的h0,x x变了，找不到引导文件

解决方法：
```
grub rescue>ls
#先list出所有的分区 如hd(0,7)等
grub rescue>ls hd(0,7)/boot/grub
#在循环查看/grub所在的分区
grub rescue>set root=hd(0,7)
#hd(0,7)为你ls grub是能查看到目录里面的文件是的hd(x,x)
grub rescue>set prefix=hd(0,7)/boot/grub
grub rescue>insmod  /boot/grub/normal.mod
grub rescue>normal
#然后就进入系统了
#Alt+Ctrl+t 调出终端
$update-grub
$grub-install /dev/sda6
#sda6是你grub所在的分区可以在系统管理-磁盘工具 里面查看
```
