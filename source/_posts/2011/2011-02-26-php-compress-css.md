---
layout: post
title: php对css格式化和压缩
tags: 
- css compression
date: 2011-02-26
categories: php
---
今天在csdn看到有人问这个问题，于是答了下，结果发现答错了，囧~，下来自己写了下，不知不觉就花了3个小时才解决，
哎谁叫俺还是个新手拉，不过学到了很多东西，
大致格式化为这样
```
body{font-size:12px;font-weight:bold;}
.nav ul.user{float:right;margin:15px 5px 0 0;font-weight:bold;}
.nav ul.user li{color:#000;font-weight:normal;}
.nav ul.user li a{color:#000;padding:0 6px;}
.nav ul.user #vName{font-weight:bold;color:#000;}
```

```
<?php
/*
* 思路：
* {}里面的进行替换
* 再对外边的进行替换
* @Date 2011-2-26
* @Author h2ero
* Email 122750707@qq.com
* Blog blog.h2ero.cn
*/
$str=<<body{
font-size:12px;
font-weight:bold;
}
.nav ul.user{float:right;margin:
15px 5px 0 0;font-weight:
bold;}

.nav ul.user li{color:#000;
font-weight:normal;}

.nav ul.user li a{color:#000;
padding:0 6px;}
.nav ul.user #vName{font-weight:bold;color:#000;}
.nav ul.user input.btn{margin:0 3px -5px 0;}
eof;

function replaceblank($s){
$s=$s[1];
$search=array('/([\r\n])[\s]+/');
$replace=array('');
$result=preg_replace($search,$replace,$s);
$result="{"."$result"."}";
return $result;
}

$pattern='/\{(.*?)\}/is';
$str=preg_replace_callback($pattern,replaceblank,$str);//先删除{}的空格和换行
$str=preg_replace('/\r\n/','\\1',$str);//去除{}外边的换行,因为可能有多个所以删了再添加下
$replace="\\1}".chr(13);
$str=preg_replace('/}/',$replace,$str);//在}后添加换行
$pattern='/(.*?)[\r\n]/is';
preg_match_all($pattern,$str,$result);//逐行读出在去掉空格换行
for($i=0;$i {
$result[0][$i]=trim($result[0][$i]);
$resultstring.=$result[0][$i].chr(13);//再添加换行这儿不添加换行就等于压缩了
}
print_r($resultstring);
?>
```
