---
layout: post
title: Codeigniter使用Uploadify实现多文件上传
tags: codeigniter uploadify
categories: php
---
Codeigniter使用Uploadify实现多文件上传的时候因为其上传文件的mime类型是application/octet-stream所以要修改config目录下的mimes.php
{% highlight php linenos %}
<?php
'gif'   =>  array('image/gif', 'application/octet-stream' ),
'jpeg'  =>  array('image/jpeg', 'image/pjpeg', 'application/octet-stream'),
'jpg'   =>  array('image/jpeg', 'image/pjpeg', 'application/octet-stream'),
'jpe'   =>  array('image/jpeg', 'image/pjpeg', 'application/octet-stream'),
'png'   =>  array('image/png',  'image/x-png', 'application/octet-stream')
?>
{% endhighlight %}

