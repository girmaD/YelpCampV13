const Campground = require('../models/campground'),
	  Comment    = require ('../models/comment');
// all the middlewares go here.

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
	if(req.isAuthenticated()){		
		Campground.findById(req.params.id, function(err, foundCampground){
		if(err) {
			req.flash('error', 'Campground not found!');
			res.redirect('back');
		} else {
			//does the user own the campground?
			// foundCampground.author.id is a mongoose object
			//req.user._id is a String. These cannot be equated using (== or ===)
			// mongoose gives us (.equals) to compare these two
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			} else {
				req.flash("error", "You don't have the permission to do that!");
				res.redirect('back');
			}
		}
	});
	} else {
		req.flash('error', 'You Need To Be Loggedin To Do That!');
		res.redirect('back');
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){		
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err) {
				req.flash('error', 'Something went wrong!');
				res.redirect('back');
			} else {
				//does the user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have the permission to do that!");
					res.redirect('back');
				}
			}
	});
	} else {
		req.flash('error', 'You Need To Be Loggedin To Do That!');
		res.redirect('back');
	}
}

middlewareObj.isLoggedIn = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'You Need To Be Loggedin To Do That!');
	res.redirect('/login');
}

module.exports = middlewareObj;