var CommentModel = require('../models/commentModel');

exports.saveComment = function(req, res) {
	var _comment = req.body.comment;
	var movieId = _comment.movie;
	
	var comm = new CommentModel(_comment);
	
	console.info(comm);
	
	comm.save(function(err) {
		if (err) {
			console.log(err);
		}

		res.redirect('/movie/' + movieId);
	});
};
