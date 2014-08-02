var express = require('express');
var router = express.Router();
var Food = require('../models/food');

var foodspot_factory = require('../FoodSpottingApi/foodspot_factory');

router.get('/', function(req, res) {
  foodspot_factory.search('', '10.7721885', '106.65396659999999', function(foodspotJSON) {
    res.json(foodspotJSON);
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
				foods.forEach(function(food, index) {
					foodspot_factory.search(food.food_name, req.params.lat, req.params.long, function(foodspotJSON) {
						food_bag.concat(foodspotJSON);
					});
				});
				res.json(food_bag);
			} else {
				res.json(500,  { message : 'There is no food.'});
			}
		} else {
			res.json(500, { message : 'Something is wrong.'});
		}
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
	})
};

module.exports = router;
