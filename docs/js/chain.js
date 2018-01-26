$(function(){
	
		//SCROLL
		$("a[href^=#]").on('click',function(){
		    $('html, body').animate({
		        scrollTop: $( $(this).attr('href') ).offset().top-100
		    }, 500, 'easeInOutCubic');
		    return false;
		});
		
		$(document).on('click','a',function(){
		    $('html, body').animate({
		        scrollTop: $( $(this).attr('href') ).offset().top-100
		    }, 500, 'easeInOutCubic');
		    return false;
		});
				
		$('div.method').on('click',function(){
		    $('html, body').animate({
		        scrollTop: $(this).offset().top-100
		    }, 500, 'easeInOutCubic');
		    return false;
		});
		
		var defaultmethodname = $('#defaultmethodname').eq(0).text();
		$('span.defaultmethodname').text(defaultmethodname);
		
		
		$('div#default.method').find('span.method').eq(0).prepend(defaultmethodname);
		
		$('div.method:not(#default)').each(function(){
			$(this).find('span.method').eq(0).prepend(defaultmethodname+'.');
		});
		
		$("a[href^=#]").each(function(){
			let methodname = ($(this).attr('href') === '#default') ? defaultmethodname : defaultmethodname+'.'+$(this).attr('href').substring(1);
			$(this).text(methodname+' ()');
		});
		
		$('.col').each(function(){
			var $col = $('<div class="index col"></div>');
			$($col).append($('<h3></h3>').text($(this).attr('id')+' methods:'));
			$(this).find('div.method').each(function(){
				let methodname = ($(this).attr('id') === 'default') ? defaultmethodname : defaultmethodname+'.'+$(this).attr('id');
				$($col).append($('<p></p>').html('<div class="link"><a href="#'+$(this).attr('id')+'">'+methodname+' ()</a></div> '+$(this).find('span.desc').text()));
			});
			$('#contents').append($col);
		});
		
		$('.link').css({display:'inline-block'});


		$('span.return.value').prepend('<br>');
		$(window).resize(function(){
			if($(window).width()<960){
				//$('.center>p').css({font: '11px/20px "Lucida Grande", Lucida, Verdana, sans-serif'});
				$('.index').css({width:360});
				$('.center').css({width:380});
				$('span.return.value > br').show();
			}else{
				//$('.center>p').css({font: '13px/22px "Lucida Grande", Lucida, Verdana, sans-serif'});
				$('.index').css({width:400});
				$('.center').css({width:840});
				$('span.return.value > br').hide();
			}
		});
		$(window).resize();	
			
});