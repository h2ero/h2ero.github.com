---
layout: post
title: Vim PHP 代码格式化
tags: vim vimL vimscript PHP
categories: vim
---
最近对Vim进行各种折腾，现在又上了一层。敲PHP总是有很多地方要空格隔开。所以按照[Kohana文档中的编程规范][0]来写了个脚本。写这个脚本把Vim的正则表达式用的非常熟了。功能简单就是加最简单的空格。主要还是用在自己敲代码的时候。基本上的类型就是下面这些了。
###格式化类型
{% highlight php linenos %}
<?php 
//判断
if($foo=='bar')     
if ($foo == 'bar')

//赋值
$foo='bar';
$foo = 'bar';

//否定
if (!$foo)
if ( ! $foo)

//三元加其他运算符
$foo=(($bar>5)?($bar+$foo):strlen($bar))?$foo%5:$bar%7;
$foo = (($bar>5) ? ($bar + $foo) : strlen($bar)) ? $foo % 5 : $bar % 7;

//强制转换
$foo=(string)$bar;
$foo = (string) $bar;

//判断内有强制转换
if((string)$bar)
if ( (string) $bar)

//括号中有,
preg_replace('/(\d+) dollar/','$1 euro',$str);
preg_replace('/(\d+) dollar/', '$1 euro', $str);

//条件符号
if(($foo&&$bar)||($b&&$c))
if (($foo && $bar) || ($b && $c))

//数组
$arr=array('key'=>array('key'=>'value'+'value2'))
$arr = array('key' => array('key' => 'value' + 'value2'))

//运算符
$a+=$b/$c-$d;
$a += $b / $c - $d;

{% endhighlight %}
###难点
整个脚本用了了10多条正则，用到了正则中的环视和贪婪。不支持这两个特性的正则都是不完美的。

1. 对于字符串中有转义又有要替换的情况，如`“h2ero=h2eros \"##\"##”`格式化的时候会将引号中的要替换的类型都给替换掉，如果要排除这些的话需要在10多条正则中都添加，解决是先匹配处是字符串的类型然后替换为STR0，STR1等，并保存到list里面。然后在所有类型替换完后在替换回去,这是最难的地方。
2. 要格式化是在每一次回车的时候继续格式化，也就是说边敲边格式化。不过vim正则替换完后都是会改变光标的位置，然后回车就失效了。解决是先执行回车保留本来的行为，然后在取上一行进行替换。
3. 转义'这个是第一个问题中遇到的一个问题。当pattern为'regex'的时候regex里面包含有‘的话需要使用两个’‘进行转义而不是\'。
4. Vim正则语法比较难，不过正则思想都一样。

###使用
没有写为插件的形式，直接复制下面代码保存。然后在.vimrc中添加以下代码`:source ~/.vim/script/phpformat.vim` 最后一行只会对php文件生效。然后每次敲完一行代码回车就会格式化好。
{% highlight vim linenos %}
"format code
"http://kohanaframework.org/3.3/guide/kohana/conventions

func! Add_space()
    let now_line = line('.')
    "exec "inoremap <CR> <CR>"
    exec "normal! a\<CR>\<Esc>"
    let n_line = getline(now_line)

    " str replace
    let strlist = []
    let flag = 0
    let index= 0
    while flag == 0
        let replacelist = matchlist(n_line, '\([''"]\)\{1}\(.\{-}\)\\\@<!\1\{1}')
        if len(replacelist) == 0 
            let flag = 1
        else
            let rstr = replacelist[1].replacelist[2].replacelist[1]
            call add(strlist,['STR'.index,rstr])
            let n_line = substitute(n_line,rstr,'STR'.index,'')
            let index+=1
        endif
    endwhile


    " 1.  =+*<-%/ exclude => != !== .= += <= 
    let n_line = substitute(n_line,'\s*\(!\|!=\|+=\|<=\|\.\)\@<!\([%/=*+<-]\+[>]\@!\)\s*',' \2 ','g')

    " 2.  ,                eg : array('a' => 'b', 'c' => 'd')
    let n_line = substitute(n_line,'\s*\([,]\+\)\s*','\1 ','g')

    " 3.  ()               eg : if ( $foo )  exclude define('') 
    let n_line = substitute(n_line,'\(if\|for\|foreach\|switch\)\@<=\s*\([(]\+\)\(.\{-}\)\([)]\+\)\s*',' \2\3\4 ','g')

    " 4.  =>               eg : array('a' => 'b', 'c' => 'd')
    let n_line = substitute(n_line,'\s*\(=>\)\s*',' \1 ','g')

    " 5.  + - * /  exclude ++ --
    "let n_line = substitute(n_line,'\s*\([-]\{2,}\)\s*','\1','g')

    " 6.  != !== += .=     eg : if ($foo !== FALSE)  $a += 5;
    let n_line = substitute(n_line,'\s*\(!=\+\|+=\|\.=\|<=\)\s*',' \1 ','g')

    " 7.  (!               eg : if ( ! $foo)
    let n_line = substitute(n_line,'\s*[(]\@<=\(!\)\s*',' \1 ','g')

    " 8.  || &&            eg : if (($foo && $bar) || ($b && $c))
    let n_line = substitute(n_line,'\s*\(&&\|||\)\s*',' \1 ','g')

    " 9.  (int)            eg : if ( (int) $foo) in up regex will replace it like if((int) $foo), follow will fix it.
    let n_line = substitute(n_line,'\s*(\(int\|bool\|float\|string\|binary\|array\|object\|unset\))\s*',' (\1) ','g')

    " 10.  ?:              eg : $foo = $bar ? $foo : $bar;
    let n_line = substitute(n_line,'\s*\(?\)\s*\(.\{-}\)\s*\(:\)\s*',' \1 \2 \3 ','g')

    " 11. for(;;)          eg : for($i = 0; $i < 100; $i++) 
    let n_line = substitute(n_line,'\(for\s(\)\@<=\([^;]*\)\(;\)\([^;]*\)\(;\)','\2\3 \4\5 ','g')
    
    "let n_line = substitute(n_line,'\s*\(for(\)\@<=.*\s*\(;\).*\s*','\2 ','g')

    "let n_line=substitute(n_line,'\s*\([=+]\+\)\s*',' \1 ','g')

    " str restore
    let index = len(strlist) - 1
    while len(strlist) > 0
        let n_line = substitute(n_line,strlist[index][0],strlist[index][1],'')
        unlet strlist[index]
        let index-=1
    endwhile

    call setline(now_line,n_line)
    "exec now_line."s/\\\s*\\\([=+]\\\+\\\)\\\s*/ \\1 /ge"
    "exec "inoremap <CR> <Esc>:call Add_space()<CR>"

endfunc

func! PHP_space()
    let now_line = line( '.' )
    let n_line = getline(now_line)
    let html = matchstr(n_line, '^\s*[<.#]')
    if empty(html) 
        call Add_space()
    else
        exec "normal! \<ESC>a\<CR>"
        echo "this is html"
        "throw "no url recognized into ``".n_line."''"
    endif
endfunc

":inoremap <CR> <Esc>:call Add_space()<CR>
"inoremap <CR> <Esc>:call Add_space()<CR>
au FileType php inoremap <CR> <Esc>:call PHP_space()<CR>
{% endhighlight %}


[0]:http://kohanaframework.org/3.0/guide/kohana/conventions   "kohana"
<i class="os_date">
System Version: OS X 10.8 (12A269) Kernel Version: Darwin 12.0.0
2013-01-29 12:41:08
</i>
