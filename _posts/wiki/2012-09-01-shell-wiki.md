---
layout: post
title: SHELL
tags: shell terminator
categories:  wiki
---
##基础知识
###linux文件分类
+ \-  一般文件
+ d  目录
+ l  符号链接文件
+ b  磁盘设备文件
+ c  字符设备文件
+ s  Socket文件
+ p  连接文件

判断方式ls -l,file filename

###文件权限
+ 三种身份 u g o
+ 四种权限 r(read)4 w(write)2 x(execute)1 s(set user/group id|sticky bit) 
	+ set user id 执行者变为文件的拥有者4755
	+ set group id 执行者变为用户组 2755
	+ sticky bit 只有文件拥有者才可以删除 1777

###Login Shell
/etc/passwd字段含义:帐号:x:UID:GID:用户信息:主目录:login shell
eg:lightdm:x:104:111:Light Display Manager:/var/lib/lightdm:/bin/false

###配置文件
+ 登录执行脚本及顺序
	1. /etc/profile
	2. .bash_profile
	3. .bash_login
	4. .profile
+ 注销
	1. .bash_logout
+ 执行新Shell
	1. 交互模式(interactive) .bashrc
	2. 非交互模式 /bin/bash 检查BASH_ENV /bin/sh不检查任何文件

###括号匹配
+ echo l{i,o}ve
+ cp file{,.bak} 备份文件
+ mkdir {1,2}/{3,4}

##Shell Script
###执行
+ `bash script.sh`
+ `sh script.sh`
+ `. script.sh`
+ `source .bashrc` 直接使配置生效
+ . source 都会让script.sh在父Shell中执行`echo $SHLVL` `ps axf`查看层级

###调试
+ 检测语法 `bash -v script.sh`
+ 不执行查看程序代码 `bash -n script.sh`
+ 追踪脚本执行 `bash -x`

##命令
###内置命令
1.  `type bg`  bg is a shell builtin 判断内置命令
2.  `help -s` 显示命令语法 eg: `help -s alias`  alias: alias [-p] [name[=value] ... ]
3.  `echo` -n 不换行 -e \n等解释
4.  `cd -` 返回先前目录
5.  `:` 传回真值
6.  `alias ll='ls -l'` 重命名命令,取消`alias ll='ll'` 或者 `unalias ll` `unalias -a`取消所有别名
7.  `umask` 显示文件权限屏蔽值 创建文件时候 文件权限值=系统默认权限-umask值
8.  `set` 设置Bash Shell属性 `set -o vi`开启vi模式，`set +o vi` 关闭vi模式,`set -o noclobber`/`set -C`转向输出保护存在文件
9.  `shopt` 设置Bash Shell行为模式
10. `time` 指令执行耗时统计 `time ls -la`
11. read 读取变量
	+ `read input` 如果没有input变量，默认为$REPLY
	+ `read -p "please input a word:"`
	+ `read -a arr<<(echo 1,2,3,6,5,4)` 读取数组
	+ `IFS=":";read f1 f2 f3 f4 < datafile` 没有设置IFS则默认空格
	+ `read -r raw` 不过滤\
12. `exec` `eval` 执行命令
13. `man -k sort` 查找命令

###命令行程序
执行时候需要到$PATH中寻找

1.  `which top` 在PATH找寻第一top命令所在位置 -a 找寻全部
2.  `locate my.conf` 在文件索引数据库中找寻my.conf文件
3.  date
    + `date MMDDhhmmYY`调整时间 
    + `date + "%d%h%m"` 产生指定时间格式
    + `date -R` 产生与RFC-2822兼容的时间格式
4.  ls
    + `ls -A` 与 `ls -a`相同但不显示 .,..
    + `ls -F` 在结果中加入标识符(\*可执行文件，@软链接文件，=socket文件，|管道文件,不加则表示普通文件)
5.  `cat >file`输入内容<kbd>CTRL</kbd>+<kbd>D</kbd>编辑保存文件内容到file
6.  `head -n 4`显示前4行内容，`head -c -20`不显示前面20bytes内容,`tail`类似
7.  `wc` -c/w/l计算文件字符/单词/行
8.  `finde . -name "*.txt" -ctime 2 --exec rm -f {} \; ` 找寻2天内修改过的text文件删除
9.  tar
	+ `tar -zxvf backup.tgz -C www/public` 解压到指定目录
	+ tar tvf etc.tar 显示文件内容
	+ tar xzvf etc.tar 解压
	+ tar zcvf etc.tar 压缩
	+ tar rvf etc.tar re.add.file 添加
	+ tar uvf etc.tar add.file 更新
	+ tar Avf 1.tar 2.tar all.tar 合并
	+ tar vf etc.tar --delete etc/hosts 删除指定文件
