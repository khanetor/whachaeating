var express = require('express');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');

router.get('/', function(req, res) {
  var url = 'http://www.foodspotting.com/find/best/banh-canh/in/Ho-Chi-Minh-City-H%E1%BB%93-Ch%C3%AD-Minh-Vietnam';

	request(url, function(err, response, html) {
		if (!err) {
			var $ = cheerio.load(html);

			res.json($('body').html());
		}
	});

  
});

module.exports = router;