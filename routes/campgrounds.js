const express    = require('express'),
	  router     = express.Router({mergeParams: true}),
	  Campground = require('../models/campground'),
	  middleware = require('../middleware');

// router.get('/', (req, res) => {
// 	res.render('landing');
// });


// INDEX ROUTE - show all campgrounds
router.get('/', (req, res) => {	
	
	// 	get campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render('campgrounds/index', {campgrounds: allCampgrounds});
		}
	})	
});
// CREATE ROUTE - add new campground to DB
router.post('/', middleware.isLoggedIn, (req, res) =>{	
	// 	get data from form and add it to campgrounds
	const name = req.body.name;
	const price = req.body.price;
	const image = req.body.image;
	const desc = req.body.description;	
	const author = {
		id: req.user._id,
		username: req.user.username
	}
	const newCampground = {name: name, price: price, image: image, description: desc, author: author};	
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//  redirect to the campgrounds page
			req.flash('success', 'You Just added a New Campground')
			res.redirect('/campgrounds');
		}
	});
});

// NEW ROUTE - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) =>{
	res.render('campgrounds/new');
});

// SHOW - show more info about one caampground
router.get('/:id', (req, res) =>{
	// find the campground with provided id 
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err){
			console.log(err);
		} else {
			// console.log(foundCampground);
			// render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	})	
});

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render('campgrounds/edit', {campground: foundCampground});
	});	
});
//UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground,  function(err, updatedCampground){
		if(err){
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id)
		}
	})	
});

//DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			res.redirect('/campgrounds')
		} else {
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;