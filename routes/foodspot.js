var express = require('express');
var router = express.Router();

var foodspot_factory = require('../FoodSpottingApi/foodspot_factory');

router.get('/:course', function(req, res) {

	foodspot_factory.search(req.params.course, function(foodspotJSON) {
		res.json(foodspotJSON);
	});
});

module.exports = router;