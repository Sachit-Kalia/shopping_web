var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
	passport   = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Product = require("./models/product"),
    Comment    = require("./models/comment"),
	User       = require("./models/user"),
	seedDB     = require("./seeds");
   
var commentRoutes = require("./routes/comments"),
	productRoutes = require("./routes/products"),
	indexRoutes      = require("./routes/index");

seedDB(); //seed the database
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "I am undefetable! Well everyone knows that!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use("/products/:id/comments", commentRoutes);
app.use("/products", productRoutes);

app.listen(3000, function(){
	console.log("Yelpcamp server has started!")
});
