$(function(){
	
		//SCROLL
		$('a').on('click',function(){
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
		
		$('.col').each(function(){
			var $col = $('<div class="index col"></div>');
			$($col).append($('<h3></h3>').text($(this).attr('id')+' methods:'));
			$(this).find('div.method').each(function(){
				$($col).append($('<p></p>').html('<div class="link"><a href="#'+$(this).attr('id')+'">.'+$(this).attr('id')+'()</a></div> '+$(this).find('span.desc').text()));
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

		$('a').wrap('<nobr></nobr>');

		
			
});