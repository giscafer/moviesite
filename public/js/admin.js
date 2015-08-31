$(function(){
	$('.movieDel').click(function(e){
		var target=$(e.target)
		var id=target.data('id')
		var tr=$('.item-id-'+id)
		$.ajax({
			type:'DELETE',
			url:'/admin/movie/list/?id='+id
		})
		.done(function(results){
			if(results.success===1){
				if(tr.length>0){
					tr.remove();
				}
			}
		});
	});
	$('.categoryDel').click(function(e){
		var target=$(e.target)
		var id=target.data('id')
		var tr=$('.cat-id-'+id)
		$.ajax({
			type:'DELETE',
			url:'/admin/category/list/?id='+id
		})
		.done(function(results){
			if(results.success===1){
				if(tr.length>0){
					tr.remove();
				}
			}
		});
	});
	/**
	 * 豆瓣API JSONP同步电影数据
	 */
	$('#doubanCollect').click(function(){
		var douban=$('#douban');
		var id=douban.val();
		$.ajax({
			url:'https://api.douban.com/v2/movie/subject/'+id,
			cache:true,
			type:'get',
			dataType:'jsonp',
			crossDomain:true,
			jsonp:'callback',
			success:function(data){
				//对获取的数据进行自动赋值
				$('#inputTitle').val(data.title);
				$('#inputDirector').val(data.directors[0].name);
				$('#inputCountry').val(data.countries[0]);
				$('#inputYear').val(data.year);
				// $('#inputLanguage').val(data.);
				// $('#inputFlash').val(data.large);
				$('#inputPoster').val(data.images.large);
				$('#inputSummary').val(data.summary);
				//电影分类
				var $cat=$('.radio-inline');
				var flag=false,
					index=0;
				for (var i = 0; i < $cat.length; i++) {
					var categoryName=$($cat[i]).text().trim();
					if(categoryName===data.genres[0]){
						flag=true;
						index=i;
					}
				}
				//存在可选的radio
				if(flag){
					$cat[index].find('input').attr('checked','checked');
					$cat[index].find('input').trigger('click');
				}else{//没有可选的时候
					$('#inputCategory').val(data.genres[0]);
				}
			}
		});
	});
})