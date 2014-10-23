$(function(){
	$(".del").on('click', function(e){
		
		if(confirm('确定要删除吗？')) {
			var id = $(this).data("id");
			var $tr = $(".item-id-"+id);
			
			$.ajax({
				type: 'delete',
				url: '/admin/movie/del2/'+id
			}).done(function(data){
				if(data.succ == 1) {
					$tr.remove();
				}
			});
		}
		
	});
});
