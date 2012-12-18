---
layout: post
title: 为Youtube播放事件添加Google Analytics统计
tags: Youtube GoogleAnalytics
categories: wiki
---
Google Analytics太过于强大，才发现国内的什么CNZZ,51la,百度统计等都弱爆。单单是 [Dimensions & Metrics][0]就可以满足对网站各种不同的数据分析。以前都不明白为什么很多外国的官方网站都放Youtube的视频，原来Youtube提供的API也非常强大。可惜这些好产品在国内都不能用。不过做个英文站这些都会用到。
要统计Youtube的播放及其他事件需要参照[IFrame embeds using the IFrame Player API][1]

{% highlight javascript linenos %}
//先在页面添加div#player
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'zLQFkztsozw',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}
function onPlayerStateChange(event) {
    if(event.data == YT.PlayerState.PLAYING) {
        _gaq.push(['_trackEvent', 'Videos', 'Play', player.getVideoUrl()]);
    }
    if(event.data == YT.PlayerState.ENDED) {
        _gaq.push(['_trackEvent', 'Videos', 'Watch to End', player.getVideoUrl()]);
    }
}
tag.onload = onYouTubePlayerAPIReady();
{% endhighlight %}

然后就可以在Google Analytics里面看到。

Event Category | Event Action | total event| unique event
:----------- | :-----------: | -----------:|
Videos         | Play        | 90|85
Videos         | Watched to End        | 30|30

[0]:https://developers.google.com/analytics/devguides/reporting/core/dimsmets
[1]:https://developers.google.com/youtube/player_parameters#IFrame_Player_API

