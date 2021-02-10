 var express = require("express");
var router = express.Router({mergeParams: true});
var Product = require("../models/product");
var Comment   = require("../models/comment");

router.get("/new",isLoggedIn, function(req,res){
	Product.findById(req.params.id, function(err, product){
		if(err){
			console.log(err);
		}
		else{
				res.render("comments/new", {product: product});
		}
	});
});

router.post("/", isLoggedIn, function(req,res){
	Product.findById(req.params.id, function(err, product){
		if(err){
			console.log(err);
			res.redirect("/products");
		}
		else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}
				else{
				    comment.author.id  = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					product.comments.push(comment);
					product.save();
					res.redirect("/products/" + product._id);
				}
			})
		}
	})
});

// edit route

router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comments/edit", {product_id: req.params.id, comment: foundComment});
		}
	});
});

// update route

router.put("/:comment_id", checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/products/" + req.params.id);
		}
	});
});


// delete router

router.delete("/:comment_id", checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/products/" + req.params.id);
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			//does the user own a product
			if(foundComment.author.id.equals(req.user._id)){ 
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
