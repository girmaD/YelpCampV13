const express = require('express');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const User = require('./models/user');
const seedDB = require('./seeds');
const Comment = require('./models/comment');
const passport = require('passport');
const localStrategy = require('passport-local');
const methodOverride = require('method-override');

const commentRoutes = require('./routes/comments'),
	campgroundsRoutes = require('./routes/campgrounds'),
	indexRoutes = require('./routes/index');

const app = express();

// seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(
	require('express-session')({
		secret: 'I have the best girl on the planet!',
		resave: false,
		saveUninitialized: false
	})
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// connectint mongoose with mongodb
//mongoose.connect("mongodb://localhost/yelp_camp_v12Deployed", {useNewUrlParser: true, useUnifiedTopology: true});

const url = process.env.DATABASEURL || 'mongodb://localhost/YelpCamp_v12';
mongoose.connect(url);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

//passing req.user and req.flash('error') to all route files
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

//Requiring routes
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundsRoutes);

// Initiating the server
app.listen(3000, function() {
	console.log('YelpCamp server in use');
});
app.listen(process.env.PORT, process.env.IP);
