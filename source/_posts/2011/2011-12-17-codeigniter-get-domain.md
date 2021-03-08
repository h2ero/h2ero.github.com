---
layout: post
title: codeigniter 获取域名
tags: codeigniter
date: 2011-12-17
categories: php
---
人懒直接找的网上的，设置cookie的时候需要用到，添加下面的函数到url_helper.php中即可

```
<?php
/**
 * Get domain
 *
 * Return the domain name only based on the "base_url" item from your config file.
 *
 * @access    public
 * @return    string
 */    

function getDomain()
{
    $CI =& get_instance();
    return preg_replace("/^[\w]{2,6}:\/\/([\w\d\.\-]+).*$/","$1", $CI->config->slash_item('base_url'));
}
?>
```
