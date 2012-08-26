---
layout: post
title: MySQL like %word% 全文搜索建立fulltext索引优化
tags: MySQL 索引 SQL fulltext
categories: SQL
---

回家了一段时间，回学校了，没有啥子心思耍。今天想优化下TAG数据库,总担心效率问题。表结构Tag(id,tagName,targetId,sum)。targetId里面是文章图片的id，分别用p,a做前缀逗号隔开。这样搜索Tag很快，不过找单张图片id慢很多。关于TAG数据库设计可以看这儿列出的三种方法[Tags Database schemas][1]
###数据准备:生成一百万条数据###
{% highlight php linenos %}
<?php
for ($i=0;$i<1000000;$i++){
		$t1=iconv("GB2312","UTF-8",chr(mt_rand(176,215)).chr(mt_rand(161,249)));
		$t2=iconv("GB2312","UTF-8",chr(mt_rand(176,215)).chr(mt_rand(161,249)));
		$t3=iconv("GB2312","UTF-8",chr(mt_rand(176,215)).chr(mt_rand(161,249)));
		$query.= "INSERT INTO `tag`(`id`, `name`, `targetId`, `sum`) VALUES ('','".$t1.$t2.$t3."','p".rand(0,20000)."','".rand(2,100)."');";
}
echo $query;
?>
{% endhighlight %}
复制上面代码保存为tag.php,然后在bash中运行`php tag.php > tag.sql`然后再在MySQL中导入
{% highlight bash linenos %}
use weimei
source tag.sql
{% endhighlight %}
###建立FULLTEXT索引###
{% highlight sql linenos %}
CREATE FULLTEXT INDEX tag ON tag(targetId)
{% endhighlight %}
###性能对比###
{% highlight sql linenos %}
--FULLTEXT查询
--4 total, Query took 0.0005 sec
SELECT * FROM `tag` where  MATCH(targetId) AGAINST("a3")
--未建立索引前like查询
--4 total, Query took 0.6314 sec
SELECT * FROM `tag` where  targetId like '%a3,%'
{% endhighlight %}
###出现的问题###
1. 换做FULLTEXT索引后不再需要,因为建立索引时候是以词建立的。
2. 可能出现较短或较长的词不能搜索的情况，只是因为受到一下几个(MySQL System Variables)[2]的影响，执行以下命令查看。
{% highlight bash linenos %}
$bash>mysqld --verbose --help | grep ft
#ft-boolean-syntax                                 + -><()~*:""&|
#ft-max-word-len                                   84
#ft-min-word-len                                   2
#ft-query-expansion-limit                          20
#或者
$bash>mysqladmin variables | grep ft
| ft_boolean_syntax                                 | + -><()~*:""&|                                                                                                         |
| ft_max_word_len                                   | 84                                                                                                                     |
| ft_min_word_len                                   | 2                                                                                                                      |
| ft_query_expansion_limit                          | 20                                                                                                                     |
| ft_stopword_file                                  | (built-in)                                                                                                             |
#或者在MySQL中执行
mysql>SHOW VARIABLES
{% endhighlight %}
在`/etc/mysql/my.cnf`(在我的Ubuntu 12.04下是这个，没有的话`locate my.cnf`即可找到)添加以下配置重启下Apache`sudo apache2ctl restart`即可生效，不过要记得再建立下索引。
{% highlight bash linenos %}
[mysqld]
ft_min_word_len = 2
ft-query-expansion-limit=30
ft-boolean-syntax='+ -><(),~*:""&|'
{% endhighlight %}
关于更多和PHP和FULLTEXT相关的使用前往这儿[Using MySQL Full-text Searching][3]查看。

参考文档:
1. [MySQL CREATE INDEX Syntax][4]
2. [MySQL Full-Text Search Functions][5]
3. [MySQL SET Syntax][6]
[1]:http://www.pui.ch/phred/archives/2005/04/tags-database-schemas.html     "Tags: Database schemas"
[2]:http://dev.mysql.com/doc/refman/5.0/en/using-system-variables.html     "MySQL System Variables"
[3]:http://devzone.zend.com/26/using-mysql-full-text-searching/    "Using MySQL Full-text Searching"
[4]:http://dev.mysql.com/doc/refman/5.0/en/create-index.html   "MySQL CREATE INDEX Syntax"
[5]:http://dev.mysql.com/doc/refman/5.5/en/fulltext-search.html  "MySQL Full-Text Search Functions"
[6]:http://dev.mysql.com/doc/refman/5.0/en/set-statement.html   "MySQL SET Syntax"