10. `basename /path/filename` 取filename
11. `dirname /path/filename` 取path 
12. `sort -nr +2 -t: /etc/passwd` -t 分隔符 +2 跳过两列排序第三列 -nr 反序按数值排序(默认按ASCII)
13. `uniq file`删除文件中重复的行，-d找出重复行，-c 计算重复行出现的次数
14. cut
	+ `cut -c2-3 file` 抽取第2-3个字符
	+ `cut -c9- file` 抽取第9以后的
	+ `cut -c1` 抽取第1个字符
	+ `cut -c-3,22- file`抽取第1-3,和22以后的字符
	+ `cut -d: -f3,1 /etc/passwd` 抽取paawd见3,1列
15. tr 转换或删除字符
	+ `tr '[a-z]' '[A-Z]' < file` 转换大写
	+ `tr -d k` 删除字符k
	+ `tr -s '[a-z]' '[a-z]' <file `压缩aaa为a
16. grep
	+ `grep -Rin "word" *`/`grep -Ril "word" *` 匹配所有word显示行号，不区分大小
	+ `grep -v "word" *` 显示不包含word eg:`ps -ef | grep nautilus| grep -v "grep nautilus"`
	+ `grep -q "word" file` 返回1/0，并放到$?这个变量中
	+ `grep -A 2 -e 'someone (love|like) you' file` 找到h2..以后显示接下来的两行
17. tee
	+ `tee -a file`=`cat >>file`文件内容<kbd>Ctrl</kbd>+<kbd>D</kbd>
	+ `tee file`存在清空，不存在输入然后<kbd>Ctrl</kbd>+<kbd>D</kbd>
18. `script log`记录接下来命令的执行过程及结果,直到`exit`退出
19. top <kby>z</kby>切换彩色显示

###文件操作
20. touch file 建立新文件等同于 > file :>file
21. mkdir -m 777 file
22. mknod -m 666 file c/b/p n m 建立字符/区块/管道文件 主要设备代码n 次要设备代码m
23. mkfifo file 建立管道文件 使用 echo "h2ero" > file ,  cat < file
24. ln -sf file lnfile 删除ln再次建立
25. stat file 查看文件的所有属性 
	+ stat -c "%a%n" 单独查看文件相关属性输出 
	+ stat -f "%a" 单独查看分区相关属性输出 
26. chattr +attr =attr -attr AaiD 为文件设置文件取用时间不变/只能转向开启文件进行写入/不能修改文件/不需要dump 特殊属性 
27. lsattr file 查看文件特殊属性

###历史命令
+ fc
	+ fc ssh 查找最近一个包含ssh
	+ fc -s ssh 查找最近一个包含ssh，并执行
+ 历史命令扩展
	+ !! 执行上一条 = !-1
	+ !historyline 执行编号为historyline的指令
	+ !-n 调用倒数第n条指令
	+ !ssh 调用最近含有ssh的命令
	+ !?home? 调用最近含有home的命令
	+ ^var1^var2^ 将前一个历史命令中的var1替换为var2再执行
	+ !# 前面输入的所有字符。ls !# 相当于执行ls ls
	+ !!:$ 前一条命令的最后一个参数=$_
	+ !ls:1 找出最近一条以ls开头的命令的第一个参数=!ls:^
	+ !ls:* 找出最近一天以ls开头的所有参数
	+ !!:3-5 找出前一条3-5的参数
	+ !!:s/var/var1/替换前1条指令中的var 为 var1
	+ !!:h 删除后面的文件名
	+ !!:t 删除前面的目录
	+ !!:p 显示前一条命令但是不执行


###执行多条命令
1. cmd1&&cmd2 cmd1执行成功cmd2才执行
2. cmd1||cmd2 cmd1执行失败cmd2才执行
3. (cmd1,cmd2,cmd3)子shell中执行
4. { cmd1,cmd2,cmd3 }在当前shell中执行

##变量
###数组
+ 语法${A[index]}}，声明arr=(1 2 3 4)
+ 所有元素`${A[@]}/${A[*]}`
+ 长度`${#A[@]}/${#A[*]}`
+ 赋值 `arr[${#arr[*]}]=2`

###取消变量
+ unset -v variable unset -f function

