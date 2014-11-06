$(function(){
	$(".comment").click(function(){
		//data-commentId 竟然在页面上被转化成commentid
		var commentId = $(this).data("commentid"); //点击头像的id，点击评论的评论者用户id
		var commenterId = $(this).data("commenterid"); //当前评论的id
		
		$("<input>").attr({
			type : "hidden",
			name : "comment[commentId]",
			value: commentId
		}).appendTo("#commentForm");
		
		$("<input>").attr({
			type : "hidden",
			name : "comment[commenterId]",
			value: commenterId
		}).appendTo("#commentForm");
	});
});
