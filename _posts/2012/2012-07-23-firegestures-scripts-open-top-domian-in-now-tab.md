---
layout: post
title: firegestures鼠标手势打开当前域名顶级域名
tags: 
- firefox 
- firegestures script
- javascript
categories: web
---

每次进wooyun都是跑到zone里面去了，然后切换到wooyun.org比较麻烦，于是用Firegetures的Scripts功能解决了下下。把下面的代码复制到Firegestures的User Scripts中，然后自定义个手势，当使用该手势即可在当前Tab中打开该域名的顶级域名。: )
[这儿](http://www.xuldev.org/firegestures/getscripts.php)有更多的脚本可以找找灵感。

{% highlight javascript linenos %}
javascript:(function(){
function getDomain(url) {
	var domainExt = ['com', 'org', 'gov'];
	//如果是ip地址直接返回
	if (/[0-9]/.test(url[url.length - 1])) {
		return url;
	} else {
		var domain = '';
		url = url.split('.');
		if (url.length >= 2) {
			domain += url.pop();
			ext = url.pop()
			domain = ext + '.' + domain;
			//判断是否为demo.org.cn等情况
			if (domainExt.indexOf(ext) != -1) {
				domain = url.pop() + '.' + domain;
				return domain;
			} else {
				return domain;
			}
		} else {
			//返回是localhost没有后缀的情况
			return url;
		}
	}
}
var doc = FireGestures.sourceNode.ownerDocument;
var charset = window.content.document.characterSet;
var referer = makeURI(doc.location.href);
gBrowser.loadURI(getDomain(doc.domain), referer, charset);
})()
{% endhighlight %}

