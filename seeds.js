var mongoose = require("mongoose");
var Product = require("./models/product");
var Comment = require("./models/comment");

var data = [
    {
        name: "Nike Air Zoom Pegasus 37", 
        image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5/44297225-bf4c-4dbb-8e8b-a7377b22d05b/air-zoom-pegasus-37-running-shoe-mwrTCc.jpg",
        description: "Reinvigorate your stride with the Nike Air Zoom Pegasus 37. Delivering the same fit and feel that runners love, the shoe has an all-new forefoot cushioning unit and foam for maximum responsiveness. The result is a durable, lightweight trainer designed for everyday running."
    },
    {
        name: "Nike Zoom Gravity 2", 
        image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5/9f146c47-6ee3-4eda-8093-b1bf8b369fb2/zoom-gravity-2-running-shoe-0Gw32G.jpg",
        description: "The Nike Zoom Gravity 2 helps you push to the next level. Built for Tempo Runs or a 5–10K race, it features an updated design with exaggerated details for a fast look."
    },
    {
        name: "Jordan React Havoc SE", 
        image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5/82352767-a3db-46fe-bf7b-b0e03edc01aa/jordan-react-havoc-se-running-shoe-FLQ4bZ.jpg",
        description: "An update to the ultra-fast Jordan React Havoc, the SE maintains its responsive cushioning combination while revamping elements of the upper. The transparent heel clip offers the same great heel lockdown but with a new aesthetic. A synthetic suede and striped-line mudguard provides lightweight lateral support. The updated tongue reduces lace pressure and provides easy on and off."
    }
]

function seedDB(){
	//remove all products
	Product.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed products!");
		Comment.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed comments!");
		
		data.forEach(function(seed){
			Product.create(seed, function(err, product){
				if(err){
					console.log(err);
				}
				else{
					console.log("Added a product!");
					
					Comment.create(
						{   
						text: "This is the trail comment",
						author: "Sachit Kalia"
						},function(err,comment){
							if(err){
								console.log(err);
							}
							else{
								product.comments.push(comment);
								product.save();
								console.log("Created a new comment!");
							}
						});
				    }
					
				});
			});
		});
		
	});
	
}

module.exports = seedDB;