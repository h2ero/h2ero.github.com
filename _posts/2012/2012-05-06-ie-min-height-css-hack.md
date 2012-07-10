---
layout: post
title: IE6 min-height hack 实现
tags: css 
categories: web
---
1. css用expression利用js判断设置。
2. 
{% highlight css linenos %}
selector {
  min-height:500px;
  height:auto !important;
  height:500px;
}
{% endhighlight %}
来源:[http://www.dustindiaz.com/min-height-fast-hack/](http://www.dustindiaz.com/min-height-fast-hack/)
