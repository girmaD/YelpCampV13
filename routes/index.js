const express  = require('express'),
	  router   = express.Router({mergeParams: true}),
	  passport = require('passport'),
	  User     = require('../models/user');

// The root route
router.get('/', (req, res) => {
	res.render('landing');
});

// show the register form
router.get('/register', function(req, res){
	res.render('register');
});
// handle sign up logic
router.post('/register', function(req, res){
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if (err){	
			req.flash("error", err.message);
			return res.render('register');	
		}
		passport.authenticate('local')(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect('/campgrounds');
		});
	});
});

// show login form
router.get('/login', function(req, res){
	res.render('login');
});
//handling login logic
//app.post('/login, midddileware, call back function)
router.post('/login', passport.authenticate('local', {
	successRedirect: '/campgrounds', 
	failureRedirect: '/login'
}), function(req, res){	
});

//logout route
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'Logged You Out');
	res.redirect('/campgrounds');
});

module.exports = router;