###环境变量
+ export -p 显示全部环境变量
+ `declare -x LANG="en_US.UTF-8"` 或者 `export LANG="en_US.UTF-8"`
###Bash 内置变量
+ $BASH bash完整路径
+ $BASH_VERSION bash版本
+ $CDPATH cd切换搜寻目录
+ $HISCONTROL 控制指令是否存入历史，三个值ignorespace,ignoredups,ignoreboth，
+ $HISTFILESIZE 行数
+ $HISTIGNORE `export HISTIGNORE=ls:ps:cd:t*:\& `
+ HISTTIMEFORMAT='%F%T' 时间格式
+ `locale` 语系
+ $PATH 命令搜索目录
+ RANDOM
+ $* 所有参数一个字符串 "arg1 arg2 arg3"
+ $n 第n个参数
+ $@ 所有参数分开字符串 "arg1" "arg2" "arg3"
+ $# 位置参数个数
+ $? 上一条命令传回的值1/0 成功或者失败
+ $$ 当前bash shell 进程标号 eg: kill $$
+ $_ 
	+ script执行时候bash路径/bin/bash
	+ 上一条命令最后一个参数值
	+ 检查邮件时候,邮件文件名

###变量属性
+ readonly
	+ readonly -p 显示所有只读属性
	+ readonly -a/f 声明只读变量或者函数
+ declare 
	+ declare -p | grep x  显示x变量属性
	+ declare -p x 显示x变量属性
	+ declare -a/f/i/r/x 声明数组/函数/整数/只读/环境变量
	+ declare -F 显示所有的函数名称及属性

###HEREDOC
1. 重定向到msg文件
		cat  <<HEREDOC >msg 
		doc
		HEREDOC
2. 直接输出
		cat <<HEREDOC 
		$USER can be used
		HEREDOC
3. 直接输出不支持变量替换
		cat <<"HEREDOC"
		$USER can't be used
		HEREDOC

