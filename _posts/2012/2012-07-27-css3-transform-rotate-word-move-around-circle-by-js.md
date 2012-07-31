---
layout: post
title: CSS3 transform rotate实现文字围绕圆形旋转
tags: CSS3 transform jQuery
categories: web
---
最近看到[HITCON 2012](http://hitcon.org/2012/)这个网站上文字围绕圆形旋转的效果，想看看怎么弄的结果是`<img src="images/hack.svg">` 囧，果断放弃。以为是CSS3实现的。于是折腾了下CSS3的实现。这个[csswarp][0]网站上已经实现的很不错了,不过是静态的效果。实现上主要参考了下它的实现过程。

###CSS3 transform rotate知识点###

+ 书写格式:transform:rotate(0deg);
+ 单位:deg角度 rad弧度 换算:360deg=2PIrad=400grad PI=3.141592654  全称:deg degree rad radian
+ 获取:st.getPropertyValue("-moz-transform");得到一个matrix的矩阵值，rotate skew scale这三个效果都要通过这个值计算再得到。其中rotate(Xdeg) = matrix(cos(X), sin(X), -sin(X), cos(X), 0, 0);

###文字围绕效果代码实现###

1. 将文字分段写入span中,平均计算每段的rotate值。
2. 为了文字移动平滑设置span CSS `transition:all 2s ease;`
3. 通过setTimeOut递增每个span的rotate值并通过象限计算x,y的偏移距离

{% highlight html linenos %}
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title> Warped Text </title>
		<script type="text/javascript" src="./style/js/jquery-1.7.2.min.js"></script>
		<script type="text/javascript" src="./style/js/jquery-css-transform.js"></script>
		<link rel='stylesheet' type='text/css' href='http://fonts.googleapis.com/css?family=Abel:regular:latin'>
		<style type='text/css'>
			#circle{
				background: none repeat scroll 0 0 #CCCCCC;
				border-radius: 280px 280px 280px 280px;
				display: block;
				height: 500px;
				position: relative;
				width: 500px;
			}
			#circle span{
				font-family: 'Abel';
				font-size: 38px;
				font-weight: regular;
				font-style: normal;
				line-height: 0.65;
				white-space: pre;
				overflow: visible;
				padding: 0px;
				position: absolute;
				-moz-transition:all 2s ease;
			}
		</style>
	</head>
	<body>
		<div id='circle'>
		</div>
	</body>

</html>
{% endhighlight %}
{% highlight javascript linenos %}
$(function() {
    //通过R半径，angle角度获取具体位置
    function getXY(angle, R) {
        var R = 250;
        var x, y;
        angle = parseInt(angle);
        if(angle<0){
           angle=angle+360*360; 
        }
        angle = angle % 360;
        where = Math.floor(angle / 90) + 1;
        //转换为rad值
        an = Math.floor(angle % 90) / 360 * 2 * Math.PI;
        //分象限计算
        switch(where) {
            case 1:
                x = Math.sin(an) * R + R;
                y = R - Math.cos(an) * R;
                break;
            case 2:
                y = Math.sin(an) * R +R;
                x = Math.cos(an) * R +R;
                break;
            case 3:
                x = R - Math.sin(an) * R;
                y = Math.cos(an) * R + R;
                break;
            case 4:
                y = R-Math.sin(an) * R;
                x = R-Math.cos(an) * R ;
                break;
        }
        return [x,y];
    }
    var str="h2ero love you if you love too";
    var html='';
    str=str.split(' ');
    var deg=[];
    var len =str.length;
    var predeg=360/len;
    for(var i=0;i<len;i++){
        html+='<span id="w'+i+'"><a href="http://blog.h2ero.cn">'+str[len-i-1]+'</a></span>'
        deg[i]=i*predeg;
    }
    $('#circle').html(html);
    var R = 250;
    var doc=[];
    for(var i=0;i<deg.length;i++){
         doc[i]=$('#w'+i);
    }
    function turnRun(){
        for(var i=0;i<deg.length;i++){
            deg[i] = deg[i] - 20;
            r=getXY(deg[i],R);
            angles = deg[i] + 'deg';
            doc[i].css({'left': r[0] + 'px','top': r[1] + 'px','-moz-transform': 'rotate(' + angles + ')'});
        }
        setTimeout(turnRun,1000);
    }
        setTimeout(turnRun,1000);
});
{% endhighlight %}
参考:
1. [rotation manipulate by js][1]
2. [rotate value in jQuery][2]
3. [rotate unit][3]
4. [online convert angle to rad][4]
[0]:  http://csswarp.eleqtriq.com/ "csswarp"
[1]:  http://css-tricks.com/get-value-of-css-rotation-through-javascript/ "rotation manipulate by js"
[2]:  http://stackoverflow.com/questions/8270612/get-element-moz-transformrotate-value-in-jquery "rotate value in jQuery"
[3]:  http://blog.sina.com.cn/s/blog_42cdca7d01014p2n.html "rotate unit"
[4]:  http://www.unitjuggler.com/convert-angle-from-rad-to-gon.html "online convert angle to rad "
