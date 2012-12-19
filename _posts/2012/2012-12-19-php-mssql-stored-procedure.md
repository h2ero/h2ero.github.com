---
layout: post
title: PHP连接SQL Server 并使用存储过程
tags: PHP mssql 存储过程 
categories: PHP
---
标题仅仅是为了SEO凑合着，这1天半都在折腾这个东西了，感觉PHP就是这些好。
##freetds
###freetds简介
[freeTDS][2]全名叫 free [Tabular Data Stream][1],TDS是应用层的协议，最早由Sybase Inc开发，用在自家的数据库，后来被Micrososoft用于MS Server。freeTDS则是TDS的一个开源版本实现。python,ruby,php,perl都能够使用。有一个java实现的版本[jTDS][3],freeTDS自身也包含有[ODBC][4]库。
###安装
ubuntu debain系，sudo apt-get install freetds。mac brew install freetds。或者编译安装。
###配置
找到这个文件freetds.conf。然后编辑。
{% highlight bash linenos %}
# A typical Microsoft SQL Server 7.0 configuration      
[MMS]
host = server.h2ero.cn
port = 1433
tds version = 7.0
{% endhighlight %}
###连接SQL SERVER
使用[tsql][5]进行连接，`tsql -H server.h2ero.cn -p 1433 -U username -P password`。通常显示过去多少秒的数字表示没有连接上。直接上了显示>，然后可以执行SQL了，输入version可以查看当前的freeTDS版本。执行mssql，select @@version 回车，go 回车。然后即可执行。
##PHP mssql
安装好了freeTDS后查看phpinfo信息里面有没有mssql，如果有直接就可以使用mssql_connect进行连接，如果没有需要去掉php.ini里面mssql.so或者相关dll的注释，然后重启相关服务查看。如果没有只能重新编译安装讲mmsql扩展添加进来。
###php mssql连接
到了这一步直接用使用一下代码进行简单的操作，其实和mysql相关函数一样

{% highlight php linenos %}

$Server='server.h2ero.cn:1433';
$dbconn = mssql_connect($Server, $User, $Pass) or die("Couldn't connect to SQL Server on $Server");
mssql_select_db($DB, $dbconn);
$version = mssql_query('SELECT @@VERSION');
$row = mssql_fetch_array($version);
echo $row[0];
// Clean up
mssql_free_result($version);

{% endhighlight %}
###php 使用mssql存储过程

{% highlight php linenos %}
$dbconn = mssql_connect('MMS', $User, $Pass) or die("Couldn't connect to SQL Server on $Server");
//init
$stmt=mssql_init('user_del',$dbconn);
mssql_bind($stmt,'@id',$user['id'],SQLINT1,false,false,3);
$res=mssql_execute($stmt);
mssql_free_statement($stmt);
{% endhighlight %}
需要注意mssql_connnect的第一个参数使用的是freeTDS里面的配置名。
###几条MSSQL
{% highlight sql linenos %}
#查看所有表
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
#查看所有存储过程
select * from information_schema.routines where routine_type = 'PROCEDURE;
{% endhighlight %}
###MSSQL系统自带存储过程
这些可以在tsql里面运行其中sp_helptext，sp_help对了解别人写的存储过程还是作用比较大。MySQL从5.0也开始能使用存储过程了，可以直接把存储过程理解为函数。

{% highlight sql linenos %}
exec sp_databases; --查看数据库
exec sp_tables;        --查看表
exec sp_columns student;--查看列
exec sp_helpIndex student;--查看索引
exec sp_helpConstraint student;--约束
exec sp_stored_procedures;
exec sp_helptext 'sp_stored_procedures';--查看存储过程创建、定义语句
exec sp_rename student, stuInfo;--修改表、索引、列的名称
exec sp_renamedb myTempDB, myDB;--更改数据库名称
exec sp_defaultdb 'master', 'myDB';--更改登录名的默认数据库
exec sp_helpdb;--数据库帮助，查询数据库信息
exec sp_helpdb master;
{% endhighlight %}



[Installing the MSSQL module for Mac OS X][0]
[0]:http://blog.benjaminwalters.net/?p=10
[1]:[]
[2]:[http://freetds.schemamania.org/]
[3]:[http://jtds.sourceforge.net/] "jTDS project"
[4]:[http://en.wikipedia.org/wiki/ODBC] "ODBC"
[5]:[http://linux.die.net/man/1/tsql] "tsql"

<i class="os_date">
System Version: OS X 10.8 (12A269) Kernel Version: Darwin 12.0.0
2012-12-19 22:00:01
</i>
