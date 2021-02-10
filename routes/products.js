var express = require("express");
var router = express.Router();
var Product = require("../models/product");

router.get("/", function(req, res){
	Product.find({}, function(err, allProducts){
		if(err){
			console.log(err);
		}
		else{
			res.render("products/index", {products: allProducts, currentUser: req.user});
		}
	});
});

router.post("/", isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newProduct = {name:name, image:image, description:desc, author:author};
	Product.create(newProduct, function(err, newlycreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/products");
		}
	});
});

router.get("/new", isLoggedIn, function(req,res){
	res.render("products/new");
});

router.get("/:id", function(req,res){
	Product.findById(req.params.id).populate("comments").exec(function(err, foundproduct){
		if(err){
			console.log(err);
		}
		else{
			res.render("products/show", {product: foundproduct});
		}
	});
});

//Edit route

router.get("/:id/edit",checkProductOwnership, function(req,res){
		Product.findById(req.params.id, function(err, foundProduct){
		res.render("products/edit", {product: foundProduct});
	});
});


// Update route

router.put("/:id", checkProductOwnership, function(req,res){
	Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct){
		if(err){
			res.redirect("/products");
		}
		else{
			res.redirect("/products/" + req.params.id);
		}
	});
});

// DESTROY ROUTE

router.delete("/:id", checkProductOwnership, function(req,res){
	Product.findByIdAndRemove(req.params.id, function(err){
	 if(err){
		 res.redirect("/products");
	 }	else{
		 res.redirect("/products");
	 }
	});
});


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkProductOwnership(req, res, next){
	if(req.isAuthenticated()){
		Product.findById(req.params.id, function(err, foundProduct){
		if(err){
			res.redirect("back");
		}else{
			//does the user own a product
			if(foundProduct.author.id.equals(req.user._id)){ 
				//1st one is a mongoose object while 2nd one is a string
				next();
			}else{
				res.redirect("back");
			}
		}
	});
	} else{
		res.redirect("back");
	}
}

module.exports = router;