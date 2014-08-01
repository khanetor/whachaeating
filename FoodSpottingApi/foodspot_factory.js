var request = require('request');
var cheerio = require('cheerio');
var url = require('url');

var link = "http://www.foodspotting.com/api/v1/sightings.json?api_key=88jrlU7j4HsTnnVNciqhfZbXd6vgPmVU9gbu46Mh&query=&sort=best&filter=all&latitude=10.8230989&longitude=106.6296638&ne=11.1602136%2C107.02484679999998&sw=10.3766885%2C106.36387839999998&per_page=16&page=1&callback=jQuery18205398014166858047_1406878634392&_=1406878884116";
var parsedUrl = url.parse(link, true);

var foodspotting = function() {
};

foodspotting.search = function(course, callback) {
	buildQueryUrl(course, function(link) {
		request(link, function(err, response, html) {
			if (!err) {
				extractFoodSpotJSON(html, function(foodspotJSON) {
					callback(foodspotJSON);
				});
			}
		});
	});
};

function buildQueryUrl (course, callback) {
	parsedUrl.query.query = course;
	delete parsedUrl.search;
	link = url.format(parsedUrl);
	callback(link);
};


function extractFoodSpotJSON(string, callback) {
	callback(string.substring(string.indexOf("(") + 1, string.length - 1));
};

module.exports = foodspotting;