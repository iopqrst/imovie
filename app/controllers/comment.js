var CommentModel = require('../models/commentModel');

exports.saveComment = function(req, res) {
	var _comment = req.body.comment;
	var movieId = _comment.movie;
	
	//如果commentId有值说明该评论是在原有基础之上进行评论的
	if(_comment.commentId) {
		CommentModel.findById(_comment.commentId, function(err, com){
			var reply = {
				from : _comment.from,
				to: _comment.commenterId,
				content: _comment.content
			};
			//console.info(com);
			com.reply.push(reply);
			
			com.save(function(err) {
				if(err) {
					console.log(err);
				}
				
				res.redirect('/movie/' + movieId);
			});
		});
	} else {
		var comm = new CommentModel(_comment);
		//console.info(comm);
		comm.save(function(err) {
			if (err) {
				console.log(err);
			}
	
			res.redirect('/movie/' + movieId);
		});
	}

};
