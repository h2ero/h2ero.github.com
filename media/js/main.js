$(function(){
    if($('h1,h1,h3').length>3){
        $('h1,h2,h3').each(function(i){
            $(this).attr('id',i);
            hn=this.nodeName.toLowerCase();
            $('#listTitle').append('<li class=t-'+hn+'><a href=#'+i+'>'+$(this).text()+'</a></li>')
        });
        var width=-$('#listTitle').css('width').split('px')[0]+20
        setTimeout(function(){
            $('#listTitle').css({'right':width+'px'});
        },2000);
        $('#listTitle').hover(function(){
            $(this).css({'right':'0px'});
        },function(){
            $(this).css({'right':width+'px'});
        });
        //http://css-tricks.com/examples/SmoothPageScroll/#
        function filterPath(string) {
            return string
            .replace(/^\//,'')
            .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
            .replace(/\/$/,'');
        }
                // Use the first element that is "scrollable"  (cross-browser fix?)
        function scrollableElement(els) {
            for (var i = 0, argLength = arguments.length; i <argLength; i++) {
                var el = arguments[i],
                $scrollElement = $(el);
                if ($scrollElement.scrollTop()> 0) {
                    return el;
                } else {
                    $scrollElement.scrollTop(1);
                    var isScrollable = $scrollElement.scrollTop()> 0;
                    $scrollElement.scrollTop(0);
                    if (isScrollable) {
                        return el;
                    }
                }
            }
            return [];
        }
    
        var locationPath = filterPath(location.pathname);
        var scrollElem = scrollableElement('html', 'body');
    
        // Any links with hash tags in them (can't do ^= because of fully qualified URL potential)
        $('a[href*=#]').each(function() {
    
            // Ensure it's a same-page link
            var thisPath = filterPath(this.pathname) || locationPath;
            if (  locationPath == thisPath
                && (location.hostname == this.hostname || !this.hostname)
                && this.hash.replace(/#/,'') ) {
    
                    // Ensure target exists
                    var $target = $(this.hash), target = this.hash;
                    if (target) {
    
                        // Find location of target
                        var targetOffset = $target.offset().top;
                        $(this).click(function(event) {
    
                            // Prevent jump-down
                            event.preventDefault();
    
                            // Animate to target
                            $(scrollElem).animate({scrollTop: targetOffset}, 400, function() {
    
                                // Set hash in URL after animation successful
                                location.hash = target;
    
                            });
                        });
                    }
            }
    
        });
    

        }
});        
