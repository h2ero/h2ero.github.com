---
layout: post
title: MySQL
tags: mysql
categories: mysql 
---

1. `set @now=(DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s'));`
2. `INSERT INTO test VALUES ('',uid, @now) ON DUPLICATE KEY  update date_added=@now;` 当出现uid相同的列时候执行后面的语句。
3. `set @i=0;select (@i:=@i+1)   as   i  from games limit 20；`选择1-20
4. join
   1. 笛卡尔积(交叉连接),join,cross join
   
   			SELECT * FROM table1 CROSS JOIN table2
			SELECT * FROM table1 JOIN table2
			SELECT * FROM table1,table2
   2. 内连接INNER JOIN
   3. 外连接LEFT [OUTER] JOIN,RIGHT [OUTER] JOIN
   4. `USING select * from t1 join t1 on t1.id=t2.id `可以改为` select * from t1 join USING(id)`
5. `having select *,sum(cash) s_cash from transaction group by uid having s_cash > 20000`
6. `create table t1 select * from t2,insert into t1 select * t2`;
7. `SELECT * from name where field REGEXP '.*h2ero|h2ero.*'`;
8. `select last_insert_id()`
9. 快速导入数据

		mysql>show variables like 'max_allowed_packet';
		mysql>show variables like 'net_buffer_length';
		$>mysqldump -uroot -p  matchmove_reports -e --max_allowed_packet=1048576 --net_buffer_length=2048 > ~/Downloads/matchmove_reports.sql
