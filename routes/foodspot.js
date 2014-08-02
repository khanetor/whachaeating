var express = require('express');
var router = express.Router();
var Food = require('../models/food');
var Question = require('../models/question');

var foodspot_factory = require('../FoodSpottingApi/foodspot_factory');

router.get('/question/:question_id', function(req, res) {
	Question.findById(req.params.question_id, function(err, question) {
		console.log(question);
		if (!err) {
			if (!question) {
				res.json(400, { message : "There is no such question."});
			} else {
				res.json({ tag : question.tag });
			}
		} else {
			res.json(500, { message : "Something is wrong." });
		}
	});
});

router.get('/tag/:tag/:lat/:long', function(req, res) {
	// Translate from tag to food
	// Get all foods with this tag
	var tag = req.params.tag;
	tagToFood(tag, function(err, foods) {
		if (!err) {
			if (foods.length > 0) {
				var food_bag = [];
				var o = 0;
				foods.forEach(function(food, index) {
					
					foodspot_factory.search(food.food_name, req.params.lat, req.params.long, function(foodspotJSON) {
						o++;
						food_bag = food_bag.concat(foodspotJSON);
						console.log("TROI OI "+food_bag.length);
						if(o == foods.length) {
							console.log('Good! '+food_bag.length)
							res.json(food_bag);
						}
					});
					
				});
				//////res.json(food_bag);
			} else {
				res.json(500,  { message : 'There is no food.'});
			}
		} else {
			res.json(500, { message : 'Something is wrong.'});
		}
	});
});

// router.get('/tag/:lat/:long', function(req, res) {
// 	var tags = req.query.tags;
// 	var food_bag = [];
// 	tags.forEach(function(tag, index) {
// 		tagToFood(tag, function(err, foods) {
// 			if (!err) {
// 				foods.forEach(function(food) {
// 					console.log('Hre: '+food_bag.indexOf(food));
// 					if (food_bag.indexOf(food) < 0) {
// 						food_bag.push(food);
// 						console.log(food_bag);
// 					}
// 				});
// 			}

// 		});
// 	});

// 	res.json(food_bag);
// });

router.get('/food', function(req, res) {
  foodspot_factory.search('', '10.7721885', '106.65396659999999', function(foodspotJSON) {
    res.json(foodspotJSON);
  });
});

router.get('/food/:food', function(req, res) {
	foodspot_factory.search(req.params.food, '10.7721885', '106.65396659999999', function(foodspotJSON) {
		res.json(foodspotJSON);
	});
});

router.get('/food/:food/:lat/:long', function(req, res) {
	foodspot_factory.search(req.params.food, req.params.lat, req.params.long, function(foodspotJSON) {
		res.json(foodspotJSON);
	});
});

function tagToFood(tag, callback) {
	Food.find({ tags : tag }, function(err, foods) {
		if (!err) {
			callback(null, foods);
		} else {
			callback(err);
		}
	});
};

module.exports = router;
