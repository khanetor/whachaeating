var express = require('express');
var router = express.Router();

var foodspot_factory = require('../FoodSpottingApi/foodspot_factory');

router.get('/:food', function(req, res) {
	foodspot_factory.search(req.params.food, '', '', function(foodspotJSON) {
		res.json(foodspotJSON);
	});
});

router.get('/:food/:lat/:long', function(req, res) {
	foodspot_factory.search(req.params.food, req.params.lat, req.params.long, function(foodspotJSON) {
		res.json(foodspotJSON);
	});
});

module.exports = router;