##高级变量
###分类
1. ${var} 变量扩展
	+ 测试存在
			+---------------------+------------------------+----------------+---------------------------------------+ 
			| 条件式              | 目的                   | 判断条件       | 符合的处理方法                        | 
			+---------------------+------------------------+----------------+---------------------------------------+ 
			| ${待测变量-默认值}  | 给不存在变量赋值       | 不存在         | 赋值                                  | 
			+---------------------+------------------------+----------------+---------------------------------------+ 
			| ${待测变量:-默认值} | 给不存在或空值变量赋值 | 不存在或空值   | 赋值                                  | 
			+---------------------+------------------------+----------------+---------------------------------------+ 
			| ${待测变量:=默认值} | 给空值赋值             | 不存在或空值   | 赋值                                  | 
			+---------------------+------------------------+----------------+---------------------------------------+ 
			| ${待测变量:?默认值} | 检查变量是否完备       | 不存在或空值   | 显示变量名称:提示信息，停止执行后面的 | 
			+---------------------+------------------------+----------------+---------------------------------------+ 
			| ${待测变量:i默认值} | 判断是否为真           | 测试存在且非空 | 传回默认值                            | 
			+---------------------+------------------------+----------------+---------------------------------------+ 
			记忆
			+---+--------+--------------------------+ 
			| : | 空     | 测试值                   | 
			+---+--------+--------------------------+ 
			| - | 负向   | 测不存在                 | 
			+---+--------+--------------------------+ 
			| = | 设值   | 给空值变量设置一个默认值 | 
			+---+--------+--------------------------+ 
			| ? | 有问题 | 检查条件是否完备后再执行 | 
			+---+--------+--------------------------+ 
			| - | 正向   | 测试存在                 | 
			+---+--------+--------------------------+ 
	+ 取字符串
			+------------------+--------------------------+
			| ${var:start}     | 指定位置截取到最后       | 
			+------------------+--------------------------+
			| ${var:start:len} | 指定位置截取len个        | 
			+------------------+--------------------------+
			| ${#var}          | 变量字符长度             | 
			+------------------+--------------------------+
			| ${#var[@]}       | 数组元素个数             | 
			+------------------+--------------------------+
			| ${#var[\*]}      | 数组元素个数             | 
			+------------------+--------------------------+
			| ${var:start:len} | 指定位置截取len个        | 
			+------------------+--------------------------+
			| ${@:start}       | 指定位置截取到最后的参数 | 
			+------------------+--------------------------+
			| ${@:start:count} | 指定位置截取到最后的参数 | 
			+------------------+--------------------------+
	+ 对比
			 +-------------+--------------------+
			 | ${var#tpl}  | 由前面对比删除最短 | 
			 +-------------+--------------------+
			 | ${var##tpl} | 由前面对比删除最长 | 
			 +-------------+--------------------+
			 | ${var%tpl}  | 由后面对比删除最短 | 
			 +-------------+--------------------+
			 | ${var%%tpl} | 由后面对比删除最长 | 
			 +-------------+--------------------+
	+ 修改 若不加/str则为删除，替换为空
            +---+-----------------+--------------------+
            | 1 | ${var/tpl/str}  | 替换地一个符tpl的  |
            +---+-----------------+--------------------+
            | 2 | ${var//tpl/str} | 替换地全部符合tpl的|
            +---+-----------------+--------------------+
            | 3 | ${var#tpl/str}  | 同1，由开始替换    |
            +---+-----------------+--------------------+
            | 4 | ${var#tpl/str}  | 同2，由开始替换    |
            +---+-----------------+--------------------+
	+ 取变量
		1. ${!var@} 或者 `${!var*}` 去所有一var开头的变量名称
		2. ${!arr[@]} 或者 `${!arr[*]}` 取所有数组索引
2. $(cmd) 或者 `cmd` 命令扩展
3. 算术扩展
	1. $((exp)) 
	2. `expr exp`
	3. $[exp]

##流程控制
1. if cmd1&&cmd2 也可当做if用
	1. if-then
			if condition;then
				cmd
			fi
	2. if-then-else
			if condition;then
				cmd
			else
				cmd
			fi
	3. if-then-elif-then-else
			if condition;then
				cmd
			elif condition;then
			else
				cmd
			fi
2. 条件
	1. 执行命令返回的结果，eg: grep -q ^h2ero$ filename
	2. [[ ]] eg: [[ str > xyz ]]
	3. test eg: test "str"\>"xyz"
	4. [ ] eg:[ "str"\>"xyz" ] , [ -f dir/file ]
3. case 如果shopt -s extglob 则开启高级样式
		case testitem in
			j|k|l) cmd;;
		esac
4. for
		for i in arr
		do
			cmd
		done
		for ((i=1;i<10;i++))
		do
			cmd
		done
5. while or until
		while condition
		do 
			cmd
		done
		死循环
		while ((1))|true|:
		for(;1;)
		do
			cmd
		done
6. select 
		select s in arr
		do 
			$REPLY $f
		done
		eg:
		select i in $(ls ../)
		do
			if [ $REPLY=='q' ];then
				kill -INT $$
			fi
		done
##转向
###默认文件代码(file descriptor)
+ stdin 0 stdout 1 stderr 2

###文件代码操作
+ fileDescriptor<>file 打开文件
+ fileDescriptor<&- 关闭文件
+ fileDescriptor>&- 关闭转向输出文件
+ n<&m 复制转向输入的文件代码m存为n,使n连接到m
+ n>&m 复制转向输出的文件代码m存为n,使n连接到m
+ `>|` 忽略noclobber直接覆盖
+ eg:exec 6 < file ;cat <&6

##系统信号
+ `kill -l/trap -l`显示使用系统信号
+ kill 
	+ `kill -信号id/名 PID` 或者 `kill -s 信号 PID`
	+ `kill -HUP PID` 重启进程，若是daemon就重新读取系统配置。
	+ <kbd>CTRL</kbd>+<kbd>C</kbd> 发出INT信号。
+ trap
	+ `trap "echo 'kill this ?'" INT`  注册INT信号
	+ `trap - INT`  取消注册INT信号
	+ `trap '' INT` 忽略INT信号
	+ `trap -p` 显示全部注册信号

##进程
+ 进程字段|USER|PID|%CUP|%MEN|VSZ|RSS|TTY|STAT|START|TIME|COMMAND|
+ 进程NI(nice) 值，NI值越大，优先度越小。
	+ `nice -n num runapp`
	+ `renice num -p PID -g GROUP -u USER` 为指定进程/群组/用户调整NI值

###工作控制
+ <kbd>Ctrl</kbd>+<kbd>Z</kbd>暂停执行程序，bg后台执行。
+ jobs -l 查看执行程序,%% 或者 %+调用当前程序，%- 调用前一个。%n调用编号为n的程序等同fg %n,后台执行%n&或者bg %n

##用户管理
+ 建立帐号
	- adduser h2ero
	- useradd -D 显示创建用户时候的默认配置，/etc/default/useradd
	- deluser/userdle username ~目录保存 
