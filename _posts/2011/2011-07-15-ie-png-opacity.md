---
layout: post
title: IE6下PNG背景图片透明
tags: IE6
categories: web
---
{% highlight css linenos %}
#h1{
    width: 500px;
    height: 250px;
    background: url(“images/oa.png”);
    _filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src=’style/images/oa.png’); /* IE6 */
    _ background-image: none; /* IE6 */
}
{% endhighlight %}

