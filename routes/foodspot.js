var express = require('express');
var router = express.Router();

var foodspot_factory = require('../FoodSpottingApi/foodspot_factory');

router.get('/:food', function(req, res) {
	foodspot_factory.search(req.params.food, function(foodspotJSON) {
		foodspotJSON.forEach(function(item, index) {
			console.log(item);
		});
		res.json(foodspotJSON);
	});
});

module.exports = router;
