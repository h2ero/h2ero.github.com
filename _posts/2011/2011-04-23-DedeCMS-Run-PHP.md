---
layout: post
title: dedecms模板标签中运行php代码
tags: dedecms
categories: php
---
大清早爬起来看了看《松药店的儿子们》，然后想弄弄网站，把头像网站给升级为dedecms5.7去了，图片集多了一个描述的编辑框，以前都没有用那个，都是在摘要里面写的描述，现在有了就想用，可是有个问题就是摘要和描述要同时判断下然后在输出，无奈，找了半天的资料终于给解决了。

dedecms使用php：
{% highlight php linenos %}
<?php
{dede:field name='array' runphp='yes'}
if (@me['body']=='')
@me=@me['description'];
else @me=@me['body'];
{/dede:field}
//其中的＠me为输出的内容，不能直接echo，比如判断有短标题输出短标题，没有则输出完整的标题，
{dede:field name='array' runphp='yes'}
if (@me['shorttitle']=='')
@me=@me['title'];
else @me=@me['shorttitle'];
{/dede:field}

?>
{% endhighlight %}
一看就能明白，找这例子写就行了，
